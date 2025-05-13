package com.auth

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import com.database.Users

class UserRepository {
  fun findByEmail(email: String): User? = transaction {
    Users.select { Users.email eq email }
         .map { row -> User(
             id = row[Users.id],
             username = row[Users.username],
             email = row[Users.email],
             hashedPassword = row[Users.password]
           )
         }
         .singleOrNull()
  }

  fun create(user: SignupRequest, hashedPwd: String): User = transaction {
    val userId = Users.insert {
      it[username] = user.username
      it[email]    = user.email
      it[password] = hashedPwd
    } get Users.id

    User(id = userId, username = user.username, email = user.email, hashedPassword = hashedPwd)
  }
}
