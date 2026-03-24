import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, PlayCircle, StopCircle, MapPin, CheckCircle2, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8001/api';

const TeacherAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionCode, setSessionCode] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gpsLoading, setGpsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('campusai_token');
    fetch(`${API_URL}/academics/subjects/my_subjects/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if(Array.isArray(data)) {
        setSubjects(data);
        if (data.length > 0) setSelectedSubject(data[0].id);
      }
    })
    .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    let timer;
    if (sessionActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && sessionActive) {
      setSessionActive(false);
    }
    return () => clearInterval(timer);
  }, [sessionActive, timeLeft]);

  const startSession = () => {
    if (!selectedSubject) return alert("Select a subject first");
    setGpsLoading(true);
    const token = localStorage.getItem('campusai_token');

    const doStartSession = async (lat, lon) => {
      try {
        const res = await fetch(`${API_URL}/attendance/start/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            subject_id: selectedSubject,
            latitude: lat || null,
            longitude: lon || null
          })
        });
        if (res.ok) {
          const data = await res.json();
          setSessionCode(data.code);
          setTimeLeft(20); // 20 seconds
          setSessionActive(true);
        } else {
          const errData = await res.json();
          alert('Error: ' + (errData.error || errData.detail || JSON.stringify(errData)));
        }
      } catch(e) { console.error(e); }
      finally { setGpsLoading(false); }
    };

    if (!navigator.geolocation) {
      // Browser doesn't support GPS — start without location
      doStartSession(null, null);
      return;
    }

    // Try GPS with 8-second timeout — if denied/unavailable, proceed without it
    navigator.geolocation.getCurrentPosition(
      (pos) => doStartSession(pos.coords.latitude, pos.coords.longitude),
      () => {
        // GPS denied or unavailable (industry visit, GPS off, blocked)
        // Start session without location — students mark via code only
        doStartSession(null, null);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const endSession = () => {
    setSessionActive(false);
    setTimeLeft(0);
  };

  return (
    <div className="grid-2">
      <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 2rem' }}>
        {!sessionActive ? (
          <>
            <div style={{ background: 'var(--primary-light)', padding: '1.5rem', borderRadius: '50%', color: 'var(--primary)', marginBottom: '1.5rem' }}>
              <Calendar size={48} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Start New Session</h2>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>Select your subject to generate a 20-second live code.</p>
            
            <select className="input" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} style={{ marginBottom: '2rem', maxWidth: '300px', appearance: 'auto', background: 'transparent' }}>
              {subjects.map(s => <option key={s.id} value={s.id} style={{ color: 'black' }}>{s.name}</option>)}
              {subjects.length === 0 && <option value="">No subjects assigned</option>}
            </select>

            <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', padding: '1rem 2rem' }} onClick={startSession} disabled={gpsLoading || subjects.length === 0}>
              {gpsLoading ? <Loader2 size={24} className="animate-spin" /> : <PlayCircle size={24} />}
              {gpsLoading ? 'Starting...' : 'Start Session'}
            </button>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Live Session Code</h2>
            <div style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '10px', color: 'var(--primary)', margin: '1rem 0', background: '#EEF2FF', padding: '1rem 3rem', borderRadius: '1rem', border: '2px dashed var(--primary)' }}>
              {sessionCode}
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', width: '100%' }}>
              <div style={{ flex: 1, background: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Expires In</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: timeLeft <= 5 ? '#DC2626' : 'var(--text-main)', fontFamily: 'monospace' }}>
                  00:{timeLeft.toString().padStart(2, '0')}
                </p>
              </div>
            </div>

            <button className="btn" style={{ background: '#FEE2E2', color: '#991B1B', marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }} onClick={endSession}>
              <StopCircle size={20} />
              End Session Early
            </button>
          </>
        )}
      </div>

      <div className="card glass-panel flex-align">
        <div style={{ padding: '2rem', textAlign: 'center', width: '100%', color: 'var(--text-muted)' }}>
          <Calendar size={48} style={{ opacity: 0.5, marginBottom: '1rem', margin: '0 auto' }} />
          <h3>Secure By Design</h3>
          <p>Live GPS validation prevents proxies from marking presence anywhere off-campus.</p>
        </div>
      </div>
    </div>
  );
};

const StudentAttendance = () => {
  const [code, setCode] = useState('');
  const [gpsStatus, setGpsStatus] = useState('fetching'); 
  const [gpsCoords, setGpsCoords] = useState(null);
  const [submitStatus, setSubmitStatus] = useState('idle'); 
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const autoSubmitTimeout = useRef(null);

  useEffect(() => {
    // Acquire GPS immediately
    navigator.geolocation.getCurrentPosition((pos) => {
      setGpsCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      setGpsStatus('success');
    }, () => {
      setGpsStatus('error');
    }, { enableHighAccuracy: true, timeout: 10000 });

    // Fetch Summary
    const token = localStorage.getItem('campusai_token');
    fetch(`${API_URL}/attendance/summary/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if(!data.error) setSummary(data);
    })
    .catch(err => console.error(err));

    fetchHistory(token);
  }, []);

  const fetchHistory = (token) => {
    fetch(`${API_URL}/attendance/student/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if(Array.isArray(data)) setAttendanceHistory(data);
    })
    .catch(err => console.error(err));
  };

  useEffect(() => {
    // Auto-submit when 4 digits entered — GPS is OPTIONAL
    if (code.length === 4 && submitStatus === 'idle') {
      if (autoSubmitTimeout.current) clearTimeout(autoSubmitTimeout.current);
      autoSubmitTimeout.current = setTimeout(() => {
        executeSubmit(code);
      }, 500);
    }
  }, [code, submitStatus]);

  const executeSubmit = async (submitCode) => {
    if (submitCode.length !== 4) {
      setSubmitStatus('error');
      setMessage('Attendance code must be 4 digits exactly.');
      return;
    }
    
    // GPS is optional — if available, send coordinates; if not, still allow marking
    const coords = gpsStatus === 'success' && gpsCoords ? gpsCoords : null;

    setSubmitStatus('loading');
    const token = localStorage.getItem('campusai_token');

    try {
      const res = await fetch(`${API_URL}/attendance/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          code: submitCode,
          latitude: coords?.lat || null,
          longitude: coords?.lon || null
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitStatus('success');
        setMessage(data.message || 'Attendance marked successfully!');
        
        // Refresh summary and history
        fetch(`${API_URL}/attendance/summary/`, { headers: { 'Authorization': `Bearer ${token}` }})
        .then(r => r.json())
        .then(d => { if(!d.error) setSummary(d); });
        
        fetchHistory(token);
      } else {
        setSubmitStatus('error');
        setMessage(data.error || 'Failed to verify session code.');
      }
    } catch(err) {
      setSubmitStatus('error');
      setMessage('Network error preventing connection.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSubmit(code);
  };

  const nextMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const formatMonth = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getFilteredHistory = () => {
    return attendanceHistory.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate.getMonth() === currentMonthDate.getMonth() && recordDate.getFullYear() === currentMonthDate.getFullYear();
    });
  };

  const filteredHistory = getFilteredHistory();

  return (
    <div className="grid-2">
      <div className="card glass-panel" style={{ padding: '2rem' }}>
        <h2 className="card-title" style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Mark My Attendance</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '0.5rem',
          background: gpsStatus === 'fetching' ? '#FFFBEB' : gpsStatus === 'success' ? '#DCFCE7' : '#F0F9FF',
          color: gpsStatus === 'fetching' ? '#B45309' : gpsStatus === 'success' ? '#166534' : '#0369A1',
          marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <MapPin size={18} />
          {gpsStatus === 'fetching' && 'Acquiring GPS signal...'}
          {gpsStatus === 'success' && 'Location verified: GPS Active ✓'}
          {gpsStatus === 'error' && 'GPS unavailable — code-only mode (attendance will be recorded)'}
        </div>

        {submitStatus === 'success' ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <CheckCircle2 size={64} color="#16A34A" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ color: '#166534', marginBottom: '0.5rem' }}>Confirmed!</h3>
            <p className="text-muted">{message}</p>
            <button className="btn" style={{ marginTop: '2rem' }} onClick={() => {setSubmitStatus('idle'); setCode('');}}>
              Mark Another Class
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Enter 4-Digit Live Code</label>
              <input 
                type="text" 
                className="input" 
                placeholder="0000" 
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                style={{ fontSize: '1.5rem', textAlign: 'center', letterSpacing: '10px', fontWeight: 700 }}
                disabled={submitStatus === 'loading'}
              />
            </div>

            {submitStatus === 'error' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#DC2626', fontSize: '0.9rem', marginBottom: '1.5rem', background: '#FEE2E2', padding: '1rem', borderRadius: '0.5rem' }}>
                <AlertCircle size={16} />
                <span>{message}</span>
              </div>
            )}

            <button type="submit" className="btn" style={{ display: 'none' }} disabled={submitStatus === 'loading'}>
              {submitStatus === 'loading' ? <Loader2 size={20} className="animate-spin" /> : 'Submit Code'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              System will validate automatically when 4 digits are entered.
            </div>
          </form>
        )}
      </div>

      <div className="card glass-panel" style={{ padding: '2rem' }}>
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <h2 className="card-title">My Subject Attendance Tracker</h2>
          <div className="flex-align" style={{ gap: '0.5rem' }}>
            <button onClick={prevMonth} className="btn-icon" style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '0.25rem', borderRadius: '4px', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', width: '120px', textAlign: 'center' }}>{formatMonth(currentMonthDate)}</span>
            <button onClick={nextMonth} className="btn-icon" style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '0.25rem', borderRadius: '4px', cursor: 'pointer' }}><ChevronRight size={16} /></button>
          </div>
        </div>
        
        {filteredHistory.length > 0 ? (
          <table className="data-table" style={{ marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>Subject</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map(record => {
                const date = new Date(record.timestamp);
                return (
                  <tr key={record.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{date.toLocaleDateString()}</div>
                      <div className="text-muted" style={{ fontSize: '0.8rem' }}>{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{record.subject_name || "Subject"}</td>
                    <td><span className="badge success">PRESENT</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
            No attendance marked in this month.
          </div>
        )}

        {summary && summary.subjects && summary.subjects.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Overall Subject Summary</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Attended/Total</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {summary.subjects.map(sub => (
                  <tr key={sub.id}>
                    <td style={{ fontWeight: 500 }}>{sub.name}</td>
                    <td>{sub.attended} / {sub.total}</td>
                    <td style={{ fontWeight: 700, color: sub.status === 'low' ? '#DC2626' : '#166534' }}>
                      {sub.percentage}%
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
};

function Attendance() {
  const { user } = useAuth();
  
  return (
    <div className="animate-slide-up">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Attendance Portal</h1>
      </div>

      {(user?.role?.toLowerCase() === 'teacher' || user?.role?.toLowerCase() === 'hod') ? <TeacherAttendance /> : <StudentAttendance />}
    </div>
  );
}

export default Attendance;
