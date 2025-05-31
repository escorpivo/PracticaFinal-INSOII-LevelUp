package api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import com.database.Games
import com.database.Ratings
import com.database.Comments
import com.auth.ReviewResponse


fun Route.reviewsRoutes() {
    authenticate("auth-jwt") {
        get("/reviews") {
            val principal = call.principal<JWTPrincipal>()!!
            val userId = principal.payload.getClaim("userId").asInt()

            val reviews = transaction {
                (Comments innerJoin Games)
                    .select { Comments.userId eq userId }
                    .orderBy(Comments.commentedAt, SortOrder.DESC) 
                    .map { commentRow ->
                        val rating = Ratings
                            .select { (Ratings.userId eq userId) and (Ratings.gameId eq commentRow[Comments.gameId]) }
                            .firstOrNull()?.get(Ratings.score)

                        ReviewResponse(
                            gameId = commentRow[Games.id],
                            name = commentRow[Games.name],
                            coverUrl = commentRow[Games.coverUrl],
                            rating = rating,
                            comment = commentRow[Comments.content],
                            commentedAt = commentRow[Comments.commentedAt].toString()
                        )
                    }
            }


            call.respond(reviews)
        }
    }
}
