# Academic Analytics & Queries

This document outlines how to extract meaningful insights from the normalized schema without relying on pre-computed columns.

## 1. Mock Data Injection (Examples)

```sql
-- Create a Subject
INSERT INTO subjects (code, name, credits) VALUES ('CS101', 'Data Structures', 4);

-- Create an Assessment
INSERT INTO assessments (subject_id, batch_id, created_by, title, type, max_marks, scheduled_date)
VALUES ('<subject_uuid>', '<batch_uuid>', '<faculty_uuid>', 'Midterm 1', 'EXAM', 50.00, '2024-03-15');

-- Record Marks
INSERT INTO marks (assessment_id, student_id, score_obtained) 
VALUES ('<assessment_uuid>', '<student_uuid>', 42.5);
```

## 2. Analytics Queries

### A. Student Performance Over Time
**Goal:** Visualize a student's progress in a specific subject throughout the semester.

```sql
SELECT 
    a.title AS assessment_name,
    a.scheduled_date,
    m.score_obtained,
    a.max_marks,
    ROUND((m.score_obtained / a.max_marks) * 100, 2) AS percentage
FROM marks m
JOIN assessments a ON m.assessment_id = a.id
WHERE 
    m.student_id = '<student_uuid>' 
    AND a.subject_id = '<subject_uuid>'
ORDER BY a.scheduled_date ASC;
```

### B. Batch Attendance Summary
**Goal:** Identify students with low attendance (<75%) in a specific batch and subject.

```sql
SELECT 
    u.name AS student_name,
    s.roll_number,
    COUNT(CASE WHEN ar.status = 'PRESENT' THEN 1 END) AS classes_attended,
    COUNT(*) AS total_classes,
    ROUND((COUNT(CASE WHEN ar.status = 'PRESENT' THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2) AS attendance_pct
FROM attendance_records ar
JOIN students s ON ar.student_id = s.user_id
JOIN users u ON s.user_id = u.id
WHERE 
    ar.subject_id = '<subject_uuid>'
    AND s.batch_id = '<batch_uuid>'
GROUP BY u.name, s.roll_number
HAVING (COUNT(CASE WHEN ar.status = 'PRESENT' THEN 1 END)::DECIMAL / COUNT(*)) < 0.75
ORDER BY attendance_pct ASC;
```

### C. Faculty Efficiency (Grading Speed)
**Goal:** Calculate average time taken by faculty to grade assignments after the scheduled date.

```sql
SELECT 
    u.name AS faculty_name,
    AVG(EXTRACT(EPOCH FROM (m.graded_at - a.scheduled_date))/3600) AS avg_hours_to_grade
FROM assessments a
JOIN marks m ON a.id = m.assessment_id
JOIN users u ON a.created_by = u.id
GROUP BY u.name;
```
