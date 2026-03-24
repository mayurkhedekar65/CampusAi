import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, BookOpen, Bot, Bell, User, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/app/dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['student', 'teacher', 'hod'] },
  { path: '/app/attendance', name: 'Attendance', icon: CalendarCheck, roles: ['student', 'teacher'] },
  { path: '/app/notes', name: 'Notes', icon: BookOpen, roles: ['student', 'teacher'] },
  { path: '/app/assistant', name: 'AI Assistant', icon: Bot, roles: ['student'] },
  { path: '/app/notifications', name: 'Notifications', icon: Bell, roles: ['student', 'teacher', 'hod'] },
  { path: '/app/profile', name: 'Profile', icon: User, roles: ['student', 'teacher', 'hod'] },
];

function Sidebar({ isOpen }) {
  const { user } = useAuth();
  
  // Filter based on role, default to empty array if no user
  const visibleItems = user ? navItems.filter(item => item.roles.includes(user.role)) : [];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" style={{ justifyContent: isOpen ? 'flex-start' : 'center', padding: isOpen ? '1.5rem 2rem' : '1.5rem 0' }}>
        <GraduationCap size={32} style={{ flexShrink: 0 }} />
        {isOpen && <span className="premium-gradient-text" style={{ fontWeight: 800 }}>CampusAI</span>}
      </div>
      
      {isOpen && (
        <div style={{ padding: '0 2rem 1rem 2rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {user?.role} Portal
        </div>
      )}

      <nav className="nav-links" style={{ padding: isOpen ? '1.5rem 1rem' : '1.5rem 0.5rem' }}>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={!isOpen ? item.name : undefined}
              style={{ justifyContent: isOpen ? 'flex-start' : 'center', padding: isOpen ? '0.875rem 1rem' : '0.875rem 0' }}
            >
              <Icon size={20} style={{ flexShrink: 0 }} />
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
