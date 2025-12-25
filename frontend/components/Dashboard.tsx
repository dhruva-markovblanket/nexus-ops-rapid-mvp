import React, { useState, useMemo, useEffect } from 'react';
import { User, Ticket, TicketStatus, UserRole, ClassSession, Announcement, Batch, ExamResult, Assignment, AttendanceRecord, AnnouncementScope, AnnouncementCategory } from '../types';
import TicketCard from './TicketCard';
import AcademicSchedule from './AcademicSchedule';
import AdminAcademicOverview from './AdminAcademicOverview';
import AnnouncementBoard from './AnnouncementBoard';
import PerformanceAnalytics from './PerformanceAnalytics';
import CampusMap from './CampusMap';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  LayoutDashboard, Wrench, Megaphone, 
  BarChart3, Upload, GraduationCap, Clock, BookOpen, 
  Bell, AlertCircle, Moon, Sun, Shield, Map,
  CheckCircle2, AlertTriangle, TrendingUp,
  FileText,
  Search
} from 'lucide-react';

interface DashboardProps {
  user: User;
  tickets: Ticket[];
  classes: ClassSession[];
  announcements: Announcement[];
  batches: Batch[];
  examResults: ExamResult[];
  assignments: Assignment[];
  attendance: AttendanceRecord[];
  staffUsers: User[];
  onUpdateStatus: (id: string, status: TicketStatus) => void;
  onAssign?: (ticketId: string, staffId: string, staffName: string) => void;
  onCreateTicket: () => void;
  onAddExtraClass: () => void;
  onAddAnnouncement: (title: string, content: string, priority: 'NORMAL' | 'URGENT', scope: AnnouncementScope, category: AnnouncementCategory) => void;
  onOpenUploadModal: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

type TabType = 'HOME' | 'ACADEMIC' | 'PERFORMANCE' | 'ANNOUNCEMENTS' | 'MAINTENANCE' | 'MAP';

const Dashboard: React.FC<DashboardProps> = ({ 
    user, tickets, classes, announcements, batches, examResults, assignments, attendance, staffUsers, 
    onUpdateStatus, onAssign, onCreateTicket, onAddExtraClass, onAddAnnouncement, onOpenUploadModal,
    isDarkMode, toggleTheme
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('HOME');
  const [filter, setFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  // Automatically set guest to MAP or HOME
  useEffect(() => {
      if (user.role === UserRole.GUEST && activeTab !== 'HOME' && activeTab !== 'MAP' && activeTab !== 'ANNOUNCEMENTS') {
          setActiveTab('HOME');
      }
  }, [user.role, activeTab]);

  // Determine available tabs based on role
  const availableTabs = useMemo(() => {
      const tabs = [
          { id: 'HOME', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'MAP', label: 'Campus Map', icon: Map },
      ];

      if (user.role === UserRole.GUEST) {
          tabs.push({ id: 'ANNOUNCEMENTS', label: 'Public News', icon: Bell });
          return tabs;
      }

      if (user.role === UserRole.ADMIN) {
          tabs.push({ id: 'MAINTENANCE', label: 'Issue Reporting', icon: Wrench });
          tabs.push({ id: 'PERFORMANCE', label: 'University Stats', icon: BarChart3 });
          tabs.push({ id: 'ACADEMIC', label: 'Academic Overview', icon: BookOpen });
      } else {
          // Staff and Students
          tabs.push({ id: 'ACADEMIC', label: 'Academics', icon: BookOpen });
          tabs.push({ id: 'PERFORMANCE', label: user.role === UserRole.STAFF ? 'Batch Results' : 'My Grades', icon: BarChart3 });
      }

      tabs.push({ id: 'ANNOUNCEMENTS', label: 'News', icon: Bell });
      
      return tabs;
  }, [user.role]);

  // --- Derived Data ---
  
  const nextClass = useMemo(() => {
    // Determine current day for mock purposes, defaulting to Monday
    return classes.find(c => c.dayOfWeek === 'Monday') || null;
  }, [classes]);

  const adminStats = useMemo(() => {
    const total = tickets.length;
    const pending = tickets.filter(t => t.status === TicketStatus.PENDING).length;
    const resolved = tickets.filter(t => t.status === TicketStatus.RESOLVED).length;
    const inProgress = tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length;

    const data = [
      { name: 'Pending', value: pending },
      { name: 'In Progress', value: inProgress },
      { name: 'Resolved', value: resolved },
    ];
    return { total, pending, resolved, inProgress, data };
  }, [tickets]);

  // Student Health Insights
  const studentRisk = useMemo(() => {
    if (user.role !== UserRole.STUDENT) return null;
    const riskSubjects = attendance.filter(a => (a.present / a.total) < 0.75);
    const upcomingAssignments = assignments.filter(a => a.status === 'PENDING').length;
    return { riskSubjects, upcomingAssignments };
  }, [attendance, assignments, user.role]);

  // Faculty Insights
  const facultyInsights = useMemo(() => {
    if (user.role !== UserRole.STAFF) return null;
    const myBatches = batches.length; 
    const pendingGrading = 2; // Mock
    const lowAttendanceCount = 12; // Mock student count
    return { myBatches, pendingGrading, lowAttendanceCount };
  }, [batches, user.role]);


  const filteredTickets = useMemo(() => {
    let result = tickets;

    if (user.role === UserRole.STUDENT) {
        result = result.filter(t => t.createdBy === user.id);
    } 
    
    if (filter !== 'ALL') {
        result = result.filter(t => t.status === filter);
    }
    if (search) {
        const lowerSearch = search.toLowerCase();
        result = result.filter(t => 
            t.title.toLowerCase().includes(lowerSearch) || 
            t.description.toLowerCase().includes(lowerSearch) ||
            t.location.toLowerCase().includes(lowerSearch)
        );
    }
    return result;
  }, [tickets, user, filter, search]);

  // --- UI Components ---

  const WelcomeHeader = () => (
    <div className="bg-gradient-to-r from-gray-900 to-indigo-900 rounded-2xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
            {user.role === UserRole.ADMIN ? <Shield className="w-64 h-64" /> : user.role === UserRole.GUEST ? <Map className="w-64 h-64" /> : <GraduationCap className="w-64 h-64" />}
        </div>
        
        {/* Theme Toggle */}
        <button 
            onClick={toggleTheme}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
        >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-white" />}
        </button>

        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">
                {user.role === UserRole.GUEST ? 'Welcome to CampusFix' : `Welcome back, ${user.name.split(' ')[0]}`}
            </h1>
            <p className="text-indigo-100 max-w-xl">
                {user.role === UserRole.STUDENT && "Here is your academic snapshot for the semester."}
                {user.role === UserRole.STAFF && "Review your batch performance and pending tasks below."}
                {user.role === UserRole.ADMIN && "System health and campus operations overview."}
                {user.role === UserRole.GUEST && "Explore our campus map and latest announcements in Guest Mode."}
            </p>
            
            <div className="flex gap-3 mt-6">
                 {/* Role specific quick actions */}
                 {user.role === UserRole.STUDENT && (
                     <button 
                        onClick={onCreateTicket}
                        className="bg-white text-indigo-900 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center shadow-sm"
                     >
                        <AlertCircle className="w-4 h-4 mr-2" /> Report Issue
                     </button>
                )}
                 {user.role === UserRole.ADMIN && (
                     <button 
                        onClick={onOpenUploadModal}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center shadow-sm border border-green-400"
                     >
                        <Upload className="w-4 h-4 mr-2" /> Upload Marks Data
                     </button>
                )}
                 {user.role === UserRole.GUEST && (
                     <button 
                        onClick={() => setActiveTab('MAP')}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center shadow-sm"
                     >
                        <Map className="w-4 h-4 mr-2" /> Explore Campus Map
                     </button>
                 )}
            </div>
        </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen transition-colors duration-300">
      
      {activeTab === 'HOME' && <WelcomeHeader />}

      {/* Navigation Tabs */}
      <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <nav className="flex space-x-2 min-w-max">
            {availableTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex items-center px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                            isActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none transform scale-105'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700'
                        }`}
                    >
                        <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-indigo-200' : 'text-gray-400 dark:text-gray-500'}`} />
                        {tab.label}
                    </button>
                )
            })}
        </nav>
      </div>

      {/* --- HOME TAB --- */}
      {activeTab === 'HOME' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Role-Specific Insight Card */}
                    {user.role === UserRole.STUDENT && studentRisk && (
                         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                             <h3 className="font-bold text-gray-800 dark:text-white flex items-center mb-4">
                                <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
                                Academic Health
                             </h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 <div className={`p-4 rounded-lg border ${studentRisk.riskSubjects.length > 0 ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900' : 'bg-green-50 border-green-100 dark:bg-green-900/10'}`}>
                                     <div className="flex items-start justify-between">
                                         <div>
                                             <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Attendance Risk</p>
                                             <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{studentRisk.riskSubjects.length} <span className="text-sm font-normal text-gray-500">Subjects</span></p>
                                         </div>
                                         <AlertTriangle className={`w-5 h-5 ${studentRisk.riskSubjects.length > 0 ? 'text-red-500' : 'text-green-500'}`} />
                                     </div>
                                     {studentRisk.riskSubjects.length > 0 && (
                                         <p className="text-xs text-red-600 dark:text-red-400 mt-2">Below 75% in {studentRisk.riskSubjects[0].subject}</p>
                                     )}
                                 </div>
                                 <div className="p-4 rounded-lg border bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900">
                                      <div className="flex items-start justify-between">
                                         <div>
                                             <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Due Assignments</p>
                                             <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{studentRisk.upcomingAssignments}</p>
                                         </div>
                                         <FileText className="w-5 h-5 text-blue-500" />
                                     </div>
                                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Check 'Academics' tab</p>
                                 </div>
                             </div>
                         </div>
                    )}

                    {user.role === UserRole.STAFF && facultyInsights && (
                         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                             <h3 className="font-bold text-gray-800 dark:text-white flex items-center mb-4">
                                <CheckCircle2 className="w-5 h-5 mr-2 text-indigo-500" />
                                Faculty Action Items
                             </h3>
                             <div className="grid grid-cols-3 gap-4">
                                 <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                     <span className="block text-xl font-bold text-gray-800 dark:text-white">{facultyInsights.pendingGrading}</span>
                                     <span className="text-xs text-gray-500">Pending Grading</span>
                                 </div>
                                 <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                     <span className="block text-xl font-bold text-gray-800 dark:text-white">{facultyInsights.lowAttendanceCount}</span>
                                     <span className="text-xs text-gray-500">Students &lt; 75%</span>
                                 </div>
                                 <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                     <span className="block text-xl font-bold text-gray-800 dark:text-white">{facultyInsights.myBatches}</span>
                                     <span className="text-xs text-gray-500">Active Batches</span>
                                 </div>
                             </div>
                         </div>
                    )}

                    {/* Next Class Widget */}
                    {user.role !== UserRole.ADMIN && user.role !== UserRole.GUEST && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800 dark:text-white flex items-center">
                                    <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                                    Upcoming Session
                                </h3>
                                <span className="text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">Monday Schedule</span>
                            </div>
                            {nextClass ? (
                                <div className="flex items-start gap-4">
                                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg text-center min-w-[80px]">
                                        <span className="block text-lg font-bold text-indigo-700 dark:text-indigo-300">{nextClass.startTime}</span>
                                        <span className="text-xs text-indigo-500 dark:text-indigo-400 uppercase">{nextClass.dayOfWeek.substring(0,3)}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{nextClass.subject}</h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center mt-1">
                                            <span className="mr-3">{nextClass.location}</span>
                                            <span>• {nextClass.teacherName}</span>
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming classes scheduled.</p>
                            )}
                        </div>
                    )}
                    
                    {/* Announcement Widget */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800 dark:text-white flex items-center">
                                <Megaphone className="w-5 h-5 mr-2 text-amber-500" />
                                Latest News
                            </h3>
                            <button onClick={() => setActiveTab('ANNOUNCEMENTS')} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">View All</button>
                         </div>
                         <div className="space-y-4">
                            {announcements.slice(0, 2).map(ann => (
                                <div key={ann.id} className="pb-4 border-b border-gray-50 dark:border-gray-700 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-medium text-gray-900 dark:text-gray-200 text-sm">{ann.title}</h4>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(ann.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{ann.content}</p>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>

                {/* Right Column: Stats */}
                <div className="space-y-6">
                    {user.role === UserRole.ADMIN ? (
                         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                             <h3 className="font-bold text-gray-800 dark:text-white mb-2">System Pulse</h3>
                             <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={adminStats.data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                            {adminStats.data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                             </div>
                             <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-2">
                                 <div className="text-center"><span className="block font-bold text-lg text-gray-800 dark:text-white">{adminStats.pending}</span>Open</div>
                                 <div className="text-center"><span className="block font-bold text-lg text-gray-800 dark:text-white">{adminStats.inProgress}</span>WIP</div>
                                 <div className="text-center"><span className="block font-bold text-lg text-gray-800 dark:text-white">{adminStats.resolved}</span>Done</div>
                             </div>
                         </div>
                    ) : (
                         <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                             <div className="flex items-center justify-between mb-4">
                                 <h3 className="font-bold text-white/90">Quick Links</h3>
                                 <Clock className="w-4 h-4 text-white/60" />
                             </div>
                             <div className="space-y-3">
                                 <button onClick={() => setActiveTab('ACADEMIC')} className="w-full text-left bg-white/10 hover:bg-white/20 p-3 rounded-lg text-sm font-medium transition-colors flex items-center">
                                     <BookOpen className="w-4 h-4 mr-2" /> View Timetable
                                 </button>
                                 <button onClick={() => setActiveTab('MAP')} className="w-full text-left bg-white/10 hover:bg-white/20 p-3 rounded-lg text-sm font-medium transition-colors flex items-center">
                                     <Map className="w-4 h-4 mr-2" /> Campus Map
                                 </button>
                             </div>
                         </div>
                    )}
                </div>
           </div>
      )}

      {/* --- CAMPUS MAP (GUEST & LOGGED IN) --- */}
      {activeTab === 'MAP' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <CampusMap tickets={tickets} userRole={user.role} />
          </div>
      )}

      {/* --- ACADEMIC HUB --- */}
      {activeTab === 'ACADEMIC' && user.role !== UserRole.GUEST && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {user.role === UserRole.ADMIN ? (
                 <AdminAcademicOverview batches={batches} />
              ) : (
                 <AcademicSchedule 
                    classes={classes} 
                    userRole={user.role}
                    assignments={assignments}
                    attendance={attendance}
                    onAddExtraClass={onAddExtraClass}
                  />
              )}
          </div>
      )}

      {/* --- PERFORMANCE / ANALYTICS --- */}
      {activeTab === 'PERFORMANCE' && user.role !== UserRole.GUEST && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <PerformanceAnalytics 
             results={examResults}
             batches={batches}
             user={user}
          />
        </div>
      )}

      {/* --- ANNOUNCEMENTS --- */}
      {activeTab === 'ANNOUNCEMENTS' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl mx-auto">
              <AnnouncementBoard 
                announcements={announcements} 
                userRole={user.role} 
                onAddAnnouncement={onAddAnnouncement}
              />
          </div>
      )}

      {/* --- MAINTENANCE (ADMIN ONLY) --- */}
      {activeTab === 'MAINTENANCE' && user.role === UserRole.ADMIN && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
             
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Issue Reporting & Requests</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage student and staff reports.</p>
                </div>
            </div>

            {/* Ticket Management Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                    type="text" 
                    placeholder="Search tickets..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 dark:text-gray-200 transition-all"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {([
                        'ALL', 
                        TicketStatus.PENDING, 
                        TicketStatus.IN_PROGRESS, 
                        TicketStatus.RESOLVED
                    ] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                filter === status 
                                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' 
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent'
                            }`}
                        >
                             {status === 'PENDING' ? 'Open' : status === 'IN_PROGRESS' ? 'In Progress' : status === 'RESOLVED' ? 'Resolved' : 'All'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ticket Grid */}
            {filteredTickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTickets.map(ticket => (
                    <TicketCard 
                    key={ticket.id} 
                    ticket={ticket} 
                    userRole={user.role} 
                    staffUsers={staffUsers}
                    onUpdateStatus={onUpdateStatus}
                    onAssign={onAssign}
                    />
                ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                        <Wrench className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-medium">No tickets found</p>
                </div>
            )}
        </div>
      )}

    </div>
  );
};

export default Dashboard;