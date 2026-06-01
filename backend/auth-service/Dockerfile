FROM maven:3.9-eclipse-temurin-17 as builder
WORKDIR /app
COPY pom.xml .
COPY discovery-server discovery-server
COPY api-gateway api-gateway
COPY auth-service auth-service
COPY job-service job-service
COPY profile-service profile-service
COPY application-service application-service
COPY company-service company-service
COPY ai-cv-service ai-cv-service
COPY admin-service admin-service
COPY notification-service notification-service
COPY chat-service chat-service
COPY video-interview-service video-interview-service
COPY config-server config-server
COPY recommendation-service recommendation-service
RUN mvn clean package -DskipTests -pl auth-service -am

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/auth-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
