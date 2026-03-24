import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [departmentId, setDepartmentId] = useState('');
  const [semester, setSemester] = useState(1);
  
  // UI state
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  
  const navigate = useNavigate();
  const { login, register } = useAuth();

  React.useEffect(() => {
    // Fetch departments for the signup form
    fetch('http://127.0.0.1:8001/api/academics/departments/')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data) && data.length > 0) {
          setDepartments(data);
          setDepartmentId(data[0].id);
        } else {
          const fallback = [
            { id: 1, name: 'Computer Science' }, 
            { id: 2, name: 'IT' },
            { id: 3, name: 'E-Comp' },
            { id: 4, name: 'Mechanical' },
            { id: 5, name: 'Civil' },
            { id: 6, name: 'Electrical' },
            { id: 7, name: 'Electronics' }
          ];
          setDepartments(fallback);
          setDepartmentId(1);
        }
      })
      .catch(err => {
        console.log('Failed to fetch departments:', err);
        const fallback = [
          { id: 1, name: 'Computer Science' }, 
          { id: 2, name: 'IT' },
          { id: 3, name: 'E-Comp' },
          { id: 4, name: 'Mechanical' },
          { id: 5, name: 'Civil' },
          { id: 6, name: 'Electrical' },
          { id: 7, name: 'Electronics' }
        ];
        setDepartments(fallback);
        setDepartmentId(1);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          name,
          role,
          department: departmentId || null,
          semester: role === 'STUDENT' ? parseInt(semester) : null,
        });
      }
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-slide-up glass-panel">
        <div className="flex-align" style={{ justifyContent: 'center', marginBottom: '2rem', fontSize: '2rem', fontWeight: 800 }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #818CF8 100%)', color: 'white', padding: '0.75rem', borderRadius: '1rem', display: 'flex', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)' }}>
            <GraduationCap size={40} />
          </div>
        </div>
        
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '1.75rem', fontWeight: 800 }}>
          {isLogin ? 'Welcome back to ' : 'Create an account on '}
          <span className="premium-gradient-text">CampusAI</span>
        </h2>
        <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.95rem' }}>
          {isLogin ? 'Enter your credentials to access your portal' : 'Start simplifying your academic life today'}
        </p>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', textAlign: 'left' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="input-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g. John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="input-group">
                <label>Account Role</label>
                <select className="input" value={role} onChange={(e) => setRole(e.target.value)} disabled={isLoading}>
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="HOD">HOD / Admin</option>
                </select>
              </div>
              {/* Department — shown for HOD, TEACHER and STUDENT */}
              {(role === 'STUDENT' || role === 'HOD' || role === 'TEACHER') && (
                <div className="input-group">
                  <label>Department {role === 'HOD' ? '(Your Department)' : ''}</label>
                  <select className="input" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} disabled={isLoading} required style={{ appearance: 'auto', background: 'transparent' }}>
                    {departments.length > 0 ? (
                      departments.map(d => (
                        <option key={d.id} value={d.id} style={{ color: 'black' }}>{d.name}</option>
                      ))
                    ) : (
                      <option value="">Loading departments...</option>
                    )}
                  </select>
                  {role === 'HOD' && <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginTop: '0.3rem' }}>⚠ You will manage THIS department only</small>}
                </div>
              )}
              {/* Semester — student only */}
              {role === 'STUDENT' && (
                <div className="input-group">
                  <label>Semester</label>
                  <input type="number" className="input" min="1" max="8" value={semester} onChange={(e) => setSemester(e.target.value)} disabled={isLoading} required />
                </div>
              )}
            </>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input" 
              placeholder="student@university.edu" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input" 
              placeholder="Minimum 6 characters" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="btn" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={isLoading}>
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => {
                setIsLogin(!isLogin);
                setError('');
            }} 
            style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </div>

      </div>
    </div>
  );
}

export default LoginSignup;
