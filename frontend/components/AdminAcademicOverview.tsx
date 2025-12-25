import React, { useState, useMemo } from 'react';
import { Batch } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend 
} from 'recharts';
import { 
  Users, GraduationCap, AlertTriangle, ArrowRight, ArrowLeft, 
  TrendingUp, BookOpen, Info 
} from 'lucide-react';

interface AdminAcademicOverviewProps {
  batches: Batch[];
}

interface BatchAnalytics {
  id: string;
  name: string;
  course: string;
  totalStudents: number;
  avgAttendance: number;
  avgCGPA: number;
  riskStatus: 'NORMAL' | 'ATTENTION';
  subjectAttendance: { subject: string; percentage: number }[];
  cgpaDistribution: { range: string; count: number }[];
}

const AdminAcademicOverview: React.FC<AdminAcademicOverviewProps> = ({ batches }) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  // Generate Mock Analytics Data based on existing batches
  const batchAnalytics: BatchAnalytics[] = useMemo(() => {
    return batches.map(batch => {
      // Deterministic mock data generation based on batch ID length/char codes to keep it consistent
      const seed = batch.id.length + batch.name.length;
      const avgAttendance = 70 + (seed * 2) % 25; // Random between 70-95
      const avgCGPA = 6.5 + (seed % 35) / 10; // Random between 6.5-10.0
      
      const isRisky = avgAttendance < 75 || avgCGPA < 7.0;

      return {
        id: batch.id,
        name: batch.name,
        course: batch.course,
        totalStudents: batch.totalStudents,
        avgAttendance: Math.round(avgAttendance),
        avgCGPA: parseFloat(avgCGPA.toFixed(2)),
        riskStatus: isRisky ? 'ATTENTION' : 'NORMAL',
        subjectAttendance: [
          { subject: 'Mathematics', percentage: Math.round(avgAttendance + 2) },
          { subject: 'Physics', percentage: Math.round(avgAttendance - 5) },
          { subject: 'Comp Sci', percentage: Math.round(avgAttendance + 5) },
          { subject: 'History', percentage: Math.round(avgAttendance - 2) },
        ],
        cgpaDistribution: [
          { range: '9-10', count: Math.round(batch.totalStudents * 0.1) },
          { range: '8-9', count: Math.round(batch.totalStudents * 0.3) },
          { range: '7-8', count: Math.round(batch.totalStudents * 0.4) },
          { range: '<7', count: Math.round(batch.totalStudents * 0.2) },
        ]
      };
    });
  }, [batches]);

  const selectedBatch = useMemo(() => 
    batchAnalytics.find(b => b.id === selectedBatchId), 
  [selectedBatchId, batchAnalytics]);

  if (selectedBatch) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setSelectedBatchId(null)}
          className="flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Overview
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              {selectedBatch.name}
              <span className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                {selectedBatch.course}
              </span>
            </h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
               <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {selectedBatch.totalStudents} Students</span>
               <span className="flex items-center"><GraduationCap className="w-4 h-4 mr-1" /> Batch Leader: Staff Bob</span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg border ${
            selectedBatch.riskStatus === 'NORMAL' 
              ? 'bg-green-50 border-green-100 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' 
              : 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300'
          }`}>
             <span className="text-xs font-bold uppercase tracking-wider flex items-center">
                {selectedBatch.riskStatus === 'NORMAL' ? <TrendingUp className="w-4 h-4 mr-2" /> : <AlertTriangle className="w-4 h-4 mr-2" />}
                Status: {selectedBatch.riskStatus}
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Attendance Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
             <h3 className="font-bold text-gray-800 dark:text-white mb-6">Subject-wise Attendance</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedBatch.subjectAttendance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="subject" type="category" width={100} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1f2937', color: 'white', borderRadius: '8px', border: 'none'}} />
                    <Bar dataKey="percentage" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#6B7280', fontSize: 12 }} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* CGPA Distribution Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
             <h3 className="font-bold text-gray-800 dark:text-white mb-6">CGPA Distribution</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedBatch.cgpaDistribution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                    <XAxis dataKey="range" tick={{fontSize: 12, fill: '#9CA3AF'}} />
                    <YAxis tick={{fill: '#9CA3AF'}} allowDecimals={false} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1f2937', color: 'white', borderRadius: '8px', border: 'none'}} />
                    <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Analytics Note</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    These metrics are generated for illustrative purposes. In a production environment, this data would be aggregated from real-time attendance records and exam results linked to the batch ID. Future updates will include predictive risk modeling using ML.
                </p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-indigo-600" />
                Academic Oversight
           </h2>
           <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
             Monitoring {batches.length} active batches across the campus.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batchAnalytics.map((batch) => (
          <div 
            key={batch.id}
            onClick={() => setSelectedBatchId(batch.id)}
            className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-900 transition-all cursor-pointer overflow-hidden relative"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${batch.riskStatus === 'NORMAL' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {batch.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{batch.course}</p>
                 </div>
                 {batch.riskStatus === 'ATTENTION' && (
                     <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 p-1.5 rounded-full">
                         <AlertTriangle className="w-4 h-4" />
                     </div>
                 )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                      <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Avg Attendance</span>
                      <span className={`block text-lg font-bold ${
                          batch.avgAttendance < 75 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
                      }`}>
                          {batch.avgAttendance}%
                      </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                      <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Avg CGPA</span>
                      <span className="block text-lg font-bold text-gray-900 dark:text-white">
                          {batch.avgCGPA}
                      </span>
                  </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50 dark:border-gray-700/50">
                  <span>{batch.totalStudents} Students Enrolled</span>
                  <span className="flex items-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      View Analytics <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center mt-8">
          <p className="text-xs text-gray-400 italic">
              * Analytics data shown above is mock and illustrative for interface demonstration.
          </p>
      </div>
    </div>
  );
};

export default AdminAcademicOverview;