import React, { useState } from 'react';
import { Ticket, TicketStatus, TicketPriority, UserRole, User } from '../types';
import { Clock, MapPin, User as UserIcon, AlertTriangle, Sparkles, History, X, UserPlus, Check, Building2, Book, FileText } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  userRole: UserRole;
  staffUsers?: User[];
  onUpdateStatus?: (id: string, status: TicketStatus) => void;
  onAssign?: (ticketId: string, staffId: string, staffName: string) => void;
}

const statusColors = {
  [TicketStatus.PENDING]: 'bg-red-100 text-red-700 border-red-200',
  [TicketStatus.IN_PROGRESS]: 'bg-amber-100 text-amber-700 border-amber-200',
  [TicketStatus.RESOLVED]: 'bg-green-100 text-green-700 border-green-200',
  [TicketStatus.REJECTED]: 'bg-gray-100 text-gray-700 border-gray-200',
};

const priorityColors = {
  [TicketPriority.LOW]: 'text-blue-600',
  [TicketPriority.MEDIUM]: 'text-amber-600',
  [TicketPriority.HIGH]: 'text-orange-600',
  [TicketPriority.CRITICAL]: 'text-red-600 font-bold',
};

const TicketCard: React.FC<TicketCardProps> = ({ ticket, userRole, staffUsers = [], onUpdateStatus, onAssign }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);

  // Helper to determine category icon
  const getCategoryIcon = (cat: string) => {
      const lower = cat.toLowerCase();
      if (lower.includes('academic')) return <Book className="w-3 h-3 mr-1" />;
      if (lower.includes('admin')) return <FileText className="w-3 h-3 mr-1" />;
      return <Building2 className="w-3 h-3 mr-1" />;
  };

  // Status Timeline Helper
  const getTimelineStep = () => {
      if (ticket.status === TicketStatus.RESOLVED) return 3;
      if (ticket.status === TicketStatus.IN_PROGRESS) return 2;
      return 1;
  };
  const currentStep = getTimelineStep();

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full relative">
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[ticket.status]}`}>
              {ticket.status === TicketStatus.PENDING ? 'Submitted' : ticket.status === TicketStatus.IN_PROGRESS ? 'In Review' : ticket.status.replace('_', ' ')}
            </span>
            <div className="flex items-center space-x-2">
                <span className={`flex items-center text-xs uppercase tracking-wider ${priorityColors[ticket.priority]}`}>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {ticket.priority}
                </span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{ticket.title}</h3>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
             <div className="flex items-center">
                 <MapPin className="w-3 h-3 mr-1" />
                 <span className="line-clamp-1">{ticket.location}</span>
             </div>
             <div className="flex items-center px-2 py-0.5 bg-gray-50 rounded border border-gray-100">
                 {getCategoryIcon(ticket.category)}
                 <span className="font-medium">{ticket.category}</span>
             </div>
          </div>
          
          {/* Assigned To Display */}
          {(ticket.assignedToName || userRole !== UserRole.STUDENT) && (
              <div className="flex items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                      <UserIcon className="w-3 h-3 mr-1.5 flex-shrink-0" />
                      <span className="text-xs font-medium">
                          {ticket.assignedToName ? `Assigned to: ${ticket.assignedToName}` : 'Unassigned'}
                      </span>
                  </div>
              </div>
          )}

          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{ticket.description}</p>
          
          {ticket.aiAnalysis && (
             <div className="mb-4 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
               <div className="flex items-center text-xs font-semibold text-indigo-700 mb-1">
                 <Sparkles className="w-3 h-3 mr-1" />
                 AI Insight
               </div>
               <p className="text-xs text-indigo-800 leading-snug">{ticket.aiAnalysis}</p>
             </div>
          )}
          
          {/* Status Timeline Visualization */}
          <div className="mt-auto pt-4 border-t border-gray-50">
              <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                      <span className={`text-[10px] mt-1 ${currentStep >= 1 ? 'text-indigo-700 font-medium' : 'text-gray-400'}`}>Submitted</span>
                  </div>
                  <div className={`h-0.5 flex-1 mx-1 ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-100'}`}></div>
                  <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                      <span className={`text-[10px] mt-1 ${currentStep >= 2 ? 'text-indigo-700 font-medium' : 'text-gray-400'}`}>In Review</span>
                  </div>
                  <div className={`h-0.5 flex-1 mx-1 ${currentStep >= 3 ? 'bg-green-500' : 'bg-gray-100'}`}></div>
                  <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${currentStep >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      <span className={`text-[10px] mt-1 ${currentStep >= 3 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>Resolved</span>
                  </div>
              </div>
          </div>
        </div>

        {/* Action Buttons for Staff/Admin */}
        {(userRole === UserRole.ADMIN || userRole === UserRole.STAFF) && (
          <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center space-x-2 relative">
             <div className="flex items-center space-x-1">
                <button
                    onClick={() => setShowHistory(true)}
                    className="text-gray-500 hover:text-indigo-600 transition-colors p-2 hover:bg-gray-200 rounded-full"
                    title="View History"
                >
                    <History className="w-4 h-4" />
                </button>
                
                {/* Assignment Dropdown Trigger */}
                <div className="relative">
                    <button
                        onClick={() => setShowAssignDropdown(!showAssignDropdown)}
                        className={`text-gray-500 hover:text-indigo-600 transition-colors p-2 hover:bg-gray-200 rounded-full ${showAssignDropdown ? 'bg-gray-200 text-indigo-600' : ''}`}
                        title="Assign Staff"
                    >
                        <UserPlus className="w-4 h-4" />
                    </button>
                    
                    {/* Assignment Dropdown */}
                    {showAssignDropdown && (
                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10 overflow-hidden animate-in fade-in zoom-in duration-100">
                            <div className="p-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500">
                                Assign to...
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                                {staffUsers.length > 0 ? (
                                    staffUsers.map(staff => (
                                        <button
                                            key={staff.id}
                                            onClick={() => {
                                                onAssign && onAssign(ticket.id, staff.id, staff.name);
                                                setShowAssignDropdown(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between"
                                        >
                                            <span>{staff.name}</span>
                                            {ticket.assignedTo === staff.id && <Check className="w-3 h-3" />}
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-2 text-xs text-gray-400 text-center">No staff found</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
             </div>

             <div className="flex space-x-2">
                 {ticket.status !== TicketStatus.RESOLVED && (
                   <>
                     {userRole === UserRole.STAFF && ticket.status === TicketStatus.PENDING && (
                       <button 
                        onClick={() => onUpdateStatus && onUpdateStatus(ticket.id, TicketStatus.IN_PROGRESS)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-md transition-colors"
                       >
                         Start Review
                       </button>
                     )}
                     <button 
                      onClick={() => onUpdateStatus && onUpdateStatus(ticket.id, TicketStatus.RESOLVED)}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors"
                     >
                       Resolve
                     </button>
                   </>
                 )}
                 {userRole === UserRole.ADMIN && ticket.status === TicketStatus.PENDING && (
                     <button 
                       onClick={() => onUpdateStatus && onUpdateStatus(ticket.id, TicketStatus.REJECTED)}
                       className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-md transition-colors"
                     >
                       Reject
                     </button>
                 )}
             </div>
          </div>
        )}
        
        {/* Click backdrop to close dropdown */}
        {showAssignDropdown && (
            <div className="fixed inset-0 z-0" onClick={() => setShowAssignDropdown(false)} style={{backgroundColor: 'transparent'}}></div>
        )}
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">Ticket History</h3>
                    <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {ticket.history && ticket.history.length > 0 ? (
                        <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
                            {[...ticket.history].sort((a, b) => b.timestamp - a.timestamp).map((entry, index) => (
                                <div key={entry.id} className="relative pl-6">
                                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                                        entry.action === 'CREATED' ? 'bg-blue-500' :
                                        entry.action === 'STATUS_CHANGE' ? 'bg-amber-500' :
                                        entry.action === 'REJECTION' ? 'bg-red-500' :
                                        entry.action === 'ASSIGNMENT' ? 'bg-purple-500' :
                                        'bg-gray-400'
                                    }`}></div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                                            {new Date(entry.timestamp).toLocaleString(undefined, {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                        <span className="text-sm font-medium text-gray-900">{entry.details}</span>
                                        <div className="flex items-center mt-1">
                                            <UserIcon className="w-3 h-3 text-gray-400 mr-1" />
                                            <span className="text-xs text-gray-500">by {entry.actorName}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 text-sm">No history available for this ticket.</p>
                    )}
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default TicketCard;