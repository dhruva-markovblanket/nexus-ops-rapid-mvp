# API Integration Contract

## 1. General Standards
*   **Base URL:** `/api/v1`
*   **Content-Type:** `application/json`
*   **Versioning:** URI Versioning (v1, v2). Breaking changes require a new version.

## 2. Authentication (Mock)
Since true auth is out of scope, the frontend must pass context via headers:
*   `x-mock-user-id`: string (UUID of the active user)
*   `x-mock-role`: string (ADMIN | STAFF | STUDENT)

## 3. Response Format
All successful responses are wrapped in a `data` object.

**Success (200/201):**
```json
{
  "data": { ...payload }
}
```

**Error (4xx/5xx):**
```json
{
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human readable message",
    "details": {} // Optional validation errors
  }
}
```

## 4. Endpoints

### Issues / Tickets
*   `POST /tickets`: Create a new issue.
    *   **Payload:** `{ title, description, buildingId, severity, category }`
*   `GET /tickets`: List issues.
    *   **Query Params:** `status`, `buildingId`

### Academics
*   `GET /academics/student/overview`: Student dashboard stats.
*   `GET /academics/batch/:id/attendance`: Faculty view.
