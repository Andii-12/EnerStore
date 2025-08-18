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
    <div style={{ 
      background: '#222', 
      borderBottom: '1px solid #eee',
      position: 'relative'
    }}>
      {/* Mobile Menu Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
        '@media (min-width: 768px)': { display: 'none' }
      }}>
        <button
          onClick={toggleMobileMenu}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 'clamp(18px, 4.5vw, 20px)',
            cursor: 'pointer',
            padding: 'clamp(6px, 1.5vw, 8px)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}
        >
          ☰ Цэс
        </button>
        <div style={{
          fontSize: 'clamp(14px, 3.5vw, 16px)',
          color: '#fff',
          fontWeight: 600
        }}>
          EnerStore
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="nav-bar" style={{ 
        maxWidth: 1400, 
        margin: '0 auto', 
        padding: '0 clamp(16px, 4vw, 32px)',
        display: 'none',
        '@media (min-width: 768px)': { display: 'block' }
      }}>
        {menuItems.map(item => (
          <span 
            key={item._id} 
            onClick={() => window.location.href = item.link}
            style={{
              cursor: 'pointer',
              padding: 'clamp(8px, 2vw, 12px)',
              fontSize: 'clamp(13px, 3vw, 14px)',
              color: '#fff',
              transition: 'color 0.2s',
              '&:hover': { color: 'var(--color-accent)' }
            }}
          >
            {item.label}
          </span>
        ))}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: 'block',
            '@media (min-width: 768px)': { display: 'none' }
          }}
        />
      )}

      {/* Mobile Menu */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: isMobileMenuOpen ? 0 : '-100%',
        width: 'clamp(250px, 70vw, 300px)',
        height: '100vh',
        background: '#222',
        zIndex: 1000,
        transition: 'left 0.3s ease',
        padding: 'clamp(20px, 5vw, 32px)',
        boxShadow: '2px 0 8px rgba(0,0,0,0.3)',
        overflowY: 'auto',
        display: 'block',
        '@media (min-width: 768px)': { display: 'none' }
      }}>
        <div style={{ marginBottom: 'clamp(24px, 6vw, 32px)' }}>
          <h3 style={{ 
            fontSize: 'clamp(18px, 4.5vw, 20px)', 
            fontWeight: 600, 
            color: '#fff',
            marginBottom: 'clamp(16px, 4vw, 20px)',
            textAlign: 'center'
          }}>
            Цэс
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 2vw, 12px)' }}>
            {menuItems.map(item => (
              <button
                key={item._id}
                onClick={() => { 
                  window.location.href = item.link;
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  padding: 'clamp(10px, 2.5vw, 12px)',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  color: '#fff',
                  cursor: 'pointer',
                  borderRadius: 6,
                  transition: 'background 0.2s',
                  width: '100%',
                  '&:hover': { background: 'rgba(255,255,255,0.1)' }
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar; 