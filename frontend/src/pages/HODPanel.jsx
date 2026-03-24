import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Users, BookOpen, BarChart2, Bell, Database, 
  ChevronDown, Loader2, Check, X, AlertCircle,
  UserCheck, BookMarked, PlusCircle, Trash2, Send, UserPlus
} from 'lucide-react';

const API = 'http://127.0.0.1:8001/api';

const token = () => localStorage.getItem('campusai_token');

const authFetch = (url, opts = {}) => fetch(url, {
  ...opts,
  headers: { 'Authorization': `Bearer ${token()}`, 'Content-Type': 'application/json', ...opts.headers }
});

// ─── Tab: Overview ───────────────────────────────────────────────────────────
function OverviewTab({ stats, loading }) {
  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}><Loader2 size={40} className="animate-spin" style={{ margin: '0 auto', color: 'var(--primary)' }} /></div>;
  if (!stats) return <p className="text-muted text-center">Could not load department data. Ensure you are assigned to a department.</p>;

  const cards = [
    { label: 'Total Subjects', value: stats.total_subjects, icon: <BookOpen size={28} />, color: '#EEF2FF', iconColor: 'var(--primary)' },
    { label: 'Assigned Subjects', value: stats.assigned_subjects, icon: <BookMarked size={28} />, color: '#DCFCE7', iconColor: '#16A34A' },
    { label: 'Unassigned', value: stats.unassigned_subjects, icon: <AlertCircle size={28} />, color: '#FEF9C3', iconColor: '#B45309' },
    { label: 'Teachers', value: stats.total_teachers, icon: <UserCheck size={28} />, color: '#F0FDF4', iconColor: '#15803D' },
    { label: 'Students', value: stats.total_students, icon: <Users size={28} />, color: '#F5F3FF', iconColor: '#7C3AED' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {cards.map(c => (
          <div key={c.label} className="card glass-panel" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
            <div style={{ background: c.color, color: c.iconColor, width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>{c.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{c.value}</div>
            <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="card-title">Registered Teachers</h2>
        {stats.teachers && stats.teachers.length > 0 ? (
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600 }}>#</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600 }}>Email</th>
                </tr>
              </thead>
              <tbody>
                {stats.teachers.map((t, i) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{t.name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '8px', color: 'var(--text-muted)', marginTop: '1rem', border: '1px dashed #CBD5E1' }}>
            <UserPlus size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No teachers are registered in your department yet.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Teachers will appear here once they register and are assigned to this department.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Subject Assignment ─────────────────────────────────────────────────
function SubjectsTab({ teachers }) {
  const [subjectName, setSubjectName] = useState('');
  const [semester, setSemester] = useState('1');
  const [teacherId, setTeacherId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [toast, setToast] = useState({ msg: '', ok: true });

  const [subjects, setSubjects] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [filterSem, setFilterSem] = useState('');
  const [deleting, setDeleting] = useState({});

  // Load all subjects in dept
  const loadSubjects = async () => {
    setLoadingSubs(true);
    try {
      const url = filterSem ? `${API}/academics/hod_subjects/?semester=${filterSem}` : `${API}/academics/hod_subjects/`;
      const res = await authFetch(url);
      if (res.ok) setSubjects(await res.json());
    } catch (e) { console.error(e); }
    setLoadingSubs(false);
  };

  useEffect(() => { loadSubjects(); }, [filterSem]);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg: '', ok: true }), 4000);
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!subjectName.trim()) { showToast('Enter a subject name', false); return; }
    setAssigning(true);
    try {
      const res = await authFetch(`${API}/academics/hod_assign/`, {
        method: 'POST',
        body: JSON.stringify({
          subject_name: subjectName.trim(),
          semester: parseInt(semester),
          teacher_id: teacherId || null
        })
      });
      const data = await res.json();
      if (res.ok) {
        const teacher = teachers.find(t => t.id === parseInt(teacherId));
        showToast(
          data.created
            ? `✅ Subject "${data.name}" created & ${teacher ? `assigned to ${teacher.name}` : 'saved unassigned'}`
            : `✅ Subject "${data.name}" updated — ${teacher ? `assigned to ${teacher.name}` : 'unassigned'}`,
          true
        );
        setSubjectName('');
        setTeacherId('');
        await loadSubjects();
      } else {
        showToast('Error: ' + JSON.stringify(data), false);
      }
    } catch (e) { showToast('Network error', false); }
    setAssigning(false);
  };

  const handleDelete = async (subjectId, name) => {
    if (!window.confirm(`Delete subject "${name}"? This also removes it from the teacher.`)) return;
    setDeleting(prev => ({ ...prev, [subjectId]: true }));
    try {
      const res = await authFetch(`${API}/academics/hod_subjects/`, {
        method: 'DELETE',
        body: JSON.stringify({ subject_id: subjectId })
      });
      if (res.ok) {
        setSubjects(prev => prev.filter(s => s.id !== subjectId));
        showToast(`Deleted "${name}"`, true);
      }
    } catch (e) { console.error(e); }
    setDeleting(prev => ({ ...prev, [subjectId]: false }));
  };

  return (
    <div>
      {/* Assign Form */}
      <div className="card glass-panel" style={{ marginBottom: '2rem', border: '2px solid var(--primary)' }}>
        <h2 className="card-title" style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>
          📚 Assign Subject to Teacher
        </h2>

        {toast.msg && (
          <div style={{ background: toast.ok ? '#DCFCE7' : '#FEE2E2', color: toast.ok ? '#166534' : '#991B1B', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {toast.msg}
          </div>
        )}

        <form onSubmit={handleAssign} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label>Subject Name <span style={{ color: '#DC2626' }}>*</span></label>
            <input
              className="input"
              placeholder="e.g. Data Structures, Calculus II, DBMS..."
              value={subjectName}
              onChange={e => setSubjectName(e.target.value)}
              required
              style={{ fontSize: '1rem' }}
            />
            <small className="text-muted" style={{ marginTop: '0.25rem', display: 'block' }}>
              Type any name — subject is auto-created if it doesn't exist
            </small>
          </div>

          <div className="input-group">
            <label>Semester <span style={{ color: '#DC2626' }}>*</span></label>
            <select className="input" value={semester} onChange={e => setSemester(e.target.value)} style={{ appearance: 'auto' }} required>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label>Assign To Teacher</label>
            <select className="input" value={teacherId} onChange={e => setTeacherId(e.target.value)} style={{ appearance: 'auto' }}>
              <option value="">— No Teacher (save for later) —</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" className="btn flex-align" style={{ gap: '0.5rem', width: '100%', justifyContent: 'center', padding: '0.75rem' }} disabled={assigning}>
              {assigning ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
              {assigning ? 'Assigning...' : 'Assign / Update'}
            </button>
          </div>
        </form>
      </div>

      {/* Subjects Table */}
      <div className="card">
        <div className="flex-between" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="card-title" style={{ margin: 0 }}>All Department Subjects</h2>
          <div className="flex-align" style={{ gap: '0.75rem' }}>
            <select className="input" value={filterSem} onChange={e => setFilterSem(e.target.value)} style={{ appearance: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}>
              <option value="">All Semesters</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
        </div>

        {loadingSubs ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}><Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)' }} /></div>
        ) : subjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#F8FAFC', borderRadius: '10px', border: '1px dashed #CBD5E1', color: 'var(--text-muted)' }}>
            <BookOpen size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
            <p>No subjects yet. Use the form above to add your first subject.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '550px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid var(--border-color)' }}>
                  {['Subject Name', 'Semester', 'Assigned Teacher', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subjects.map(sub => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{sub.name}</td>
                    <td style={{ padding: '0.85rem 1rem' }}><span className="badge" style={{ background: '#EEF2FF', color: '#4F46E5' }}>Sem {sub.semester}</span></td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: sub.teacher_name ? 600 : 400, color: sub.teacher_name ? 'var(--text-main)' : 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {sub.teacher_name || '— Unassigned —'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ padding: '0.3rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: sub.teacher_name ? '#DCFCE7' : '#FEF9C3', color: sub.teacher_name ? '#166534' : '#B45309' }}>
                        {sub.teacher_name ? '✓ Assigned' : '⚠ Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <button
                        onClick={() => handleDelete(sub.id, sub.name)}
                        disabled={deleting[sub.id]}
                        style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '6px', padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        {deleting[sub.id] ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── Tab: Notifications ───────────────────────────────────────────────────────
function NotificationsTab() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', notification_type: 'academic', target_semester: '' });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState('');

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API}/notifications/`);
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchNotifs(); }, []);

  const sendNotif = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setSending(true);
    try {
      const payload = { ...form, target_semester: form.target_semester || null };
      const res = await authFetch(`${API}/notifications/`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newN = await res.json();
        setNotifications([newN, ...notifications]);
        setForm({ title: '', description: '', notification_type: 'academic', target_semester: '' });
        setToast('Notification sent to students!');
      } else {
        setToast('Failed to send notification.');
      }
    } catch (e) { setToast('Network error.'); }
    setSending(false);
    setTimeout(() => setToast(''), 4000);
  };

  const deleteNotif = async (id) => {
    try {
      await authFetch(`${API}/notifications/${id}/`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (e) { console.error(e); }
  };

  const typeColor = { academic: { bg: '#EEF2FF', text: '#4F46E5' }, alert: { bg: '#FEE2E2', text: '#DC2626' }, reminder: { bg: '#FEF9C3', text: '#B45309' } };

  return (
    <div className="grid-2" style={{ alignItems: 'flex-start' }}>
      <div className="card">
        <h2 className="card-title">Create Notification</h2>
        {toast && (
          <div style={{ background: toast.includes('sent') ? '#DCFCE7' : '#FEE2E2', color: toast.includes('sent') ? '#166534' : '#991B1B', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {toast}
          </div>
        )}
        <form onSubmit={sendNotif} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div className="input-group">
            <label>Title</label>
            <input className="input" placeholder="e.g. Submission Deadline" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea className="input" rows={4} placeholder="Write your notification message..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} required style={{ resize: 'vertical' }} />
          </div>
          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="input-group">
              <label>Type</label>
              <select className="input" value={form.notification_type} onChange={e => setForm({...form, notification_type: e.target.value})} style={{ appearance: 'auto' }}>
                <option value="academic">📚 Academic</option>
                <option value="alert">🔴 Alert</option>
                <option value="reminder">⏰ Reminder</option>
              </select>
            </div>
            <div className="input-group">
              <label>Target Semester (optional)</label>
              <select className="input" value={form.target_semester} onChange={e => setForm({...form, target_semester: e.target.value})} style={{ appearance: 'auto' }}>
                <option value="">All Students</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn flex-align" style={{ justifyContent: 'center', gap: '0.5rem' }} disabled={sending}>
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            Send to Students
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="card-title">Sent Notifications</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="animate-spin" size={24} style={{ color: 'var(--primary)' }} /></div>
          ) : notifications.length === 0 ? (
            <p className="text-muted text-center">No notifications sent yet.</p>
          ) : notifications.map(n => {
            const c = typeColor[n.notification_type] || typeColor.academic;
            return (
              <div key={n.id} style={{ padding: '1rem', borderRadius: '10px', background: c.bg, border: `1px solid ${c.text}30`, position: 'relative' }}>
                <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: c.text, textTransform: 'uppercase', letterSpacing: '1px' }}>{n.notification_type}</span>
                  <button onClick={() => deleteNotif(n.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><Trash2 size={14} /></button>
                </div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.3rem' }}>{n.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{n.description}</p>
                <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.5rem' }}>
                  {n.target_semester ? `→ Semester ${n.target_semester}` : '→ All Students'} • {new Date(n.created_at).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Student Records ─────────────────────────────────────────────────────
function RecordsTab() {
  const [semester, setSemester] = useState('1');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState({});
  const [toast, setToast] = useState('');

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API}/auth/students/?semester=${semester}`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadStudents(); }, [semester]);

  const saveStudent = async (student) => {
    setSaving(prev => ({ ...prev, [student.id]: true }));
    try {
      const res = await authFetch(`${API}/auth/students/${student.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ cgpa: student.cgpa, credits: student.credits })
      });
      if (res.ok) {
        setToast(`Saved ${student.name}`);
      } else {
        setToast(`Error saving ${student.name}`);
      }
    } catch (e) { setToast('Network error'); }
    setSaving(prev => ({ ...prev, [student.id]: false }));
    setTimeout(() => setToast(''), 3000);
  };

  const handleChange = (id, field, value) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div>
      <div className="flex-align" style={{ gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Select Semester</label>
          <select className="input" value={semester} onChange={e => setSemester(e.target.value)} style={{ width: '200px', appearance: 'auto' }}>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>
        {toast && (
          <div style={{ background: toast.startsWith('Error') || toast.startsWith('Network') ? '#FEE2E2' : '#DCFCE7', color: toast.startsWith('Error') || toast.startsWith('Network') ? '#991B1B' : '#166534', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.9rem', marginTop: '1.25rem' }}>
            {toast}
          </div>
        )}
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <h2 className="card-title" style={{ marginBottom: '1rem' }}>Students — Semester {semester}</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}><Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)' }} /></div>
        ) : students.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: '#F8FAFC', borderRadius: '8px', color: 'var(--text-muted)', border: '1px dashed #CBD5E1' }}>
            No students in Semester {semester} for your department.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '2px solid var(--border-color)' }}>
                {['#', 'Name', 'Email', 'Semester', 'CGPA', 'Credits', 'Save'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((st, i) => (
                <tr key={st.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{st.name}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{st.email}</td>
                  <td style={{ padding: '0.75rem 1rem' }}><span className="badge success">Sem {st.semester}</span></td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <input type="number" step="0.01" min="0" max="10" className="input" style={{ width: '80px', padding: '0.35rem 0.5rem', fontSize: '0.9rem' }}
                      value={st.cgpa || 0} onChange={e => handleChange(st.id, 'cgpa', e.target.value)} />
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <input type="number" min="0" className="input" style={{ width: '80px', padding: '0.35rem 0.5rem', fontSize: '0.9rem' }}
                      value={st.credits || 0} onChange={e => handleChange(st.id, 'credits', e.target.value)} />
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button className="btn" style={{ padding: '0.35rem 0.9rem', fontSize: '0.85rem' }}
                      disabled={saving[st.id]} onClick={() => saveStudent(st)}>
                      {saving[st.id] ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Main HOD Panel ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: <BarChart2 size={18} /> },
  { id: 'subjects', label: 'Subject Assignment', icon: <BookOpen size={18} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { id: 'records', label: 'Student Records', icon: <Database size={18} /> },
];

function HODPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await authFetch(`${API}/academics/hod_dashboard/`);
        if (res.ok) { setStats(await res.json()); }
      } catch (e) { console.error(e); }
      setStatsLoading(false);
    };
    load();
  }, []);

  return (
    <div className="animate-slide-up">
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>HOD Control Panel</h1>
          <p className="text-muted" style={{ marginTop: '0.25rem' }}>
            Department: <strong>{stats?.department || user?.departmentName || '...'}</strong>
          </p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
          HOD / Head of Department
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.25rem', background: 'transparent', border: 'none',
              borderBottom: `3px solid ${activeTab === tab.id ? 'var(--primary)' : 'transparent'}`,
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === tab.id ? 700 : 500, cursor: 'pointer',
              fontSize: '0.9rem', whiteSpace: 'nowrap', marginBottom: '-2px', transition: 'all 0.2s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab stats={stats} loading={statsLoading} />}
      {activeTab === 'subjects' && <SubjectsTab teachers={stats?.all_teachers || stats?.teachers || []} />}
      {activeTab === 'notifications' && <NotificationsTab />}
      {activeTab === 'records' && <RecordsTab />}
    </div>
  );
}

export default HODPanel;
