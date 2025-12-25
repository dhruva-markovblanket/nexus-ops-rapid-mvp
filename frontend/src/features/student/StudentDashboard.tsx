import React, { useEffect, useState } from 'react';
import { getStudentMetrics } from '../../services/studentService';
import TicketList from '../tickets/components/TicketList';

/**
 * Feature-Based Architecture:
 * This component resides in `features/student/` because it is specific to the Student role.
 * It consumes shared components (TicketList) but maintains its own layout logic.
 */

const StudentDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    getStudentMetrics().then(setMetrics);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">My Attendance</h2>
          {/* Attendance Chart Component */}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Recent Issues</h2>
          <TicketList filter="MY_TICKETS" />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
