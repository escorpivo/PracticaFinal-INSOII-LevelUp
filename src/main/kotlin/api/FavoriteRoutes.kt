// api/FavoriteRoutes.kt
package api

import com.database.Favorites
import com.database.Games
import org.jetbrains.exposed.sql.insertIgnore
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.http.*

fun Route.favoriteRoutes() {

    authenticate("auth-jwt") {

        post("/favorites") {
            val principal = call.principal<JWTPrincipal>()!!
            val userId = principal.payload.getClaim("userId").asInt()

            val body = call.receive<Map<String, Long>>()
            val gameId = body["gameId"] ?: return@post call.respond(HttpStatusCode.BadRequest)

            transaction {
                Favorites.insertIgnore {
                    it[Favorites.userId] = userId
                    it[Favorites.gameId] = gameId

                }
            }

            call.respond(HttpStatusCode.Created)
        }

        get("/favorites") {
            val principal = call.principal<JWTPrincipal>()!!
            val userId = principal.payload.getClaim("userId").asInt()

            val games = transaction {
                (Favorites innerJoin Games)
                    .select { Favorites.userId eq userId }
                    .map {
                        mapOf(
                            "id" to it[Games.id],
                            "name" to it[Games.name]
                        )
                    }
            }

            call.respond(games)
        }

    }
}
