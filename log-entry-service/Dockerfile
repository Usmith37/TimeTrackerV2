FROM openjdk:23

COPY /target/*.jar app.jar
ENTRYPOINT [ "java", "-jar", "app.jar" ]
#FROM maven:3.9.10-eclipse-temurin-24 AS build
#WORKDIR /app
#COPY . .
#RUN mvn -pl log-entry-service -am clean package -DskipTests
#
#FROM openjdk:23
#WORKDIR /app
#COPY --from=build /app/log-entry-service/target/*.jar app.jar
#ENTRYPOINT ["java", "-jar", "app.jar"]