
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  STUDENT = 'STUDENT',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export enum TicketStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface TicketHistoryEntry {
  id: string;
  timestamp: number;
  action: 'STATUS_CHANGE' | 'ASSIGNMENT' | 'COMMENT' | 'CREATED' | 'REJECTION';
  actorName: string;
  details: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  location: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  createdBy: string; // User ID
  createdByName: string;
  assignedTo?: string; // Staff ID
  assignedToName?: string;
  createdAt: number;
  aiAnalysis?: string; // Summary or suggestion from automated analysis
  imageUrl?: string;
  history: TicketHistoryEntry[];
}

export interface AppNotification {
  id: string;
  recipientId: string;
  message: string;
  read: boolean;
  timestamp: number;
  type: 'info' | 'success' | 'warning';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// --- Academic Types ---

export interface ClassSession {
  id: string;
  subject: string;
  teacherName: string;
  location: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  isExtraClass: boolean;
}

export type AnnouncementScope = 'UNIVERSITY' | 'DEPARTMENT' | 'BATCH' | 'SUBJECT';
export type AnnouncementCategory = 'GENERAL' | 'ACADEMIC' | 'EVENTS' | 'EXAMS';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: number;
  authorName: string;
  authorRole: UserRole;
  priority: 'NORMAL' | 'URGENT';
  scope: AnnouncementScope;
  category: AnnouncementCategory;
}

export interface Assignment {
  id: string;
  courseId: string; // link to batch/class
  title: string;
  dueDate: number;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED';
  totalPoints: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subject: string;
  present: number;
  total: number;
}

// --- New Performance Types ---

export interface Batch {
  id: string;
  name: string; // e.g., "CS-2024-A"
  course: string;
  year: number;
  totalStudents: number;
}

export interface ExamResult {
  id: string;
  batchId: string;
  studentId: string; // In a real app, link to student
  subject: string;
  teacherId: string; // To link performance to a teacher
  teacherName: string;
  marksObtained: number;
  totalMarks: number;
  examType: 'MID_TERM' | 'FINAL' | 'QUIZ';
  date: number; // For history tracking
}

// --- Map & Navigation Types ---

export interface MapPoint {
  id: string;
  name: string;
  buildingId: string;
  floor: number;
  type: 'ROOM' | 'CORRIDOR' | 'STAIRS' | 'ENTRANCE' | 'FACILITY';
  x: number; // For 2D SVG map (0-1000 scale)
  y: number; // For 2D SVG map (0-1000 scale)
  connections: string[]; // IDs of connected MapPoints
}

export interface Building {
  id: string;
  name: string;
  floors: number;
  description: string;
  facilities: string[];
  // Coordinates for 2D Map (SVG 1000x800 viewBox)
  mapX: number;
  mapY: number;
  width: number;
  height: number;
}

export interface NavigationStep {
  description: string;
  pointId: string;
}

export interface RoadSegment {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
