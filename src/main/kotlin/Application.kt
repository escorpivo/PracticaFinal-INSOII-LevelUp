package com

import com.api.IGDBClient
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
import io.github.cdimascio.dotenv.dotenv
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.server.plugins.cors.routing.*

//cargamos el .env
val dotenv = dotenv()

fun main() {

    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        module()
    }.start(wait = true)
}

fun Application.module() {
    //instala un plugin en el servidor Ktor, permitiendo así manejar distintos formatos de datos
    install(ContentNegotiation) {

        //estos atributos sirven para formatear y analizar la salida JSON para que sea más legible y flexible
        json(Json { prettyPrint = true; isLenient = true ; explicitNulls = true ; encodeDefaults = true})

    }
    install(CORS) {
        anyHost() // 🚨 Solo para desarrollo, no usar en producción
        allowMethod(HttpMethod.Get)
        allowHeader(HttpHeaders.ContentType)
    }

    //hay que crear un .env para evitar que los datos viajen por aqui
    val igdbClient = IGDBClient(
        clientId = dotenv["CLIENT_ID"] ?: error("CLIENT_ID no encontrado"),
        clientSecret = dotenv["CLIENT_SECRET"] ?: error("CLIENT_SECRET no encontrado")
    )

    routing {
        //ruta para obtener los juegos, de la funcion fetchGames de IGDBClient
        get("/games") {
            val games = igdbClient.fetchGames()
            call.respond(games)
        }
    }
}
