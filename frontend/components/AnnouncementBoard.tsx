import React, { useState, useMemo } from 'react';
import { Announcement, AnnouncementCategory, AnnouncementScope, UserRole } from '../types';
import { Megaphone, Pin, Plus, X, Globe, Users, GraduationCap, BookOpen, Calendar, AlertCircle, FileText } from 'lucide-react';

interface AnnouncementBoardProps {
  announcements: Announcement[];
  userRole: UserRole;
  onAddAnnouncement: (title: string, content: string, priority: 'NORMAL' | 'URGENT', scope: AnnouncementScope, category: AnnouncementCategory) => void;
}

const AnnouncementBoard: React.FC<AnnouncementBoardProps> = ({ announcements, userRole, onAddAnnouncement }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [scope, setScope] = useState<AnnouncementScope>('UNIVERSITY');
  const [category, setCategory] = useState<AnnouncementCategory>('GENERAL');
  
  const [activeFilter, setActiveFilter] = useState<'ALL' | AnnouncementCategory>('ALL');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAnnouncement(newTitle, newContent, isUrgent ? 'URGENT' : 'NORMAL', scope, category);
    setNewTitle('');
    setNewContent('');
    setIsUrgent(false);
    setScope('UNIVERSITY');
    setCategory('GENERAL');
    setIsAdding(false);
  };

  const filteredAnnouncements = useMemo(() => {
    let result = announcements;
    if (activeFilter !== 'ALL') {
        result = result.filter(a => a.category === activeFilter);
    }
    return result.sort((a, b) => b.date - a.date);
  }, [announcements, activeFilter]);

  const scopeStyles = {
      'UNIVERSITY': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'DEPARTMENT': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'BATCH': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      'SUBJECT': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  };

  const ScopeIcon = ({ scope }: { scope: AnnouncementScope }) => {
      switch(scope) {
          case 'UNIVERSITY': return <Globe className="w-3 h-3 mr-1" />;
          case 'DEPARTMENT': return <Users className="w-3 h-3 mr-1" />;
          case 'BATCH': return <GraduationCap className="w-3 h-3 mr-1" />;
          case 'SUBJECT': return <BookOpen className="w-3 h-3 mr-1" />;
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Megaphone className="w-6 h-6 mr-2 text-indigo-600" />
                Campus News
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Stay updated with the latest happenings.</p>
        </div>
        
        {(userRole === UserRole.ADMIN || userRole === UserRole.STAFF) && !isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post Announcement
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {(['ALL', 'ACADEMIC', 'EVENTS', 'EXAMS'] as const).map(filter => (
              <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeFilter === filter
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                  {filter.charAt(0) + filter.slice(1).toLowerCase()}
              </button>
          ))}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-lg animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-start mb-6">
                <h3 className="font-semibold text-gray-800 dark:text-white">New Announcement</h3>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Scope</label>
                        <select 
                            value={scope} 
                            onChange={e => setScope(e.target.value as AnnouncementScope)}
                            className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        >
                            <option value="UNIVERSITY">University-wide</option>
                            <option value="DEPARTMENT">Departmental</option>
                            <option value="BATCH">Batch Specific</option>
                            <option value="SUBJECT">Subject Specific</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Category</label>
                        <select 
                            value={category} 
                            onChange={e => setCategory(e.target.value as AnnouncementCategory)}
                            className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        >
                            <option value="GENERAL">General</option>
                            <option value="ACADEMIC">Academic</option>
                            <option value="EVENTS">Events</option>
                            <option value="EXAMS">Exams</option>
                        </select>
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="Announcement Title"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                
                <textarea
                    placeholder="Write the details here..."
                    required
                    rows={4}
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                
                <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={isUrgent} 
                            onChange={e => setIsUrgent(e.target.checked)} 
                            className="mr-2 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        Mark as Urgent Priority
                    </label>
                    <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm transition-transform active:scale-95">
                        Post Announcement
                    </button>
                </div>
            </form>
        </div>
      )}

      <div className="grid gap-4">
        {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((item) => (
            <div 
                key={item.id} 
                className={`group p-5 rounded-xl border bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 ${
                    item.priority === 'URGENT' ? 'border-l-4 border-l-red-500 dark:border-l-red-500 border-t border-r border-b border-gray-100 dark:border-gray-700' : 'border border-gray-100 dark:border-gray-700'
                }`}
            >
                {/* Header: Scope Badge & Date */}
                <div className="flex justify-between items-center mb-3">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${scopeStyles[item.scope]}`}>
                        <ScopeIcon scope={item.scope} />
                        {item.scope}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                        {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>

                <div className="flex items-start gap-3 mb-2">
                    {item.priority === 'URGENT' && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-1.5 rounded-full mt-0.5">
                             <AlertCircle className="w-4 h-4 text-red-500" />
                        </div>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.title}
                    </h3>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 pl-0.5">
                    {item.content}
                </p>

                {/* Footer: Author & Category */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700/50 text-xs">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <span className="font-semibold mr-1">{item.authorName}</span>
                        <span className="text-gray-400 dark:text-gray-500">({item.authorRole})</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md font-medium text-[10px] flex items-center">
                            {item.category === 'EXAMS' && <Calendar className="w-3 h-3 mr-1" />}
                            {item.category === 'ACADEMIC' && <BookOpen className="w-3 h-3 mr-1" />}
                            {item.category === 'EVENTS' && <Users className="w-3 h-3 mr-1" />}
                            {item.category === 'GENERAL' && <FileText className="w-3 h-3 mr-1" />}
                            {item.category}
                        </span>
                    </div>
                </div>
            </div>
            ))
        ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <Megaphone className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No announcements found for this filter.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementBoard;