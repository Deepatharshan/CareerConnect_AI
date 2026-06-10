# Database Schema Design

Each microservice manages its own database to adhere to the Database-per-Service pattern.

## 1. Authentication Service (MySQL)
**Table: `users`**
- `id` (PK, UUID)
- `email` (VARCHAR, Unique)
- `password_hash` (VARCHAR)
- `role` (ENUM: JOB_SEEKER, EMPLOYER, ADMIN)
- `created_at` (TIMESTAMP)

## 2. Profile Service (MongoDB)
**Collection: `user_profiles`**
- `_id` (ObjectId)
- `user_id` (UUID - relates to Auth Service)
- `first_name` (String)
- `last_name` (String)
- `headline` (String)
- `education` (Array of Objects)
- `experience` (Array of Objects)
- `skills` (Array of Strings)
- `cv_url` (String)
- `profile_picture_url` (String)

## 3. Job Service (MySQL)
**Table: `jobs`**
- `id` (PK, UUID)
- `company_id` (UUID)
- `title` (VARCHAR)
- `description` (TEXT)
- `requirements` (TEXT)
- `salary_min` (DECIMAL)
- `salary_max` (DECIMAL)
- `location` (VARCHAR)
- `job_type` (ENUM: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP)
- `status` (ENUM: OPEN, CLOSED)
- `created_at` (TIMESTAMP)

**Table: `job_skills`**
- `job_id` (FK to jobs)
- `skill_name` (VARCHAR)

## 4. Application Service (MySQL)
**Table: `applications`**
- `id` (PK, UUID)
- `job_id` (UUID)
- `candidate_id` (UUID)
- `status` (ENUM: APPLIED, UNDER_REVIEW, SHORTLISTED, INTERVIEW_SCHEDULED, REJECTED, SELECTED)
- `applied_at` (TIMESTAMP)
- `resume_url_used` (VARCHAR)

## 5. Company Service (MySQL)
**Table: `companies`**
- `id` (PK, UUID)
- `owner_id` (UUID - employer user)
- `name` (VARCHAR)
- `description` (TEXT)
- `website` (VARCHAR)
- `logo_url` (VARCHAR)
- `industry` (VARCHAR)
- `location` (VARCHAR)

## 6. Video Interview Service (MySQL)
**Table: `interviews`**
- `id` (PK, UUID)
- `application_id` (UUID)
- `scheduled_time` (TIMESTAMP)
- `meeting_link` (VARCHAR)
- `status` (ENUM: SCHEDULED, COMPLETED, CANCELLED)
