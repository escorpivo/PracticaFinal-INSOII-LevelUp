package api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import com.database.Games
import com.database.Ratings
import java.math.BigDecimal

// Reutilizamos RatingRequest de Request.kt para el POST…

@Serializable
data class RatingAverageResponse(
  val gameId: Long,
  val average: Double
)

fun Route.ratingRoutes() {
  authenticate("auth-jwt") {
    // POST /ratings
    post("/ratings") {
      val principal = call.principal<JWTPrincipal>()!!
      val userId    = principal.payload.getClaim("userId").asInt()

      val req = call.receive<RatingRequest>()

      transaction {
        Games.insertIgnore {
          it[Games.id]   = req.gameId
          it[Games.name] = req.gameName
        }
        Ratings.insert {
          it[Ratings.userId]   = userId
          it[Ratings.gameId]   = req.gameId
          it[Ratings.score]    = req.score.toInt()
          it[Ratings.gameName] = req.gameName
        }
      }

      call.respond(HttpStatusCode.Created)
    }

    // GET /games/{gameId}/rating-average
    get("/games/{gameId}/rating-average") {
      val gameId = call.parameters["gameId"]?.toLongOrNull()
        ?: return@get call.respond(HttpStatusCode.BadRequest, "gameId inválido")

      val avg = transaction {
        Ratings
          .slice(Ratings.score.avg())
          .select { Ratings.gameId eq gameId }
          .mapNotNull  { it[Ratings.score.avg()] }
          .firstOrNull() ?: BigDecimal.ZERO
      }.toDouble()

      // Respondemos con un data class, no un Map
      call.respond(RatingAverageResponse(gameId = gameId, average = avg))
    }
  }
}
