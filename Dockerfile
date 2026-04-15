# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ENV VITE_API_URL=/api
RUN npm run build

# Stage 2: Build the Spring Boot backend with frontend bundled in
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY demo/ ./
# Copy the built frontend into Spring Boot's static resources
COPY --from=frontend-build /frontend/dist/ ./src/main/resources/static/
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests
CMD ["java", "-jar", "target/demo-0.0.1-SNAPSHOT.jar"]
