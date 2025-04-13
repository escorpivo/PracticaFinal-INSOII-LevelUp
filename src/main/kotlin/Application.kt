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

    //hay que crear un .env para evitar que los datos viajen por aqui
    val igdbClient = IGDBClient(
        clientId = "null",
        clientSecret = "null"
    )

    routing {
        //ruta para obtener los juegos, de la funcion fetchGames de IGDBClient
        get("/games") {
            val games = igdbClient.fetchGames()
            call.respond(games)
        }
    }
}
