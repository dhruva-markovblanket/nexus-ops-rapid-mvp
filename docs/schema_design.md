# Database Schema Design & Analytics Strategy

## Core Entities

1.  **Users (Base Table):**
    *   Uses a Single Table Inheritance (STI) pattern via `role` ENUM but separates data into `students` and `faculty` tables.
    *   **Why:** Ensures clear separation of concerns while keeping authentication logic centralized in `users`.

2.  **Students & Faculty (Extension Tables):**
    *   1:1 mapping with `users`.
    *   **Why:** `students` have `roll_number`, `faculty` have `designation`. Merging these into `users` would create sparse rows (lots of nulls).

3.  **Enrollment (The Junction Table):**
    *   Links `Student` ↔ `Subject` ↔ `Batch` ↔ `Faculty`.
    *   **Why:** This is the most critical table for the system. It defines *who* is learning *what*, *when* (Batch context), and *from whom* (Faculty).

## Relationships

*   **User ↔ Student/Faculty:** 1:1.
*   **Batch ↔ Student:** 1:N (A student belongs to a primary batch).
*   **Enrollment:** N:M relationship breaker.
    *   A Student has many Enrollments.
    *   A Subject has many Enrollments.
    *   A Faculty teaches many Enrollments.

## Analytics & Long-Term Intelligence

This normalized schema supports deep analytics without storing derived data (like CGPA):

1.  **Longitudinal Student Performance:**
    *   By querying `enrollments` for a specific `student_id` over time, we can reconstruct their entire academic journey.
    *   *Query:* `SELECT * FROM enrollments WHERE student_id = ? ORDER BY enrolled_at`

2.  **Faculty Impact Analysis:**
    *   We link `faculty_id` to `enrollments`. This allows us to compare average grades/outcomes for the same `subject_id` taught by different faculty members.
    *   *Insight:* "Students taking CS101 with Prof. X have a 15% higher completion rate."

3.  **Batch/Cohort Trends:**
    *   By grouping `enrollments` by `batch_id`, we can compare entire cohorts.
    *   *Insight:* "The 2024 Batch is performing 10% lower in Math compared to the 2023 Batch."

4.  **No Derived Fields (CGPA):**
    *   We do **not** store CGPA on the student table.
    *   **Why:** If the university changes the grading formula (e.g., credit weighting), we don't need to update millions of rows. We simply update the calculation view/service logic that sums up `enrollments`.
