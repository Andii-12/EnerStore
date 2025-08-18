import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { API_ENDPOINTS, SOCKET_CONFIG } from '../config/api';

function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const [isLoading, setIsLoading] = useState(true);
  const [socketEnabled, setSocketEnabled] = useState(true);

  // Brand management state
  const [brands, setBrands] = useState([]);
  const [brandForm, setBrandForm] = useState({ name: '', logo: '', description: '' });
  const [brandLoading, setBrandLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');

  const [editBrandId, setEditBrandId] = useState(null);
  const [editBrandForm, setEditBrandForm] = useState({ name: '', logo: '', description: '' });
  const [editLogoPreview, setEditLogoPreview] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    // Fetch basic data
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(API_ENDPOINTS.PRODUCTS),
          fetch(API_ENDPOINTS.CATEGORIES)
        ]);
        
        if (isMounted) {
          if (productsRes.ok) {
            const products = await productsRes.json();
            setProductCount(products.length);
          }
          
          if (categoriesRes.ok) {
            const categories = await categoriesRes.json();
            setCategoryCount(categories.length);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Socket.IO connection with better error handling - make it optional
    let socket = null;
    let socketTimeout = null;

    const initializeSocket = () => {
      if (!socketEnabled) return;
      
      try {
        socket = io(SOCKET_CONFIG.url, {
          ...SOCKET_CONFIG.options,
          timeout: 3000, // Very short timeout
          forceNew: true,
          autoConnect: false
        });

        // Set a timeout for socket connection
        socketTimeout = setTimeout(() => {
          if (socket && !socket.connected) {
            console.log('Socket connection timeout, disabling real-time features');
            setSocketStatus('timeout');
            setSocketEnabled(false);
            if (socket) {
              socket.disconnect();
              socket = null;
            }
          }
        }, 2000);

        socket.on('connect', () => {
          console.log('Socket connected:', socket.id);
          if (isMounted) {
            setSocketStatus('connected');
            clearTimeout(socketTimeout);
          }
        });

        socket.on('disconnect', () => {
          console.log('Socket disconnected');
          if (isMounted) {
            setSocketStatus('disconnected');
          }
        });

        socket.on('connect_error', (error) => {
          console.log('Socket connection error (non-critical):', error.message);
          if (isMounted) {
            setSocketStatus('error');
            setSocketEnabled(false);
            clearTimeout(socketTimeout);
            if (socket) {
              socket.disconnect();
              socket = null;
            }
          }
        });

        socket.on('viewerCount', (count) => {
          if (isMounted) {
            setViewerCount(count);
          }
        });

        // Try to connect
        socket.connect();

      } catch (error) {
        console.log('Socket initialization failed (non-critical):', error.message);
        if (isMounted) {
          setSocketStatus('error');
          setSocketEnabled(false);
        }
      }
    };

    // Initialize socket with a delay to prevent blocking the main UI
    const socketDelay = setTimeout(initializeSocket, 200);

    // Fetch brands
    const fetchBrands = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.BRANDS);
        if (isMounted) {
          setBrands(res.data);
        }
      } catch (err) {
        console.error('Error fetching brands:', err);
      }
    };

    fetchBrands();

    return () => {
      isMounted = false;
      clearTimeout(socketDelay);
      clearTimeout(socketTimeout);
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socketEnabled]);

  const handleBrandInput = (e) => {
    setBrandForm({ ...brandForm, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setBrandForm(prev => ({ ...prev, logo: reader.result }));
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    setBrandLoading(true);
    try {
      await axios.post(API_ENDPOINTS.BRANDS, brandForm);
      setBrandForm({ name: '', logo: '', description: '' });
      setLogoPreview('');
      const res = await axios.get(API_ENDPOINTS.BRANDS);
      setBrands(res.data);
    } catch (error) {
      console.error('Error adding brand:', error);
    } finally {
      setBrandLoading(false);
    }
  };

  const handleDeleteBrand = async (id) => {
    try {
      await axios.delete(`${API_ENDPOINTS.BRANDS}/${id}`);
      setBrands(brands.filter(b => b._id !== id));
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const handleEditBrandInput = (e) => {
    setEditBrandForm({ ...editBrandForm, [e.target.name]: e.target.value });
  };

  const handleEditLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditBrandForm(prev => ({ ...prev, logo: reader.result }));
      setEditLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEditBrand = (brand) => {
    setEditBrandId(brand._id);
    setEditBrandForm({ name: brand.name, logo: brand.logo, description: brand.description });
    setEditLogoPreview(brand.logo);
  };

  const handleUpdateBrand = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_ENDPOINTS.BRANDS}/${editBrandId}`, editBrandForm);
      setEditBrandId(null);
      setEditBrandForm({ name: '', logo: '', description: '' });
      setEditLogoPreview('');
      const res = await axios.get(API_ENDPOINTS.BRANDS);
      setBrands(res.data);
    } catch (error) {
      console.error('Error updating brand:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditBrandId(null);
    setEditBrandForm({ name: '', logo: '', description: '' });
    setEditLogoPreview('');
  };

  const getSocketStatusColor = () => {
    switch (socketStatus) {
      case 'connected': return '#22c55e';
      case 'disconnected': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'timeout': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getSocketStatusText = () => {
    switch (socketStatus) {
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'error': return 'Error';
      case 'timeout': return 'Timeout';
      default: return 'Unknown';
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ background: '#f6f6f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-dark)', marginBottom: 16 }}>Loading Dashboard...</div>
          <div style={{ fontSize: 16, color: '#666' }}>Please wait while we fetch your data</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f6f6f6', minHeight: '100vh', padding: 0 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 0' }}>
        {/* Dashboard Cards */}
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 36 }}>
          <div style={{ flex: 1, minWidth: 220, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, boxShadow: '0 2px 8px rgba(8,15,70,0.06)', padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 15, color: 'var(--color-dark)', marginBottom: 8 }}>Нийт бараа</div>
            <div style={{ fontWeight: 700, fontSize: 28, color: 'var(--color-accent)' }}>{productCount}</div>
          </div>
          <div style={{ flex: 1, minWidth: 220, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, boxShadow: '0 2px 8px rgba(8,15,70,0.06)', padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 15, color: 'var(--color-dark)', marginBottom: 8 }}>Нийт ангилал</div>
            <div style={{ fontWeight: 700, fontSize: 28, color: 'var(--color-accent)' }}>{categoryCount}</div>
          </div>
          <div style={{ flex: 1, minWidth: 220, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, boxShadow: '0 2px 8px rgba(8,15,70,0.06)', padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 15, color: 'var(--color-dark)', marginBottom: 8 }}>Хандалт</div>
            <div style={{ fontWeight: 700, fontSize: 28, color: 'var(--color-accent)' }}>{viewerCount}</div>
          </div>
          <div style={{ flex: 1, minWidth: 220, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, boxShadow: '0 2px 8px rgba(8,15,70,0.06)', padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 15, color: 'var(--color-dark)', marginBottom: 8 }}>Socket Status</div>
            <div style={{ fontWeight: 700, fontSize: 28, color: getSocketStatusColor() }}>{getSocketStatusText()}</div>
          </div>
        </div>

        {/* Socket Status Info */}
        {socketStatus === 'error' && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 16, marginBottom: 24, color: '#dc2626' }}>
            <strong>Socket.IO Connection Issue:</strong> The real-time features may not work properly. 
            This is likely due to Railway's WebSocket configuration. The admin dashboard will still function for basic operations.
          </div>
        )}

        {socketStatus === 'timeout' && (
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, padding: 16, marginBottom: 24, color: '#92400e' }}>
            <strong>Socket.IO Timeout:</strong> Real-time connection timed out. The dashboard will continue to work normally without live updates.
          </div>
        )}

        {!socketEnabled && (
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: 16, marginBottom: 24, color: '#0c4a6e' }}>
            <strong>Real-time Features Disabled:</strong> Socket.IO has been disabled due to connection issues. 
            The dashboard is fully functional for all CRUD operations.
          </div>
        )}

        {/* Chart Placeholder */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, boxShadow: '0 2px 8px rgba(8,15,70,0.06)', padding: 32, minHeight: 260, marginBottom: 48 }}>
          <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--color-dark)', marginBottom: 16 }}>Статистик (placeholder)</div>
          <div style={{ width: '100%', height: 180, background: 'rgba(8,15,70,0.06)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-dark)', fontSize: 22, opacity: 0.5 }}>
            Chart.js or Recharts here
          </div>
        </div>

        {/* Brand Management Section */}
        <section style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, margin: '32px 0', padding: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Брэндүүд</h2>
          <form onSubmit={handleAddBrand} style={{ display: 'flex', gap: 12, marginBottom: 18, alignItems: 'center' }}>
            <input name="name" value={brandForm.name} onChange={handleBrandInput} placeholder="Брэнд нэр" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', minWidth: 120 }} />
            <input name="description" value={brandForm.description} onChange={handleBrandInput} placeholder="Тайлбар (заавал биш)" style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', minWidth: 180 }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', background: '#f3f4f6', borderRadius: 6, padding: '8px 14px', border: '1px solid #ddd' }}>
              <span>Лого оруулах</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
            </label>
            {logoPreview && <img src={logoPreview} alt="logo preview" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 4, border: '1px solid #eee' }} />}
            <button type="submit" disabled={brandLoading} style={{ padding: '8px 18px', borderRadius: 6, background: 'var(--color-accent)', color: '#fff', border: 'none', fontWeight: 600 }}>Нэмэх</button>
          </form>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
            {brands.map(brand => (
              <div key={brand._id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, minWidth: 220, background: '#fafbfc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {editBrandId === brand._id ? (
                  <form onSubmit={handleUpdateBrand} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <input name="name" value={editBrandForm.name} onChange={handleEditBrandInput} placeholder="Брэнд нэр" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', minWidth: 120 }} />
                    <input name="description" value={editBrandForm.description} onChange={handleEditBrandInput} placeholder="Тайлбар (заавал биш)" style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', minWidth: 180 }} />
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', background: '#f3f4f6', borderRadius: 6, padding: '8px 14px', border: '1px solid #ddd' }}>
                      <span>Лого оруулах</span>
                      <input type="file" accept="image/*" onChange={handleEditLogoUpload} style={{ display: 'none' }} />
                    </label>
                    {editLogoPreview && <img src={editLogoPreview} alt="logo preview" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 4, border: '1px solid #eee' }} />}
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button type="submit" style={{ padding: '6px 14px', borderRadius: 6, background: 'var(--color-accent)', color: '#fff', border: 'none', fontWeight: 600 }}>Хадгалах</button>
                      <button type="button" onClick={handleCancelEdit} style={{ padding: '6px 14px', borderRadius: 6, background: '#eee', color: '#333', border: 'none', fontWeight: 500 }}>Болих</button>
                    </div>
                  </form>
                ) : (
                  <>
                    {brand.logo && <img src={brand.logo} alt={brand.name} style={{ width: 60, height: 60, objectFit: 'contain', marginBottom: 8 }} />}
                    <div style={{ fontWeight: 600, fontSize: 17 }}>{brand.name}</div>
                    <div style={{ color: '#888', fontSize: 14, margin: '6px 0 10px 0' }}>{brand.description}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEditBrand(brand)} style={{ background: '#e0e7ff', color: '#3730a3', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 500, cursor: 'pointer' }}>Засах</button>
                      <button onClick={() => handleDeleteBrand(brand._id)} style={{ background: '#ffeded', color: '#d00', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 500, cursor: 'pointer' }}>Устгах</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard; 