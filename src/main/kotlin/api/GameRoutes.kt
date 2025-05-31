package com.api

import com.api.IGDBClient
import io.ktor.http.HttpStatusCode
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.gameRoutes(igdbClient: IGDBClient) {

    route("/games") {
        //Ruta de lista paginada
        get {
            val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 0
            val games = igdbClient.fetchGamesCached(page)
            call.respond(games)
        }

        //Ruta por ID para juegos específico
        get("{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
            if (id == null) {
                call.respond(HttpStatusCode.BadRequest, "ID inválido")
                return@get
            }

            val game = igdbClient.fetchGameById(id)
            if (game != null) {
                call.respond(game)
            } else {
                call.respond(HttpStatusCode.NotFound, "Juego no encontrado")
            }
        }


        get("/search") {
            val query = call.request.queryParameters["query"]?.trim()
            if (query.isNullOrBlank()) {
                call.respond(HttpStatusCode.BadRequest, "Falta el parámetro de búsqueda")
                return@get
            }

            val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 0
            val resultados = igdbClient.searchGamesByName(query, page)

            call.respond(resultados)
        }

    }
}