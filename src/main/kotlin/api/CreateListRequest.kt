package api

import kotlinx.serialization.Serializable

@Serializable
data class GameDTO(val id: Long, val name: String)

@Serializable
data class CreateListRequest(
    val name: String,
    val games: List<GameDTO>
)
