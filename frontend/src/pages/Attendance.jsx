import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, PlayCircle, StopCircle, MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const TeacherAttendance = () => {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionCode, setSessionCode] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [studentsMarked, setStudentsMarked] = useState(0);

  useEffect(() => {
    let timer;
    if (sessionActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        // Simulate random students marking attendance
        if (Math.random() > 0.7) {
          setStudentsMarked(prev => Math.min(prev + 1, 45));
        }
      }, 1000);
    } else if (timeLeft === 0 && sessionActive) {
      setSessionActive(false);
    }
    return () => clearInterval(timer);
  }, [sessionActive, timeLeft]);

  const startSession = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionCode(code);
    setTimeLeft(20);
    setStudentsMarked(0);
    setSessionActive(true);
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
            <p className="text-muted" style={{ marginBottom: '2rem' }}>Generate a live code for your students to mark their attendance.</p>
            <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', padding: '1rem 2rem' }} onClick={startSession}>
              <PlayCircle size={24} />
              Start Session
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
                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Time Remaining</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: timeLeft <= 5 ? '#DC2626' : 'var(--text-main)' }}>00:{timeLeft.toString().padStart(2, '0')}</p>
              </div>
              <div style={{ flex: 1, background: '#DCFCE7', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #BBF7D0' }}>
                <p style={{ fontSize: '0.85rem', color: '#166534', marginBottom: '0.25rem' }}>Students Marked</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#15803D' }}>{studentsMarked} / 45</p>
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
          <h3>Recent Sessions</h3>
          <p>History of your attendance logs will appear here.</p>
        </div>
      </div>
    </div>
  );
};

const StudentAttendance = () => {
  const [code, setCode] = useState('');
  const [gpsStatus, setGpsStatus] = useState('fetching'); // fetching, success, error
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Simulate GPS fetch
    const fetchLocation = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (navigator.geolocation) {
           setGpsStatus('success');
        } else {
           setGpsStatus('error');
        }
      } catch (err) {
        setGpsStatus('error');
      }
    };
    fetchLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length < 6) {
      setSubmitStatus('error');
      setMessage('Please enter a valid 6-character code.');
      return;
    }
    
    setSubmitStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      if (code.toUpperCase() === 'EXPIRED') {
        setSubmitStatus('error');
        setMessage('This session has expired.');
      } else if (gpsStatus !== 'success') {
        setSubmitStatus('error');
        setMessage('Cannot verify location. High alert area.');
      } else {
        setSubmitStatus('success');
        setMessage('Attendance marked successfully!');
      }
    }, 1200);
  };

  return (
    <div className="grid-2">
      <div className="card glass-panel" style={{ padding: '2rem' }}>
        <h2 className="card-title" style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Mark Attendance</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '0.5rem', background: gpsStatus === 'fetching' ? '#FFFBEB' : gpsStatus === 'success' ? '#DCFCE7' : '#FEE2E2', color: gpsStatus === 'fetching' ? '#B45309' : gpsStatus === 'success' ? '#166534' : '#991B1B', marginBottom: '2rem', fontSize: '0.9rem' }}>
          <MapPin size={20} />
          {gpsStatus === 'fetching' && 'Verifying location via GPS...'}
          {gpsStatus === 'success' && 'Location verified: On Campus'}
          {gpsStatus === 'error' && 'Failed to verify location.'}
        </div>

        {submitStatus === 'success' ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <CheckCircle2 size={64} color="#16A34A" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ color: '#166534', marginBottom: '0.5rem' }}>{message}</h3>
            <p className="text-muted">You can safely close this page.</p>
            <button className="btn" style={{ marginTop: '2rem' }} onClick={() => {setSubmitStatus('idle'); setCode('');}}>
              Mark Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Enter Live Session Code</label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. A1B2C3" 
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                style={{ fontSize: '1.5rem', textAlign: 'center', letterSpacing: '5px', fontWeight: 700 }}
                disabled={submitStatus === 'loading'}
              />
            </div>

            {submitStatus === 'error' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#DC2626', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <AlertCircle size={16} />
                <span>{message}</span>
              </div>
            )}

            <button type="submit" className="btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={submitStatus === 'loading' || gpsStatus === 'fetching'}>
              {submitStatus === 'loading' ? <Loader2 size={20} className="animate-spin" /> : 'Submit Code'}
            </button>
          </form>
        )}
      </div>

      <div className="card glass-panel" style={{ padding: '2rem' }}>
        <h2 className="card-title">Subject Summary</h2>
        <table className="data-table" style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Status</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 500 }}>Machine Learning</td>
              <td><span className="badge success">Safe</span></td>
              <td style={{ fontWeight: 700 }}>85%</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 500 }}>Database Systems</td>
              <td><span className="badge danger">Critical</span></td>
              <td style={{ fontWeight: 700, color: '#DC2626' }}>68%</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 500 }}>Cloud Computing</td>
              <td><span className="badge success">Safe</span></td>
              <td style={{ fontWeight: 700 }}>92%</td>
            </tr>
          </tbody>
        </table>
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

      {(user?.role === 'teacher' || user?.role === 'hod') ? <TeacherAttendance /> : <StudentAttendance />}
    </div>
  );
}

export default Attendance;
