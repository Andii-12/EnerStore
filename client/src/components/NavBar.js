import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import './NavBar.css';

function NavBar() {
  const [menuItems, setMenuItems] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetch(API_ENDPOINTS.HEADER_MENU_ITEMS)
      .then(res => res.json())
      .then(data => setMenuItems(data));
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="nav-bar-container">
      {/* Mobile Menu Button */}
      <div className="mobile-menu-button">
        <button
          onClick={toggleMobileMenu}
          className="menu-toggle-btn"
        >
          ☰ Цэс
        </button>
        <div className="mobile-brand">
          EnerStore
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        {menuItems.map(item => (
          <span 
            key={item._id} 
            onClick={() => window.location.href = item.link}
            className="nav-item"
          >
            {item.label}
          </span>
        ))}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="mobile-menu-overlay"
        />
      )}

      {/* Mobile Sidebar Menu */}
      <div className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3 className="sidebar-title">Цэс</h3>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="sidebar-close-btn"
          >
            ✕
          </button>
        </div>
        <div className="sidebar-menu">
          {menuItems.map(item => (
            <button
              key={item._id}
              onClick={() => { 
                window.location.href = item.link;
                setIsMobileMenuOpen(false);
              }}
              className="sidebar-menu-item"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavBar; 