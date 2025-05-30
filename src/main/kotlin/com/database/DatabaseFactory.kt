package com.database

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

object DatabaseFactory {
  fun init(url: String, user: String, pass: String) {
    val config = HikariConfig().apply {
      jdbcUrl = url
      driverClassName = "org.postgresql.Driver"
      username = user
      password = pass
      maximumPoolSize = 5
    }
    val ds = HikariDataSource(config)
    Database.connect(ds)
    transaction {
      SchemaUtils.createMissingTablesAndColumns(Users, Games, Ratings, Comments, Favorites, Lists, ListItems)
    }
  }
}
