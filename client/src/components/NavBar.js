import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Static menu items
  const menuItems = [
    { id: 1, label: 'Нүүр', link: '/' },
    { id: 2, label: 'Бүтээгдэхүүн', link: '/products' },
    { id: 3, label: 'Ангилал', link: '/categories' },
    { id: 4, label: 'Брэнд', link: '/brands' },
    { id: 5, label: 'Тухай', link: '/about' },
    { id: 6, label: 'Холбоо барих', link: '/contact' }
  ];

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
          <Link 
            key={item.id} 
            to={item.link}
            className="nav-item"
          >
            {item.label}
          </Link>
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
            <Link
              key={item.id}
              to={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="sidebar-menu-item"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavBar; 