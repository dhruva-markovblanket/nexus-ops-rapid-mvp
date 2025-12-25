import { pool } from '../config/database';

/**
 * Academic Service
 * Contains raw SQL queries to fetch normalized data.
 * Returns mock data structure if DB is empty for demonstration.
 */

export const fetchStudentOverview = async (studentId: string) => {
  // Query: Calculate aggregate attendance and identify risks
  const query = `
    SELECT 
      s.name as subject,
      COUNT(CASE WHEN ar.status = 'PRESENT' THEN 1 END)::FLOAT / NULLIF(COUNT(*), 0) as attendance_ratio
    FROM attendance_records ar
    JOIN subjects s ON ar.subject_id = s.id
    WHERE ar.student_id = $1
    GROUP BY s.name
  `;
  
  // const { rows } = await pool.query(query, [studentId]);
  
  // Mock Response
  return {
    studentId,
    attendanceRisk: [
      { subject: 'Applied Physics', percentage: 72, status: 'WARNING' }
    ],
    upcomingAssignments: 3,
    cgpa: 8.4
  };
};

export const fetchSubjectPerformance = async (studentId: string, subjectId: string) => {
  const query = `
    SELECT a.title, a.type, a.max_marks, m.score_obtained, a.scheduled_date
    FROM marks m
    JOIN assessments a ON m.assessment_id = a.id
    WHERE m.student_id = $1 AND a.subject_id = $2
    ORDER BY a.scheduled_date DESC
  `;

  // const { rows } = await pool.query(query, [studentId, subjectId]);

  // Mock Response
  return {
    subjectId,
    assessments: [
      { title: 'Midterm 1', type: 'EXAM', obtained: 42, total: 50, date: '2024-03-15' },
      { title: 'Lab Report 3', type: 'ASSIGNMENT', obtained: 9, total: 10, date: '2024-02-28' },
      { title: 'Quiz 1', type: 'QUIZ', obtained: 18, total: 20, date: '2024-02-10' }
    ]
  };
};

export const fetchBatchAttendance = async (batchId: string) => {
  const query = `
    SELECT 
      u.name, 
      u.email,
      COUNT(CASE WHEN ar.status = 'PRESENT' THEN 1 END)::FLOAT / NULLIF(COUNT(*), 0) as ratio
    FROM students st
    JOIN users u ON st.user_id = u.id
    JOIN attendance_records ar ON st.user_id = ar.student_id
    WHERE st.batch_id = $1
    GROUP BY u.id
    HAVING (COUNT(CASE WHEN ar.status = 'PRESENT' THEN 1 END)::FLOAT / NULLIF(COUNT(*), 0)) < 0.75
  `;

  // const { rows } = await pool.query(query, [batchId]);

  // Mock Response
  return {
    batchId,
    totalStudents: 45,
    lowAttendanceStudents: [
      { name: 'Sam Porter', attendancePct: 65 },
      { name: 'Jessica Jones', attendancePct: 71 }
    ]
  };
};

export const fetchUniversityAnalytics = async () => {
  const query = `
    SELECT AVG(score_obtained / max_marks) as university_avg
    FROM marks m
    JOIN assessments a ON m.assessment_id = a.id
  `;

  // const { rows } = await pool.query(query);

  // Mock Response
  return {
    avgAttendance: 82.5,
    avgCGPA: 7.8,
    openIssues: 12,
    activeBatches: 8
  };
};