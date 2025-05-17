package api

import com.database.Comments
import com.database.Games
import com.database.Users
import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.format.DateTimeFormatter

fun Route.commentRoutes() {
    route("/api/comments") {

        // GET /api/comments
        get {
            val comments = transaction {
                (Comments innerJoin Users).selectAll().map { row ->
                    CommentResponse(
                        id          = row[Comments.id],
                        userId      = row[Comments.userId],
                        username    = row[Users.username],
                        gameId      = row[Comments.gameId],
                        content     = row[Comments.content],
                        commentedAt = row[Comments.commentedAt].format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                    )
                }
            }
            call.respond(comments)
        }

        // POST /api/comments (requiere JWT)
        authenticate("auth-jwt") {
            post {

                val principal = call.principal<JWTPrincipal>() ?: return@post call.respond(HttpStatusCode.Unauthorized)
                val userId = principal.payload.getClaim("userId").asInt()

                val req = call.receive<CommentRequest>()

                transaction {
                    // Asegura que el juego existe
                    Games.insertIgnore {
                        it[id] = req.gameId
                        it[name] = ""
                    }

                    Comments.insert {
                        it[Comments.userId] = userId
                        it[gameId] = req.gameId
                        it[content] = req.content
                    }
                }

                call.respond(HttpStatusCode.Created)
            }


            // PUT /api/comments/{id}
            put("/{id}") {
                val principal = call.principal<JWTPrincipal>() ?: return@put call.respond(HttpStatusCode.Unauthorized)
                val userId = principal.payload.getClaim("userId").asInt()
                val commentId = call.parameters["id"]?.toIntOrNull() ?: return@put call.respond(HttpStatusCode.BadRequest, "ID inválido")
                val req = call.receive<CommentRequest>()

                val updatedRows = transaction {
                    Comments.update({ Comments.id eq commentId and (Comments.userId eq userId) }) {
                        it[content] = req.content
                    }
                }

                if (updatedRows > 0) {
                    call.respond(HttpStatusCode.OK, "Comentario actualizado")
                } else {
                    call.respond(HttpStatusCode.Forbidden, "No tienes permiso para editar este comentario o no existe")
                }
            }



            // DELETE /api/comments/{id}
            delete("/{id}") {
                val principal = call.principal<JWTPrincipal>() ?: return@delete call.respond(HttpStatusCode.Unauthorized)
                val userId = principal.payload.getClaim("userId").asInt()
                val commentId = call.parameters["id"]?.toIntOrNull() ?: return@delete call.respond(HttpStatusCode.BadRequest, "ID inválido")

                val deletedRows = transaction {
                    Comments.deleteWhere {id eq commentId and (Comments.userId eq userId) }
                }

                if (deletedRows > 0) {
                    call.respond(HttpStatusCode.OK, "Comentario eliminado")
                } else {
                    call.respond(HttpStatusCode.Forbidden, "No tienes permiso para eliminar este comentario o no existe")
                }
            }
        }
    }
}