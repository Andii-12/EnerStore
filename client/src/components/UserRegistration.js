import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import MainHeader from './MainHeader';
import NavBar from './NavBar';
import Footer from './Footer';

function UserRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      district: '',
      zipCode: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Нэр оруулна уу';
    if (!formData.lastName.trim()) newErrors.lastName = 'Овог оруулна уу';
    if (!formData.email.trim()) newErrors.email = 'Имэйл оруулна уу';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Зөв имэйл оруулна уу';
    
    if (!formData.phone.trim()) newErrors.phone = 'Утасны дугаар оруулна уу';
    else if (!/^\d{8}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Зөв утасны дугаар оруулна уу';
    
    if (!formData.password) newErrors.password = 'Нууц үг оруулна уу';
    else if (formData.password.length < 6) newErrors.password = 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Нууц үг таарахгүй байна';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/customer-users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          address: formData.address
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Бүртгэл амжилттай үүслээ! Та одоо нэвтэрч болно.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage(data.error || 'Алдаа гарлаа. Дахин оролдоно уу.');
      }
    } catch (error) {
      setMessage('Серверт холбогдоход алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ background: '#f6f6f6', minHeight: '100vh' }}>
      <Header />
      <MainHeader />
      <NavBar />
      
      <div style={{ maxWidth: 600, margin: '32px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(8,15,70,0.06)', padding: 32 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 32, color: '#222', fontSize: 28, fontWeight: 700 }}>
          Хэрэглэгч бүртгүүлэх
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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

          {/* Password Fields */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', color: '#222' }}>Нууц үг *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: 12, 
                  borderRadius: 8, 
                  border: errors.password ? '1px solid #dc3545' : '1px solid #ddd',
                  fontSize: 16,
                  boxSizing: 'border-box'
                }}
                placeholder="Нууц үгээ оруулна уу"
              />
              {errors.password && <div style={{ color: '#dc3545', fontSize: 14, marginTop: 4 }}>{errors.password}</div>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', color: '#222' }}>Нууц үг давтах *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: 12, 
                  borderRadius: 8, 
                  border: errors.confirmPassword ? '1px solid #dc3545' : '1px solid #ddd',
                  fontSize: 16,
                  boxSizing: 'border-box'
                }}
                placeholder="Нууц үгээ дахин оруулна уу"
              />
              {errors.confirmPassword && <div style={{ color: '#dc3545', fontSize: 14, marginTop: 4 }}>{errors.confirmPassword}</div>}
            </div>
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
            {isLoading ? 'Бүртгэж байна...' : 'Бүртгүүлэх'}
          </button>

          {/* Login Link */}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ color: '#666' }}>Бүртгэлтэй юу? </span>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: '#f8991b',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 16
              }}
            >
              Нэвтрэх
            </button>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
}

export default UserRegistration; 