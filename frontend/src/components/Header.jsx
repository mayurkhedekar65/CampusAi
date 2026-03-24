import React from 'react';
import { Bell, Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="flex-align text-muted" style={{ background: '#F8FAFC', padding: '0.5rem 1rem', borderRadius: '2rem', flex: '0 1 300px' }}>
        <Search size={18} />
        <input type="text" placeholder="Search CampusAI..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
      </div>
      
      <div className="user-profile">
        <button className="flex-align text-muted" style={{ background: 'transparent' }} onClick={() => navigate('/app/notifications')}>
          <Bell size={20} />
        </button>
        <div className="avatar" onClick={() => navigate('/app/profile')} style={{ cursor: 'pointer' }}>
          MK
        </div>
        <button className="flex-align text-muted" style={{ background: 'transparent', marginLeft: '0.5rem' }} onClick={handleLogout} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export default Header;
