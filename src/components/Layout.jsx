import React from 'react';
import Navbar from './Navbar.jsx';
import { Outlet } from 'react-router-dom';

export default function Layout({ onLogout }) {
  return (
    <div>
      <Navbar onLogout={onLogout} />
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
      </div>
  );
} 
