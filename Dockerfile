# ----------------------
# Etapa 1: Compilar el frontend con Node.js
# ----------------------
FROM node:20-alpine as frontend-build

WORKDIR /frontend

# Copiamos package.json y lock para instalar solo si cambian
COPY levelupfront/package*.json ./
RUN npm install

# copiamos todo el frontend y lo construimos
COPY levelupfront/ .
RUN npm run build

# ----------------------
# Etapa 2: Compilar el backend con Gradle y empaquetar frontend
# ----------------------
FROM openjdk:17-jdk-alpine

WORKDIR /app

# Copiamos el backend completo
COPY . .

# Copiamos el frontend compilado desde la etapa anterior
COPY --from=frontend-build /frontend/build ./levelupfront/build

# Damos permisos y construimos el JAR con el frontend incluido
RUN chmod +x ./gradlew
RUN ./gradlew build shadowJar

# Puerto expuesto por Ktor
EXPOSE 8080

# Ejecutamos la aplicación
CMD ["java", "-jar", "build/libs/LevelUp-all.jar"]
