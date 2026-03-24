import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={`layout ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <Sidebar isOpen={isSidebarOpen} />
      <div className="main-content">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="page-content animate-slide-up" style={{ padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
