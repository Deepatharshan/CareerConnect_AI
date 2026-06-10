# CareerConnect AI Live Execution Guide

CareerConnect AI is a Spring Boot and React microservices platform for job search, recruitment, CV analysis, recommendations, applications, chat, video interview scheduling, notifications, and admin analytics.

## Services

| Service | Port | Responsibility |
| --- | ---: | --- |
| config-server | 8888 | Centralized Spring Cloud configuration |
| discovery-server | 8761 | Eureka service discovery |
| api-gateway | 8080 | Gateway routes for `/api/v1/**` |
| auth-service | 8081 | Register, login, JWT, roles |
| job-service | 8082 | Job CRUD, search, Kafka `JobCreated` |
| profile-service | 8083 | MongoDB-backed candidate profile |
| application-service | 8084 | Apply, save, withdraw, status tracking |
| company-service | 8085 | Company profile and applicants |
| ai-cv-service | 8086 | CV text/PDF analysis contract, ATS score, skill gaps |
| recommendation-service | 8087 | Skill and behavior based job recommendations |
| chat-service | 8088 | Candidate/employer room messaging |
| video-interview-service | 8089 | WebRTC meeting link generation |
| admin-service | 8090 | Analytics and reports |
| notification-service | 8091 | Kafka-driven email/push notification contract |

## Communication Diagram

```text
React + Vite UI
    |
    v
API Gateway :8080
    |
    +--> Auth Service ---> MySQL
    +--> Job Service ---> MySQL ---> Kafka: JobCreated
    +--> Profile Service ---> MongoDB/GridFS-style CV/profile storage
    +--> Application Service ---> MySQL ---> Kafka: ApplicationSubmitted
    +--> Company Service ---> MySQL
    +--> AI CV Service ---> NLP/LLM provider contract
    +--> Recommendation Service <--- Kafka: JobCreated, user behavior
    +--> Notification Service <--- Kafka: CVUploaded, InterviewScheduled
    +--> Chat Service ---> WebSocket/REST room messaging
    +--> Video Interview Service ---> WebRTC meeting link contract
    +--> Admin Service ---> platform analytics

Prometheus scrapes services, Grafana visualizes metrics, ELK/OpenSearch can consume container logs.
```

## Local Run

1. Build backend:
   ```bash
   cd backend
   mvn -DskipTests package
   ```

2. Start infrastructure and services:
   ```bash
   cd ..
   docker compose up --build
   ```

3. Start frontend:
   ```bash
   cd frontend/career-connect-ui
   npm install
   npm run dev
   ```

4. Open:
   - Frontend: `http://localhost:5173`
   - API Gateway: `http://localhost:8080`
   - Eureka: `http://localhost:8761`
   - Prometheus: `http://localhost:9090`
   - Grafana: `http://localhost:3000`

## Kubernetes

Apply the manifests:

```bash
kubectl apply -f k8s/deployments/core-deployments.yaml
kubectl apply -f k8s/services/core-services.yaml
kubectl apply -f k8s/enterprise-platform.yaml
kubectl apply -f k8s/ingress/ingress.yaml
```

The Kubernetes bundle includes deployments, services, ConfigMap, Secret, persistent CV storage, Nginx ingress, and an HPA.

## Database Schema Summary

Relational data lives in MySQL: `users`, `jobs`, `applications`, and `companies`.
Profile/CV-oriented data lives in MongoDB: profile basics, skills, education, experience, portfolio links, profile image URL, and uploaded CV metadata.
Redis is reserved for hot job search/profile cache and session-adjacent lookup data.

## API Highlights

| Method | Endpoint | Use |
| --- | --- | --- |
| POST | `/api/v1/auth/register` | Register job seeker, employer, or admin |
| POST | `/api/v1/auth/login` | Login and receive JWT |
| GET | `/api/v1/jobs?q=&location=&jobType=&salaryMin=&experienceMax=` | Search and filter jobs |
| POST | `/api/v1/jobs` | Create job |
| POST | `/api/v1/applications/apply/{jobId}` | Apply for a job |
| POST | `/api/v1/applications/save/{jobId}` | Save a job |
| PATCH | `/api/v1/applications/{id}/withdraw` | Withdraw application |
| POST | `/api/v1/ai/analyze` | Analyze CV text |
| POST | `/api/v1/ai/cv/upload` | Upload CV/PDF for analysis contract |
| GET | `/api/v1/recommendations/jobs/{userId}` | Recommended jobs |
| POST | `/api/v1/interviews/schedule` | Schedule interview and generate WebRTC link |
| POST | `/api/v1/chat/rooms/{roomId}/messages` | Send candidate/employer message |
| GET | `/api/v1/admin/analytics` | Platform analytics |

## Current Implementation Notes

The project is production-shaped and locally runnable. AI, email/push, and WebRTC provider calls are implemented as deterministic service contracts so the website works without paid third-party keys. Replace those internals with OpenAI/LLM, SMTP/FCM, and a real WebRTC SFU/provider when deploying commercially.
