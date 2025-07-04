import React, { useState } from 'react';
import './MainHeader.css';
import logo1 from './assets/logo2.png';
import { useNavigate } from 'react-router-dom';

function MainHeader() {
  const [showLogin, setShowLogin] = useState(false);
  const [loginType, setLoginType] = useState('user'); // 'user' or 'company'
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registerType, setRegisterType] = useState('user');
  const [companyReg, setCompanyReg] = useState({ name: '', email: '', password: '', address: '', contact: '', logo: '' });
  const [companyLogoPreview, setCompanyLogoPreview] = useState('');

  const handleLogin = async () => {
    setLoginError('');
    if (loginType === 'company') {
      // Company login
      const res = await fetch('http://localhost:5000/api/companies/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('company', JSON.stringify(data.company));
        setShowLogin(false);
        setLoginEmail('');
        setLoginPassword('');
        navigate('/company/dashboard');
      } else {
        setLoginError('Имэйл эсвэл нууц үг буруу байна.');
      }
    } else {
      // User login (not implemented)
      setLoginError('User login is not implemented yet.');
    }
  };

  const handleCompanyLogoChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyLogoPreview(e.target.result);
        setCompanyReg({ ...companyReg, logo: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', height: 72, padding: '0 32px' }}>
        <div className="logo-area" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo1} alt="logo" className="logo-img" />
        </div>
        <input className="search-bar" placeholder="Хайх" style={{ flex: 1, margin: '0 32px' }} />
        <div className="header-icons" style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: 18 }}>
          <span className="icon-heart">♡</span>
          <span className="icon-cart">🛒</span>
          <button className="profile-btn" onClick={() => setShowLogin(true)}>Нэвтрэх</button>
        </div>
      </div>
      {showLogin && (
        <div className="login-modal-bg" onClick={() => setShowLogin(false)}>
          <div className="login-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <button
                onClick={() => setLoginType('user')}
                style={{
                  flex: 1,
                  background: loginType === 'user' ? 'var(--color-accent)' : '#f3f3f3',
                  color: loginType === 'user' ? '#fff' : '#222',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 0',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  transition: 'background 0.18s',
                }}
              >
                Хэрэглэгч
              </button>
              <button
                onClick={() => setLoginType('company')}
                style={{
                  flex: 1,
                  background: loginType === 'company' ? 'var(--color-accent)' : '#f3f3f3',
                  color: loginType === 'company' ? '#fff' : '#222',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 0',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  transition: 'background 0.18s',
                }}
              >
                Компани
              </button>
            </div>
            <h2 style={{ marginBottom: 18 }}>{loginType === 'company' ? 'Компани нэвтрэх' : 'Хэрэглэгч нэвтрэх'}</h2>
            <input
              type="text"
              placeholder={loginType === 'company' ? 'Компани и-мэйл эсвэл нэр' : 'Имэйл эсвэл утас'}
              style={{ width: '90%', margin: '0 auto 12px auto', display: 'block', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Нууц үг"
              style={{ width: '90%', margin: '0 auto 16px auto', display: 'block', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
            />
            {loginError && <div style={{ color: 'red', marginBottom: 10 }}>{loginError}</div>}
            <button
              style={{ width: '100%', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 0', fontWeight: 'bold', fontSize: 16 }}
              onClick={handleLogin}
            >
              Нэвтрэх
            </button>
            <button
              style={{ width: '100%', marginTop: 10, background: '#eee', color: '#222', border: 'none', borderRadius: 4, padding: '8px 0', fontWeight: 'bold' }}
              onClick={() => setShowLogin(false)}
            >
              Болих
            </button>
            {loginType === 'user' && (
              <button
                style={{ width: '100%', marginTop: 10, background: '#fff', color: 'var(--color-accent)', border: '1.5px solid var(--color-accent)', borderRadius: 4, padding: '8px 0', fontWeight: 'bold', fontSize: 15, transition: 'background 0.18s', cursor: 'pointer' }}
                onClick={() => { setShowRegister(true); setRegisterType('user'); }}
              >
                Бүртгүүлэх
              </button>
            )}
          </div>
        </div>
      )}
      {showRegister && registerType === 'company' && (
        <div className="login-modal-bg" onClick={() => setShowRegister(false)}>
          <div className="login-modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 18 }}>Компани бүртгүүлэх</h2>
            <input type="text" placeholder="Компани нэр" value={companyReg.name} onChange={e => setCompanyReg({ ...companyReg, name: e.target.value })} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
            <input type="email" placeholder="Имэйл" value={companyReg.email} onChange={e => setCompanyReg({ ...companyReg, email: e.target.value })} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
            <input type="password" placeholder="Нууц үг" value={companyReg.password} onChange={e => setCompanyReg({ ...companyReg, password: e.target.value })} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
            <input type="text" placeholder="Хаяг" value={companyReg.address} onChange={e => setCompanyReg({ ...companyReg, address: e.target.value })} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
            <input type="text" placeholder="Холбоо барих" value={companyReg.contact} onChange={e => setCompanyReg({ ...companyReg, contact: e.target.value })} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
            <label style={{ display: 'inline-block', padding: '10px 18px', background: 'var(--color-accent)', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginBottom: 12 }}>
              📷 Лого оруулах
              <input type="file" accept="image/*" onChange={handleCompanyLogoChange} style={{ display: 'none' }} />
            </label>
            {companyLogoPreview && <img src={companyLogoPreview} alt="logo preview" style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8, marginBottom: 12, display: 'block' }} />}
            <button style={{ width: '100%', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 0', fontWeight: 'bold', fontSize: 16 }}>Бүртгүүлэх</button>
            <button onClick={() => setShowRegister(false)} style={{ width: '100%', marginTop: 10, background: '#eee', color: '#222', border: 'none', borderRadius: 4, padding: '8px 0', fontWeight: 'bold' }}>Болих</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainHeader; 