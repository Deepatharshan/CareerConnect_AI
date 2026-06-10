# CareerConnect AI - Architecture & Design

## Microservice Architecture & Communication

The system relies on an API Gateway as the single entry point. Internal services communicate synchronously via REST (for direct queries) and asynchronously via Kafka (for event-driven data flow).

```mermaid
graph TD
    Client[Web/Mobile Client] -->|HTTPS| APIGW[API Gateway]
    
    subgraph Spring Cloud Infrastructure
        Config[Config Server]
        Discovery[Eureka Discovery]
    end

    APIGW --> Auth[Auth Service]
    APIGW --> Job[Job Service]
    APIGW --> Profile[Profile Service]
    APIGW --> App[Application Service]
    APIGW --> Comp[Company Service]
    APIGW --> AI[AI CV Analysis]
    APIGW --> Rec[Recommendation]
    APIGW --> Chat[Chat Service]
    APIGW --> Video[Video Interview]

    Auth -.-> DB_MySQL[(Auth DB MySQL)]
    Job -.-> DB_MySQL2[(Job DB MySQL)]
    Profile -.-> DB_Mongo[(Profile DB Mongo)]
    App -.-> DB_MySQL3[(App DB MySQL)]
    Comp -.-> DB_MySQL4[(Company DB MySQL)]
    Rec -.-> DB_Mongo2[(Rec DB Mongo)]
    
    Job -->|JobCreated Event| Kafka
    App -->|ApplicationSubmitted Event| Kafka
    Profile -->|CVUploaded Event| Kafka
    Video -->|InterviewScheduled Event| Kafka

    Kafka -->|Consume| Rec
    Kafka -->|Consume| Notif[Notification Service]
    Kafka -->|Consume| AI
    
    Auth -.-> Redis[(Redis Session/Cache)]
    Chat -.-> Redis
```

## Technology Stack Justification
- **Spring Boot & Spring Cloud**: Robust microservice ecosystem with built-in discovery, config, and resilience.
- **API Gateway**: Provides a reverse proxy and unified API edge.
- **Kafka**: Essential for decoupled events (like triggering AI analysis only after CV upload).
- **MySQL/PostgreSQL**: Relational integrity for core transactional systems (Jobs, Users, Applications).
- **MongoDB**: Schema-less flexibility for User Profiles, rich CV JSON, and Recommendations.

## High-Level Data Flow Example: Apply for Job
1. User clicks "Apply" on UI. Request routed via API Gateway to `Application Service`.
2. `Application Service` saves application status as `Applied` in MySQL.
3. `Application Service` publishes `ApplicationSubmitted` event to Kafka.
4. `Notification Service` listens to Kafka and sends an email to the User and Company.
5. `Recommendation Service` updates user's personalized job feed based on the applied sector.
