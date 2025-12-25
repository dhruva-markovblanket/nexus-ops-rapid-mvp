# Academic Module API Design

## Overview
These APIs support the academic dashboard features including student performance tracking, attendance monitoring, and admin analytics.

**Base URL:** `/api/v1`

## 1. Student Academic Overview
**GET** `/academics/student/overview`

**Headers:**
- `x-mock-user-id`: string (Required)

**Response:**
```json
{
  "studentId": "student1",
  "attendanceRisk": [
    {
      "subject": "Applied Physics",
      "percentage": 72,
      "status": "WARNING"
    }
  ],
  "upcomingAssignments": 3,
  "cgpa": 8.4
}
```

## 2. Subject Performance History
**GET** `/academics/student/subject/:subjectId`

**Headers:**
- `x-mock-user-id`: string (Required)

**Response:**
```json
{
  "subjectId": "sub-101",
  "assessments": [
    {
      "title": "Midterm 1",
      "type": "EXAM",
      "obtained": 42,
      "total": 50,
      "date": "2024-03-15"
    }
  ]
}
```

## 3. Batch Attendance Summary
**GET** `/academics/batch/:batchId/attendance`

**Role:** Faculty / Admin

**Response:**
```json
{
  "batchId": "b-1",
  "totalStudents": 45,
  "lowAttendanceStudents": [
    {
      "name": "Sam Porter",
      "attendancePct": 65
    }
  ]
}
```

## 4. Admin Analytics Overview
**GET** `/academics/admin/analytics`

**Role:** Admin

**Response:**
```json
{
  "avgAttendance": 82.5,
  "avgCGPA": 7.8,
  "openIssues": 12,
  "activeBatches": 8
}
```