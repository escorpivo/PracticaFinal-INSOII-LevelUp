package com.api

import kotlinx.serialization.Serializable

@Serializable
data class RatingRequest(
  val userId: Int,     // ID del usuario que valora
  val gameId: Long,    // ID del juego (coincide con PK en tabla Games)
  val gameName: String,// Nombre del juego (se usará para insertar en tabla Games si no existe)
  val score: Short     // Puntuación de 1 a 5
)

@Serializable
data class CommentRequest(
  val userId: Int,
  val gameId: Long,
  val content: String  // Texto del comentario
)