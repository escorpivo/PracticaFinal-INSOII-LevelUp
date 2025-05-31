package com.auth

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.*
import com.module


class AuthRoutesTest {

    @Test
    fun testRegisterAndLogin() = testApplication {
        application {
            module() 
        }

        val testEmail = "testuser@example.com"
        val testUsername = "testuser"
        val testPassword = "testpassword"

        // 🔹 Register
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

        // 🔹 Login
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
        val body = loginResponse.bodyAsText()
        println("Login JWT: $body")

        //assertTrue("token" in body || "jwt" in body, "La respuesta no contiene JWT")
    }
}
