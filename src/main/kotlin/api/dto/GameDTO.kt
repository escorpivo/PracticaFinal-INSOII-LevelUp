package api.dto

import kotlinx.serialization.Serializable

@Serializable
data class GameDTO(
    val id: Long,
    val name: String
)
