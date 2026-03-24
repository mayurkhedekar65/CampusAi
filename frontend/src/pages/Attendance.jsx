import React, { useState } from 'react';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';

const initialSubjects = [
  { id: 1, name: 'Machine Learning', total: 40, attended: 35, status: 'high' },
  { id: 2, name: 'Database Systems', total: 38, attended: 25, status: 'low' },
  { id: 3, name: 'Cloud Computing', total: 35, attended: 30, status: 'high' },
  { id: 4, name: 'Web Development', total: 42, attended: 38, status: 'high' },
];

function Attendance() {
  const [subjects, setSubjects] = useState(initialSubjects);

  const markAttendance = (id, present) => {
    setSubjects(prev => prev.map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          total: sub.total + 1,
          attended: present ? sub.attended + 1 : sub.attended,
        };
      }
      return sub;
    }));
  };

  return (
    <div className="animate-slide-up">
      <div className="flex-between">
        <h1 className="page-title">Attendance Tracker</h1>
        <button className="btn flex-align" style={{ width: 'auto', padding: '0.65rem 1.25rem' }}>
          <Calendar size={18} />
          View History
        </button>
      </div>

      <div className="grid-3" style={{ marginTop: '2rem' }}>
        <div className="card hoverable">
          <p className="text-muted" style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Overall Attendance</p>
          <div className="flex-align">
            <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 800 }}>81.2%</h2>
            <span className="badge success">+2.1% this week</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>Mark Today's Attendance</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Classes Attended</th>
                <th>Total Classes</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(sub => {
                const percentage = ((sub.attended / sub.total) * 100).toFixed(1);
                const isLow = percentage < 75;
                return (
                  <tr key={sub.id}>
                    <td style={{ fontWeight: 600 }}>{sub.name}</td>
                    <td>{sub.attended}</td>
                    <td>{sub.total}</td>
                    <td style={{ fontWeight: 700, color: isLow ? '#DC2626' : '#16A34A' }}>
                      {percentage}%
                    </td>
                    <td>
                      <span className={`badge ${isLow ? 'danger' : 'success'}`}>
                        {isLow ? 'Low' : 'Good'}
                      </span>
                    </td>
                    <td>
                      <div className="flex-align">
                        <button 
                          onClick={() => markAttendance(sub.id, true)}
                          style={{ background: '#DCFCE7', color: '#166534', padding: '0.5rem', borderRadius: '0.5rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Mark Present"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button 
                          onClick={() => markAttendance(sub.id, false)}
                          style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.5rem', borderRadius: '0.5rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Mark Absent"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
