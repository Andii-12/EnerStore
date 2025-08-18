import React, { useState, useEffect, useRef } from 'react';
import './MainHeader.css';
import logo1 from './assets/logo2.png';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

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
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInCompany, setLoggedInCompany] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchTimeout = useRef(null);

  useEffect(() => {
    const updateCounts = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavCount(favs.length);
    };
    updateCounts();
    window.addEventListener('storage', updateCounts);
    
    // Check for logged in user/company
    const user = JSON.parse(localStorage.getItem('user'));
    const company = JSON.parse(localStorage.getItem('company'));
    if (user) setLoggedInUser(user);
    if (company) setLoggedInCompany(company);
    
    return () => window.removeEventListener('storage', updateCounts);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('[data-profile-menu]')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const handleLogin = async () => {
    setLoginError('');
    if (loginType === 'company') {
      // Company login
      const res = await fetch(API_ENDPOINTS.COMPANY_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('company', JSON.stringify(data.company));
        setLoggedInCompany(data.company);
        setShowLogin(false);
        setLoginEmail('');
        setLoginPassword('');
        navigate('/company/dashboard');
      } else {
        setLoginError('Имэйл эсвэл нууц үг буруу байна.');
      }
    } else {
      // User login
      const res = await fetch(API_ENDPOINTS.CUSTOMER_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      if (res.ok) {
        const user = await res.json();
        localStorage.setItem('user', JSON.stringify(user));
        setLoggedInUser(user);
        setShowLogin(false);
        setLoginEmail('');
        setLoginPassword('');
        // Stay on current page or navigate to home
        navigate('/');
      } else {
        const data = await res.json();
        setLoginError(data.error || 'Имэйл эсвэл нууц үг буруу байна.');
      }
    }
  };

  const handleLogout = () => {
    if (loggedInUser) {
      localStorage.removeItem('user');
      setLoggedInUser(null);
    }
    if (loggedInCompany) {
      localStorage.removeItem('company');
      setLoggedInCompany(null);
    }
    setShowProfileMenu(false);
    navigate('/');
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.PRODUCT_SEARCH}?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      handleSearch(query);
    }, 300);
  };

  const handleSearchResultClick = (product) => {
    setShowSearchResults(false);
    setSearchQuery('');
    navigate(`/products/${product._id}`);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
      <div style={{ 
        maxWidth: 1400, 
        margin: '0 auto', 
        display: 'flex', 
        alignItems: 'center', 
        minHeight: 'clamp(60px, 15vw, 72px)', 
        padding: '0 clamp(16px, 4vw, 32px)', 
        position: 'relative',
        flexWrap: 'wrap',
        gap: 'clamp(12px, 3vw, 16px)'
      }}>
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 'clamp(20px, 5vw, 24px)',
            cursor: 'pointer',
            padding: 'clamp(6px, 1.5vw, 8px)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-dark)',
            '@media (min-width: 768px)': { display: 'none' }
          }}
        >
          ☰
        </button>

        {/* Logo */}
        <div className="logo-area" style={{ 
          display: 'flex', 
          alignItems: 'center',
          flexShrink: 0
        }}>
          <img 
            src={logo1} 
            alt="logo" 
            className="logo-img" 
            onClick={() => navigate('/')}
            style={{ 
              cursor: 'pointer',
              width: 'clamp(120px, 30vw, 160px)',
              height: 'auto'
            }}
          />
        </div>

        {/* Search Bar */}
        <div style={{ 
          flex: 1, 
          margin: '0 clamp(16px, 4vw, 32px)', 
          position: 'relative',
          minWidth: 'clamp(200px, 50vw, 300px)'
        }}>
          <input 
            className="search-bar" 
            placeholder={isSearching ? "Хайж байна..." : "Хайх"} 
            style={{ 
              width: '100%', 
              zIndex: 1,
              padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
              border: '1px solid #ddd',
              borderRadius: 'clamp(4px, 1vw, 6px)',
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              outline: 'none',
              boxSizing: 'border-box'
            }} 
            value={searchQuery}
            onChange={handleSearchInputChange}
            onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
          />
        
          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#fff',
              border: '1px solid #eee',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              maxHeight: 400,
              overflowY: 'auto',
              zIndex: 9999,
              marginTop: 8
            }}>
            {isSearching ? (
              <div style={{ padding: 'clamp(12px, 3vw, 16px)', textAlign: 'center', color: '#666', fontSize: 'clamp(13px, 3vw, 14px)' }}>
                Хайж байна...
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map(product => (
                <div
                  key={product._id}
                  onClick={() => handleSearchResultClick(product)}
                  style={{
                    padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(8px, 2vw, 12px)',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <img 
                    src={product.image || product.thumbnail} 
                    alt={product.name}
                    style={{ 
                      width: 'clamp(32px, 8vw, 40px)', 
                      height: 'clamp(32px, 8vw, 40px)', 
                      objectFit: 'contain', 
                      borderRadius: 4,
                      background: '#f8f8f8'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: 600, 
                      fontSize: 'clamp(12px, 3vw, 14px)', 
                      color: '#222', 
                      marginBottom: 2 
                    }}>
                      {product.name}
                    </div>
                    <div style={{ 
                      fontSize: 'clamp(11px, 2.5vw, 12px)', 
                      color: '#666' 
                    }}>
                      {product.price?.toLocaleString()} ₮
                    </div>
                  </div>
                </div>
              ))
            ) : searchQuery.trim() ? (
              <div style={{ 
                padding: 'clamp(12px, 3vw, 16px)', 
                textAlign: 'center', 
                color: '#666',
                fontSize: 'clamp(13px, 3vw, 14px)'
              }}>
                Хайлтын үр дүн олдсонгүй
              </div>
            ) : null}
          </div>
        )}
        </div>

        {/* Header Icons */}
        <div className="header-icons" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginLeft: 'auto', 
          gap: 'clamp(12px, 3vw, 18px)',
          flexWrap: 'wrap'
        }}>
          <span className="icon-heart" style={{ 
            position: 'relative', 
            cursor: 'pointer',
            fontSize: 'clamp(16px, 4vw, 20px)'
          }}>♡
            {favCount > 0 && <span style={{ 
              position: 'absolute', 
              top: -8, 
              right: -10, 
              background: '#f8991b', 
              color: '#fff', 
              borderRadius: '50%', 
              fontSize: 'clamp(10px, 2.5vw, 12px)', 
              padding: '2px 6px', 
              fontWeight: 700 
            }}>{favCount}</span>}
          </span>
          <span className="icon-cart" style={{ 
            position: 'relative', 
            cursor: 'pointer',
            fontSize: 'clamp(16px, 4vw, 20px)'
          }} onClick={() => navigate('/cart')}>🛒
            {cartCount > 0 && <span style={{ 
              position: 'absolute', 
              top: -8, 
              right: -10, 
              background: '#f8991b', 
              color: '#fff', 
              borderRadius: '50%', 
              fontSize: 'clamp(10px, 2.5vw, 12px)', 
              padding: '2px 6px', 
              fontWeight: 700 
            }}>{cartCount}</span>}
          </span>
          
          {loggedInUser || loggedInCompany ? (
            <div style={{ position: 'relative' }} data-profile-menu>
              <button 
                className="profile-btn" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{ 
                  background: '#f8991b', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 6, 
                  padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)', 
                  fontWeight: 600, 
                  fontSize: 'clamp(12px, 3vw, 14px)', 
                  cursor: 'pointer',
                  minHeight: 'clamp(32px, 8vw, 36px)'
                }}
                data-profile-menu
              >
                {loggedInUser ? `${loggedInUser.firstName} ${loggedInUser.lastName}` : loggedInCompany?.name} 👤
              </button>
              
              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: '#fff',
                  border: '1px solid #eee',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  minWidth: 'clamp(180px, 45vw, 200px)',
                  zIndex: 1000,
                  marginTop: 8
                }} data-profile-menu>
                  <div style={{ 
                    padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)', 
                    borderBottom: '1px solid #eee' 
                  }}>
                    <div style={{ 
                      fontWeight: 600, 
                      color: '#222',
                      fontSize: 'clamp(13px, 3vw, 14px)'
                    }}>
                      {loggedInUser ? `${loggedInUser.firstName} ${loggedInUser.lastName}` : loggedInCompany?.name}
                    </div>
                    <div style={{ 
                      fontSize: 'clamp(12px, 3vw, 13px)', 
                      color: '#666', 
                      marginTop: 2 
                    }}>
                      {loggedInUser ? loggedInUser.email : loggedInCompany?.email}
                    </div>
                  </div>
                  
                  {loggedInUser && (
                    <button
                      onClick={() => { 
                        console.log('User edit clicked'); 
                        setShowProfileMenu(false); 
                        navigate('/user/edit'); 
                      }}
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        color: '#222',
                        borderBottom: '1px solid #eee'
                      }}
                    >
                      ✏️ Мэдээлэл засах
                    </button>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: 'clamp(12px, 3vw, 14px)',
                      color: '#dc3545'
                    }}
                  >
                    🚪 Гарах
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button 
                className="profile-btn" 
                onClick={() => setShowLogin(true)}
                style={{
                  background: 'none',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
                  fontWeight: 600,
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  cursor: 'pointer',
                  minHeight: 'clamp(32px, 8vw, 36px)'
                }}
              >
                Нэвтрэх
              </button>
              <button 
                className="profile-btn" 
                onClick={() => navigate('/register')}
                style={{ 
                  background: '#f8991b', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 6, 
                  padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)', 
                  fontWeight: 600, 
                  fontSize: 'clamp(12px, 3vw, 14px)', 
                  cursor: 'pointer',
                  minHeight: 'clamp(32px, 8vw, 36px)'
                }}
              >
                Бүртгүүлэх
              </button>
            </>
          )}
        </div>
      </div>

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
        background: '#fff',
        zIndex: 1000,
        transition: 'left 0.3s ease',
        padding: 'clamp(20px, 5vw, 32px)',
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
        overflowY: 'auto',
        '@media (min-width: 768px)': { display: 'none' }
      }}>
        <div style={{ marginBottom: 'clamp(24px, 6vw, 32px)' }}>
          <h3 style={{ 
            fontSize: 'clamp(18px, 4.5vw, 20px)', 
            fontWeight: 600, 
            color: 'var(--color-dark)',
            marginBottom: 'clamp(16px, 4vw, 20px)'
          }}>
            Цэс
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 2vw, 12px)' }}>
            <button
              onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: 'clamp(10px, 2.5vw, 12px)',
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                color: '#333',
                cursor: 'pointer',
                borderRadius: 6,
                transition: 'background 0.2s'
              }}
            >
              🏠 Нүүр
            </button>
            <button
              onClick={() => { navigate('/products'); setIsMobileMenuOpen(false); }}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: 'clamp(10px, 2.5vw, 12px)',
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                color: '#333',
                cursor: 'pointer',
                borderRadius: 6,
                transition: 'background 0.2s'
              }}
            >
              📦 Бүх бараа
            </button>
            <button
              onClick={() => { navigate('/cart'); setIsMobileMenuOpen(false); }}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                padding: 'clamp(10px, 2.5vw, 12px)',
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                color: '#333',
                cursor: 'pointer',
                borderRadius: 6,
                transition: 'background 0.2s'
              }}
            >
              🛒 Сагс
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
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
                  fontSize: 'clamp(13px, 3vw, 15px)',
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
                  fontSize: 'clamp(13px, 3vw, 15px)',
                  cursor: 'pointer',
                  transition: 'background 0.18s',
                }}
              >
                Компани
              </button>
            </div>
            <h2 style={{ 
              marginBottom: 18,
              fontSize: 'clamp(18px, 4.5vw, 20px)'
            }}>{loginType === 'company' ? 'Компани нэвтрэх' : 'Хэрэглэгч нэвтрэх'}</h2>
            <input
              type="text"
              placeholder={loginType === 'company' ? 'Компани и-мэйл эсвэл нэр' : 'Имэйл эсвэл утас'}
              style={{ 
                width: '90%', 
                margin: '0 auto 12px auto', 
                display: 'block', 
                padding: 'clamp(8px, 2vw, 10px)', 
                borderRadius: 4, 
                border: '1px solid #ddd',
                fontSize: 'clamp(13px, 3vw, 14px)'
              }}
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Нууц үг"
              style={{ 
                width: '90%', 
                margin: '0 auto 16px auto', 
                display: 'block', 
                padding: 'clamp(8px, 2vw, 10px)', 
                borderRadius: 4, 
                border: '1px solid #ddd',
                fontSize: 'clamp(13px, 3vw, 14px)'
              }}
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
            />
            {loginError && <div style={{ 
              color: 'red', 
              marginBottom: 10,
              fontSize: 'clamp(12px, 3vw, 13px)'
            }}>{loginError}</div>}
            <button
              style={{ 
                width: '100%', 
                background: 'var(--color-accent)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 4, 
                padding: 'clamp(10px, 2.5vw, 12px) 0', 
                fontWeight: 'bold', 
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                cursor: 'pointer'
              }}
              onClick={handleLogin}
            >
              Нэвтрэх
            </button>
            <button
              style={{ 
                width: '100%', 
                marginTop: 10, 
                background: '#eee', 
                color: '#222', 
                border: 'none', 
                borderRadius: 4, 
                padding: 'clamp(8px, 2vw, 10px) 0', 
                fontWeight: 'bold',
                fontSize: 'clamp(13px, 3vw, 14px)',
                cursor: 'pointer'
              }}
              onClick={() => setShowLogin(false)}
            >
              Болих
            </button>
          </div>
        </div>
      )}

      {/* Company Registration Modal */}
      {showRegister && registerType === 'company' && (
        <div className="login-modal-bg" onClick={() => setShowRegister(false)}>
          <div className="login-modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ 
              marginBottom: 18,
              fontSize: 'clamp(18px, 4.5vw, 20px)'
            }}>Компани бүртгүүлэх</h2>
            <input 
              type="text" 
              placeholder="Компани нэр" 
              value={companyReg.name} 
              onChange={e => setCompanyReg({ ...companyReg, name: e.target.value })} 
              style={{ 
                width: '100%', 
                marginBottom: 12, 
                padding: 'clamp(8px, 2vw, 10px)', 
                borderRadius: 4, 
                border: '1px solid #ddd',
                fontSize: 'clamp(13px, 3vw, 14px)'
              }} 
            />
            <input 
              type="email" 
              placeholder="Имэйл" 
              value={companyReg.email} 
              onChange={e => setCompanyReg({ ...companyReg, email: e.target.value })} 
              style={{ 
                width: '100%', 
                marginBottom: 12, 
                padding: 'clamp(8px, 2vw, 10px)', 
                borderRadius: 4, 
                border: '1px solid #ddd',
                fontSize: 'clamp(13px, 3vw, 14px)'
              }} 
            />
            <input 
              type="password" 
              placeholder="Нууц үг" 
              value={companyReg.password} 
              onChange={e => setCompanyReg({ ...companyReg, password: e.target.value })} 
              style={{ 
                width: '100%', 
                marginBottom: 12, 
                padding: 'clamp(8px, 2vw, 10px)', 
                borderRadius: 4, 
                border: '1px solid #ddd',
                fontSize: 'clamp(13px, 3vw, 14px)'
              }} 
            />
            <input 
              type="text" 
              placeholder="Хаяг" 
              value={companyReg.address} 
              onChange={e => setCompanyReg({ ...companyReg, address: e.target.value })} 
              style={{ 
                width: '100%', 
                marginBottom: 12, 
                padding: 'clamp(8px, 2vw, 10px)', 
                borderRadius: 4, 
                border: '1px solid #ddd',
                fontSize: 'clamp(13px, 3vw, 14px)'
              }} 
            />
            <input 
              type="text" 
              placeholder="Холбоо барих" 
              value={companyReg.contact} 
              onChange={e => setCompanyReg({ ...companyReg, contact: e.target.value })} 
              style={{ 
                width: '100%', 
                marginBottom: 12, 
                padding: 'clamp(8px, 2vw, 10px)', 
                borderRadius: 4, 
                border: '1px solid #ddd',
                fontSize: 'clamp(13px, 3vw, 14px)'
              }} 
            />
            <label style={{ 
              display: 'inline-block', 
              padding: 'clamp(8px, 2vw, 10px) clamp(16px, 4vw, 18px)', 
              background: 'var(--color-accent)', 
              color: '#fff', 
              borderRadius: 8, 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              fontSize: 'clamp(12px, 3vw, 14px)', 
              marginBottom: 12,
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              📷 Лого оруулах
              <input type="file" accept="image/*" onChange={handleCompanyLogoChange} style={{ display: 'none' }} />
            </label>
            {companyLogoPreview && <img src={companyLogoPreview} alt="logo preview" style={{ 
              maxWidth: 120, 
              maxHeight: 80, 
              borderRadius: 8, 
              marginBottom: 12, 
              display: 'block',
              margin: '0 auto 12px auto'
            }} />}
            <button style={{ 
              width: '100%', 
              background: 'var(--color-accent)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 4, 
              padding: 'clamp(10px, 2.5vw, 12px) 0', 
              fontWeight: 'bold', 
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              cursor: 'pointer'
            }}>Бүртгүүлэх</button>
            <button onClick={() => setShowRegister(false)} style={{ 
              width: '100%', 
              marginTop: 10, 
              background: '#eee', 
              color: '#222', 
              border: 'none', 
              borderRadius: 4, 
              padding: 'clamp(8px, 2vw, 10px) 0', 
              fontWeight: 'bold',
              fontSize: 'clamp(13px, 3vw, 14px)',
              cursor: 'pointer'
            }}>Болих</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainHeader; 