package api

import kotlinx.serialization.Serializable

@Serializable
data class RatingRequest(
  val gameId: Long,    // ID del juego (coincide con PK en tabla Games)
  val gameName: String,// Nombre del juego (se usará para insertar en tabla Games si no existe)
  val score: Short     // Puntuación de 1 a 5
)

//posteamos los comentarios
@Serializable
data class CommentRequest(
  val gameId: Long,
  val content: String  // Texto del comentario
)

//obtenemos los comentarios
@Serializable
data class CommentResponse(
  val id: Int,
  val userId: Int,
  val username: String,
  val gameId: Long,
  val content: String,
  val commentedAt: String
)