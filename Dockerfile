# Imagen oficial de OpenJDK
FROM openjdk:17-jdk-alpine

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos todos los archivos del proyecto al contenedor
COPY . .

# Damos permisos de ejecución al script gradlew
RUN chmod +x ./gradlew

# Construimos el proyecto con Gradle
RUN ./gradlew build shadowJar

# Exponemos el puerto 8080 para Render
EXPOSE 8080

# Ejecutamos la aplicación de Ktor con el nombre correcto del .jar
CMD ["java", "-jar", "build/libs/LevelUp-all.jar"]