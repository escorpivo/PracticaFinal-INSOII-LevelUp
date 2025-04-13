package com.example.api

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.gameRoutes(igdbClient: IGDBClient) {
    route("/api/games") {
        get {
            try {
                val games = igdbClient.fetchGames() // Llamamos al cliente de IGDB
                call.respond(games) // Respondemos el JSON directamente
            } catch (e: Exception) {
                // Manejamos errores y los devolvemos como respuesta
                call.respondText("Error al obtener los juegos: ${e.message}")
            }
        }
    }
}