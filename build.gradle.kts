val kotlin_version: String by project
val logback_version: String by project
val ktor_version: String by project

plugins {
    kotlin("jvm") version "2.1.10"
    kotlin("plugin.serialization") version "2.1.10" // ✅ Añadido el plugin de serialización de Kotlin
    id("io.ktor.plugin") version "3.1.1"
}

group = "com"
version = "0.0.1"

application {
    mainClass.set("com.ApplicationKt") // Clase principal del servidor
    val isDevelopment: Boolean = project.ext.has("development")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
}

repositories {
    mavenCentral()
}

dependencies {

    // Herramientas esenciales para configurar un servidor en Ktor
    implementation("io.ktor:ktor-server-core:$ktor_version")
    implementation("io.ktor:ktor-server-netty:$ktor_version")

    // Esto es para la parte de autenticación
    implementation("io.ktor:ktor-server-auth:$ktor_version")
    implementation("io.ktor:ktor-server-auth-jwt:$ktor_version")

    // Esto habilita la carga de configuraciones desde archivos .yaml
    implementation("io.ktor:ktor-server-config-yaml:$ktor_version")

    // Esto habilita la negociación de contenido (por ejemplo JSON)
    implementation("io.ktor:ktor-server-content-negotiation:$ktor_version")
    implementation("io.ktor:ktor-serialization-kotlinx-json:$ktor_version")
    implementation("io.ktor:ktor-serialization-kotlinx-xml:$ktor_version")

    // Esta es la librería de serialización directa de Kotlin
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3") // ✅ Añadido para la serialización JSON

    // Dependencias para obtener los datos de webs como IGDB
    implementation("io.ktor:ktor-client-core:$ktor_version")
    implementation("io.ktor:ktor-client-cio:$ktor_version")
    implementation("io.ktor:ktor-client-content-negotiation:$ktor_version")

    // Esto es para el tema de logs, usamos Logback
    implementation("ch.qos.logback:logback-classic:$logback_version")

    // Esto es para la parte de testing
    testImplementation("io.ktor:ktor-server-test-host:$ktor_version")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")


    //implementacion del .env
    implementation("io.github.cdimascio:dotenv-kotlin:6.4.1")
    // Implementación de CORS
    implementation("io.ktor:ktor-server-cors:$ktor_version")


}

// Configuración del ShadowJar proporcionado por el plugin de Ktor
tasks {
    shadowJar {
        archiveBaseName.set("LevelUp")
        archiveVersion.set("0.0.1")
        archiveClassifier.set("all")
    }
}

// Deshabilito los tests temporalmente
tasks.test {
    enabled = false
}

// Tarea para copiar el frontend compilado al directorio de recursos de Ktor
tasks.register<Copy>("copyFrontend") {
    from("../levelupfront/build") // Ajusta si está en otro lugar
    into("build/resources/main/static")
}

tasks.named("processResources") {
    dependsOn("copyFrontend")
}