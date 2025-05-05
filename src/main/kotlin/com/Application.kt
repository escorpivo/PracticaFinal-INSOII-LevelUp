package com

import com.api.IGDBClient
import com.api.RatingRequest
import com.api.CommentRequest
import com.database.DatabaseFactory  // Import añadido para inicializar la BD
import com.database.Games
import com.database.Ratings
import com.database.Comments
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
import io.github.cdimascio.dotenv.dotenv
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import org.jetbrains.exposed.sql.insertIgnore
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File
import io.ktor.server.http.content.*

//cargamos el .env
val dotenv = dotenv()

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        module()
    }.start(wait = true)
}

fun Application.module() {
    // inicializa la BD:
  /*  DatabaseFactory.init(
        url  = dotenv["DB_URL"]     ?: error("DB_URL no definido"),
        user = dotenv["DB_USER"]    ?: error("DB_USER no definido"),
        pass = dotenv["DB_PASSWORD"]?: error("DB_PASSWORD no definido")
    )*/

    //instala un plugin en el servidor Ktor, permitiendo manejar distintos formatos de datos
    install(ContentNegotiation) {
        //estos atributos sirven para formatear y analizar la salida JSON para que sea más legible y flexible
        json(Json { prettyPrint = true; isLenient = true; explicitNulls = true; encodeDefaults = true })
    }
    install(CORS) {
        // Anyhost es Solo para desarrollo, no usar en producción, acarrea problemas de seguridad
        anyHost()
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowHeader(HttpHeaders.ContentType)
    }

    //hay que crear un .env para evitar que los datos viajen por aqui
    val igdbClient = IGDBClient(
        clientId     = dotenv["CLIENT_ID"]     ?: error("CLIENT_ID no encontrado"),
        clientSecret = dotenv["CLIENT_SECRET"] ?: error("CLIENT_SECRET no encontrado")
    )

    routing {
        //ruta para obtener los juegos, de la funcion fetchGames de IGDBClient
        get("/games") {
            val games = igdbClient.fetchGames()
            call.respond(games)
        }
        // POST /ratings
        post("/ratings") {
            val req = call.receive<RatingRequest>()
            transaction {
                Games.insertIgnore {
                    it[Games.id]   = req.gameId
                    it[Games.name] = req.gameName
                }
                Ratings.insertIgnore {
                    it[Ratings.userId] = req.userId
                    it[Ratings.gameId] = req.gameId
                    // Convertimos Short a Int para encajar con integer()
                    it[Ratings.score]  = req.score.toInt()
                }
            }
            call.respond(HttpStatusCode.Created)
        }
        // POST /comments
        post("/comments") {
            val req = call.receive<CommentRequest>()
            transaction {
                Games.insertIgnore {
                    it[Games.id]   = req.gameId
                    it[Games.name] = ""
                }
                Comments.insertIgnore {
                    it[Comments.userId]   = req.userId
                    it[Comments.gameId]   = req.gameId
                    it[Comments.content]  = req.content
                }
            }
            call.respond(HttpStatusCode.Created)
        }

        // sirve el frontend desde levelupfront/build
        staticFiles("/", File("levelupfront/build")) {
            default("index.html")
        }
    }
}
