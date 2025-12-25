# Sapthagiri NPS University - Campus Management System (Nexus Ops)

## Project Structure

This repository is a monorepo-style structure containing both the client and server applications.

### /backend
Node.js + Express + PostgreSQL.
- **Source of Truth:** All business logic and data validation reside here.
- **Architecture:** Layered (Router -> Controller -> Service -> Data Access Layer).

### /frontend
React + Vite + Tailwind CSS.
- **Consumer:** Consumes REST APIs provided by the backend.
- **Architecture:** Feature-based. Each major domain (Student, Faculty, Admin) has its own directory containing specific pages, components, and hooks.

### /docs
Architectural documentation and API contracts.

## Getting Started

1. **Database:** Ensure PostgreSQL is running.
2. **Backend:** `cd backend` -> `npm install` -> `npm run dev`
3. **Frontend:** `cd frontend` -> `npm install` -> `npm run dev`
