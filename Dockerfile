# Prueba básica para confirmar que Render está bien implementado
FROM openjdk:17-jdk-alpine

WORKDIR /app

RUN echo 'public class Main { public static void main(String[] args) { System.out.println("Hola Mundo desde Render!"); } }' > Main.java

RUN javac Main.java

CMD ["java", "Main"]
