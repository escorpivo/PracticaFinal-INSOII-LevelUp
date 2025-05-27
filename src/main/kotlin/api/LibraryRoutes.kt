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

@Serializable
data class LibraryItemResponse(
  val id: Long,
  val name: String,
  val score: Int
)

@Serializable
data class LibraryAddRequest(
  val gameId: Long,
  val gameName: String
)

fun Route.libraryRoutes() {
  authenticate("auth-jwt") {

    // 1) LISTAR biblioteca
    get("/library") {
      val principal = call.principal<JWTPrincipal>()!!
      val userId = principal.payload.getClaim("userId").asInt()

      val items = transaction {
        (Ratings innerJoin Games)
          .select { Ratings.userId eq userId }
          .map { row ->
            LibraryItemResponse(
              id    = row[Games.id],
              name  = row[Games.name],
              score = row[Ratings.score]
            )
          }
      }

      call.respond(items)
    }

    // 2) AÑADIR a la biblioteca (si no existe, crea un rating "dummy" de 1)
    post("/library") {
      val principal = call.principal<JWTPrincipal>()!!
      val userId = principal.payload.getClaim("userId").asInt()
      val req = call.receive<LibraryAddRequest>()

      transaction {
        // Asegura que el juego exista en la tabla Games
        Games.insertIgnore {
          it[id]   = req.gameId
          it[name] = req.gameName
        }
        // Inserta un rating por defecto de 1 (o ignora si ya existe)
        Ratings.insertIgnore {
          it[Ratings.userId]   = userId
          it[Ratings.gameId]   = req.gameId
          it[Ratings.score]    = 1
          it[Ratings.gameName] = req.gameName
        }
      }

      call.respond(HttpStatusCode.Created)
    }

    // 3) QUITAR de la biblioteca
    delete("/library/{gameId}") {
      val principal = call.principal<JWTPrincipal>()!!
      val userId = principal.payload.getClaim("userId").asInt()
      val gameId = call.parameters["gameId"]?.toLongOrNull()
        ?: return@delete call.respond(HttpStatusCode.BadRequest, "gameId inválido")

      val deleted = transaction {
        Ratings.deleteWhere { 
          (Ratings.userId eq userId) and 
          (Ratings.gameId eq gameId) 
        }
      }

      if (deleted > 0) {
        call.respond(HttpStatusCode.NoContent)
      } else {
        call.respond(HttpStatusCode.NotFound, "No estaba en tu biblioteca")
      }
    }
  }
}
