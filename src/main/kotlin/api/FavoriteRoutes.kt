// api/FavoriteRoutes.kt
package api

import com.database.Favorites
import com.database.Games
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.insertIgnore
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*


fun Route.favoriteRoutes() {

    authenticate("auth-jwt") {

        //para el post
        @kotlinx.serialization.Serializable
        data class FavoriteRequest(
            val gameId: Long,
            val name: String,
            val coverUrl: String
        )

        //para el get
        @kotlinx.serialization.Serializable
        data class FavoriteResponse(
            val id: Long,
            val name: String,
            val coverUrl: String
        )



        post("/favorites") {
            val principal = call.principal<JWTPrincipal>()!!
            val userId = principal.payload.getClaim("userId").asInt()
            val req = call.receive<FavoriteRequest>()

            transaction {
                // Insertar en Games si no existe
                val gameExists = Games.select { Games.id eq req.gameId }.empty().not()
                if (!gameExists) {
                    Games.insert {
                        it[Games.id] = req.gameId
                        it[Games.name] = req.name
                    }
                }

                // Insertar en Favorites
                Favorites.insertIgnore {
                    it[Favorites.userId] = userId
                    it[Favorites.gameId] = req.gameId
                    it[Favorites.coverUrl] = req.coverUrl
                }
            }

            call.respond(HttpStatusCode.Created)
        }

        get("/favorites") {
            val principal = call.principal<JWTPrincipal>()!!
            val userId = principal.payload.getClaim("userId").asInt()

            val favorites = transaction {
                (Favorites innerJoin Games)
                    .select { Favorites.userId eq userId }
                    .map {
                        FavoriteResponse(
                            id = it[Games.id],
                            name = it[Games.name],
                            coverUrl = it[Favorites.coverUrl]
                        )
                    }
            }


            call.respond(favorites)
        }

        // DELETE /favorites/{gameId}
        delete("/favorites/{gameId}") {
            // extraemos userId del token
            val principal = call.principal<JWTPrincipal>()!!
            val userId    = principal.payload.getClaim("userId").asInt()

            // validamos parámetro
            val gameId = call.parameters["gameId"]?.toLongOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "gameId inválido")

            // borramos
            val deletedRows = transaction {
                Favorites.deleteWhere { 
                    (Favorites.userId eq userId) and 
                    (Favorites.gameId eq gameId) 
                }
            }

            if (deletedRows > 0) {
                call.respond(HttpStatusCode.NoContent)
            } else {
                call.respond(HttpStatusCode.NotFound, "Favorito no encontrado")
            }
        }


    }
}
