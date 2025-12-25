
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NewTicketModal from './components/NewTicketModal';
import NotificationCenter from './components/NotificationCenter';
import Toast, { ToastMessage } from './components/Toast';
import ExtraClassModal from './components/ExtraClassModal';
import MarksUploadModal from './components/MarksUploadModal';
import { AuthState, Ticket, TicketStatus, UserRole, TicketHistoryEntry, AppNotification, ClassSession, Announcement, Batch, ExamResult, Assignment, AttendanceRecord, AnnouncementScope, AnnouncementCategory } from './types';
import { MOCK_USERS, INITIAL_TICKETS, INITIAL_CLASSES, INITIAL_ANNOUNCEMENTS, INITIAL_BATCHES, INITIAL_EXAM_RESULTS, MOCK_ASSIGNMENTS, MOCK_ATTENDANCE, LOGO_URL } from './constants';
import { LogOut } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [classes, setClasses] = useState<ClassSession[]>(INITIAL_CLASSES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [batches, setBatches] = useState<Batch[]>(INITIAL_BATCHES);
  const [examResults, setExamResults] = useState<ExamResult[]>(INITIAL_EXAM_RESULTS);
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExtraClassModalOpen, setIsExtraClassModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply Theme class to HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);


  // Load notifications from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('campus_fix_notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse notifications", e);
      }
    }
  }, []);

  // Save notifications to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('campus_fix_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Toast Helpers
  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Notification Helpers
  const createNotification = (recipientId: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newNotif: AppNotification = {
      id: `n-${Date.now()}-${Math.random()}`,
      recipientId,
      message,
      read: false,
      timestamp: Date.now(),
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearNotifications = () => {
    if (auth.user) {
      setNotifications(prev => prev.filter(n => n.recipientId !== auth.user!.id));
    }
  };

  // Auth Handlers
  const handleLogin = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      setAuth({ user, isAuthenticated: true });
      addToast(`Welcome back, ${user.name}!`, 'info');
    }
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    setToasts([]);
  };

  // Ticket Handlers
  const handleCreateTicket = (ticketData: Partial<Ticket>) => {
    const creationTime = Date.now();
    const newTicket: Ticket = {
      id: `t-${Date.now()}`,
      title: ticketData.title || 'Untitled',
      description: ticketData.description || '',
      location: ticketData.location || '',
      status: TicketStatus.PENDING,
      priority: ticketData.priority || 'LOW', 
      category: ticketData.category || 'General',
      createdBy: auth.user!.id,
      createdByName: auth.user!.name,
      createdAt: creationTime,
      aiAnalysis: ticketData.aiAnalysis,
      imageUrl: ticketData.imageUrl,
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: creationTime,
          action: 'CREATED',
          actorName: auth.user!.name,
          details: 'Ticket created'
        }
      ]
    } as Ticket;

    setTickets(prev => [newTicket, ...prev]);
    addToast('Ticket created successfully', 'success');

    // Notify Admins
    const admins = MOCK_USERS.filter(u => u.role === UserRole.ADMIN);
    admins.forEach(admin => {
        createNotification(admin.id, `New Ticket: "${newTicket.title}" by ${auth.user?.name}`, 'info');
    });
  };

  const handleAssignTicket = (ticketId: string, staffId: string, staffName: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const historyEntry: TicketHistoryEntry = {
          id: `h-${Date.now()}`,
          timestamp: Date.now(),
          action: 'ASSIGNMENT',
          actorName: auth.user?.name || 'Unknown',
          details: `Assigned to ${staffName}`
        };

        if (staffId !== auth.user?.id) {
           createNotification(staffId, `You have been assigned to ticket "${t.title}"`, 'info');
        }

        return {
          ...t,
          assignedTo: staffId,
          assignedToName: staffName,
          history: [...t.history, historyEntry]
        };
      }
      return t;
    }));
    addToast(`Ticket assigned to ${staffName}`, 'success');
  };

  const handleUpdateStatus = (id: string, status: TicketStatus) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        const isSelfAssign = status === TicketStatus.IN_PROGRESS && !t.assignedTo && auth.user?.role === UserRole.STAFF;
        
        const historyEntry: TicketHistoryEntry = {
          id: `h-${Date.now()}`,
          timestamp: Date.now(),
          action: status === TicketStatus.REJECTED ? 'REJECTION' : 'STATUS_CHANGE',
          actorName: auth.user?.name || 'Unknown',
          details: `Status changed from ${t.status.replace('_', ' ')} to ${status.replace('_', ' ')}`
        };

        if (t.createdBy !== auth.user?.id) {
             createNotification(
                t.createdBy, 
                `Your ticket "${t.title}" is now ${status.replace('_', ' ')}`, 
                status === TicketStatus.RESOLVED ? 'success' : 'info'
             );
        }

        let assignedTo = t.assignedTo;
        let assignedToName = t.assignedToName;

        if (isSelfAssign && auth.user) {
            assignedTo = auth.user.id;
            assignedToName = auth.user.name;
        }

        return { 
          ...t, 
          status,
          assignedTo,
          assignedToName,
          history: [...t.history, historyEntry]
        };
      }
      return t;
    }));
    addToast(`Status updated to ${status.replace('_', ' ')}`, 'success');
  };

  // Academic Handlers
  const handleAddExtraClass = (data: Partial<ClassSession>) => {
    const newClass = { ...data, id: `c-${Date.now()}` } as ClassSession;
    setClasses(prev => [...prev, newClass]);
    addToast('Extra class scheduled successfully', 'success');
    
    // Notify all students (In a real app, this would be filtered by subject/course)
    const students = MOCK_USERS.filter(u => u.role === UserRole.STUDENT);
    students.forEach(student => {
        createNotification(student.id, `Extra Class Added: ${newClass.subject} on ${newClass.dayOfWeek}`, 'info');
    });
  };

  const handleAddAnnouncement = (title: string, content: string, priority: 'NORMAL' | 'URGENT', scope: AnnouncementScope, category: AnnouncementCategory) => {
    const newAnnouncement: Announcement = {
        id: `a-${Date.now()}`,
        title,
        content,
        date: Date.now(),
        authorName: auth.user!.name,
        authorRole: auth.user!.role,
        priority,
        scope,
        category
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    addToast('Announcement posted', 'success');

    // Notify everyone
    MOCK_USERS.filter(u => u.id !== auth.user?.id).forEach(u => {
        createNotification(u.id, `New Announcement: ${title}`, priority === 'URGENT' ? 'warning' : 'info');
    });
  };

  // Analytics Handlers
  const handleMarksUpload = (batchId: string, subject: string, data: any) => {
    const batch = batches.find(b => b.id === batchId);
    if(!batch) return;

    const newResults: ExamResult[] = [];
    const simulatedStudents = 10; 
    
    for(let i=0; i<simulatedStudents; i++) {
        newResults.push({
            id: `r-${Date.now()}-${i}`,
            batchId: batchId,
            studentId: `s-${i}`, // Mock student ID
            subject: subject,
            teacherId: 'staff1',
            teacherName: 'Prof. Robert Langdon',
            marksObtained: Math.floor(Math.random() * (100 - 40 + 1)) + 40,
            totalMarks: 100,
            examType: data.examType,
            date: Date.now()
        });
    }

    setExamResults(prev => [...prev, ...newResults]);
    addToast(`Uploaded ${simulatedStudents} marks for ${batch.name}`, 'success');

    // Notify Staff linked to this batch (mock)
    const staff = MOCK_USERS.find(u => u.id === 'staff1');
    if(staff) {
        createNotification(staff.id, `New Marks Uploaded for your batch ${batch.name} (${subject})`, 'info');
    }
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    if (!auth.isAuthenticated) {
      return <Navigate to="/" />;
    }
    return children;
  };

  // Filter notifications for current user
  const userNotifications = auth.user 
    ? notifications.filter(n => n.recipientId === auth.user!.id) 
    : [];
  
  const staffUsers = MOCK_USERS.filter(u => u.role === UserRole.STAFF);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
        {auth.isAuthenticated && (
          <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center gap-6">
                  {/* Branding */}
                  <div className="flex items-center">
                    <img src={LOGO_URL} alt="Logo" className="w-10 h-10 object-contain mr-3" />
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white leading-tight">Sapthagiri NPS</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">UNIVERSITY</span>
                    </div>
                  </div>

                  {/* Context Bar (Desktop) */}
                  <div className="hidden md:flex items-center pl-6 border-l border-gray-200 dark:border-gray-700 h-8 my-auto space-x-4">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Academic Year: <span className="text-gray-900 dark:text-gray-200">2024-25</span>
                      </div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Semester: <span className="text-gray-900 dark:text-gray-200">Odd (Sep-Dec)</span>
                      </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                   <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
                      <img src={auth.user?.avatar} alt="Profile" className="w-6 h-6 rounded-full" />
                      <div className="flex flex-col text-right hidden sm:flex">
                         <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{auth.user?.name}</span>
                         <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                             {auth.user?.role === UserRole.STAFF ? 'FACULTY' : auth.user?.role}
                         </span>
                      </div>
                   </div>
                   
                   <NotificationCenter 
                      notifications={userNotifications}
                      onMarkAsRead={handleMarkAsRead}
                      onClearAll={handleClearNotifications}
                   />

                   <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Logout"
                   >
                     <LogOut className="w-5 h-5" />
                   </button>
                </div>
              </div>
            </div>
          </header>
        )}

        <main>
          <Routes>
            <Route path="/" element={
              !auth.isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard 
                  user={auth.user!} 
                  tickets={tickets} 
                  classes={classes}
                  announcements={announcements}
                  batches={batches}
                  examResults={examResults}
                  assignments={assignments}
                  attendance={attendance}
                  staffUsers={staffUsers}
                  onUpdateStatus={handleUpdateStatus}
                  onAssign={handleAssignTicket}
                  onCreateTicket={() => setIsModalOpen(true)}
                  onAddExtraClass={() => setIsExtraClassModalOpen(true)}
                  onAddAnnouncement={handleAddAnnouncement}
                  onOpenUploadModal={() => setIsUploadModalOpen(true)}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                />
              </ProtectedRoute>
            } />
          </Routes>
        </main>

        <Toast toasts={toasts} onRemove={removeToast} />

        {auth.isAuthenticated && (
            <>
                <NewTicketModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateTicket}
                    userId={auth.user!.id}
                    userName={auth.user!.name}
                />
                <ExtraClassModal
                    isOpen={isExtraClassModalOpen}
                    onClose={() => setIsExtraClassModalOpen(false)}
                    onSubmit={handleAddExtraClass}
                    teacherName={auth.user!.name}
                />
                <MarksUploadModal
                    isOpen={isUploadModalOpen}
                    onClose={() => setIsUploadModalOpen(false)}
                    onUpload={handleMarksUpload}
                    batches={batches}
                />
            </>
        )}
      </div>
    </Router>
  );
};

export default App;