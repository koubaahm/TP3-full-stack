FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:21
WORKDIR /app
COPY --from=build /app/target/shop-app-0.0.1-SNAPSHOT.jar shop-app.jar
ENTRYPOINT ["java", "-jar", "shop-app.jar"]
EXPOSE 8080
