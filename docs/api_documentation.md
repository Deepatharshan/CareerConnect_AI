# API Documentation

All APIs are routed through the API Gateway `http://localhost:8080`.

## 1. Auth Service `/api/v1/auth`
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/register` | Register a new user | No |
| POST   | `/login`    | Login and get JWT   | No |
| POST   | `/validate` | Validate JWT token  | No |

## 2. Profile Service `/api/v1/profiles`
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/{id}` | Get profile by User ID | Yes (Any) |
| POST | `/` | Create user profile | Yes (Job Seeker) |
| PUT | `/{id}` | Update profile | Yes (Job Seeker - Self) |
| POST | `/{id}/cv` | Upload CV (PDF) | Yes (Job Seeker - Self) |

## 3. Job Service `/api/v1/jobs`
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Search & filter jobs | Yes (Any) |
| GET | `/{id}` | Get job details | Yes (Any) |
| POST | `/` | Create a job post | Yes (Employer) |
| PUT | `/{id}` | Update job post | Yes (Employer - Owner) |
| DELETE| `/{id}` | Delete job post | Yes (Employer - Owner) |

## 4. Application Service `/api/v1/applications`
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/apply/{jobId}` | Apply for a job | Yes (Job Seeker) |
| GET | `/user/{userId}` | Get user applications | Yes (Job Seeker) |
| GET | `/job/{jobId}` | Get applicants for job| Yes (Employer - Owner) |
| PATCH | `/{appId}/status`| Update status | Yes (Employer - Owner) |

## 5. AI CV Analysis Service `/api/v1/ai`
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/analyze` | Upload CV & Job ID for score | Yes (Job Seeker) |
| GET | `/recommend/{userId}` | Get tailored job recommendations | Yes (Job Seeker) |

## 6. Video Interview Service `/api/v1/interviews`
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/schedule` | Generate meeting link  | Yes (Employer) |
| GET | `/{appId}` | Get interview details | Yes (Any related) |
