package com

import com.api.IGDBClient
import api.RatingRequest
import api.CommentRequest
import com.database.DatabaseFactory  //Import añadido para inicializar la BD
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
import io.ktor.server.auth.*                  //para Authentication
import io.ktor.server.auth.jwt.*              //para JWT
import kotlinx.serialization.json.Json
import io.github.cdimascio.dotenv.dotenv
import io.github.cdimascio.dotenv.DotenvException   //Import necesario para el catch
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import org.jetbrains.exposed.sql.insertIgnore
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File
import io.ktor.server.http.content.*
import com.auth.UserRepository
import com.auth.AuthService
import com.auth.JwtConfig
import io.ktor.server.auth.Authentication
import com.auth.SignupRequest
import com.auth.LoginRequest
import api.commentRoutes
import api.favoriteRoutes
import api.ratingRoutes





// Cargamos el .env (si existe, solo en local); en producción se usará System.getenv()
val dotenv = try {
  dotenv()
} catch (e: DotenvException) {
  null
}

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        module()
    }.start(wait = true)
}

fun Application.module() {

    val userRepo     = UserRepository()
    val authService  = AuthService(userRepo)

    println("DB_URL → ${dotenv?.get("DB_URL") ?: System.getenv("DB_URL")}")
    println("DB_USER → ${dotenv?.get("DB_USER") ?: System.getenv("DB_USER")}")
    println("DB_PASSWORD → ${dotenv?.get("DB_PASSWORD") ?: System.getenv("DB_PASSWORD")}")

    // inicializa la BD:
    DatabaseFactory.init(
        url  = dotenv?.get("DB_URL")     ?: System.getenv("DB_URL")     ?: error("DB_URL no definido"),
        user = dotenv?.get("DB_USER")    ?: System.getenv("DB_USER")    ?: error("DB_USER no definido"),
        pass = dotenv?.get("DB_PASSWORD")?: System.getenv("DB_PASSWORD")?: error("DB_PASSWORD no definido")
    )

    // instala un plugin en el servidor Ktor, permitiendo manejar distintos formatos de datos
    install(ContentNegotiation) {
        json(Json {
            prettyPrint    = true
            isLenient      = true
            explicitNulls  = true
            encodeDefaults = true
        })
    }
    install(CORS) {

        //Solo lo vamos a tener en desarrollo
        anyHost()
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
    }


    // hay que crear un .env para evitar que los datos viajen por aqui
    val igdbClient = IGDBClient(
        clientId     = dotenv?.get("CLIENT_ID")     ?: System.getenv("CLIENT_ID")     ?: error("CLIENT_ID no encontrado"),
        clientSecret = dotenv?.get("CLIENT_SECRET") ?: System.getenv("CLIENT_SECRET") ?: error("CLIENT_SECRET no encontrado")
    )

    install(Authentication) {
        JwtConfig.configureKtorAuth(this)
    }

    routing {
        // ruta para obtener los juegos, de la función fetchGames de IGDBClient
        get("/games") {
            val games = igdbClient.fetchGamesCached()
            call.respond(games)
        }
        //metodo para gestionar comentarios
        commentRoutes()
        favoriteRoutes()
        ratingRoutes()

        // POST /signup
        post("/signup") {
            // recogemos el body como SignupRequest
            val req = call.receive<SignupRequest>()
            // pasamos el objeto entero a AuthService
            val user = authService.signup(req)
            call.respond(HttpStatusCode.Created, user)
        }

        // POST /login
        post("/login") {
            // recogemos el body como LoginRequest
            val req = call.receive<LoginRequest>()
            // si no hay usuario, devolvemos 401
            val user = authService.login(req)
                ?: return@post call.respond(
                    HttpStatusCode.Unauthorized,
                    mapOf("error" to "Credenciales inválidas")
                )
            
            // generamos token JWT a partir del usuario
            val token = JwtConfig.generateToken(user.email, user.id)
            call.respond(mapOf("token" to token))
        }

        // ——— rutas protegidas: sólo usuarios logueados con JWT ———
        authenticate("auth-jwt") {
            // POST /ratings
            post("/ratings") {
                // extraigo el userId del token
                val principal = call.principal<JWTPrincipal>()!!
                val userId    = principal.payload.getClaim("userId").asInt()

                val req = call.receive<RatingRequest>()
                transaction {
                    Games.insertIgnore {
                        it[Games.id]   = req.gameId
                        it[Games.name] = req.gameName
                    }
                    Ratings.insertIgnore {
                        it[Ratings.userId]   = userId
                        it[Ratings.gameId]   = req.gameId
                        it[Ratings.score]    = req.score.toInt()
                        it[Ratings.gameName] = req.gameName
                    }
                }
                call.respond(HttpStatusCode.Created)
            }
        }


        // sirve el frontend desde levelupfront/build
        staticFiles("/", File("levelupfront/build")) {
            // Accedemos a la página por defecto
            default("index.html")
        }
    }
}
