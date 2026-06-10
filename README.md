# CareerConnect AI - Enterprise Job Search Platform

CareerConnect AI is a distributed, microservices-based job hunting and recruitment platform powered by AI. It functions similarly to LinkedIn with added AI recommendations and CV analysis. 

## Project Architecture
- **Microservices**: Spring Boot & Spring Cloud for backend
- **Frontend**: React + Vite + TailwindCSS
- **Communication**: REST API (Synchronous) + Kafka (Asynchronous)
- **Database**:
  - MySQL/PostgreSQL (Relational data: Users, Jobs, Applications)
  - MongoDB (Document data: User profiles, unstructured CV JSON)
  - Redis (Caching: Sessions, OTP, active job searches)
- **Infrastructure**: Docker for containerization, Kubernetes for orchestration

## Phase-by-Phase Execution Guide

### Phase 1: Infrastructure Setup (Local Development)
1. Ensure you have **Docker** and **Docker Compose** installed.
2. We have provided `docker-compose.yml` to spin up dependencies: Kafka, Zookeeper, MySQL, MongoDB, Redis, Prometheus, Grafana.
3. Run the following command at the project root to start infrastructure:
   ```bash
   docker-compose up -d
   ```

### Phase 2: Building Microservices Foundation
The backend is structured into multiple decoupled services.
- **Config Server** (Port `8888`): Centralized config management.
- **Discovery Server** (Port `8761`): Eureka registry for service discovery.
- **API Gateway** (Port `8080`): Entry point for all clients. Routes and load-balances.
- **Auth Service**: Manages JWT registration and authentication.
- **Profile & Job Services**: Core business logic modules.
- **AI CV Analysis Service**: NLP/LLM python or java wrapper to analyze PDF and output missing skills.
- **Other Core Services**: Company, Recommendation, Notification, Video Interview, Chat, Admin.

*To Run Services Local:*
Use Maven to run each application. E.g.,
```bash
cd backend/discovery-server
mvn spring-boot:run
```

### Phase 3: Frontend Setup
1. The frontend uses `Vite` for fast building and HMR.
2. Setup React app:
   ```bash
   cd frontend/career-connect-ui
   npm install
   npm run dev
   ```
3. Ensure the API Gateway is running on `localhost:8080` to route API calls.

### Phase 4: Kubernetes Deployment
All Kubernetes configurations are provided in the `/k8s` directory.
1. Make sure `kubectl` and `minikube` (or Docker Desktop K8s) are installed.
2. Build docker images for each service (using the provided Spring Boot `jib` or Dockerfiles).
3. Apply manifests:
   ```bash
   kubectl apply -f k8s/secrets/
   kubectl apply -f k8s/configmaps/
   kubectl apply -f k8s/volumes/
   kubectl apply -f k8s/deployments/
   kubectl apply -f k8s/services/
   kubectl apply -f k8s/ingress/
   ```

## Development and Extension
To extend the project, add more features to individual microservices and produce/consume new events via the Kafka broker configured.