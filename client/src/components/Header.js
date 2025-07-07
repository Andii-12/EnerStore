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
    <div style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 44, padding: '0 32px' }}>
        <div className="header-contact">
          <span>+976 99112233</span>
          <span>ener@store.mn</span>
        </div>
        <div className="header-links">
          <span>ТУСЛАМЖ</span>
        </div>
      </div>
    </div>
  );
}

export default Header; 