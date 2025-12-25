# Nexus Ops – Rapid MVP

This repository contains a **rapid, AI-assisted MVP** built to explore full-stack structure, feature flows, and basic system integration.

The project uses a real university environment only as a **reference scenario**. It is **not an official system**, not production-ready, and not affiliated with any institution.



## Project Structure

This repository uses a monorepo-style structure with both backend and frontend applications.

### backend
Node.js, Express, and PostgreSQL  
Handles business logic, data validation, and REST APIs.

### frontend
React, Vite, and Tailwind CSS  
Consumes backend APIs and implements role-based flows.

### docs
High-level notes and API references.



## Status

This is a **Rapid MVP**:
- built quickly for experimentation and learning
- expected to change or be discarded
- not optimized for scale or security

Long-term development happens in the main **Nexus Ops** repository.






## Getting Started

1. **Database:** Ensure PostgreSQL is running.
2. **Backend:** `cd backend` -> `npm install` -> `npm run dev`
3. **Frontend:** `cd frontend` -> `npm install` -> `npm run dev`
