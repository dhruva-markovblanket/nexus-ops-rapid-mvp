import React, { useState, useRef, useEffect } from 'react';
import { Bell, Trash2 } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onMarkAsRead, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-indigo-600 transition-colors relative rounded-full hover:bg-gray-100"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
          <div className="p-3 border-b border-gray-50 flex justify-between items-center bg-gray-50">
            <h3 className="font-semibold text-gray-700 text-sm">Notifications</h3>
            {notifications.length > 0 && (
              <button 
                onClick={onClearAll}
                className="text-xs text-gray-400 hover:text-red-500 flex items-center transition-colors"
              >
                <Trash2 className="w-3 h-3 mr-1" /> Clear all
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                No notifications yet
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {notifications.sort((a,b) => b.timestamp - a.timestamp).map(notification => (
                  <li 
                    key={notification.id} 
                    className={`p-4 transition-all cursor-pointer border-l-4 ${
                        !notification.read 
                        ? 'bg-indigo-50 border-indigo-500' 
                        : 'bg-white hover:bg-gray-50 border-transparent'
                    }`}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm ${!notification.read ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                            {notification.message}
                            </p>
                            {!notification.read && <span className="ml-2 text-[10px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0">New</span>}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.timestamp).toLocaleString(undefined, { 
                             month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;