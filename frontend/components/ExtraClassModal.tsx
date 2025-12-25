import React, { useState } from 'react';
import { ClassSession } from '../types';
import { X, CalendarPlus } from 'lucide-react';

interface ExtraClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ClassSession>) => void;
  teacherName: string;
}

const ExtraClassModal: React.FC<ExtraClassModalProps> = ({ isOpen, onClose, onSubmit, teacherName }) => {
  const [subject, setSubject] = useState('');
  const [location, setLocation] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      subject,
      location,
      dayOfWeek: dayOfWeek as any,
      startTime,
      endTime,
      teacherName,
      isExtraClass: true
    });
    setSubject('');
    setLocation('');
    setStartTime('');
    setEndTime('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
          <h2 className="text-lg font-bold flex items-center">
             <CalendarPlus className="w-5 h-5 mr-2" />
             Schedule Extra Class
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input 
              type="text" 
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., Advanced Calculus"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
             <input 
              type="text" 
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., Room 101"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input 
                 type="time" 
                 required
                 value={startTime}
                 onChange={(e) => setStartTime(e.target.value)}
                 className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
               />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input 
                 type="time" 
                 required
                 value={endTime}
                 onChange={(e) => setEndTime(e.target.value)}
                 className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
               />
             </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Add to Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExtraClassModal;