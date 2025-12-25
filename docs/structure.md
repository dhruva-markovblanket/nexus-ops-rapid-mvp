# Project Structure & Architecture

## Backend Strategy
We use a **Layered Architecture** to ensure data correctness and maintainability.

1.  **Routes (`/routes`):** Define the API endpoints and map them to controllers. No logic here.
2.  **Controllers (`/controllers`):** Handle the HTTP request/response cycle. Extract data, validate input structure (Zod), call Services, and send JSON responses.
3.  **Services (`/services`):** The "Brain". Contains all business logic (e.g., "Student cannot drop class after deadline"). Calls Models.
4.  **Models (`/models`):** The Data Access Layer (DAL). Execute raw SQL queries via `pg`. Ensures `PostgreSQL` is the single source of truth.

## Frontend Strategy
We use a **Feature-Based Architecture** to organize code by domain context rather than technical type.

1.  **Features (`/features`):** Contains domains like `auth`, `student`, `admin`.
    *   Each feature has its own `components`, `hooks`, and `services` if strictly private.
2.  **Shared (`/components`, `/services`):** truly global utilities (Button, API instance).
3.  **Routing:** Protected routes ensure students cannot access admin features.

## Database Schema (Planned)
- `users`: ID, email, role_enum, password_hash
- `tickets`: ID, title, status_enum, priority_enum, user_id (FK)
- `batches`: ID, year, course_name
- `enrollments`: user_id, batch_id

## Future Roadmap
For details on Authentication, Real-time updates, and Advanced Analytics extensions, please refer to [docs/future_roadmap.md](./future_roadmap.md).
