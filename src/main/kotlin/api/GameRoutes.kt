package com.api

import com.api.IGDBClient
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.gameRoutes(igdbClient: IGDBClient) {
    route("/api/games") {
        get {
            try {
                // Llamamos a la función para obtener juegos
                val games = igdbClient.fetchGamesCached()

                // Respondemos el JSON directamente para que el front lo tenga fácil
                call.respond(games)
            } catch (e: Exception) {
                // Manejamos errores y los devolvemos como respuesta
                call.respondText("Error al obtener los juegos: ${e.message}")
            }
        }
    }
}