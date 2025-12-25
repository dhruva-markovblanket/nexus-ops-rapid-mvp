import React, { useState, useMemo } from 'react';
import { ClassSession, UserRole, Assignment, AttendanceRecord } from '../types';
import { Calendar, Clock, MapPin, User, Plus, Book, FileText, BookOpen, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

interface AcademicScheduleProps {
  classes: ClassSession[];
  userRole: UserRole;
  assignments?: Assignment[];
  attendance?: AttendanceRecord[];
  onAddExtraClass: () => void;
}

const AcademicSchedule: React.FC<AcademicScheduleProps> = ({ 
    classes, userRole, onAddExtraClass, 
    assignments = [], attendance = [] 
}) => {
  const [activeTab, setActiveTab] = useState<'TIMETABLE' | 'ASSIGNMENTS' | 'ATTENDANCE'>('TIMETABLE');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredClasses = useMemo(() => 
    classes
    .filter(c => c.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  [classes, selectedDay]);

  const groupedAssignments = useMemo(() => {
    const groups: Record<string, Assignment[]> = {};
    assignments.forEach(assign => {
        // Find subject name from class list. Assuming c-X maps to a subject.
        const cls = classes.find(c => c.id === assign.courseId); 
        const subject = cls ? cls.subject : 'General Tasks';
        
        if (!groups[subject]) groups[subject] = [];
        groups[subject].push(assign);
    });
    return groups;
  }, [assignments, classes]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors min-h-[500px]">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col gap-6">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                    <Book className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Academic Hub
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your weekly schedule and tasks.</p>
            </div>
            
            {(userRole === UserRole.STAFF) && (
                <button 
                    onClick={activeTab === 'TIMETABLE' ? onAddExtraClass : undefined}
                    className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4 mr-1.5" />
                    {activeTab === 'ASSIGNMENTS' ? 'Create Assignment' : 'Extra Class'}
                </button>
            )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg w-fit">
            {(['TIMETABLE', 'ASSIGNMENTS', 'ATTENDANCE'] as const).map((tab) => {
                if (tab === 'ATTENDANCE' && userRole !== UserRole.STUDENT) return null;
                return (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                            activeTab === tab 
                            ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                    >
                        {tab.charAt(0) + tab.slice(1).toLowerCase()}
                    </button>
                )
            })}
        </div>
      </div>

      {/* --- TIMETABLE VIEW --- */}
      {activeTab === 'TIMETABLE' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
                {days.map(day => (
                <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`flex-1 px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                    selectedDay === day 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                >
                    {day}
                    {selectedDay === day && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"></span>
                    )}
                </button>
                ))}
            </div>

            <div className="p-6">
                {filteredClasses.length > 0 ? (
                <div className="space-y-3">
                    {filteredClasses.map((session, idx) => (
                    <div 
                        key={session.id} 
                        className="group flex items-center p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-900 bg-white dark:bg-gray-800/50 transition-all hover:shadow-md"
                    >
                        {/* Time Column */}
                        <div className="flex flex-col items-center justify-center min-w-[80px] border-r border-gray-100 dark:border-gray-700 pr-4 mr-4">
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{session.startTime}</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">{session.endTime}</span>
                        </div>
                        
                        {/* Details Column */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {session.subject}
                                </h3>
                                {session.isExtraClass && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200 tracking-wide border border-amber-200 dark:border-amber-800">
                                        Extra
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <div className="flex items-center">
                                    <User className="w-3.5 h-3.5 mr-1.5" />
                                    {session.teacherName} (Faculty)
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-3.5 h-3.5 mr-1.5" />
                                    {session.location}
                                </div>
                            </div>
                        </div>
                        
                        <div className="hidden sm:block">
                             <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 transition-colors" />
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl">
                        <Calendar className="w-12 h-12 mb-3 opacity-20" />
                        <p>No classes scheduled for {selectedDay}</p>
                    </div>
                )}
            </div>
          </div>
      )}

      {/* --- ASSIGNMENTS VIEW --- */}
      {activeTab === 'ASSIGNMENTS' && (
          <div className="p-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {Object.keys(groupedAssignments).length > 0 ? (
                  <div className="space-y-8">
                      {Object.entries(groupedAssignments).map(([subject, items]) => (
                          <div key={subject}>
                              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  {subject}
                              </h3>
                              <div className="space-y-3">
                                  {items.map(assign => (
                                      <div key={assign.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all">
                                          <div className="flex items-start gap-3">
                                              <div className={`mt-1 p-1.5 rounded-full ${
                                                  assign.status === 'SUBMITTED' || assign.status === 'GRADED'
                                                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                                  : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                              }`}>
                                                  <FileText className="w-4 h-4" />
                                              </div>
                                              <div>
                                                  <h4 className="font-semibold text-gray-900 dark:text-white">{assign.title}</h4>
                                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                                      <Calendar className="w-3 h-3 mr-1" />
                                                      Due {new Date(assign.dueDate).toLocaleDateString()}
                                                  </p>
                                              </div>
                                          </div>
                                          
                                          <div className="text-right">
                                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                  assign.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                  assign.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                              }`}>
                                                  {assign.status === 'PENDING' ? <AlertCircle className="w-3 h-3 mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                                                  {assign.status}
                                              </span>
                                              {assign.status === 'PENDING' && userRole === UserRole.STUDENT && (
                                                  <button className="block mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium ml-auto">
                                                      Submit Now
                                                  </button>
                                              )}
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                      <FileText className="w-12 h-12 mb-3 opacity-20" />
                      <p>No active assignments found.</p>
                  </div>
              )}
          </div>
      )}

      {/* --- ATTENDANCE VIEW (Student Only) --- */}
      {activeTab === 'ATTENDANCE' && userRole === UserRole.STUDENT && (
          <div className="p-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {attendance.map(record => {
                      const percentage = Math.round((record.present / record.total) * 100);
                      const isGood = percentage >= 85;
                      const isWarning = percentage >= 75 && percentage < 85;
                      
                      const colorClass = isGood ? 'text-green-600 dark:text-green-400' : isWarning ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';
                      const bgClass = isGood ? 'bg-green-50 dark:bg-green-900/10' : isWarning ? 'bg-yellow-50 dark:bg-yellow-900/10' : 'bg-red-50 dark:bg-red-900/10';
                      const strokeColor = isGood ? '#22c55e' : isWarning ? '#eab308' : '#ef4444';
                      
                      return (
                          <div key={record.id} className="p-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm flex items-center justify-between relative overflow-hidden group">
                             <div className={`absolute top-0 left-0 w-1.5 h-full ${isGood ? 'bg-green-500' : isWarning ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                             <div>
                                 <h4 className="font-bold text-gray-800 dark:text-gray-200 text-lg">{record.subject}</h4>
                                 <div className="mt-2 flex items-center gap-2">
                                     <span className={`text-xs font-bold px-2 py-0.5 rounded ${bgClass} ${colorClass}`}>
                                         {isGood ? 'On Track' : isWarning ? 'Warning' : 'Critical'}
                                     </span>
                                     <span className="text-xs text-gray-400">{record.present}/{record.total} Classes</span>
                                 </div>
                             </div>
                             
                             <div className="relative w-16 h-16 flex items-center justify-center">
                                 {/* Circular Progress */}
                                 <svg className="w-full h-full transform -rotate-90">
                                     <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100 dark:text-gray-700" />
                                     <circle cx="32" cy="32" r="28" stroke={strokeColor} strokeWidth="6" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * percentage) / 100} strokeLinecap="round" />
                                 </svg>
                                 <span className={`absolute text-sm font-bold ${colorClass}`}>{percentage}%</span>
                             </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      )}

    </div>
  );
};

export default AcademicSchedule;