import React, { useState, useEffect } from 'react';
import { Mail, GraduationCap, MapPin, Edit3, Settings, Shield, Edit2, Check, Users, Search, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile state (works for all roles)
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    course: user?.departmentName || (user?.role === 'TEACHER' ? 'Faculty' : 'Computer Science'),
    year: user?.role === 'STUDENT' ? `Semester ${user?.semester || 1}` : user?.role,
    location: 'Campus Area'
  });

  const [studentAcademics, setStudentAcademics] = useState({
    cgpa: '0.0',
    credits: '0'
  });

  // Teacher functionality state
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSem, setSelectedSem] = useState('1');
  const [studentsList, setStudentsList] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [saveLoadingId, setSaveLoadingId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (user?.role === 'STUDENT') {
      const fetchStudentData = async () => {
        const token = localStorage.getItem('campusai_token');
        try {
          const res = await fetch('http://127.0.0.1:8001/api/auth/profile/', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setStudentAcademics({ cgpa: data.cgpa || '0.0', credits: data.credits || '0' });
          }
        } catch(e) {}
      };
      fetchStudentData();
    } else if (user?.role === 'TEACHER' || user?.role === 'HOD') {
      const token = localStorage.getItem('campusai_token');
      fetch('http://127.0.0.1:8001/api/academics/departments/', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setDepartments(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  const fetchStudents = async () => {
    if (!selectedDept || !selectedSem) return;
    setIsLoadingStudents(true);
    const token = localStorage.getItem('campusai_token');
    try {
      const res = await fetch(`http://127.0.0.1:8001/api/auth/students/?department=${selectedDept}&semester=${selectedSem}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setStudentsList(await res.json());
      }
    } catch (e) { console.error(e); } finally { setIsLoadingStudents(false); }
  };

  const handleInlineChange = (id, field, value) => {
    setStudentsList(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const saveStudentAcademics = async (student) => {
    setSaveLoadingId(student.id);
    const token = localStorage.getItem('campusai_token');
    try {
      const res = await fetch(`http://127.0.0.1:8001/api/auth/students/${student.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cgpa: student.cgpa, credits: student.credits })
      });
      if (res.ok) {
        setToastMsg(`Saved successfully for ${student.name}`);
        setTimeout(() => setToastMsg(''), 3000);
      } else {
        setToastMsg(`Error saving ${student.name}`);
        setTimeout(() => setToastMsg(''), 3000);
      }
    } catch(e) {} finally { setSaveLoadingId(null); }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(prev => ({...prev, name: user?.name || prev.name, email: user?.email || prev.email}));
    setIsEditing(false);
  };

  return (
    <div className="animate-slide-up">
      <h1 className="page-title">{user?.role === 'STUDENT' ? 'Student Profile' : 'Teacher Profile'}</h1>

      <div className="grid-2">
        <div className="card">
          <div className="flex-between">
            <h2 className="card-title">Personal Details</h2>
            <button onClick={() => setIsEditing(!isEditing)} className="flex-align text-muted" style={{ background: 'transparent', color: 'var(--primary)' }}>
              <Edit3 size={18} /> {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '2rem 0' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)' }}>
              {(profile.name || 'U').split(' ').filter(n => n.length > 0).map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{profile.name || user?.name || 'User'}</h2>
              <span className={`badge ${user?.role === 'STUDENT' ? 'success' : 'warning'}`} style={{ marginTop: '0.5rem', display: 'inline-block' }}>
                {user?.role === 'TEACHER' ? 'Faculty / Teacher' : user?.role === 'HOD' ? 'Head of Department' : 'Active Student'}
              </span>
            </div>
          </div>

          {!isEditing ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="flex-align">
                <Mail size={18} className="text-muted" />
                <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{profile.email}</span>
              </div>
              <div className="flex-align">
                <GraduationCap size={18} className="text-muted" />
                <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{profile.course} — {profile.year}</span>
              </div>
              <div className="flex-align">
                <MapPin size={18} className="text-muted" />
                <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{profile.location}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Full Name (Cannot be changed)</label>
                <input className="input" value={profile.name} disabled style={{ backgroundColor: '#F1F5F9', color: '#94A3B8', cursor: 'not-allowed' }} title="Contact admin to change name" />
              </div>
              <div>
                <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Email (Cannot be changed)</label>
                <input className="input" value={profile.email} disabled style={{ backgroundColor: '#F1F5F9', color: '#94A3B8', cursor: 'not-allowed' }} />
              </div>
              <div>
                <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Course / Department</label>
                <input className="input" value={profile.course} onChange={e => setProfile({...profile, course: e.target.value})} disabled={user?.role === 'STUDENT'} />
              </div>
              <div>
                <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>Location</label>
                <input className="input" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} />
              </div>
              <button type="submit" className="btn" style={{ marginTop: '0.5rem' }}>Save Changes</button>
            </form>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {user?.role === 'STUDENT' ? (
            <div className="card" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)', color: 'white', border: 'none' }}>
              <h2 className="card-title" style={{ color: 'white' }}>Academic Snapshot</h2>
              <div className="flex-between" style={{ marginTop: '1.5rem' }}>
                <div>
                  <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Current CGPA</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>{studentAcademics.cgpa}</h3>
                </div>
                <div>
                  <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Avg Attendance</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>Live Data</h3>
                </div>
                <div>
                  <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Credits</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>{studentAcademics.credits}</h3>
                </div>
              </div>
              <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', opacity: 0.7 }}>* CGPA and Credits are officially managed by your lecturers.</p>
            </div>
          ) : (
            <div className="card" style={{ border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="flex-align text-primary" style={{ gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Users size={20} /> <h2 className="card-title" style={{ margin: 0, color: 'var(--primary)' }}>Academic Access</h2>
              </div>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>You have authorized access to modify student academic records.</p>
            </div>
          )}

          <div className="card">
            <h2 className="card-title">Preferences</h2>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <div className="flex-between text-muted" style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px' }}>
                <span className="flex-align"><Settings size={18} /> Account Settings</span>
                <span style={{ cursor: 'pointer' }}>➔</span>
              </div>
              <div className="flex-between text-muted" style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px' }}>
                <span className="flex-align"><Shield size={18} /> Privacy & Security</span>
                <span style={{ cursor: 'pointer' }}>➔</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {(user?.role === 'TEACHER' || user?.role === 'HOD') && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2 className="card-title">Student Records Management</h2>
          <div className="flex-align" style={{ gap: '1rem', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Department</label>
              <select className="input" value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
                <option value="">Select Department...</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Semester / Year</label>
              <select className="input" value={selectedSem} onChange={e => setSelectedSem(e.target.value)}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
            <button onClick={fetchStudents} disabled={!selectedDept} className="btn flex-align" style={{ alignSelf: 'flex-end', height: '42px' }}>
              {isLoadingStudents ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} 
              Load Students
            </button>
          </div>

          {toastMsg && (
            <div style={{ padding: '0.75rem', background: '#DCFCE7', color: '#166534', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {toastMsg}
            </div>
          )}

          {studentsList.length > 0 ? (
            <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>Student Name</th>
                    <th style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>Email Address</th>
                    <th style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>CGPA</th>
                    <th style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>Credits</th>
                    <th style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsList.map(st => (
                    <tr key={st.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{st.name}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{st.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <input type="number" step="0.01" value={st.cgpa} onChange={e => handleInlineChange(st.id, 'cgpa', e.target.value)} className="input" style={{ width: '80px', padding: '0.4rem', border: '1px solid #CBD5E1' }} />
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <input type="number" value={st.credits} onChange={e => handleInlineChange(st.id, 'credits', e.target.value)} className="input" style={{ width: '80px', padding: '0.4rem', border: '1px solid #CBD5E1' }} />
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <button onClick={() => saveStudentAcademics(st)} disabled={saveLoadingId === st.id} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                          {saveLoadingId === st.id ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '3rem 0', textAlign: 'center', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1', color: '#64748B' }}>
              Select parameters and click Load Students to view records
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
