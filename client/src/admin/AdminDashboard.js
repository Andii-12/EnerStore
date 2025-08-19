import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import io from 'socket.io-client';

function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [brandCount, setBrandCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [carouselCount, setCarouselCount] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState({ name: '', logo: '' });
  const [editingBrand, setEditingBrand] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', logo: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(true);
  const [socket, setSocket] = useState(null);
  const [socketEnabled, setSocketEnabled] = useState(false);
  const [socketStatus, setSocketStatus] = useState('');

  useEffect(() => {
    setIsMounted(true);
    fetchDashboardData();
    
    // Delay Socket.IO initialization to prevent blocking UI
    const socketTimer = setTimeout(() => {
      if (isMounted) {
        initializeSocket();
      }
    }, 200);

    return () => {
      setIsMounted(false);
      if (socket) {
        socket.disconnect();
      }
      clearTimeout(socketTimer);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, categoriesRes, brandsRes, companiesRes, usersRes, carouselRes] = await Promise.all([
        fetch(API_ENDPOINTS.PRODUCTS),
        fetch(API_ENDPOINTS.CATEGORIES),
        fetch(API_ENDPOINTS.BRANDS),
        fetch(API_ENDPOINTS.COMPANIES),
        fetch(API_ENDPOINTS.CUSTOMER_USERS),
        fetch(API_ENDPOINTS.CAROUSEL)
      ]);

      if (isMounted) {
        if (productsRes.ok) setProductCount((await productsRes.json()).length);
        if (categoriesRes.ok) setCategoryCount((await categoriesRes.json()).length);
        if (brandsRes.ok) {
          const brandsData = await brandsRes.json();
          setBrandCount(brandsData.length);
          setBrands(brandsData);
        }
        if (companiesRes.ok) setCompanyCount((await companiesRes.ok).length);
        if (usersRes.ok) setUserCount((await usersRes.json()).length);
        if (carouselRes.ok) setCarouselCount((await carouselRes.json()).length);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  const initializeSocket = () => {
    try {
      const socketInstance = io(process.env.REACT_APP_SOCKET_URL || 'https://enerstore-production.up.railway.app', {
        timeout: 3000,
        transports: ['polling', 'websocket']
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected');
        if (isMounted) {
          setSocketEnabled(true);
          setSocketStatus('Connected');
        }
      });

      socketInstance.on('connect_error', (error) => {
        console.log('Socket connection error:', error);
        if (isMounted) {
          setSocketEnabled(false);
          setSocketStatus('Connection Error');
        }
      });

      socketInstance.on('viewerCount', (count) => {
        if (isMounted) setViewerCount(count);
      });

      // Set timeout to disconnect if connection takes too long
      const socketTimeout = setTimeout(() => {
        if (socketInstance && !socketInstance.connected) {
          console.log('Socket connection timeout');
          socketInstance.disconnect();
          if (isMounted) {
            setSocketEnabled(false);
            setSocketStatus('Connection Timeout - Real-time Features Disabled');
          }
        }
      }, 3000);

      setSocket(socketInstance);
    } catch (error) {
      console.error('Socket initialization error:', error);
      if (isMounted) {
        setSocketEnabled(false);
        setSocketStatus('Real-time Features Disabled');
      }
    }
  };

  const handleBrandInput = (e) => {
    setNewBrand(prev => ({ ...prev, name: e.target.value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBrand(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBrand = async () => {
    if (!newBrand.name.trim()) return;
    
    try {
      const res = await fetch(API_ENDPOINTS.BRANDS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBrand)
      });
      
      if (res.ok) {
        setNewBrand({ name: '', logo: '' });
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error adding brand:', error);
    }
  };

  const handleDeleteBrand = async (id) => {
    if (window.confirm('Энэ брэндийг устгахдаа итгэлтэй байна уу?')) {
      try {
        const res = await fetch(`${API_ENDPOINTS.BRANDS}/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchDashboardData();
        }
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    }
  };

  const handleEditBrandInput = (e) => {
    setEditForm(prev => ({ ...prev, name: e.target.value }));
  };

  const handleEditLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setEditForm({ name: brand.name, logo: brand.logo });
  };

  const handleUpdateBrand = async () => {
    if (!editingBrand || !editForm.name.trim()) return;
    
    try {
      const res = await fetch(`${API_ENDPOINTS.BRANDS}/${editingBrand._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      if (res.ok) {
        setEditingBrand(null);
        setEditForm({ name: '', logo: '' });
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating brand:', error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f6f6f6', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 600, color: 'var(--color-dark)', marginBottom: 16 }}>Уншиж байна...</div>
          <div style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: '#666' }}>Та түр хүлээнэ үү</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: 'clamp(16px, 4vw, 32px)', 
      background: '#f6f6f6', 
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      {/* Socket Status */}
      {socketStatus && (
        <div style={{ 
          background: socketStatus.includes('Connected') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${socketStatus.includes('Connected') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 20,
          color: socketStatus.includes('Connected') ? '#155724' : '#721c24',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          {socketStatus}
        </div>
      )}

      {/* Dashboard Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: 'clamp(16px, 3vw, 24px)', 
        marginBottom: 'clamp(24px, 5vw, 40px)' 
      }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(20px, 4vw, 32px)', boxShadow: '0 2px 12px rgba(8,15,70,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(32px, 8vw, 48px)', fontWeight: 700, color: 'var(--color-accent)', marginBottom: 8 }}>{productCount}</div>
          <div style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: '#666', fontWeight: 600 }}>Бүтээгдэхүүн</div>
        </div>
        
        <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(20px, 4vw, 32px)', boxShadow: '0 2px 12px rgba(8,15,70,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(32px, 8vw, 48px)', fontWeight: 700, color: '#10b981', marginBottom: 8 }}>{categoryCount}</div>
          <div style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: '#666', fontWeight: 600 }}>Ангилал</div>
        </div>
        
        <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(20px, 4vw, 32px)', boxShadow: '0 2px 12px rgba(8,15,70,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(32px, 8vw, 48px)', fontWeight: 700, color: '#f59e0b', marginBottom: 8 }}>{brandCount}</div>
          <div style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: '#666', fontWeight: 600 }}>Брэнд</div>
        </div>
        
        <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(20px, 4vw, 32px)', boxShadow: '0 2px 12px rgba(8,15,70,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(32px, 8vw, 48px)', fontWeight: 700, color: '#8b5cf6', marginBottom: 8 }}>{companyCount}</div>
          <div style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: '#666', fontWeight: 600 }}>Компани</div>
        </div>
        
        <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(20px, 4vw, 32px)', boxShadow: '0 2px 12px rgba(8,15,70,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(32px, 8vw, 48px)', fontWeight: 700, color: '#ef4444', marginBottom: 8 }}>{userCount}</div>
          <div style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: '#666', fontWeight: 600 }}>Хэрэглэгч</div>
        </div>
        
        <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(20px, 4vw, 32px)', boxShadow: '0 2px 12px rgba(8,15,70,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(32px, 8vw, 48px)', fontWeight: 700, color: '#06b6d4', marginBottom: 8 }}>{carouselCount}</div>
          <div style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: '#666', fontWeight: 600 }}>Карусель</div>
        </div>
      </div>

      {/* Live Viewer Count */}
      {socketEnabled && (
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          padding: 'clamp(20px, 4vw, 32px)', 
          boxShadow: '0 2px 12px rgba(8,15,70,0.08)', 
          marginBottom: 'clamp(24px, 5vw, 40px)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'clamp(18px, 4vw, 20px)', fontWeight: 600, color: 'var(--color-dark)', marginBottom: 8 }}>Онлайн хэрэглэгч</div>
          <div style={{ fontSize: 'clamp(24px, 6vw, 32px)', fontWeight: 700, color: 'var(--color-accent)' }}>{viewerCount}</div>
        </div>
      )}

      {/* Brand Management */}
      <div style={{ 
        background: '#fff', 
        borderRadius: 16, 
        boxShadow: '0 2px 12px rgba(8,15,70,0.08)', 
        padding: 'clamp(20px, 4vw, 32px)',
        marginBottom: 'clamp(24px, 5vw, 40px)'
      }}>
        <h2 style={{ 
          fontWeight: 700, 
          fontSize: 'clamp(20px, 5vw, 24px)', 
          marginBottom: 'clamp(20px, 4vw, 32px)', 
          color: 'var(--color-dark)',
          textAlign: 'center'
        }}>
          Брэнд удирдах
        </h2>
        
        {editingBrand ? (
          // Edit Form
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: 'clamp(16px, 3vw, 24px)', 
            alignItems: 'end',
            marginBottom: 24
          }}>
            <div>
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', fontSize: '14px' }}>Брэндийн нэр</label>
              <input
                type="text"
                value={editForm.name}
                onChange={handleEditBrandInput}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e1e5e9',
                  borderRadius: 8,
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="Брэндийн нэр"
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', fontSize: '14px' }}>Лого</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleEditLogoUpload}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '2px solid #e1e5e9',
                  borderRadius: 8,
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={handleUpdateBrand}
                style={{
                  background: 'var(--color-accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background-color 0.2s',
                  minWidth: '100px'
                }}
              >
                Шинэчлэх
              </button>
              <button
                onClick={() => setEditingBrand(null)}
                style={{
                  background: '#f8f9fa',
                  color: '#6c757d',
                  border: '2px solid #e1e5e9',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  minWidth: '100px'
                }}
              >
                Болих
              </button>
            </div>
          </div>
        ) : (
          // Add Form
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: 'clamp(16px, 3vw, 24px)', 
            alignItems: 'end',
            marginBottom: 24
          }}>
            <div>
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', fontSize: '14px' }}>Брэндийн нэр</label>
              <input
                type="text"
                value={newBrand.name}
                onChange={handleBrandInput}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e1e5e9',
                  borderRadius: 8,
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="Брэндийн нэр"
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', fontSize: '14px' }}>Лого</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '2px solid #e1e5e9',
                  borderRadius: 8,
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button
              onClick={handleAddBrand}
              style={{
                background: 'var(--color-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background-color 0.2s',
                minWidth: '100px'
              }}
            >
              Нэмэх
            </button>
          </div>
        )}

        {/* Brands List */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: 'clamp(16px, 3vw, 24px)' 
        }}>
          {brands.map((brand) => (
            <div key={brand._id} style={{ 
              background: '#f9f9f9', 
              border: '1.5px solid #eee', 
              borderRadius: 12, 
              boxShadow: '0 2px 8px rgba(8,15,70,0.04)', 
              padding: 'clamp(16px, 3vw, 20px)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 12 
            }}>
              {brand.logo && (
                <img src={brand.logo} alt={brand.name} style={{ width: 80, height: 40, objectFit: 'contain', marginBottom: 8 }} />
              )}
              <div style={{ fontWeight: 700, fontSize: 'clamp(14px, 3.5vw, 16px)', color: '#222', marginBottom: 4, textAlign: 'center' }}>
                {brand.name}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  onClick={() => handleDeleteBrand(brand._id)}
                  style={{
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 16px',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    minWidth: '80px'
                  }}
                >
                  Устгах
                </button>
                <button
                  onClick={() => handleEditBrand(brand)}
                  style={{
                    background: 'var(--color-accent)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 16px',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    minWidth: '80px'
                  }}
                >
                  Засах
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 