import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, BookOpen, Bot, Bell, User, GraduationCap } from 'lucide-react';

const navItems = [
  { path: '/app/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/app/attendance', name: 'Attendance', icon: CalendarCheck },
  { path: '/app/notes', name: 'Notes', icon: BookOpen },
  { path: '/app/assistant', name: 'AI Assistant', icon: Bot },
  { path: '/app/notifications', name: 'Notifications', icon: Bell },
  { path: '/app/profile', name: 'Profile', icon: User },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <GraduationCap size={32} />
        <span>CampusAI</span>
      </div>
      <nav className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
