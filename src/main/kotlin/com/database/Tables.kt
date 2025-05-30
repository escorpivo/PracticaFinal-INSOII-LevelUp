package com.database

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.ReferenceOption
import java.time.LocalDateTime

object Users : Table("users") {
    val id           = integer("id").autoIncrement()
    override val primaryKey = PrimaryKey(id, name = "PK_Users_Id")
    val username     = varchar("username", 50).uniqueIndex()
    val email        = varchar("email", 100).uniqueIndex()
    val password = varchar("password", length = 60) // BCrypt
    val createdAt    = datetime("created_at").defaultExpression(CurrentDateTime)
}

object Games : Table("games") {
    val id = long("id")
    override val primaryKey = PrimaryKey(id, name = "PK_Games_Id")
    val name = text("name")
}

object Ratings : Table("ratings") {
    val id     = integer("id").autoIncrement()
    override val primaryKey = PrimaryKey(id, name = "PK_Ratings_Id")

    val userId = integer("user_id")
        .references(Users.id, onDelete = ReferenceOption.CASCADE)
    val gameId = long("game_id")
        .references(Games.id, onDelete = ReferenceOption.CASCADE)

    // Usamos integer en lugar de smallint
    val score   = integer("score").check { it.between(1, 5) }

    val gameName = text("gameName")
    val coverUrl  = varchar("cover_url", 255).default("")

    init {
        uniqueIndex("UX_Ratings_User_Game", userId, gameId)
    }
}

object Comments : Table("comments") {
    val id = integer("id").autoIncrement()
    override val primaryKey = PrimaryKey(id, name = "PK_Comments_Id")

    val userId = integer("user_id")
        .references(Users.id, onDelete = ReferenceOption.CASCADE)
    val gameId = long("game_id")
        .references(Games.id, onDelete = ReferenceOption.CASCADE)

    val content     = text("content")
    val commentedAt = datetime("commented_at").defaultExpression(CurrentDateTime)
}

object Favorites : Table() {
    val userId = integer("user_id").references(Users.id)
    val gameId = long("game_id").references(Games.id)
    val coverUrl = varchar("cover_url", 255)
    override val primaryKey = PrimaryKey(userId, gameId)
}

object Library : Table("library") {
    val userId   = integer("user_id")
      .references(Users.id, onDelete = ReferenceOption.CASCADE)
    val gameId   = long("game_id")
      .references(Games.id, onDelete = ReferenceOption.CASCADE)
    val coverUrl = varchar("cover_url", 255)
    val addedAt  = datetime("added_at")
      .clientDefault { LocalDateTime.now() }   // ← Usa LocalDateTime

    override val primaryKey = PrimaryKey(userId, gameId, name = "PK_Library_user_game")
}