import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { useAdminAuth } from './AdminAuthContext';

function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Use the context login function
        const loginSuccess = login(data.user);
        
        if (loginSuccess) {
          console.log('Admin login successful:', data.user);
          // Navigate after successful login
          navigate('/admin/dashboard');
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Login failed. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f6f6f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 340, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(8,15,70,0.10)', padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 28, color: 'var(--color-dark)', letterSpacing: 0.5 }}>Админ нэвтрэх</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input
            type="text"
            placeholder="Нэвтрэх нэр"
            value={formData.username}
            onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
            style={{ width: '100%', boxSizing: 'border-box', padding: '14px 0', marginBottom: 18, borderRadius: 8, border: '2px solid #e1e5e9', fontSize: 16, outline: 'none', transition: 'border-color 0.2s', textIndent: 16 }}
            required
          />
          <input
            type="password"
            placeholder="Нууц үг"
            value={formData.password}
            onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
            style={{ width: '100%', boxSizing: 'border-box', padding: '14px 0', marginBottom: 24, borderRadius: 8, border: '2px solid #e1e5e9', fontSize: 16, outline: 'none', transition: 'border-color 0.2s', textIndent: 16 }}
            required
          />
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '14px 0', 
              background: isLoading ? '#ccc' : 'var(--color-accent)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              fontWeight: 'bold', 
              fontSize: 17, 
              letterSpacing: 0.5, 
              boxShadow: '0 1px 4px rgba(8,15,70,0.06)', 
              cursor: isLoading ? 'not-allowed' : 'pointer', 
              transition: 'background 0.2s' 
            }}
          >
            {isLoading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
          </button>
          {error && <div style={{ color: 'red', marginTop: 16, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
        </form>
        
        {/* Default credentials info */}
        <div style={{ marginTop: 24, padding: 16, background: '#f8f9fa', borderRadius: 8, fontSize: 14, color: '#666', textAlign: 'center' }}>
          <strong>Default Admin Credentials:</strong><br/>
          Username: <code>admin</code><br/>
          Password: <code>admin123</code>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin; 