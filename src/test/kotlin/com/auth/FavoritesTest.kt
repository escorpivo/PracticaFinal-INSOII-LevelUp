package com.routes

import com.module
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.*
import kotlinx.serialization.json.*

class FavoriteRoutesTest {

    @Test
    fun testAddAndGetFavorite() = testApplication {
        application {
            module()
        }

        val timestamp = System.currentTimeMillis()
        val username = "user_$timestamp"
        val email = "user_$timestamp@example.com"
        val password = "testpass"

        // Register
        val registerRes = client.post("/signup") {
            contentType(ContentType.Application.Json)
            setBody("""{
                "username": "$username",
                "email": "$email",
                "password": "$password"
            }""")
        }
        assertEquals(HttpStatusCode.Created, registerRes.status)

        // Login
        val loginRes = client.post("/login") {
            contentType(ContentType.Application.Json)
            setBody("""{
                "email": "$email",
                "password": "$password"
            }""")
        }
        assertEquals(HttpStatusCode.OK, loginRes.status)

        val token = Json.parseToJsonElement(loginRes.bodyAsText())
            .jsonObject["token"]!!.jsonPrimitive.content

        // Añadir favorito
        val gameId = 42L
        val addRes = client.post("/favorites") {
            contentType(ContentType.Application.Json)
            header("Authorization", "Bearer $token")
            setBody("""{
                "gameId": $gameId,
                "name": "Test Game",
                "coverUrl": "http://example.com/test.jpg"
            }""")
        }
        assertEquals(HttpStatusCode.Created, addRes.status)

        // Listar favoritos
        val favRes = client.get("/favorites") {
            header("Authorization", "Bearer $token")
        }
        assertEquals(HttpStatusCode.OK, favRes.status)

        val favorites = Json.parseToJsonElement(favRes.bodyAsText()).jsonArray
        val added = favorites.any {
            it.jsonObject["id"]!!.jsonPrimitive.long == gameId
        }

        assertTrue(added, "El juego no se añadió correctamente a favoritos")
    }
}
