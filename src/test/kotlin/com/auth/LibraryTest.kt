package com.auth

import com.module
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlin.test.*

class LibraryRoutesTest {

    @Test
    fun testAddAndGetLibrary() = testApplication {
        application {
            module()
        }

        val timestamp = System.currentTimeMillis()
        val testUsername = "testuser_$timestamp"
        val testEmail = "user_$timestamp@example.com"
        val testPassword = "testpassword"

        // Register
        val registerResponse = client.post("/signup") {
            contentType(ContentType.Application.Json)
            setBody(
                """
                {
                    "username": "$testUsername",
                    "email": "$testEmail",
                    "password": "$testPassword"
                }
                """.trimIndent()
            )
        }
        assertEquals(HttpStatusCode.Created, registerResponse.status)

        // Login
        val loginResponse = client.post("/login") {
            contentType(ContentType.Application.Json)
            setBody(
                """
                {
                    "email": "$testEmail",
                    "password": "$testPassword"
                }
                """.trimIndent()
            )
        }
        assertEquals(HttpStatusCode.OK, loginResponse.status)

        // ✅ Extraer solo el token como string
        val jsonToken = Json.parseToJsonElement(loginResponse.bodyAsText())
        val token = jsonToken.jsonObject["token"]?.jsonPrimitive?.content
            ?: error("Token no encontrado")

        val testGameId = 99999L
        val testGameName = "Test Game"
        val testCoverUrl = "https://example.com/test.jpg"

        // Añadir favorito
        val favRes = client.post("/favorites") {
            contentType(ContentType.Application.Json)
            header("Authorization", "Bearer $token")
            setBody(
                """
                {
                    "gameId": $testGameId,
                    "name": "$testGameName",
                    "coverUrl": "$testCoverUrl"
                }
                """.trimIndent()
            )
        }
        assertEquals(HttpStatusCode.Created, favRes.status)

        // Añadir valoración
        val rateRes = client.post("/ratings") {
            contentType(ContentType.Application.Json)
            header("Authorization", "Bearer $token")
            setBody(
                """
                {
                    "gameId": $testGameId,
                    "gameName": "$testGameName",
                    "score": 4
                }
                """.trimIndent()
            )
        }
        assertEquals(HttpStatusCode.Created, rateRes.status)

        // Obtener biblioteca
        val libraryRes = client.get("/library") {
            header("Authorization", "Bearer $token")
        }
        assertEquals(HttpStatusCode.OK, libraryRes.status)

        val json = Json.parseToJsonElement(libraryRes.bodyAsText()).jsonArray
        assertTrue(json.isNotEmpty(), "La biblioteca debería tener al menos un juego")

        val first = json.first().jsonObject
        assertEquals(testGameId.toString(), first["id"].toString())
        assertEquals("\"$testGameName\"", first["name"].toString())
        assertEquals("4", first["score"].toString())
        assertEquals("\"$testCoverUrl\"", first["coverUrl"].toString())
    }
}
