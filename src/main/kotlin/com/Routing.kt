 package com

import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*
import java.io.File

fun Application.configureRouting() {

    //accedemos a la carpeta del frontend que contiene el resultado de npm run build
    val buildDir = File("levelupfront/build")

    routing {
        staticFiles("/", buildDir) {

            //Accedemos a la página por defecto
            default("index.html")
        }
    }
}