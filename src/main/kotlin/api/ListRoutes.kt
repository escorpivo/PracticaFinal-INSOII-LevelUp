package api

import com.database.Lists
import com.database.ListItems
import com.database.Games
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.http.*
import org.jetbrains.exposed.sql.insertAndGetId

fun Route.listRoutes() {

    authenticate("auth-jwt") {

        post("/lists") {
            val principal = call.principal<JWTPrincipal>()!!
            val userId = principal.payload.getClaim("userId").asInt()

            val request = call.receive<CreateListRequest>()

            try {
                val listId = transaction {
                    val insertedId = Lists.insertAndGetId {
                        it[Lists.userId] = userId
                        it[Lists.name] = request.name
                    }.value

                    request.games.forEach { game ->
                        Games.insertIgnore {
                            it[Games.id] = game.id
                            it[Games.name] = game.name
                        }

                        ListItems.insertIgnore {
                            it[ListItems.listId] = insertedId
                            it[ListItems.gameId] = game.id
                        }
                    }


                    insertedId
                }

                call.respond(HttpStatusCode.Created, mapOf("listId" to listId))
            } catch (e: Exception) {
                e.printStackTrace()  // Lo verás en consola
                call.respond(HttpStatusCode.InternalServerError, "Error interno al crear la lista")
            }
        }




        post("/lists/{listId}/add") {
            val listId = call.parameters["listId"]?.toIntOrNull()
                ?: return@post call.respond(HttpStatusCode.BadRequest)

            val body = call.receive<Map<String, List<Long>>>()
            val gameIds = body["gameIds"] ?: return@post call.respond(HttpStatusCode.BadRequest)

            transaction {
                gameIds.forEach { gameId ->
                    ListItems.insertIgnore {
                        it[ListItems.listId] = listId
                        it[ListItems.gameId] = gameId
                    }
                }
            }

            call.respond(HttpStatusCode.Created)
        }


        get("/lists") {
            val principal = call.principal<JWTPrincipal>()!!
            val userId = principal.payload.getClaim("userId").asInt()

            val lists = transaction {
                Lists.select { Lists.userId eq userId }
                    .map { row ->
                        val listId = row[Lists.id].value
                        val games = (ListItems innerJoin Games)
                            .select { ListItems.listId eq listId }
                            .map {
                                mapOf("id" to it[Games.id], "name" to it[Games.name])
                            }
                        mapOf("id" to listId, "name" to row[Lists.name], "games" to games)
                    }
            }

            call.respond(lists)
        }

        get("/lists/{id}") {
            val principal = call.principal<JWTPrincipal>()!!
            val userId = principal.payload.getClaim("userId").asInt()
            val listId = call.parameters["id"]?.toIntOrNull()

            if (listId == null) {
                println("listId no válido")
                return@get call.respond(HttpStatusCode.BadRequest, "ID inválido")
            }

            val result = transaction {
                println("Buscando lista con id=$listId y userId=$userId")

                val listRow = Lists.select { (Lists.id eq listId) and (Lists.userId eq userId) }
                    .singleOrNull()

                if (listRow == null) {
                    println("Lista no encontrada o no pertenece al usuario")
                    return@transaction null
                }

                val games = (ListItems innerJoin Games)
                    .select { ListItems.listId eq listId }
                    .map {
                        mapOf("id" to it[Games.id], "name" to it[Games.name])
                    }

                mapOf("id" to listRow[Lists.id].value, "name" to listRow[Lists.name], "games" to games)
            }

            if (result == null) {
                call.respond(HttpStatusCode.NotFound, "Lista no encontrada o no pertenece al usuario")
            } else {
                call.respond(result)
            }
        }
    }
}
