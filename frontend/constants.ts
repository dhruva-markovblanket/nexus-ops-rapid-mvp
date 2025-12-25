
import { User, UserRole, Ticket, TicketStatus, TicketPriority, ClassSession, Announcement, Batch, ExamResult, Assignment, AttendanceRecord, Building, MapPoint, RoadSegment } from './types';

export const LOGO_URL = "https://via.placeholder.com/150/ffffff/4f46e5?text=Sapthagiri+NPS"; // Replace with your actual logo URL

export const MOCK_USERS: User[] = [
  {
    id: 'admin1',
    name: 'Admin Alice',
    email: 'admin@sapthagiri.edu',
    role: UserRole.ADMIN,
    avatar: 'https://picsum.photos/seed/admin1/100/100'
  },
  {
    id: 'staff1',
    name: 'Prof. Robert Langdon',
    email: 'robert@sapthagiri.edu',
    role: UserRole.STAFF,
    avatar: 'https://picsum.photos/seed/staff1/100/100'
  },
  {
    id: 'staff2',
    name: 'Dr. Katherine Johnson',
    email: 'katherine@sapthagiri.edu',
    role: UserRole.STAFF,
    avatar: 'https://picsum.photos/seed/staff2/100/100'
  },
  {
    id: 'student1',
    name: 'Sam Porter',
    email: 'sam@sapthagiri.edu',
    role: UserRole.STUDENT,
    avatar: 'https://picsum.photos/seed/student1/100/100'
  },
  {
    id: 'guest',
    name: 'Campus Guest',
    email: 'guest@sapthagiri.edu',
    role: UserRole.GUEST,
    avatar: 'https://ui-avatars.com/api/?name=Guest&background=random'
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 't-101',
    title: 'HVAC Malfunction - Central Library',
    description: 'The air conditioning in the main reading room (2nd Floor) is emitting a loud rattling noise and failing to cool the area. Students are unable to study.',
    location: 'Central Library, 2nd Floor',
    status: TicketStatus.PENDING,
    priority: TicketPriority.HIGH,
    category: 'Infrastructure',
    createdBy: 'student1',
    createdByName: 'Sam Porter',
    createdAt: Date.now() - 86400000,
    aiAnalysis: 'Infrastructure - High priority HVAC failure indicating potential motor bearing issue.',
    imageUrl: 'https://picsum.photos/seed/ac/400/300',
    history: [
      {
        id: 'h-1',
        timestamp: Date.now() - 86400000,
        action: 'CREATED',
        actorName: 'Sam Porter',
        details: 'Ticket submitted via Student Portal'
      }
    ]
  },
  {
    id: 't-102',
    title: 'Attendance Discrepancy - Physics Lab',
    description: 'My attendance for the Applied Physics lab on Feb 14th is not reflecting in the portal despite my physical presence and signature in the logbook.',
    location: 'Physics Department',
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.MEDIUM,
    category: 'Academic',
    createdBy: 'student1',
    createdByName: 'Sam Porter',
    assignedTo: 'staff1',
    assignedToName: 'Prof. Robert Langdon',
    createdAt: Date.now() - 172800000,
    aiAnalysis: 'Academic Record - Cross-verification with physical attendance register required.',
    imageUrl: undefined,
    history: [
      {
        id: 'h-2',
        timestamp: Date.now() - 172800000,
        action: 'CREATED',
        actorName: 'Sam Porter',
        details: 'Ticket submitted'
      },
      {
        id: 'h-3',
        timestamp: Date.now() - 86400000,
        action: 'ASSIGNMENT',
        actorName: 'Admin Alice',
        details: 'Assigned to Prof. Robert Langdon'
      },
      {
        id: 'h-4',
        timestamp: Date.now() - 80000000,
        action: 'STATUS_CHANGE',
        actorName: 'Prof. Robert Langdon',
        details: 'Status changed to In Review'
      }
    ]
  }
];

export const INITIAL_CLASSES: ClassSession[] = [
  { id: 'c-1', subject: 'Advanced Calculus', teacherName: 'Dr. Katherine Johnson', location: 'Room 101, Block A', dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:30', isExtraClass: false },
  { id: 'c-2', subject: 'Applied Physics', teacherName: 'Prof. Robert Langdon', location: 'Physics Lab, Block B', dayOfWeek: 'Monday', startTime: '11:00', endTime: '12:30', isExtraClass: false },
  { id: 'c-3', subject: 'Data Structures', teacherName: 'Prof. Alan Turing', location: 'CS Lab 1, Block A', dayOfWeek: 'Tuesday', startTime: '10:00', endTime: '11:30', isExtraClass: false },
  { id: 'c-4', subject: 'World History', teacherName: 'Ms. Davis', location: 'Room 204, Block C', dayOfWeek: 'Wednesday', startTime: '14:00', endTime: '15:30', isExtraClass: false },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a-1',
    title: 'Mid-Semester Assessment Schedule',
    content: 'The detailed schedule for the upcoming Mid-Semester Assessments (MSA) has been published. Please review your batch-specific timings attached.',
    date: Date.now() - 10000000,
    authorName: 'Admin Alice',
    authorRole: UserRole.ADMIN,
    priority: 'URGENT',
    scope: 'UNIVERSITY',
    category: 'EXAMS'
  },
  {
    id: 'a-2',
    title: 'Annual Science Symposium Registration',
    content: 'Registration for the Annual Science Symposium is now open. Interested students should submit project abstracts to the Faculty Coordinator by Friday.',
    date: Date.now() - 50000000,
    authorName: 'Dr. Katherine Johnson',
    authorRole: UserRole.STAFF,
    priority: 'NORMAL',
    scope: 'DEPARTMENT',
    category: 'EVENTS'
  },
  {
    id: 'a-3',
    title: 'CS-2024-A Lecture Rescheduled',
    content: 'The Data Structures lecture scheduled for tomorrow at 10:00 AM is rescheduled to Thursday 2:00 PM due to faculty availability.',
    date: Date.now() - 5000000,
    authorName: 'Prof. Alan Turing',
    authorRole: UserRole.STAFF,
    priority: 'NORMAL',
    scope: 'BATCH',
    category: 'ACADEMIC'
  },
  {
    id: 'a-4',
    title: 'Library Maintenance - Reading Room Closed',
    content: 'The main reading room will be closed for HVAC maintenance this Saturday from 9 AM to 2 PM. Digital access remains available.',
    date: Date.now() - 200000000,
    authorName: 'Admin Alice',
    authorRole: UserRole.ADMIN,
    priority: 'NORMAL',
    scope: 'UNIVERSITY',
    category: 'GENERAL'
  }
];

export const INITIAL_BATCHES: Batch[] = [
  { id: 'b-1', name: 'CS-2024-A', course: 'Computer Science', year: 2024, totalStudents: 45 },
  { id: 'b-2', name: 'CS-2024-B', course: 'Computer Science', year: 2024, totalStudents: 42 },
  { id: 'b-3', name: 'ME-2023-A', course: 'Mechanical Eng', year: 2023, totalStudents: 38 },
];

export const INITIAL_EXAM_RESULTS: ExamResult[] = [
  // CS-2024-A Results
  { id: 'r-1', batchId: 'b-1', studentId: 'student1', subject: 'Applied Physics', teacherId: 'staff1', teacherName: 'Prof. Robert Langdon', marksObtained: 85, totalMarks: 100, examType: 'MID_TERM', date: Date.now() - 2000000 },
  { id: 'r-1-old', batchId: 'b-1', studentId: 'student1', subject: 'Applied Physics', teacherId: 'staff1', teacherName: 'Prof. Robert Langdon', marksObtained: 70, totalMarks: 100, examType: 'QUIZ', date: Date.now() - 10000000 },
  { id: 'r-2', batchId: 'b-1', studentId: 's-2', subject: 'Applied Physics', teacherId: 'staff1', teacherName: 'Prof. Robert Langdon', marksObtained: 72, totalMarks: 100, examType: 'MID_TERM', date: Date.now() - 2000000 },
  { id: 'r-3', batchId: 'b-1', studentId: 's-3', subject: 'Applied Physics', teacherId: 'staff1', teacherName: 'Prof. Robert Langdon', marksObtained: 90, totalMarks: 100, examType: 'MID_TERM', date: Date.now() - 2000000 },
  
  // CS-2024-B Results
  { id: 'r-5', batchId: 'b-2', studentId: 's-5', subject: 'Advanced Calculus', teacherId: 'staff2', teacherName: 'Dr. Katherine Johnson', marksObtained: 78, totalMarks: 100, examType: 'MID_TERM', date: Date.now() - 2000000 },
  
  // Student 1 History
  { id: 'r-10', batchId: 'b-1', studentId: 'student1', subject: 'Advanced Calculus', teacherId: 'staff2', teacherName: 'Dr. Katherine Johnson', marksObtained: 65, totalMarks: 100, examType: 'QUIZ', date: Date.now() - 15000000 },
  { id: 'r-11', batchId: 'b-1', studentId: 'student1', subject: 'Advanced Calculus', teacherId: 'staff2', teacherName: 'Dr. Katherine Johnson', marksObtained: 82, totalMarks: 100, examType: 'MID_TERM', date: Date.now() - 2000000 },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
    { id: 'as-1', courseId: 'c-1', title: 'Calculus Problem Set 3: Limits', dueDate: Date.now() + 172800000, status: 'PENDING', totalPoints: 20 },
    { id: 'as-2', courseId: 'c-2', title: 'Lab Report: Optical Physics', dueDate: Date.now() + 86400000, status: 'SUBMITTED', totalPoints: 50 },
    { id: 'as-3', courseId: 'c-3', title: 'BST Implementation Project', dueDate: Date.now() - 86400000, status: 'GRADED', totalPoints: 100 },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
    { id: 'at-1', studentId: 'student1', subject: 'Advanced Calculus', present: 28, total: 30 },
    { id: 'at-2', studentId: 'student1', subject: 'Applied Physics', present: 22, total: 30 }, // Warning level
    { id: 'at-3', studentId: 'student1', subject: 'Data Structures', present: 30, total: 30 },
    { id: 'at-4', studentId: 'student1', subject: 'World History', present: 20, total: 30 }, // Critical level
];

// --- Mock Map Data (2D Coordinates on a 1000x800 grid) ---

export const CAMPUS_BUILDINGS: Building[] = [
  { 
    id: 'b-admin', name: 'Administrative Building', floors: 3, description: 'Registrar, Admissions, HRD', 
    facilities: ['Admissions Office', 'Registrar', 'HRD'],
    mapX: 420, mapY: 50, width: 160, height: 100
  },
  { 
    id: 'b-academic-a', name: 'Academic Block A', floors: 4, description: 'Computer Science, IT', 
    facilities: ['CS Labs', 'Electronics Labs', 'Lecture Halls 101-105'],
    mapX: 100, mapY: 200, width: 140, height: 250
  },
  { 
    id: 'b-academic-b', name: 'Academic Block B', floors: 4, description: 'Engineering Sciences', 
    facilities: ['Workshops', 'Physics Lab', 'Lecture Halls 201-205'],
    mapX: 760, mapY: 200, width: 140, height: 250
  },
  { 
    id: 'b-library', name: 'Central Library', floors: 2, description: 'Main Library & Archives', 
    facilities: ['Digital Library', 'Reading Room', 'Book Bank'],
    mapX: 430, mapY: 300, width: 140, height: 140
  },
  { 
    id: 'b-audit', name: 'University Auditorium', floors: 1, description: 'Events & Convocation Hall', 
    facilities: ['Main Stage', 'Green Room'],
    mapX: 420, mapY: 550, width: 160, height: 120
  },
  {
    id: 'b-cafe', name: 'Student Cafeteria', floors: 1, description: 'Food Court',
    facilities: ['Food Court', 'Coffee Shop'],
    mapX: 780, mapY: 550, width: 100, height: 80
  }
];

// Road Network for 2D Map Visualization
export const CAMPUS_ROADS: RoadSegment[] = [
    { id: 'r1', x1: 500, y1: 150, x2: 500, y2: 300 }, // Admin to Library
    { id: 'r2', x1: 500, y1: 440, x2: 500, y2: 550 }, // Library to Auditorium
    { id: 'r3', x1: 240, y1: 325, x2: 430, y2: 370 }, // Block A to Library (approx)
    { id: 'r4', x1: 570, y1: 370, x2: 760, y2: 325 }, // Library to Block B
    { id: 'r5', x1: 240, y1: 450, x2: 420, y2: 610 }, // Block A to Auditorium
    { id: 'r6', x1: 580, y1: 610, x2: 760, y2: 450 }, // Auditorium to Block B
    { id: 'r7', x1: 760, y1: 450, x2: 780, y2: 550 }, // Block B to Cafe
];

// Graph Nodes for Navigation
export const MAP_POINTS: MapPoint[] = [
  // Building Nodes
  { id: 'node-admin', name: 'Admin Entrance', buildingId: 'b-admin', floor: 0, type: 'ENTRANCE', x: 500, y: 150, connections: ['node-lib-n'] },
  { id: 'node-block-a', name: 'Block A Entrance', buildingId: 'b-academic-a', floor: 0, type: 'ENTRANCE', x: 240, y: 325, connections: ['node-lib-w', 'node-audit-w'] },
  { id: 'node-block-b', name: 'Block B Entrance', buildingId: 'b-academic-b', floor: 0, type: 'ENTRANCE', x: 760, y: 325, connections: ['node-lib-e', 'node-audit-e'] },
  { id: 'node-lib', name: 'Library Main', buildingId: 'b-library', floor: 0, type: 'ENTRANCE', x: 500, y: 370, connections: ['node-lib-n', 'node-lib-s', 'node-lib-w', 'node-lib-e'] },
  { id: 'node-audit', name: 'Auditorium', buildingId: 'b-audit', floor: 0, type: 'ENTRANCE', x: 500, y: 550, connections: ['node-audit-n', 'node-audit-w', 'node-audit-e'] },
  { id: 'node-cafe', name: 'Cafeteria', buildingId: 'b-cafe', floor: 0, type: 'ENTRANCE', x: 780, y: 550, connections: ['node-block-b'] },

  // Intersection Nodes
  { id: 'node-lib-n', name: 'Pathway', buildingId: '', floor: 0, type: 'CORRIDOR', x: 500, y: 300, connections: ['node-admin', 'node-lib'] },
  { id: 'node-lib-s', name: 'Pathway', buildingId: '', floor: 0, type: 'CORRIDOR', x: 500, y: 440, connections: ['node-lib', 'node-audit-n'] },
  { id: 'node-lib-w', name: 'Pathway', buildingId: '', floor: 0, type: 'CORRIDOR', x: 430, y: 370, connections: ['node-lib', 'node-block-a'] },
  { id: 'node-lib-e', name: 'Pathway', buildingId: '', floor: 0, type: 'CORRIDOR', x: 570, y: 370, connections: ['node-lib', 'node-block-b'] },
  
  { id: 'node-audit-n', name: 'Pathway', buildingId: '', floor: 0, type: 'CORRIDOR', x: 500, y: 500, connections: ['node-lib-s', 'node-audit'] },
  { id: 'node-audit-w', name: 'Pathway', buildingId: '', floor: 0, type: 'CORRIDOR', x: 420, y: 610, connections: ['node-audit', 'node-block-a'] },
  { id: 'node-audit-e', name: 'Pathway', buildingId: '', floor: 0, type: 'CORRIDOR', x: 580, y: 610, connections: ['node-audit', 'node-block-b'] },
];
