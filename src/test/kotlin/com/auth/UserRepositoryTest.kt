package com.auth

import com.database.Users
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.*
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class UserRepositoryTest {

    private lateinit var repo: UserRepository

    @BeforeAll
    fun setupDatabase() {
        // Conectar H2 en memoria
        Database.connect(
            url = "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1;",
            driver = "org.h2.Driver"
        )
        transaction {
            SchemaUtils.create(Users)
        }
        repo = UserRepository()
    }

    @Test
    fun `create inserta usuario y retorna mismo hashedPwd`() {
        val request   = SignupRequest("alice", "alice@mail", "password123")
        val fakeHash  = "\$2a\$10\$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        // Llamamos supplyando el hashedPwd
        val user = repo.create(request, fakeHash)

        // Verificamos que devuelve el mismo hash
        assertNotNull(user.id, "El ID no debe ser nulo")
        assertEquals("alice", user.username)
        assertEquals(fakeHash, user.hashedPassword)
    }

    @Test
    fun `findByEmail devuelve el usuario previamente creado`() {
        // Ya hemos insertado a "alice" arriba
        val found = repo.findByEmail("alice@mail")
        assertNotNull(found, "Debe encontrar un usuario con ese email")
        assertEquals("alice", found!!.username)
        // Y que el hash coincide con el que guardamos
        assertEquals("\$2a\$10\$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                     found.hashedPassword)
    }
}
