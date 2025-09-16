import React, { useState, useEffect, useRef } from 'react';
import './MainHeader.css';
import logo1 from './assets/logo2.png';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

function MainHeader() {
  const [showLogin, setShowLogin] = useState(false);
  const [loginType, setLoginType] = useState('user');
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInCompany, setLoggedInCompany] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
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
    
    const user = JSON.parse(localStorage.getItem('user'));
    const company = JSON.parse(localStorage.getItem('company'));
    if (user) setLoggedInUser(user);
    if (company) setLoggedInCompany(company);
    
    return () => window.removeEventListener('storage', updateCounts);
  }, []);

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
        navigate('/');
      } else {
        const data = await res.json();
        setLoginError(data.error || 'Имэйл эсвэл нууц үг буруу байна.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('company');
    setLoggedInUser(null);
    setLoggedInCompany(null);
    setShowProfileMenu(false);
    navigate('/');
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    if (query.trim()) {
      setIsSearching(true);
      searchTimeout.current = setTimeout(() => {
        performSearch(query);
      }, 300);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
    }
  };

  const performSearch = async (query) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.PRODUCT_SEARCH}?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchResultClick = (product) => {
    setSearchQuery('');
    setShowSearchResults(false);
    navigate(`/products/${product._id}`);
  };

  return (
    <div className="main-header-container">
      {/* Desktop Header */}
      <div className="desktop-header">
        <div className="header-content">
          {/* Logo */}
          <div className="logo-area">
            <img 
              src={logo1} 
              alt="logo" 
              className="logo-img" 
              onClick={() => navigate('/')}
            />
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <input 
              className="search-bar" 
              placeholder={isSearching ? "Хайж байна..." : "Хайх"} 
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="search-results">
                {isSearching ? (
                  <div className="search-loading">
                    Хайж байна...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(product => (
                    <div
                      key={product._id}
                      className="search-result-item"
                      onClick={() => handleSearchResultClick(product)}
                    >
                      <img 
                        src={product.image || product.thumbnail} 
                        alt={product.name}
                        className="search-result-image"
                      />
                      <div className="search-result-info">
                        <div className="search-result-name">
                          {product.name}
                        </div>
                        <div className="search-result-price">
                          {product.price} ₮
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-no-results">
                    Хайлтын үр дүн олдсонгүй
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Header Icons and Buttons */}
          <div className="header-actions">
            <span className="icon-heart">
              ♡
              {favCount > 0 && <span className="icon-badge">{favCount}</span>}
            </span>
            <span className="icon-cart" onClick={() => navigate('/cart')}>
              🛒
              {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
            </span>
            
            {loggedInUser || loggedInCompany ? (
              <div className="profile-container" data-profile-menu>
                <button 
                  className="profile-btn logged-in" 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  data-profile-menu
                >
                  {loggedInUser ? `${loggedInUser.firstName} ${loggedInUser.lastName}` : loggedInCompany?.name} 👤
                </button>
                
                {showProfileMenu && (
                  <div className="profile-menu" data-profile-menu>
                    <div className="profile-info">
                      <div className="profile-name">
                        {loggedInUser ? `${loggedInUser.firstName} ${loggedInUser.lastName}` : loggedInCompany?.name}
                      </div>
                      <div className="profile-email">
                        {loggedInUser ? loggedInUser.email : loggedInCompany?.email}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/user/edit')}
                      className="profile-menu-item"
                    >
                      ✏️ Профайл засах
                    </button>
                    <button
                      onClick={() => {
                        navigate('/user-orders');
                        setShowProfileMenu(false);
                      }}
                      className="profile-menu-item"
                    >
                      📦 Захиалга
                    </button>
                    <button
                      onClick={handleLogout}
                      className="profile-menu-item logout"
                    >
                      🚪 Гарах
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <button 
                  className="login-btn" 
                  onClick={() => setShowLogin(true)}
                >
                  Нэвтрэх
                </button>
                <button 
                  className="register-btn" 
                  onClick={() => navigate('/register')}
                >
                  Бүртгүүлэх
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="mobile-header">
        {/* Mobile Top Row - Logo and Icons */}
        <div className="mobile-top-row">
          <div className="mobile-logo">
            <img 
              src={logo1} 
              alt="logo" 
              onClick={() => navigate('/')}
            />
          </div>
          <div className="mobile-icons">
            <span className="mobile-icon">♡
              {favCount > 0 && <span className="mobile-icon-badge">{favCount}</span>}
            </span>
            <span className="mobile-icon" onClick={() => navigate('/cart')}>🛒
              {cartCount > 0 && <span className="mobile-icon-badge">{cartCount}</span>}
            </span>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="mobile-search-row">
          <input 
            className="mobile-search-bar" 
            placeholder={isSearching ? "Хайж байна..." : "Хайх"} 
            value={searchQuery}
            onChange={handleSearchInputChange}
            onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
          />
        </div>

        {/* Mobile Buttons Row */}
        <div className="mobile-buttons-row">
          {loggedInUser || loggedInCompany ? (
            <button 
              className="mobile-profile-btn" 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              {loggedInUser ? `${loggedInUser.firstName} ${loggedInUser.lastName}` : loggedInCompany?.name} 👤
            </button>
          ) : (
            <>
              <button 
                className="mobile-login-btn" 
                onClick={() => setShowLogin(true)}
              >
                Нэвтрэх
              </button>
              <button 
                className="mobile-register-btn" 
                onClick={() => navigate('/register')}
              >
                Бүртгүүлэх
              </button>
            </>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="login-modal-bg" onClick={() => setShowLogin(false)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="login-title">
              {loginType === 'company' ? 'Компани нэвтрэх' : 'Хэрэглэгч нэвтрэх'}
            </h2>
            
            <div className="login-type-selector">
              <button
                onClick={() => setLoginType('user')}
                className={`type-btn ${loginType === 'user' ? 'active' : ''}`}
              >
                Хэрэглэгч
              </button>
              <button
                onClick={() => setLoginType('company')}
                className={`type-btn ${loginType === 'company' ? 'active' : ''}`}
              >
                Компани
              </button>
            </div>

            <input
              type="email"
              placeholder="Имэйл"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="Нууц үг"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="login-input"
            />
            
            {loginError && (
              <div className="login-error">
                {loginError}
              </div>
            )}
            
            <button
              onClick={handleLogin}
              className="login-submit-btn"
            >
              Нэвтрэх
            </button>
            
            <div className="login-footer">
              Бүртгэл байхгүй юу?{' '}
              <button
                onClick={() => {
                  setShowLogin(false);
                  navigate('/register');
                }}
                className="login-link"
              >
                Бүртгүүлэх
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainHeader; 