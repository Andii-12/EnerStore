import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('admin', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Нэвтрэх нэр эсвэл нууц үг буруу байна!');
      }
    } catch (err) {
      setError('Сервертэй холбогдож чадсангүй!');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f6f6f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 340, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(8,15,70,0.10)', padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 28, color: 'var(--color-dark)', letterSpacing: 0.5 }}>Админ нэвтрэх</h2>
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <input
            type="text"
            placeholder="Нэвтрэх нэр"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '14px 0', marginBottom: 18, borderRadius: 8, border: '2px solid #e1e5e9', fontSize: 16, outline: 'none', transition: 'border-color 0.2s', textIndent: 16 }}
          />
          <input
            type="password"
            placeholder="Нууц үг"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '14px 0', marginBottom: 24, borderRadius: 8, border: '2px solid #e1e5e9', fontSize: 16, outline: 'none', transition: 'border-color 0.2s', textIndent: 16 }}
          />
          <button type="submit" style={{ width: '100%', padding: '14px 0', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', fontSize: 17, letterSpacing: 0.5, boxShadow: '0 1px 4px rgba(8,15,70,0.06)', cursor: 'pointer', transition: 'background 0.2s' }}>Нэвтрэх</button>
          {error && <div style={{ color: 'red', marginTop: 16, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default AdminLogin; 