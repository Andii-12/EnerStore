import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import MainHeader from './MainHeader';
import NavBar from './NavBar';
import Footer from './Footer';
import { API_ENDPOINTS } from '../config/api';

function UserEdit() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      district: '',
      zipCode: ''
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      navigate('/');
      return;
    }
    setUser(loggedInUser);
    setFormData({
      firstName: loggedInUser.firstName || '',
      lastName: loggedInUser.lastName || '',
      email: loggedInUser.email || '',
      phone: loggedInUser.phone || '',
      address: {
        street: loggedInUser.address?.street || '',
        city: loggedInUser.address?.city || '',
        district: loggedInUser.address?.district || '',
        zipCode: loggedInUser.address?.zipCode || ''
      }
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Нэр оруулна уу';
    if (!formData.lastName.trim()) newErrors.lastName = 'Овог оруулна уу';
    if (!formData.email.trim()) newErrors.email = 'Имэйл оруулна уу';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Зөв имэйл оруулна уу';
    
    if (!formData.phone.trim()) newErrors.phone = 'Утасны дугаар оруулна уу';
    else if (!/^\d{8}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Зөв утасны дугаар оруулна уу';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) newErrors.currentPassword = 'Одоогийн нууц үг оруулна уу';
    if (!passwordData.newPassword) newErrors.newPassword = 'Шинэ нууц үг оруулна уу';
    else if (passwordData.newPassword.length < 6) newErrors.newPassword = 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой';
    
    if (passwordData.newPassword !== passwordData.confirmPassword) newErrors.confirmPassword = 'Нууц үг таарахгүй байна';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_ENDPOINTS.CUSTOMER_USERS}/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update localStorage with new user data
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage('Мэдээлэл амжилттай хадгалагдлаа!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Алдаа гарлаа. Дахин оролдоно уу.');
      }
    } catch (error) {
      setMessage('Серверт холбогдоход алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_ENDPOINTS.CUSTOMER_USERS}/${user._id}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Нууц үг амжилттай өөрчлөгдлөө!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Алдаа гарлаа. Дахин оролдоно уу.');
      }
    } catch (error) {
      setMessage('Серверт холбогдоход алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div style={{ padding: 40 }}>Уншиж байна...</div>;

  return (
    <div style={{ background: '#f6f6f6', minHeight: '100vh' }}>
      <Header />
      <MainHeader />
      <NavBar />
      
      <div style={{ maxWidth: 800, margin: '32px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(8,15,70,0.06)', padding: 32 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 32, color: '#222', fontSize: 28, fontWeight: 700 }}>
          Мэдээлэл засах
        </h1>

        {message && (
          <div style={{ 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 24, 
            textAlign: 'center',
            background: message.includes('амжилттай') ? '#d4edda' : '#f8d7da',
            color: message.includes('амжилттай') ? '#155724' : '#721c24',
            fontWeight: 600
          }}>
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              background: activeTab === 'profile' ? '#f8991b' : '#f3f4f6',
              color: activeTab === 'profile' ? '#fff' : '#222',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'background 0.18s',
            }}
          >
            👤 Хувийн мэдээлэл
          </button>
          <button
            onClick={() => setActiveTab('password')}
            style={{
              background: activeTab === 'password' ? '#f8991b' : '#f3f4f6',
              color: activeTab === 'password' ? '#fff' : '#222',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'background 0.18s',
            }}
          >
            🔒 Нууц үг өөрчлөх
          </button>
        </div>

        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Name Fields */}
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', color: '#222' }}>Нэр *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: 12, 
                    borderRadius: 8, 
                    border: errors.firstName ? '1px solid #dc3545' : '1px solid #ddd',
                    fontSize: 16,
                    boxSizing: 'border-box'
                  }}
                  placeholder="Нэрээ оруулна уу"
                />
                {errors.firstName && <div style={{ color: '#dc3545', fontSize: 14, marginTop: 4 }}>{errors.firstName}</div>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', color: '#222' }}>Овог *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: 12, 
                    borderRadius: 8, 
                    border: errors.lastName ? '1px solid #dc3545' : '1px solid #ddd',
                    fontSize: 16,
                    boxSizing: 'border-box'
                  }}
                  placeholder="Овгоо оруулна уу"
                />
                {errors.lastName && <div style={{ color: '#dc3545', fontSize: 14, marginTop: 4 }}>{errors.lastName}</div>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', color: '#222' }}>Имэйл *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: 12, 
                  borderRadius: 8, 
                  border: errors.email ? '1px solid #dc3545' : '1px solid #ddd',
                  fontSize: 16,
                  boxSizing: 'border-box'
                }}
                placeholder="Имэйл хаягаа оруулна уу"
              />
              {errors.email && <div style={{ color: '#dc3545', fontSize: 14, marginTop: 4 }}>{errors.email}</div>}
            </div>

            {/* Phone */}
            <div>
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', color: '#222' }}>Утасны дугаар *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: 12, 
                  borderRadius: 8, 
                  border: errors.phone ? '1px solid #dc3545' : '1px solid #ddd',
                  fontSize: 16,
                  boxSizing: 'border-box'
                }}
                placeholder="Утасны дугаараа оруулна уу"
              />
              {errors.phone && <div style={{ color: '#dc3545', fontSize: 14, marginTop: 4 }}>{errors.phone}</div>}
            </div>

            {/* Address Section */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: 20 }}>
              <h3 style={{ marginBottom: 16, color: '#222', fontSize: 18, fontWeight: 600 }}>Хаягийн мэдээлэл</h3>
              
              <div>
                <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', color: '#222' }}>Гудамж, байр</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: 12, 
                    borderRadius: 8, 
                    border: '1px solid #ddd',
                    fontSize: 16,
                    boxSizing: 'border-box'
                  }}
                  placeholder="Гудамж, байрны дугаар"
                />
              </div>

              <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', color: '#222' }}>Хот</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      padding: 12, 
                      borderRadius: 8, 
                      border: '1px solid #ddd',
                      fontSize: 16,
                      boxSizing: 'border-box'
                    }}
                    placeholder="Хот"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', color: '#222' }}>Дүүрэг</label>
                  <input
                    type="text"
                    name="address.district"
                    value={formData.address.district}
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      padding: 12, 
                      borderRadius: 8, 
                      border: '1px solid #ddd',
                      fontSize: 16,
                      boxSizing: 'border-box'
                    }}
                    placeholder="Дүүрэг"
                  />
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', color: '#222' }}>Шуудангийн код</label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: 12, 
                    borderRadius: 8, 
                    border: '1px solid #ddd',
                    fontSize: 16,
                    boxSizing: 'border-box'
                  }}
                  placeholder="Шуудангийн код"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: isLoading ? '#ccc' : '#f8991b',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '16px 0',
                fontSize: 18,
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginTop: 20
              }}
            >
              {isLoading ? 'Хадгалж байна...' : 'Хадгалах'}
            </button>
          </form>
        )}

        {/* Password Change Tab */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', color: '#222' }}>Одоогийн нууц үг *</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                style={{ 
                  width: '100%', 
                  padding: 12, 
                  borderRadius: 8, 
                  border: errors.currentPassword ? '1px solid #dc3545' : '1px solid #ddd',
                  fontSize: 16,
                  boxSizing: 'border-box'
                }}
                placeholder="Одоогийн нууц үгээ оруулна уу"
              />
              {errors.currentPassword && <div style={{ color: '#dc3545', fontSize: 14, marginTop: 4 }}>{errors.currentPassword}</div>}
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', color: '#222' }}>Шинэ нууц үг *</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  style={{ 
                    width: '100%', 
                    padding: 12, 
                    borderRadius: 8, 
                    border: errors.newPassword ? '1px solid #dc3545' : '1px solid #ddd',
                    fontSize: 16,
                    boxSizing: 'border-box'
                  }}
                  placeholder="Шинэ нууц үгээ оруулна уу"
                />
                {errors.newPassword && <div style={{ color: '#dc3545', fontSize: 14, marginTop: 4 }}>{errors.newPassword}</div>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', color: '#222' }}>Шинэ нууц үг давтах *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  style={{ 
                    width: '100%', 
                    padding: 12, 
                    borderRadius: 8, 
                    border: errors.confirmPassword ? '1px solid #dc3545' : '1px solid #ddd',
                    fontSize: 16,
                    boxSizing: 'border-box'
                  }}
                  placeholder="Шинэ нууц үгээ дахин оруулна уу"
                />
                {errors.confirmPassword && <div style={{ color: '#dc3545', fontSize: 14, marginTop: 4 }}>{errors.confirmPassword}</div>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: isLoading ? '#ccc' : '#f8991b',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '16px 0',
                fontSize: 18,
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginTop: 20
              }}
            >
              {isLoading ? 'Өөрчлөж байна...' : 'Нууц үг өөрчлөх'}
            </button>
          </form>
        )}

        {/* Back Button */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#fff',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer'
            }}
          >
            ← Буцах
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default UserEdit; 