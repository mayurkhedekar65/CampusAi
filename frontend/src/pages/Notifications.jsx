import React, { useState } from 'react';
import { Bell, BellOff, CalendarPlus, Check, Trash2 } from 'lucide-react';

const initialReminders = [
  { id: 1, text: 'Submit Machine Learning Assignment 3', type: 'assignment', date: 'Tomorrow, 11:59 PM', completed: false },
  { id: 2, text: 'Database Systems Midterm Exam', type: 'exam', date: '25 Mar 2026', completed: false },
  { id: 3, text: 'Tech Club Meeting', type: 'event', date: 'Today, 5:00 PM', completed: false },
  { id: 4, text: 'Pay Semester Fee', type: 'reminder', date: '30 Mar 2026', completed: true },
];

function Notifications() {
  const [reminders, setReminders] = useState(initialReminders);
  const [newReminder, setNewReminder] = useState('');

  const toggleComplete = (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const addReminder = (e) => {
    e.preventDefault();
    if (!newReminder.trim()) return;

    const r = {
      id: Date.now(),
      text: newReminder,
      type: 'reminder',
      date: 'Pending',
      completed: false
    };
    setReminders([r, ...reminders]);
    setNewReminder('');
  };

  return (
    <div className="animate-slide-up">
      <div className="flex-between">
        <h1 className="page-title">Reminders & Notifications</h1>
        <button className="btn flex-align" style={{ width: 'auto', padding: '0.65rem 1.25rem', background: '#F8FAFC', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
          <BellOff size={18} />
          Mute All
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem', background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
        <form onSubmit={addReminder} className="flex-align">
          <CalendarPlus size={24} className="text-muted" style={{ color: 'var(--primary)' }} />
          <input 
            type="text" 
            placeholder="Add new task, assignment, or event..." 
            value={newReminder}
            onChange={(e) => setNewReminder(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '1rem', padding: '0.5rem' }} 
          />
          <button type="submit" className="btn" style={{ width: 'auto', padding: '0.65rem 1.5rem' }}>Add</button>
        </form>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 className="card-title">Upcoming Tasks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {reminders.filter(r => !r.completed).length === 0 && <p className="text-muted text-center">All caught up! 🎉</p>}
            {reminders.filter(r => !r.completed).map(r => (
              <div key={r.id} className="flex-between" style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#F8FAFC' }}>
                <div className="flex-align">
                  <button onClick={() => toggleComplete(r.id)} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--primary)', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 500 }}>{r.text}</h4>
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>{r.date} • {r.type}</span>
                  </div>
                </div>
                <button onClick={() => deleteReminder(r.id)} style={{ color: 'var(--text-muted)', background: 'transparent' }}><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Completed</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {reminders.filter(r => r.completed).length === 0 && <p className="text-muted text-center">No completed tasks yet.</p>}
            {reminders.filter(r => r.completed).map(r => (
              <div key={r.id} className="flex-between" style={{ padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '8px', opacity: 0.7 }}>
                <div className="flex-align">
                  <button onClick={() => toggleComplete(r.id)} style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Check size={14} />
                  </button>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 500, textDecoration: 'line-through' }}>{r.text}</h4>
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>{r.date}</span>
                  </div>
                </div>
                <button onClick={() => deleteReminder(r.id)} style={{ color: 'var(--text-muted)', background: 'transparent' }}><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
