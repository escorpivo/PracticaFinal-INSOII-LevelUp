package api

import api.CommentRequest
import api.CommentResponse
import com.database.Comments
import com.database.Games
import com.database.Users
import io.ktor.http.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.insertIgnore
import org.jetbrains.exposed.sql.selectAll
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
        }
    }
}