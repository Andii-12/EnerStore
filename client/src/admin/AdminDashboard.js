import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { API_ENDPOINTS, SOCKET_CONFIG } from '../config/api';

function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);

  // Brand management state
  const [brands, setBrands] = useState([]);
  const [brandForm, setBrandForm] = useState({ name: '', logo: '', description: '' });
  const [brandLoading, setBrandLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');

  const [editBrandId, setEditBrandId] = useState(null);
  const [editBrandForm, setEditBrandForm] = useState({ name: '', logo: '', description: '' });
  const [editLogoPreview, setEditLogoPreview] = useState('');

  useEffect(() => {
    fetch(API_ENDPOINTS.PRODUCTS)
      .then(res => res.json())
      .then(data => setProductCount(data.length));
    fetch(API_ENDPOINTS.CATEGORIES)
      .then(res => res.json())
      .then(data => setCategoryCount(data.length));
    const socket = io(SOCKET_CONFIG.url, SOCKET_CONFIG.options);
    socket.on('viewerCount', (count) => {
      setViewerCount(count);
    });
    // Fetch brands
    axios.get(API_ENDPOINTS.BRANDS).then(res => setBrands(res.data));
    return () => socket.disconnect();
  }, []);

  const handleBrandInput = e => {
    setBrandForm({ ...brandForm, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setBrandForm(prev => ({ ...prev, logo: reader.result }));
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddBrand = async e => {
    e.preventDefault();
    setBrandLoading(true);
    await axios.post(API_ENDPOINTS.BRANDS, brandForm);
    setBrandForm({ name: '', logo: '', description: '' });
    setLogoPreview('');
    const res = await axios.get(API_ENDPOINTS.BRANDS);
    setBrands(res.data);
    setBrandLoading(false);
  };

  const handleDeleteBrand = async id => {
    await axios.delete(`${API_ENDPOINTS.BRANDS}/${id}`);
    setBrands(brands.filter(b => b._id !== id));
  };

  const handleEditBrandInput = e => {
    setEditBrandForm({ ...editBrandForm, [e.target.name]: e.target.value });
  };

  const handleEditLogoUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditBrandForm(prev => ({ ...prev, logo: reader.result }));
      setEditLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEditBrand = brand => {
    setEditBrandId(brand._id);
    setEditBrandForm({ name: brand.name, logo: brand.logo, description: brand.description });
    setEditLogoPreview(brand.logo);
  };

  const handleUpdateBrand = async e => {
    e.preventDefault();
    await axios.put(`${API_ENDPOINTS.BRANDS}/${editBrandId}`, editBrandForm);
    setEditBrandId(null);
    setEditBrandForm({ name: '', logo: '', description: '' });
    setEditLogoPreview('');
    const res = await axios.get(API_ENDPOINTS.BRANDS);
    setBrands(res.data);
  };

  const handleCancelEdit = () => {
    setEditBrandId(null);
    setEditBrandForm({ name: '', logo: '', description: '' });
    setEditLogoPreview('');
  };

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
        </div>
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