import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, perform authentication here
    navigate('/app/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-slide-up">
        <div className="flex-align" style={{ justifyContent: 'center', marginBottom: '2rem', color: 'var(--primary)', fontSize: '2rem', fontWeight: 800 }}>
          <GraduationCap size={40} />
          <span>CampusAI</span>
        </div>
        
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 700 }}>
          {isLogin ? 'Welcome back!' : 'Create an account'}
        </h2>
        <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.95rem' }}>
          {isLogin ? 'Enter your details to access your portal' : 'Start simplifying your academic life'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" className="input" placeholder="e.g. John Doe" required />
            </div>
          )}
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" className="input" placeholder="student@university.edu" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" className="input" placeholder="••••••••" required />
          </div>

          <button type="submit" className="btn" style={{ marginTop: '1rem' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
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
