import React from 'react';
import { BookOpen, CalendarCheck, Clock, CheckCircle, Upload, PenBox, ChevronRight, Users, PlayCircle, Building, FilePieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = ({ user, navigate }) => (
  <>
    <div className="grid-3">
      <div className="card hoverable flex-align glass-panel" style={{ gap: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
          <CalendarCheck size={28} />
        </div>
        <div>
          <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Overall Attendance</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>82.5%</h3>
        </div>
      </div>
      
      <div className="card hoverable flex-align glass-panel" style={{ gap: '1.5rem', borderLeft: '4px solid #A16207' }}>
        <div style={{ background: '#FEF9C3', padding: '1rem', borderRadius: '50%', color: '#A16207' }}>
          <Clock size={28} />
        </div>
        <div>
          <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Upcoming Exams</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>2 in Next Week</h3>
        </div>
      </div>

      <div className="card hoverable flex-align glass-panel" style={{ gap: '1.5rem', borderLeft: '4px solid #166534' }}>
        <div style={{ background: '#DCFCE7', padding: '1rem', borderRadius: '50%', color: '#15803D' }}>
          <BookOpen size={28} />
        </div>
        <div>
          <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Recent Notes</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>AI, DB Systems</h3>
        </div>
      </div>
    </div>

    <div className="grid-2">
      <div className="card glass-panel">
        <h2 className="card-title">Quick Actions</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <button className="flex-align text-main" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', justifyContent: 'space-between', transition: 'all 0.2s' }} onClick={() => navigate('/app/attendance')} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateX(5px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'none'; }}>
            <div className="flex-align">
              <CheckCircle size={20} color="var(--primary)" />
              <span style={{ fontWeight: 600 }}>Mark Today's Attendance</span>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>
          <button className="flex-align text-main" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', justifyContent: 'space-between', transition: 'all 0.2s' }} onClick={() => navigate('/app/notes')} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateX(5px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'none'; }}>
            <div className="flex-align">
              <BookOpen size={20} color="var(--primary)" />
              <span style={{ fontWeight: 600 }}>View Subject Notes</span>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>
          <button className="flex-align text-main" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', justifyContent: 'space-between', transition: 'all 0.2s' }} onClick={() => navigate('/app/assistant')} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateX(5px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'none'; }}>
            <div className="flex-align">
              <PenBox size={20} color="var(--primary)" />
              <span style={{ fontWeight: 600 }}>Ask AI Assistant</span>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>
        </div>
      </div>

      <div className="card glass-panel">
        <h2 className="card-title">Today's Schedule</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { time: '10:00 AM', subject: 'Machine Learning', type: 'Lecture' },
            { time: '11:30 AM', subject: 'Database Systems', type: 'Lab' },
            { time: '02:00 PM', subject: 'Cloud Computing', type: 'Assignment Due', warning: true }
          ].map((item, i, arr) => (
            <div key={i} className="flex-between" style={{ paddingBottom: '1rem', borderBottom: i !== arr.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
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
  </>
);

const TeacherDashboard = ({ user, navigate }) => (
  <>
    <div className="grid-3">
      <div className="card hoverable flex-align glass-panel" style={{ gap: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
          <Users size={28} />
        </div>
        <div>
          <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Total Students Enrolled</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>142</h3>
        </div>
      </div>
      
      <div className="card hoverable flex-align glass-panel" style={{ gap: '1.5rem', borderLeft: '4px solid #166534' }}>
        <div style={{ background: '#DCFCE7', padding: '1rem', borderRadius: '50%', color: '#15803D' }}>
          <CalendarCheck size={28} />
        </div>
        <div>
          <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Avg. Class Attendance</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>88%</h3>
        </div>
      </div>

      <div className="card hoverable flex-align glass-panel" style={{ gap: '1.5rem', borderLeft: '4px solid #A16207' }}>
        <div style={{ background: '#FEF9C3', padding: '1rem', borderRadius: '50%', color: '#A16207' }}>
          <BookOpen size={28} />
        </div>
        <div>
          <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Notes Uploaded</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>24 Files</h3>
        </div>
      </div>
    </div>

    <div className="grid-2">
      <div className="card glass-panel">
        <h2 className="card-title">Teacher Controls</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <button className="flex-align text-main" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius)', background: 'linear-gradient(135deg, var(--primary) 0%, #818CF8 100%)', color: 'white', border: 'none', justifyContent: 'space-between', transition: 'transform 0.2s', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)' }} onClick={() => navigate('/app/attendance')} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
            <div className="flex-align">
              <PlayCircle size={22} color="white" />
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Start Attendance Session</span>
            </div>
            <ChevronRight size={18} color="white" />
          </button>
          
          <button className="flex-align text-main" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', justifyContent: 'space-between', transition: 'all 0.2s' }} onClick={() => navigate('/app/notes')} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateX(5px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'none'; }}>
            <div className="flex-align">
              <Upload size={20} color="var(--primary)" />
              <span style={{ fontWeight: 600 }}>Upload New Notes</span>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>
        </div>
      </div>

      <div className="card glass-panel">
        <h2 className="card-title">My Schedule</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { time: '09:00 AM', subject: 'Data Structures (CS-A)', type: 'Lecture' },
            { time: '11:00 AM', subject: 'Data Structures (CS-B)', type: 'Lecture' },
            { time: '02:00 PM', subject: 'Algorithms Lab', type: 'Lab', warning: true }
          ].map((item, i, arr) => (
            <div key={i} className="flex-between" style={{ paddingBottom: '1rem', borderBottom: i !== arr.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
              <div className="flex-align">
                <span style={{ width: '70px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{item.time}</span>
                <div>
                  <h4 style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{item.subject}</h4>
                  <span className={`badge ${item.warning ? 'warning' : 'success'}`} style={{ marginTop: '0.25rem', display: 'inline-block' }}>{item.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

const HODDashboard = ({ user }) => (
  <>
    <div className="grid-3">
      <div className="card hoverable flex-align glass-panel" style={{ gap: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
          <Building size={28} />
        </div>
        <div>
          <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Total Departments</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>6</h3>
        </div>
      </div>
      
      <div className="card hoverable flex-align glass-panel" style={{ gap: '1.5rem', borderLeft: '4px solid #166534' }}>
        <div style={{ background: '#DCFCE7', padding: '1rem', borderRadius: '50%', color: '#15803D' }}>
          <Users size={28} />
        </div>
        <div>
          <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Total Students / Teachers</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>1.2k / 84</h3>
        </div>
      </div>

      <div className="card hoverable flex-align glass-panel" style={{ gap: '1.5rem', borderLeft: '4px solid #A16207' }}>
        <div style={{ background: '#FEF9C3', padding: '1rem', borderRadius: '50%', color: '#A16207' }}>
          <FilePieChart size={28} />
        </div>
        <div>
          <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Dept Avg Attendance</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>91.5%</h3>
        </div>
      </div>
    </div>
    
    <div className="card glass-panel flex-align">
       <div style={{ padding: '2rem', textAlign: 'center', width: '100%', color: 'var(--text-muted)' }}>
          <Building size={48} style={{ opacity: 0.5, marginBottom: '1rem', margin: '0 auto' }} />
          <h3>Department Overview</h3>
          <p>Administrative controls and full reporting graphs will be available here.</p>
       </div>
    </div>
  </>
);

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const getFirstName = (name) => name ? name.split(' ')[0] : 'User';

  return (
    <div className="animate-slide-up">
      <h1 className="page-title">
        Welcome back, <span className="premium-gradient-text">{getFirstName(user?.name)}</span> 👋
      </h1>
      <p className="page-subtitle">
        Here is what happening in your {user?.role === 'hod' ? 'department' : 'academic life'} today.
      </p>

      {user?.role === 'student' && <StudentDashboard user={user} navigate={navigate} />}
      {user?.role === 'teacher' && <TeacherDashboard user={user} navigate={navigate} />}
      {user?.role === 'hod' && <HODDashboard user={user} />}
      
      {/* Fallback for safety */
      !user && <StudentDashboard user={user} navigate={navigate} />}
    </div>
  );
}

export default Dashboard;
