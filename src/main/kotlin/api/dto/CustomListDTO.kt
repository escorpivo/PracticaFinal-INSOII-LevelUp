package api.dto

import kotlinx.serialization.Serializable

@Serializable
data class CustomListDTO(
    val id: Int,
    val name: String,
    val games: List<GameDTO>
)
