import React from 'react';
import { Bell, Search, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="header glass-panel" style={{ borderLeft: 'none', borderRight: 'none', borderTop: 'none', display: 'flex', gap: '1rem' }}>
      <button className="flex-align text-muted" style={{ background: 'transparent', padding: '0.5rem', marginRight: '0.5rem' }} onClick={toggleSidebar}>
        <Menu size={24} />
      </button>
      
      <div className="flex-align text-muted" style={{ background: 'var(--bg-color)', padding: '0.6rem 1.25rem', borderRadius: '2rem', flex: '1', maxWidth: '400px', border: '1px solid var(--border-color)' }}>
        <Search size={18} />
        <input type="text" placeholder="Search CampusAI..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', color: 'var(--text-main)' }} />
      </div>
      
      <div className="user-profile">
        <button className="flex-align text-muted" style={{ background: 'transparent', transition: 'color 0.2s' }} onClick={() => navigate('/app/notifications')} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
          <Bell size={20} />
        </button>
        <div className="avatar" onClick={() => navigate('/app/profile')} style={{ cursor: 'pointer', background: 'linear-gradient(135deg, var(--primary) 0%, #818CF8 100%)', color: 'white', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          {getInitials(user?.name)}
        </div>
        <div style={{ marginRight: '1rem', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{user?.name || 'User'}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role || 'Guest'}</span>
        </div>
        <button className="flex-align text-muted" style={{ background: '#F1F5F9', padding: '0.5rem', borderRadius: '50%', transition: 'all 0.2s' }} onClick={handleLogout} title="Logout" onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#991B1B'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default Header;
