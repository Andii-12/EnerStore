import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import './NavBar.css';

function NavBar() {
  const [menuItems, setMenuItems] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetch(API_ENDPOINTS.HEADER_MENU_ITEMS)
      .then(res => res.json())
      .then(data => setMenuItems(data));
  }, []);

  return (
    <div style={{ background: '#222', borderBottom: '1px solid #eee' }}>
      <nav className="nav-bar" style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px' }}>
        {menuItems.map(item => (
          <span key={item._id} onClick={() => window.location.href = item.link}>{item.label}</span>
        ))}
      </nav>
    </div>
  );
}

export default NavBar; 