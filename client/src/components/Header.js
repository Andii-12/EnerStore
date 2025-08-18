import React, { useEffect, useState } from 'react';
import './Header.css';

function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavCount(favs.length);
    // Listen for storage changes (other tabs)
    const onStorage = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavCount(favs.length);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div style={{ 
      background: '#fff', 
      borderBottom: '1px solid #eee',
      padding: 'clamp(8px, 2vw, 12px) 0'
    }}>
      <div style={{ 
        maxWidth: 1400, 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        minHeight: 'clamp(32px, 8vw, 44px)', 
        padding: '0 clamp(16px, 4vw, 32px)',
        flexWrap: 'wrap',
        gap: 'clamp(8px, 2vw, 12px)'
      }}>
        <div className="header-contact" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(2px, 1vw, 4px)',
          '@media (min-width: 768px)': {
            flexDirection: 'row',
            gap: 'clamp(16px, 4vw, 24px)'
          }
        }}>
          <span style={{ 
            fontSize: 'clamp(11px, 2.5vw, 14px)', 
            color: '#666',
            fontWeight: 500
          }}>
            +976 99112233
          </span>
          <span style={{ 
            fontSize: 'clamp(11px, 2.5vw, 14px)', 
            color: '#666',
            fontWeight: 500
          }}>
            ener@store.mn
          </span>
        </div>
        <div className="header-links" style={{
          fontSize: 'clamp(11px, 2.5vw, 14px)',
          color: '#666',
          fontWeight: 500
        }}>
          ТУСЛАМЖ
        </div>
      </div>
    </div>
  );
}

export default Header; 