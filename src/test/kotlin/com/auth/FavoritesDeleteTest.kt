package com.auth

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.json.*
import kotlin.test.*
import com.module

class FavoritesDeleteTest {

    @Test
    fun testAddAndDeleteFavorite() = testApplication {
        application {
            module()
        }

        val timestamp = System.currentTimeMillis()
        val username = "testuser_$timestamp"
        val email = "test_$timestamp@example.com"
        val password = "testpass"

        val registerResponse = client.post("/signup") {
            contentType(ContentType.Application.Json)
            setBody(
                """
                {
                    "username": "$username",
                    "email": "$email",
                    "password": "$password"
                }
                """.trimIndent()
            )
        }
        assertEquals(HttpStatusCode.Created, registerResponse.status)

        val loginResponse = client.post("/login") {
            contentType(ContentType.Application.Json)
            setBody(
                """
                {
                    "email": "$email",
                    "password": "$password"
                }
                """.trimIndent()
            )
        }
        assertEquals(HttpStatusCode.OK, loginResponse.status)

        val json = Json.parseToJsonElement(loginResponse.bodyAsText()).jsonObject
        val token = json["token"]?.jsonPrimitive?.content ?: error("No se encontró el token")

        val gameId = 88888
        val addFavorite = client.post("/favorites") {
            contentType(ContentType.Application.Json)
            header(HttpHeaders.Authorization, "Bearer $token")
            setBody(
                """
                {
                    "gameId": $gameId,
                    "name": "Juego Delete",
                    "coverUrl": "https://example.com/delete.png"
                }
                """.trimIndent()
            )
        }
        assertEquals(HttpStatusCode.Created, addFavorite.status)

        val deleteResponse = client.delete("/favorites/$gameId") {
            header(HttpHeaders.Authorization, "Bearer $token")
        }
        assertEquals(HttpStatusCode.NoContent, deleteResponse.status)
    }
}
