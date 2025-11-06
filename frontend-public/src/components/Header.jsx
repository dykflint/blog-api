// src/components/Header.jsx
import { Link } from 'react-router-dom';
import React from 'react';

export default function Header() {
  return (
    <header style={{ background: '#333', padding: '1rem' }}>
      <nav style={{ display: 'flex', gap: '1rem', color: 'white' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Home
        </Link>
      </nav>
    </header>
  );
}
