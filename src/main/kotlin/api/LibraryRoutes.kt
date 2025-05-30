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
import org.jetbrains.exposed.sql.transactions.transaction
import com.database.Games
import com.database.Ratings
import com.database.Favorites
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere

@Serializable
data class LibraryItemResponse(
  val id: Long,
  val name: String,
  val score: Int,
  val coverUrl: String       
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
        // JOIN de Ratings, Games y Favorites
        (Ratings innerJoin Games innerJoin Favorites)
          .slice(
            Games.id,
            Games.name,
            Ratings.score,
            Favorites.coverUrl
          )
          .select { 
            // sólo las filas de este usuario
            (Ratings.userId eq userId) and 
            (Favorites.userId eq userId) and 
            (Favorites.gameId eq Games.id)
          }
          .map { row ->
            LibraryItemResponse(
              id       = row[Games.id],
              name     = row[Games.name],
              score    = row[Ratings.score],
              coverUrl = row[Favorites.coverUrl]   
            )
          }
      }

      call.respond(items)
    }

    // 2) AÑADIR a la biblioteca
    post("/library") {
      val principal = call.principal<JWTPrincipal>()!!
      val userId = principal.payload.getClaim("userId").asInt()
      val req = call.receive<LibraryAddRequest>()

      transaction {
        Games.insertIgnore {
          it[id]   = req.gameId
          it[name] = req.gameName
        }
        Ratings.insertIgnore {
          it[Ratings.userId] = userId
          it[Ratings.gameId] = req.gameId
          it[score]          = 1
          it[gameName]       = req.gameName
        }
        Favorites.insertIgnore {
          it[Favorites.userId]   = userId
          it[Favorites.gameId]   = req.gameId
          it[Favorites.coverUrl]  = req.gameName 
        }
      }

      call.respond(HttpStatusCode.Created)
    }

    // 3) QUITAR de la biblioteca
    delete("/library/{gameId}") {
      val principal = call.principal<JWTPrincipal>()!!
      val userId = principal.payload.getClaim("userId").asInt()
      val gameId = call.parameters["gameId"]!!.toLong()

      transaction {
        Ratings.deleteWhere { 
          (Ratings.userId eq userId) and (Ratings.gameId eq gameId)
        }
        Favorites.deleteWhere {
          (Favorites.userId eq userId) and (Favorites.gameId eq gameId)
        }
      }

      call.respond(HttpStatusCode.NoContent)
    }
  }
}
