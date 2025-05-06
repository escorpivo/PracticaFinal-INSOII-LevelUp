package com.api

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.util.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.json.Json
import kotlinx.serialization.serializer

class IGDBClient(private val clientId: String, private val clientSecret: String) {

    private val json = Json {
        prettyPrint = true
        isLenient = true
        ignoreUnknownKeys = true
    }

    private val httpClient = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(json)
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

    // obtenemos los juegos desde IGDB haciendo petición al endpoint /games
    suspend fun fetchGames(): List<Game> {
        authorize()

        //aqui creo una lista mutable en la que se acumulan los juegos válidos
        val finalGames = mutableListOf<Game>()
        var offset = 0

        while (finalGames.size < 24) {
            val gamesJson: String = httpClient.post("https://api.igdb.com/v4/games") {
                header("Client-ID", clientId)
                header("Authorization", "Bearer $accessToken")
                contentType(ContentType.Application.Json)
                setBody("fields id, name, storyline, rating, url, cover, platforms, genres; where cover != null; sort rating desc; limit 24; offset $offset;")
            }.body()

            val gamesBatch = json.decodeFromString(ListSerializer(serializer<Game>()), gamesJson)

            val coverUrls = fetchCovers(gamesBatch.mapNotNull { it.cover })

            val allPlatformIds = gamesBatch.flatMap { it.platforms ?: emptyList() }.distinct()
            val platformNames = fetchPlatforms(allPlatformIds)

            val allGenreIds = gamesBatch.flatMap { it.genres ?: emptyList() }.distinct()
            val genreNames = fetchGenres(allGenreIds)

            val validGames = gamesBatch.mapNotNull { game ->
                val url = coverUrls[game.cover]
                val platformNamesList = game.platforms?.mapNotNull { platformNames[it] } ?: listOf("Desconocida")
                val genreNamesList = game.genres?.mapNotNull { genreNames[it] } ?: listOf("Sin género")

                val firstPlatformName = platformNamesList.firstOrNull() ?: "Desconocida"
                if (url != null) game.copy(
                    coverUrl = url,
                    platform = firstPlatformName,
                    platformNames = platformNamesList,
                    genreNames = genreNamesList
                ) else null
            }

            // Añadimos a la lista final solo los juegos con portada válida
            finalGames += validGames

            // Aumentamos el offset para obtener el siguiente bloque de resultados en la siguiente iteración
            offset += 24

            // para evitar bucle infinito si no hay más resultados
            if (gamesBatch.isEmpty()) break
        }

        //con esto devuelvo exactamente 20 juegos, por si me paso
        return finalGames.take(24)
    }


    // Hacemos petición al endpoint /covers para buscar las imágenes que usaremos en las tarjetas de los juegos
    suspend fun fetchCovers(coverIds: List<Int>): Map<Int, String> {
        if (coverIds.isEmpty()) return emptyMap()

        val covers: String = httpClient.post("https://api.igdb.com/v4/covers") {
            header("Client-ID", clientId)
            header("Authorization", "Bearer $accessToken")
            contentType(ContentType.Application.Json)
            setBody("fields id, url; where id = (${coverIds.joinToString(",")});")
        }.body()

        val coverList = Json.decodeFromString(ListSerializer(serializer<Cover>()), covers)

        return coverList.associateBy(
            { it.id },
            { "https:" + it.url.replace("/t_thumb/", "/t_cover_big/") }
        )
    }


    //aqui se busca la plataforma mediante los IDs obtenidos
    suspend fun fetchPlatforms(platformIds: List<Int>): Map<Int, String> {
        if (platformIds.isEmpty()) return emptyMap()

        val response: String = httpClient.post("https://api.igdb.com/v4/platforms") {
            header("Client-ID", clientId)
            header("Authorization", "Bearer $accessToken")
            contentType(ContentType.Application.Json)
            setBody("fields id, name; where id = (${platformIds.joinToString(",")});")
        }.body()

        val platformList = Json.decodeFromString(ListSerializer(serializer<Platform>()), response)
        return platformList.associateBy({ it.id }, { it.name })
    }

    //aqui se obtiene el genero mediante los datos obtenidos
    suspend fun fetchGenres(genreIds: List<Int>): Map<Int, String> {
        if (genreIds.isEmpty()) return emptyMap()

        val response: String = httpClient.post("https://api.igdb.com/v4/genres") {
            header("Client-ID", clientId)
            header("Authorization", "Bearer $accessToken")
            contentType(ContentType.Application.Json)
            setBody("fields id, name; where id = (${genreIds.joinToString(",")});")
        }.body()

        val genreList = Json.decodeFromString(ListSerializer(serializer<Genre>()), response)

        return genreList.associateBy({ it.id }, { it.name })
    }



    @Serializable
    data class Game(
        val id: Int,
        val name: String,
        val storyline: String? = "IGDB no aporta storyline de este juego.",
        val rating: Double? = -0.1,
        val url: String? = "IGDB no ofrece una URL a este juego",
        val cover: Int? = null,
        val coverUrl: String? = null,
        val platforms: List<Int>? = null,
        val genres: List<Int>? = null,
        val platform: String = "Plataforma desconocida",
        val platformNames: List<String> = emptyList(),
        val genreNames: List<String> = emptyList()
    )


    //data class para los diferentes datos obtenidos de los endpoints de IGDB
    @Serializable
    data class Cover(
        val id: Int,
        val url: String
    )

    @Serializable
    data class Platform(
        val id: Int,
        val name: String
    )

    @Serializable
    data class Genre(
        val id: Int,
        val name: String
    )

}