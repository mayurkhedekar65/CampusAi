import React from 'react';
import { BookOpen, CalendarCheck, Clock, CheckCircle, Upload, PenBox, ChevronRight, Users, PlayCircle, Building, FilePieChart, BookMarked, UserCheck, Sliders, Bell, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = ({ user, navigate, attendancePercentage }) => (
  <>
    <div className="grid-3">
      <div className="card hoverable flex-align glass-panel" style={{ gap: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
          <CalendarCheck size={28} />
        </div>
        <div>
          <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Overall Attendance</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{attendancePercentage !== null ? `${attendancePercentage}%` : 'Loading...'}</h3>
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

const TeacherDashboard = ({ user, navigate, token }) => {
  const [stats, setStats] = React.useState({
    loading: true,
    assigned_subjects: 0,
    active_sessions: 0,
    todays_sessions: 0,
    subject_overview: []
  });

  React.useEffect(() => {
    if (token) {
      fetch('http://127.0.0.1:8001/api/attendance/teacher_summary/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setStats({
          loading: false,
          assigned_subjects: data.assigned_subjects || 0,
          active_sessions: data.active_sessions || 0,
          todays_sessions: data.todays_sessions || 0,
          subject_overview: data.subject_overview || []
        });
      })
      .catch(err => {
        console.error('Failed to fetch teacher summary:', err);
        setStats(prev => ({ ...prev, loading: false }));
      });
    }
  }, [token]);

  return (
    <>
      <div className="grid-3">
        <div className="card hoverable flex-align glass-panel" style={{ gap: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
            <BookOpen size={28} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Assigned Subjects</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.loading ? '...' : stats.assigned_subjects}</h3>
          </div>
        </div>
        
        <div className="card hoverable flex-align glass-panel" style={{ gap: '1.5rem', borderLeft: '4px solid #166534' }}>
          <div style={{ background: '#DCFCE7', padding: '1rem', borderRadius: '50%', color: '#15803D' }}>
            <CalendarCheck size={28} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Active Sessions</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.loading ? '...' : stats.active_sessions}</h3>
          </div>
        </div>

        <div className="card hoverable flex-align glass-panel" style={{ gap: '1.5rem', borderLeft: '4px solid #A16207' }}>
          <div style={{ background: '#FEF9C3', padding: '1rem', borderRadius: '50%', color: '#A16207' }}>
            <Clock size={28} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Today's Sessions</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.loading ? '...' : stats.todays_sessions}</h3>
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
          <h2 className="card-title">Subject-wise Overview</h2>
          {stats.loading ? (
            <p className="text-muted flex-align" style={{ justifyContent: 'center', height: '100px' }}>Loading overview...</p>
          ) : stats.subject_overview.length === 0 ? (
            <p className="text-muted flex-align" style={{ justifyContent: 'center', height: '100px', fontSize: '0.9rem' }}>No subjects assigned to you yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.subject_overview.map((sub, i, arr) => (
                <div key={i} className="flex-between" style={{ paddingBottom: '1rem', borderBottom: i !== arr.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <div className="flex-align">
                    <div style={{ width: '36px', height: '36px', background: 'var(--surface-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--primary)' }}>
                      {sub.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{sub.name}</h4>
                      <span className="text-muted" style={{ fontSize: '0.8rem' }}>Total Sessions: {sub.total_sessions}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${sub.attendance_percentage >= 75 ? 'success' : 'warning'}`} style={{ fontWeight: 700, fontSize: '0.9rem' }}>{sub.attendance_percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const HODDashboard = ({ user, navigate, token }) => {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!token) return;
    fetch('http://127.0.0.1:8001/api/academics/hod_dashboard/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.ok ? res.json() : null)
    .then(data => { setStats(data); setLoading(false); })
    .catch(() => setLoading(false));
  }, [token]);

  const cards = stats ? [
    { label: 'Total Subjects', value: stats.total_subjects, icon: <BookOpen size={28} />, color: 'var(--primary-light)', iconColor: 'var(--primary)', border: 'var(--primary)' },
    { label: 'Assigned Subjects', value: `${stats.assigned_subjects} / ${stats.total_subjects}`, icon: <BookMarked size={28} />, color: '#DCFCE7', iconColor: '#16A34A', border: '#16A34A' },
    { label: 'Teachers in Dept', value: stats.total_teachers, icon: <UserCheck size={28} />, color: '#FEF9C3', iconColor: '#B45309', border: '#B45309' },
    { label: 'Students in Dept', value: stats.total_students, icon: <Users size={28} />, color: '#F5F3FF', iconColor: '#7C3AED', border: '#7C3AED' },
  ] : [];

  return (
    <>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}><Loader2 size={36} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} /></div>
      ) : !stats ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', border: '2px dashed #CBD5E1' }}>
          <AlertCircle size={40} style={{ margin: '0 auto 1rem', color: '#DC2626' }} />
          <h3>Department Not Set</h3>
          <p className="text-muted" style={{ marginTop: '0.5rem' }}>Your account is not linked to a department. Please contact admin or re-register with your department selected.</p>
        </div>
      ) : (
        <>
          {/* Live Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {cards.map(c => (
              <div key={c.label} className="card hoverable flex-align glass-panel" style={{ gap: '1.25rem', borderLeft: `4px solid ${c.border}` }}>
                <div style={{ background: c.color, padding: '0.875rem', borderRadius: '50%', color: c.iconColor, flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.25rem' }}>{c.label}</p>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{c.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* HOD Quick Actions + Dept Info */}
          <div className="grid-2">
            <div className="card glass-panel">
              <h2 className="card-title">HOD Quick Actions</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <button className="flex-align text-main" onClick={() => navigate('/app/hod-panel?tab=subjects')}
                  style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius)', background: 'linear-gradient(135deg, var(--primary) 0%, #818CF8 100%)', color: 'white', border: 'none', justifyContent: 'space-between', transition: 'transform 0.2s', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                  <div className="flex-align"><BookOpen size={20} color="white" /><span style={{ fontWeight: 700 }}>Assign Subjects to Teachers</span></div>
                  <ChevronRight size={18} color="white" />
                </button>
                <button className="flex-align text-main" onClick={() => navigate('/app/hod-panel')}
                  style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', justifyContent: 'space-between', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateX(5px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'none'; }}>
                  <div className="flex-align"><Sliders size={20} color="var(--primary)" /><span style={{ fontWeight: 600 }}>Open HOD Control Panel</span></div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </button>
                <button className="flex-align text-main" onClick={() => navigate('/app/notifications')}
                  style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', justifyContent: 'space-between', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#A16207'; e.currentTarget.style.transform = 'translateX(5px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'none'; }}>
                  <div className="flex-align"><Bell size={20} color="#B45309" /><span style={{ fontWeight: 600 }}>Send Notification to Students</span></div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </button>
              </div>
            </div>

            <div className="card glass-panel">
              <h2 className="card-title">Department Snapshot</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                <div style={{ padding: '1rem', background: '#EEF2FF', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: '#4F46E5' }}>Department</span>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{stats.department}</span>
                </div>
                <div style={{ padding: '1rem', background: '#F0FDF4', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: '#15803D' }}>Subject Coverage</span>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: stats.unassigned_subjects > 0 ? '#B45309' : '#15803D' }}>
                    {stats.assigned_subjects}/{stats.total_subjects} Assigned
                  </span>
                </div>
                <div style={{ padding: '1rem', background: '#FFFBEB', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: '#B45309' }}>Unassigned Subjects</span>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: stats.unassigned_subjects > 0 ? '#DC2626' : '#15803D' }}>
                    {stats.unassigned_subjects > 0 ? `⚠ ${stats.unassigned_subjects} Pending` : '✓ All Assigned'}
                  </span>
                </div>
                {stats.teachers && stats.teachers.length > 0 && (
                  <div style={{ padding: '1rem', background: '#F5F3FF', borderRadius: '10px' }}>
                    <p style={{ fontWeight: 600, color: '#7C3AED', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Faculty Members</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {stats.teachers.slice(0, 5).map(t => (
                        <span key={t.id} style={{ padding: '0.25rem 0.6rem', background: 'white', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid #DDD6FE' }}>{t.name}</span>
                      ))}
                      {stats.teachers.length > 5 && <span style={{ padding: '0.25rem 0.6rem', background: '#7C3AED', color: 'white', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>+{stats.teachers.length - 5} more</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [attendancePercentage, setAttendancePercentage] = React.useState(null);
  
  React.useEffect(() => {
    if (user?.role?.toLowerCase() === 'student' && token) {
      fetch('http://127.0.0.1:8001/api/attendance/summary/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.overall_percentage !== undefined) {
          setAttendancePercentage(data.overall_percentage);
        } else {
          setAttendancePercentage(0);
        }
      })
      .catch(err => {
        console.error('Failed to fetch attendance summary:', err);
        setAttendancePercentage(0);
      });
    }
  }, [user, token]);
  
  const getFirstName = (name) => name ? name.split(' ')[0] : 'User';

  return (
    <div className="animate-slide-up">
      <h1 className="page-title">
        Welcome back, <span className="premium-gradient-text">{getFirstName(user?.name)}</span> 👋
      </h1>
      <p className="page-subtitle">
        Here is what happening in your {user?.role?.toLowerCase() === 'hod' ? 'department' : 'academic life'} today.
      </p>

      {user?.role?.toLowerCase() === 'student' && <StudentDashboard user={user} navigate={navigate} attendancePercentage={attendancePercentage} />}
      {user?.role?.toLowerCase() === 'teacher' && <TeacherDashboard user={user} navigate={navigate} token={token} />}
      {user?.role?.toLowerCase() === 'hod' && <HODDashboard user={user} navigate={navigate} token={token} />}
      
      {/* Fallback for safety */
      !user && <StudentDashboard user={user} navigate={navigate} attendancePercentage={0} />}
    </div>
  );
}

export default Dashboard;
