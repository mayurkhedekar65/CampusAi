import React from 'react';
import { BookOpen, CalendarCheck, Clock, CheckCircle, Upload, PenBox, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="animate-slide-up">
      <h1 className="page-title">Welcome back, Mayur! 👋</h1>
      <p className="page-subtitle">Here is what happening in your academic life today.</p>

      {/* Stats row */}
      <div className="grid-3">
        <div className="card hoverable flex-align" style={{ gap: '1.5rem' }}>
          <div style={{ background: '#EEF2FF', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
            <CalendarCheck size={28} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Overall Attendance</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>82.5%</h3>
          </div>
        </div>
        
        <div className="card hoverable flex-align" style={{ gap: '1.5rem' }}>
          <div style={{ background: '#FEF08A', padding: '1rem', borderRadius: '50%', color: '#A16207' }}>
            <Clock size={28} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Upcoming Exams</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>2 in Next Week</h3>
          </div>
        </div>

        <div className="card hoverable flex-align" style={{ gap: '1.5rem' }}>
          <div style={{ background: '#DCFCE7', padding: '1rem', borderRadius: '50%', color: '#15803D' }}>
            <BookOpen size={28} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Recent Notes</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>AI, DB Systems</h3>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Quick Actions */}
        <div className="card">
          <h2 className="card-title">Quick Actions</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <button className="flex-align text-main" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius)', background: '#F8FAFC', border: '1px solid var(--border-color)', justifyContent: 'space-between' }} onClick={() => navigate('/app/attendance')}>
              <div className="flex-align">
                <CheckCircle size={20} color="var(--primary)" />
                <span style={{ fontWeight: 500 }}>Mark Today's Attendance</span>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </button>
            <button className="flex-align text-main" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius)', background: '#F8FAFC', border: '1px solid var(--border-color)', justifyContent: 'space-between' }} onClick={() => navigate('/app/notes')}>
              <div className="flex-align">
                <Upload size={20} color="var(--primary)" />
                <span style={{ fontWeight: 500 }}>Upload New Notes</span>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </button>
            <button className="flex-align text-main" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius)', background: '#F8FAFC', border: '1px solid var(--border-color)', justifyContent: 'space-between' }} onClick={() => navigate('/app/assistant')}>
              <div className="flex-align">
                <PenBox size={20} color="var(--primary)" />
                <span style={{ fontWeight: 500 }}>Ask AI Assistant</span>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </button>
          </div>
        </div>

        {/* Schedule/Reminders */}
        <div className="card">
          <h2 className="card-title">Today's Schedule</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { time: '10:00 AM', subject: 'Machine Learning', type: 'Lecture' },
              { time: '11:30 AM', subject: 'Database Systems', type: 'Lab' },
              { time: '02:00 PM', subject: 'Cloud Computing', type: 'Assignment Due', warning: true }
            ].map((item, i) => (
              <div key={i} className="flex-between" style={{ paddingBottom: '1rem', borderBottom: i !== 2 ? '1px solid var(--border-color)' : 'none' }}>
                <div className="flex-align">
                  <span style={{ width: '70px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{item.time}</span>
                  <div>
                    <h4 style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{item.subject}</h4>
                    <span className={`badge ${item.warning ? 'danger' : 'success'}`} style={{ marginTop: '0.25rem', display: 'inline-block' }}>{item.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
