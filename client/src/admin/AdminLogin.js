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

      if (res.ok) {
        await login(data.user);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Нэвтрэх нэр эсвэл нууц үг буруу байна');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Серверт холбогдоход алдаа гарлаа');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f6f6f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 20px rgba(8,15,70,0.12)', padding: '40px', width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-dark)', marginBottom: 8 }}>Админ нэвтрэх</h1>
          <p style={{ color: '#666', fontSize: 16 }}>Системд нэвтрэхийн тулд нэвтрэх нэр болон нууц үгээ оруулна уу</p>
        </div>

        {error && (
          <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: 8, padding: 16, marginBottom: 24, color: '#c33' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#333' }}>
              Нэвтрэх нэр
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e5e9',
                borderRadius: 8,
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              placeholder="Нэвтрэх нэрээ оруулна уу"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#333' }}>
              Нууц үг
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e5e9',
                borderRadius: 8,
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              placeholder="Нууц үгээ оруулна уу"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: 'var(--color-accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '14px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin; 