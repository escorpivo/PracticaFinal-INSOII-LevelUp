package com.auth

import kotlinx.serialization.Serializable

@Serializable
data class ReviewResponse(
    val gameId: Long,
    val name: String,
    val coverUrl: String,
    val rating: Int?,
    val comment: String?, 
    val commentedAt: String 
)
