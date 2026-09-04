FROM ubuntu:latest
LABEL authors="GHB25jr"

ENTRYPOINT ["top", "-b"]
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]