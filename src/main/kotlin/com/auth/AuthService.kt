package com.auth

import at.favre.lib.crypto.bcrypt.BCrypt

class AuthService(private val repo: UserRepository) {
  private val verifier = BCrypt.verifyer()
  private val hasher   = BCrypt.withDefaults()

  fun signup(req: SignupRequest): User {
    // opcional: validar uniqueness before create
    val hash = hasher.hashToString(12, req.password.toCharArray())
    return repo.create(req, hash)
  }

  fun login(req: LoginRequest): User {
    val user = repo.findByEmail(req.email)
      ?: throw IllegalArgumentException("Credenciales inválidas")

    val result = verifier.verify(req.password.toCharArray(), user.hashedPassword)
    if (!result.verified) throw IllegalArgumentException("Credenciales inválidas")
    return user
  }
}
