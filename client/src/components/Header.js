import React from 'react';
import './Header.css';

function Header() {
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