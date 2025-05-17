package com.auth

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.server.auth.AuthenticationConfig
import io.ktor.server.auth.jwt.jwt
import io.ktor.server.auth.jwt.JWTPrincipal
import io.github.cdimascio.dotenv.dotenv
import java.util.*

object JwtConfig {
  private val dotenv   = dotenv()
  private val secret   = dotenv["JWT_SECRET"] ?: error("JWT_SECRET no definido")
  private val issuer   = dotenv["JWT_ISSUER"] ?: "levelup-api"
  private val audience = dotenv["JWT_AUDIENCE"] ?: "levelup-client"
  private val realm    = dotenv["JWT_REALM"]    ?: "ktor sample app"
  private val algorithm = Algorithm.HMAC256(secret)

  fun generateToken(email: String, userId: Int): String =
    JWT.create()
       .withIssuer(issuer)
       .withAudience(audience)
       .withClaim("email", email)
       .withClaim("userId", userId)
       .withExpiresAt(Date(System.currentTimeMillis() + 86_400_000))
       .sign(algorithm)

  // Aquí usamos el alias AuthenticationConfig
  fun configureKtorAuth(config: AuthenticationConfig) {
    config.jwt("auth-jwt") {
      realm = this@JwtConfig.realm
      verifier(
        JWT
          .require(algorithm)
          .withIssuer(issuer)
          .withAudience(audience)
          .build()
      )
        validate { creds ->
            val email = creds.payload.getClaim("email").asString()
            val userId = creds.payload.getClaim("userId").asInt()

            if (email != null && userId != null) JWTPrincipal(creds.payload) else null
        }

    }
  }
}
