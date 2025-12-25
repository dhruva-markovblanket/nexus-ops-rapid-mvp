
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Batch, ExamResult, User, UserRole } from '../types';
import { TrendingUp, School, ChevronDown, ListFilter, Calendar, CheckCircle2, LayoutGrid, BookOpen, Clock } from 'lucide-react';

interface PerformanceAnalyticsProps {
  results: ExamResult[];
  batches: Batch[];
  user: User;
}

// Detailed Mock Data for Student View
const MOCK_SUBJECT_PERFORMANCE = {
  "Mathematics": [
    { id: 1, type: 'IA-1', obtained: 16, total: 20, date: '2024-02-10' },
    { id: 2, type: 'Assignment', obtained: 9, total: 10, date: '2024-02-25' },
    { id: 3, type: 'IA-2', obtained: 18, total: 20, date: '2024-03-15' },
    { id: 4, type: 'Midterm', obtained: 42, total: 50, date: '2024-04-10' },
  ],
  "Physics": [
    { id: 1, type: 'IA-1', obtained: 14, total: 20, date: '2024-02-12' },
    { id: 2, type: 'Lab Report', obtained: 10, total: 10, date: '2024-02-28' },
    { id: 3, type: 'IA-2', obtained: 19, total: 20, date: '2024-03-18' },
    { id: 4, type: 'Midterm', obtained: 38, total: 50, date: '2024-04-12' },
  ]
};

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ results, batches, user }) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [studentViewMode, setStudentViewMode] = useState<'SUBJECT' | 'SUMMARY'>('SUBJECT');

  // --- Admin Analytics Logic ---
  const adminBatchStats = useMemo(() => {
    const stats: Record<string, { name: string, total: number, count: number }> = {};
    results.forEach(r => {
      const batchName = batches.find(b => b.id === r.batchId)?.name || r.batchId;
      if (!stats[batchName]) {
        stats[batchName] = { name: batchName, total: 0, count: 0 };
      }
      stats[batchName].total += r.marksObtained;
      stats[batchName].count += 1;
    });
    return Object.values(stats).map(s => ({
      name: s.name,
      average: Math.round(s.total / s.count)
    }));
  }, [results, batches]);

  // --- Staff Analytics Logic ---
  const staffBatches = useMemo(() => {
      const myBatchIds = Array.from(new Set(results.filter(r => r.teacherId === user.id).map(r => r.batchId)));
      return batches.filter(b => myBatchIds.includes(b.id));
  }, [results, user.id, batches]);

  const staffBatchStats = useMemo(() => {
    const myResults = results.filter(r => r.teacherId === user.id);
    const stats: Record<string, { batch: string, subject: string, total: number, count: number, max: number, min: number }> = {};
    
    myResults.forEach(r => {
        const batchName = batches.find(b => b.id === r.batchId)?.name || r.batchId;
        const key = `${batchName} - ${r.subject}`;
        
        if (!stats[key]) {
            stats[key] = { batch: batchName, subject: r.subject, total: 0, count: 0, max: 0, min: 100 };
        }
        stats[key].total += r.marksObtained;
        stats[key].count += 1;
        stats[key].max = Math.max(stats[key].max, r.marksObtained);
        stats[key].min = Math.min(stats[key].min, r.marksObtained);
    });

    return Object.values(stats).map(s => ({
        name: s.batch,
        subject: s.subject,
        average: Math.round(s.total / s.count),
        max: s.max,
        min: s.min
    }));
  }, [results, user.id, batches]);

  const detailedBatchResults = useMemo(() => {
      if(!selectedBatchId) return [];
      return results.filter(r => r.batchId === selectedBatchId && r.teacherId === user.id);
  }, [selectedBatchId, results, user.id]);

  // --- Student Analytics Helper ---
  const getSubjectChartData = (assessments: typeof MOCK_SUBJECT_PERFORMANCE["Mathematics"]) => {
      return assessments.map(a => ({
          name: a.type,
          percentage: Math.round((a.obtained / a.total) * 100),
          date: new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      }));
  };

  const studentSummaryData = useMemo(() => {
      return Object.entries(MOCK_SUBJECT_PERFORMANCE).map(([subject, assessments]) => {
          const totalObtained = assessments.reduce((sum, a) => sum + a.obtained, 0);
          const totalMax = assessments.reduce((sum, a) => sum + a.total, 0);
          return {
              subject,
              average: Math.round((totalObtained / totalMax) * 100)
          };
      });
  }, []);


  // --- Render Views ---

  if (user.role === UserRole.ADMIN) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
             <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />
             University Performance Overview
        </h2>

        <div className="grid grid-cols-1 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                <div className="flex justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Average Performance by Batch</h3>
                    <span className="text-xs text-gray-400 flex items-center"><Clock className="w-3 h-3 mr-1" /> Last updated: Today, 10:00 AM</span>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={adminBatchStats}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                            <XAxis dataKey="name" tick={{fontSize: 12, fill: '#9CA3AF'}} />
                            <YAxis domain={[0, 100]} tick={{fill: '#9CA3AF'}} label={{ value: 'Avg Marks', angle: -90, position: 'insideLeft', fill: '#9CA3AF', fontSize: 12 }} />
                            <Tooltip 
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                itemStyle={{color: '#4F46E5'}}
                            />
                            <Bar dataKey="average" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Avg Marks" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </div>
    );
  }

  if (user.role === UserRole.STAFF) {
      return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                    <School className="w-6 h-6 mr-2 text-indigo-600" />
                    Batch Analysis
                </h2>
                
                <div className="relative">
                    <select 
                        className="appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                        onChange={(e) => setSelectedBatchId(e.target.value)}
                        value={selectedBatchId}
                    >
                        <option value="">Select a Batch to View Details</option>
                        {staffBatches.map(b => (
                            <option key={b.id} value={b.id}>{b.name} ({b.course})</option>
                        ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {staffBatchStats.map((stat, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{stat.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.subject}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                stat.average >= 75 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                stat.average >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                                'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            }`}>
                                Avg: {stat.average}%
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Highest</span>
                                <span className="font-medium text-gray-900 dark:text-white">{stat.max}</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${stat.max}%` }}></div>
                            </div>
                        </div>
                        </div>
                ))}
            </div>
            
            {selectedBatchId && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                         <h3 className="font-bold text-gray-800 dark:text-gray-200">Student List - Detailed Results</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-3">Student ID</th>
                                    <th className="px-6 py-3">Assessment</th>
                                    <th className="px-6 py-3">Marks</th>
                                    <th className="px-6 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {detailedBatchResults.map(res => (
                                    <tr key={res.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{res.studentId}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                {res.examType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{res.marksObtained}/{res.totalMarks}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{new Date(res.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {detailedBatchResults.length === 0 && (
                            <div className="p-8 text-center text-gray-400">No results found for this batch.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
      );
  }

  // --- Student View ---
  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />
                My Academic Performance (CGPA)
            </h2>
            
            {/* View Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button
                    onClick={() => setStudentViewMode('SUBJECT')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        studentViewMode === 'SUBJECT' 
                        ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                >
                    <span className="flex items-center"><ListFilter className="w-4 h-4 mr-2" /> Subject-wise</span>
                </button>
                <button
                    onClick={() => setStudentViewMode('SUMMARY')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        studentViewMode === 'SUMMARY' 
                        ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                >
                    <span className="flex items-center"><LayoutGrid className="w-4 h-4 mr-2" /> Semester Summary</span>
                </button>
            </div>
        </div>
        
        {studentViewMode === 'SUBJECT' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                {Object.entries(MOCK_SUBJECT_PERFORMANCE).map(([subject, assessments]) => (
                    <div key={subject} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center">
                                <BookOpen className="w-5 h-5 mr-2 text-indigo-500" />
                                {subject}
                            </h3>
                            <span className="text-xs font-medium px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md">
                                {assessments.length} Assessments
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Chart Section */}
                            <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-700">
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Score Progression (%)</h4>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={getSubjectChartData(assessments)}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                            <XAxis dataKey="name" tick={{fontSize: 11, fill: '#9CA3AF'}} interval={0} />
                                            <YAxis domain={[0, 100]} tick={{fill: '#9CA3AF'}} />
                                            <Tooltip contentStyle={{backgroundColor: '#1f2937', color: 'white', borderRadius: '8px', border: 'none'}} />
                                            <Line type="monotone" dataKey="percentage" stroke="#4F46E5" strokeWidth={3} dot={{r: 5, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 8}} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Timeline List Section */}
                            <div className="p-0">
                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                     <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Assessment History</h4>
                                </div>
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {assessments.map((a) => (
                                        <div key={a.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors flex items-center justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{a.type}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-0.5">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {new Date(a.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="block font-bold text-gray-900 dark:text-white">
                                                    {a.obtained} <span className="text-gray-400 text-xs font-normal">/ {a.total}</span>
                                                </span>
                                                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                                    {Math.round((a.obtained / a.total) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-6">Semester Summary</h3>
                     <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={studentSummaryData} barSize={50}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                <XAxis dataKey="subject" tick={{fontSize: 12, fill: '#9CA3AF'}} />
                                <YAxis domain={[0, 100]} tick={{fill: '#9CA3AF'}} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1f2937', color: 'white', borderRadius: '8px', border: 'none'}} />
                                <Bar dataKey="average" fill="#8884d8" radius={[8, 8, 0, 0]}>
                                    {studentSummaryData.map((entry, index) => (
                                        <React.Fragment key={`cell-${index}`}>
                                             {/* Alternate colors logic if needed, currently using single color */}
                                        </React.Fragment>
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                         <span>Average performance based on all assessments.</span>
                         <span className="italic">* Data is simulated for demonstration</span>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default PerformanceAnalytics;