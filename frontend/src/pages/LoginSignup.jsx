import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function LoginSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login');
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
          Welcome to <span className="premium-gradient-text">CampusAI</span>
        </h2>
        <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.95rem' }}>
          Enter your credentials to access your portal
        </p>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', textAlign: 'left' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              placeholder="Try 'password'" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="btn" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={isLoading}>
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Demo Credentials (password: password)</p>
          <ul style={{ listStyle: 'none', textAlign: 'left', paddingLeft: '1rem' }}>
            <li>📧 student@demo.com &rarr; Student Role</li>
            <li>📧 teacher@demo.com &rarr; Teacher Role</li>
            <li>📧 hod@demo.com &rarr; HOD Role</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
