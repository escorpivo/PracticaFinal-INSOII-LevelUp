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
            val data = call.receive<Map<String, String>>()
            val name = data["name"] ?: return@post call.respond(HttpStatusCode.BadRequest)

            val listId = transaction {
                Lists.insertAndGetId {
                    it[Lists.userId] = userId
                    it[Lists.name] = name
                }.value
            }

            call.respond(mapOf("listId" to listId))
        }

        post("/lists/{listId}/add") {
            val listId = call.parameters["listId"]?.toIntOrNull()
                ?: return@post call.respond(HttpStatusCode.BadRequest)
            val body = call.receive<Map<String, Long>>()
            val gameId = body["gameId"] ?: return@post call.respond(HttpStatusCode.BadRequest)

            transaction {
                ListItems.insertIgnore {
                    it[ListItems.listId] = listId
                    it[ListItems.gameId] = gameId
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
    }
}
