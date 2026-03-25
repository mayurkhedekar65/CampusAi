import React, { useState, useEffect } from 'react';
import { Bell, BellOff, CalendarPlus, Check, Trash2, BookOpen, Calendar, X, Loader2, AlertTriangle, Clock, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API = 'http://127.0.0.1:8001/api';
const token = () => localStorage.getItem('campusai_token');
const authFetch = (url, opts = {}) => fetch(url, {
  ...opts,
  headers: { 'Authorization': `Bearer ${token()}`, 'Content-Type': 'application/json', ...opts.headers }
});

const TYPE_CONFIG = {
  academic: { label: '📚 Academic', bg: '#EEF2FF', border: '#C7D2FE', text: '#4F46E5' },
  alert: { label: '🔴 Alert', bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' },
  reminder: { label: '⏰ Reminder', bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' },
};

function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Personal reminders (local only, students can create)
  const [reminders, setReminders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('campusai_reminders') || '[]'); } catch { return []; }
  });
  const [newReminder, setNewReminder] = useState('');

  // HOD/Teacher create panel
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', notification_type: 'academic', target_semester: '', file: null });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetchNotifs = async () => {
      setLoading(true);
      try {
        const res = await authFetch(`${API}/notifications/`);
        if (res.ok) {
          const data = await res.json();
          const notifs = Array.isArray(data) ? data : [];
          setNotifications(notifs);

          if (user?.role === 'STUDENT') {
            const stored = JSON.parse(localStorage.getItem('campusai_reminders') || '[]');
            const newReminders = [];
            notifs.forEach(n => {
              if (n.title.toLowerCase().includes('assignment') || n.description.toLowerCase().includes('assignment') || n.notification_type === 'reminder') {
                if (!stored.find(r => r.notif_id === n.id)) {
                  newReminders.push({ id: Date.now() + Math.random(), text: `Task: ${n.title}`, done: false, date: new Date(n.created_at || Date.now()).toLocaleDateString(), notif_id: n.id });
                }
              }
            });
            if (newReminders.length > 0) {
              setReminders(prev => {
                const updated = [...newReminders, ...prev];
                localStorage.setItem('campusai_reminders', JSON.stringify(updated));
                return updated;
              });
            }
          }
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchNotifs();
  }, [user]);

  // Persist reminders
  useEffect(() => {
    localStorage.setItem('campusai_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = (e) => {
    e.preventDefault();
    if (!newReminder.trim()) return;
    setReminders([{ id: Date.now(), text: newReminder, done: false, date: new Date().toLocaleDateString() }, ...reminders]);
    setNewReminder('');
  };

  const toggleReminder = (id) => setReminders(prev => prev.map(r => r.id === id ? { ...r, done: !r.done } : r));
  const deleteReminder = (id) => setReminders(prev => prev.filter(r => r.id !== id));

  const deleteNotif = async (id) => {
    try {
      await authFetch(`${API}/notifications/${id}/`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (e) { console.error(e); }
  };

  const sendNotif = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setSending(true);
    try {
      let res;
      if (form.file) {
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('description', form.description);
        formData.append('notification_type', form.notification_type);
        if (form.target_semester) formData.append('target_semester', form.target_semester);
        formData.append('file', form.file);

        res = await fetch(`${API}/notifications/`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token()}` },
          body: formData
        });
      } else {
        res = await authFetch(`${API}/notifications/`, {
          method: 'POST',
          body: JSON.stringify({ title: form.title, description: form.description, notification_type: form.notification_type, target_semester: form.target_semester || null })
        });
      }

      if (res.ok) {
        const n = await res.json();
        setNotifications([n, ...notifications]);
        setForm({ title: '', description: '', notification_type: 'academic', target_semester: '', file: null });
        setShowCreate(false);
        setToast('Notification sent!');
      } else {
        setToast('Failed to send.');
      }
    } catch (e) { setToast('Network error.'); }
    setSending(false);
    setTimeout(() => setToast(''), 4000);
  };

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.notification_type === filter);
  const isStaff = user?.role === 'TEACHER' || user?.role === 'HOD';

  return (
    <div className="animate-slide-up">
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Notifications & Reminders</h1>
        <div className="flex-align" style={{ gap: '0.75rem' }}>
          {isStaff && (
            <button className="btn flex-align" style={{ gap: '0.5rem', padding: '0.65rem 1.25rem' }} onClick={() => setShowCreate(!showCreate)}>
              <Bell size={18} /> {showCreate ? 'Cancel' : 'Create Notification'}
            </button>
          )}
        </div>
      </div>

      {toast && (
        <div style={{ background: toast.includes('sent') ? '#DCFCE7' : '#FEE2E2', color: toast.includes('sent') ? '#166534' : '#991B1B', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {toast}
        </div>
      )}

      {/* HOD/Teacher Create Panel */}
      {isStaff && showCreate && (
        <div className="card glass-panel" style={{ marginBottom: '2rem', border: '2px solid var(--primary)', borderRadius: '12px' }}>
          <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>📢 Send Official Notification</h2>
          <form onSubmit={sendNotif} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Title</label>
              <input className="input" placeholder="e.g. Assignment Deadline Alert" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Message</label>
              <textarea className="input" rows={3} placeholder="Write your message..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} required style={{ resize: 'vertical' }} />
            </div>
            <div className="input-group">
              <label>Type</label>
              <select className="input" value={form.notification_type} onChange={e => setForm({...form, notification_type: e.target.value})} style={{ appearance: 'auto' }}>
                <option value="academic">📚 Academic</option>
                <option value="alert">🔴 Alert</option>
                <option value="reminder">⏰ Reminder</option>
              </select>
            </div>
            <div className="input-group">
              <label>Target (optional)</label>
              <select className="input" value={form.target_semester} onChange={e => setForm({...form, target_semester: e.target.value})} style={{ appearance: 'auto' }}>
                <option value="">All Students in Department</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s} only</option>)}
              </select>
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Attachment (PDF/Image) - Optional</label>
              <input type="file" className="input" onChange={e => setForm({...form, file: e.target.files[0]})} accept=".pdf,image/*" style={{ background: 'white' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" className="btn" style={{ background: '#F1F5F9', color: 'var(--text-main)' }} onClick={() => setShowCreate(false)}>Cancel</button>
              <button type="submit" className="btn flex-align" disabled={sending} style={{ gap: '0.5rem' }}>
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Bell size={18} />} Send Now
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid-2" style={{ alignItems: 'flex-start', gap: '2rem' }}>
        {/* Official Notifications Column */}
        <div>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontWeight: 700 }}>Official Notifications</h2>
            <select className="input" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 'auto', appearance: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
              <option value="all">All Types</option>
              <option value="academic">Academic</option>
              <option value="alert">Alerts</option>
              <option value="reminder">Reminders</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}><Loader2 size={28} className="animate-spin" style={{ color: 'var(--primary)' }} /></div>
            ) : filtered.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem', border: '1px dashed #CBD5E1' }}>
                <BellOff size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                <p className="text-muted">No notifications yet.</p>
                {user?.role === 'STUDENT' && <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Your HOD or Teacher will send announcements here.</p>}
              </div>
            ) : filtered.map(n => {
              const cfg = TYPE_CONFIG[n.notification_type] || TYPE_CONFIG.academic;
              return (
                <div key={n.id} style={{ padding: '1.25rem', borderRadius: '12px', background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: cfg.text, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cfg.label}</span>
                    {isStaff && n.created_by === user?.id && (
                      <button onClick={() => deleteNotif(n.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><Trash2 size={15} /></button>
                    )}
                  </div>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.4rem', fontSize: '1rem' }}>{n.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{n.description}</p>
                  
                  {n.file && (
                    <a href={n.file.startsWith('http') ? n.file : `http://127.0.0.1:8001${n.file}`} target="_blank" rel="noopener noreferrer" className="btn flex-align" style={{ marginTop: '0.75rem', padding: '0.4rem 0.8rem', background: 'white', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem', width: 'fit-content', textDecoration: 'none', gap: '0.5rem' }}>
                      <FileText size={14} color="var(--primary)" /> View Attachment
                    </a>
                  )}

                  <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#94A3B8', display: 'flex', gap: '1rem' }}>
                    <span>From: {n.creator_name || 'Staff'}</span>
                    <span>{n.target_semester ? `→ Sem ${n.target_semester}` : '→ All'}</span>
                    <span>{new Date(n.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Personal Reminders Column */}
        <div>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>My Personal Reminders</h2>
          <form onSubmit={addReminder} className="flex-align" style={{ gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input
              className="input"
              placeholder="Add a reminder..."
              value={newReminder}
              onChange={e => setNewReminder(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn" style={{ padding: '0.6rem 1rem', whiteSpace: 'nowrap' }}>+ Add</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {reminders.length === 0 && (
              <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>No reminders yet. Add one above!</p>
            )}
            {reminders.map(r => (
              <div key={r.id} style={{ padding: '1rem', borderRadius: '10px', background: r.done ? '#F8FAFC' : 'white', border: '1px solid var(--border-color)', opacity: r.done ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button onClick={() => toggleReminder(r.id)} style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--primary)', background: r.done ? 'var(--primary)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white' }}>
                  {r.done && <Check size={14} />}
                </button>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, textDecoration: r.done ? 'line-through' : 'none', fontSize: '0.95rem' }}>{r.text}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.date}</p>
                </div>
                <button onClick={() => deleteReminder(r.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
