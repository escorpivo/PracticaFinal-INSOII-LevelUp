package com.example.api

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.json.Json
import kotlinx.serialization.serializer

class IGDBClient(private val clientId: String, private val clientSecret: String) {
    private val httpClient = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json { prettyPrint = true; isLenient = true})
        }
        install(HttpTimeout) {
            requestTimeoutMillis = 15000
        }
    }

    private var accessToken: String? = null

    // Autoriza y obtiene el token si aún no lo tiene
    private suspend fun authorize() {
        if (accessToken == null) {
            val tokenResponse: Map<String, String> = httpClient.post("https://id.twitch.tv/oauth2/token") {
                parameter("client_id", clientId)
                parameter("client_secret", clientSecret)
                parameter("grant_type", "client_credentials")
            }.body()

            accessToken = tokenResponse["access_token"] ?: error("No se pudo obtener el token.")
            println("Token obtenido: $accessToken")
        }
    }

    // Obtener juegos desde IGDB haciendo petición al endpoint /games
    suspend fun fetchGames(): List<Game> {

        //nos autorizamos para poder hacer peticiones, sino no será posible
        authorize()

        val games: String = httpClient.post("https://api.igdb.com/v4/games") {
            header("Client-ID", clientId)
            header("Authorization", "Bearer $accessToken")
            contentType(ContentType.Application.Json)
            setBody("fields id, name, storyline, rating, url, cover; limit 20;")
        }.body()

        println("Respuesta JSON de juegos: $games")

        val gameList = Json.decodeFromString(ListSerializer(serializer<Game>()), games)

        // Obtener la URL de la portada a partir del cover ID
        val coverUrls = fetchCovers(gameList.mapNotNull { it.cover })

        // Asociar la URL de la portada con el juego correcto
        return gameList.map { game ->
            game.copy(coverUrl = coverUrls[game.cover] ?: "No hay portada disponible")
        }
    }

    //hacemos petición al endpoint /covers para buscar las imágenes que usaremos en las tarjetas de los juegos
    suspend fun fetchCovers(coverIds: List<Int>): Map<Int, String> {

        //controlamos el caso de que no haya covers en un juego
        if (coverIds.isEmpty()) return emptyMap()

        val covers: String = httpClient.post("https://api.igdb.com/v4/covers") {
            header("Client-ID", clientId)
            header("Authorization", "Bearer $accessToken")
            contentType(ContentType.Application.Json)
            setBody("fields id, url; where id = (${coverIds.joinToString(",")});")
        }.body()

        println("Respuesta JSON de covers: $covers")

        // Convertimos la respuesta en una lista de objetos Cover
        val coverList = Json.decodeFromString(ListSerializer(serializer<Cover>()), covers)

        // Convertir la lista en un mapa de covers, donde se filtra la URL en base a la ID, además se añade https
        //para que siempre estén bien formateadas las imágenes y la devolvemos
        return coverList.associateBy({ it.id }, { "https:" + it.url })
    }


    // Modelo de datos que se va a pasar al front
    @Serializable
    data class Game(

        //datos que nos sirve la api /games
        val id: Int,
        val name: String,
        val storyline: String? = "IGDB no aporta storyline de este juego.",
        val rating: Double? = -0.1,
        val url: String? = "IGDB no ofrece una URL a este juego",

        //parte de las cover a través del cover ID, encontramos una URL a la imagen, nos lo sirve /covers
        val cover: Int? = null,
        val coverUrl: String? = null
    )

    @Serializable
    data class Cover(
        val id: Int,
        val url: String
    )


}