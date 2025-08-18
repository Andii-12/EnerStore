import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '', category: '', brand: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', brand: '' });

  const fetchProducts = (brandId = '') => {
    let url = API_ENDPOINTS.PRODUCTS;
    if (brandId) url += `?brand=${brandId}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  useEffect(() => {
    fetchProducts();
    axios.get(API_ENDPOINTS.BRANDS).then(res => setBrands(res.data));
  }, []);

  useEffect(() => {
    fetchProducts(selectedBrand);
  }, [selectedBrand]);

  useEffect(() => {
    let url = API_ENDPOINTS.PRODUCTS;
    if (editId) {
      url += `?edit=${editId}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [editId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = e => {
    e.preventDefault();
    fetch(API_ENDPOINTS.PRODUCTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price), brand: form.brand })
    })
      .then(res => res.json())
      .then(() => {
        setForm({ name: '', description: '', price: '', image: '', category: '', brand: '' });
        fetchProducts();
      });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`, { method: 'DELETE' })
        .then(() => {
          setProducts(products.filter(p => p._id !== id));
        });
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setEditForm({ name: product.name, price: product.price, brand: product.brand });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    fetch(`${API_ENDPOINTS.PRODUCTS}/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    }).then(() => {
      setEditId(null);
      setEditForm({ name: '', price: '', brand: '' });
      // Refresh products
      fetch(API_ENDPOINTS.PRODUCTS)
        .then(res => res.json())
        .then(data => setProducts(data));
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('mn-MN').format(price);
  };

  return (
    <div style={{ background: '#f6f6f6', minHeight: '100vh', padding: '32px 0' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontWeight: 700, fontSize: '2rem', color: 'var(--color-dark)', margin: '0 0 8px 0' }}>Бараа удирдлага</h1>
          <p style={{ color: '#666', fontSize: 16, margin: 0 }}>Нийт {products.length} бараа</p>
        </div>
        {/* Brand Filter Dropdown */}
        <div style={{ marginBottom: 24 }}>
          <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', fontSize: 15 }}>
            <option value=''>Бүх брэнд</option>
            {brands.map(brand => (
              <option key={brand._id} value={brand._id}>{brand.name}</option>
            ))}
          </select>
        </div>

        {/* Add/Edit Form */}
        <form onSubmit={editId ? handleUpdate : handleAdd} style={{ display: 'flex', gap: 12, marginBottom: 32, alignItems: 'center' }}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Барааны нэр" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', minWidth: 120 }} />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Тайлбар" style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', minWidth: 180 }} />
          <input name="price" value={form.price} onChange={handleChange} placeholder="Үнэ" type="number" required style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', minWidth: 100 }} />
          <input name="image" value={form.image} onChange={handleChange} placeholder="Зураг (URL эсвэл base64)" style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', minWidth: 180 }} />
          <input name="category" value={form.category} onChange={handleChange} placeholder="Ангилал" style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', minWidth: 120 }} />
          <select name="brand" value={form.brand} onChange={handleChange} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', fontSize: 15, minWidth: 120 }}>
            <option value=''>Брэнд сонгох</option>
            {brands.map(brand => (
              <option key={brand._id} value={brand._id}>{brand.name}</option>
            ))}
          </select>
          <button type="submit" style={{ padding: '8px 18px', borderRadius: 6, background: 'var(--color-accent)', color: '#fff', border: 'none', fontWeight: 600 }}>{editId ? 'Хадгалах' : 'Нэмэх'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '', description: '', price: '', image: '', category: '', brand: '' }); }} style={{ padding: '8px 18px', borderRadius: 6, background: '#eee', color: '#333', border: 'none', fontWeight: 500 }}>Болих</button>}
        </form>

        {/* Products Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {products.map(product => (
            <div key={product._id} style={{ 
              background: '#fff', 
              border: '1px solid #e5e7eb', 
              borderRadius: 16, 
              boxShadow: '0 2px 8px rgba(8,15,70,0.06)', 
              padding: 24,
              transition: 'box-shadow 0.2s, transform 0.2s'
            }}>
              {/* Product Image */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={{ 
                    width: '100%', 
                    height: 200, 
                    objectFit: 'contain', 
                    borderRadius: 12, 
                    background: '#f8f8f8',
                    border: '1px solid #f0f0f0'
                  }} 
                />
              </div>
              
              {/* Product Info */}
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontWeight: 700, fontSize: 18, color: 'var(--color-dark)', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                  {product.name}
                </h3>
                <p style={{ color: '#666', fontSize: 14, margin: '0 0 12px 0', lineHeight: 1.4 }}>
                  {product.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    background: '#f3f4f6', 
                    color: '#374151', 
                    padding: '6px 12px', 
                    borderRadius: 6, 
                    fontSize: 12, 
                    fontWeight: 600 
                  }}>
                    {product.category}
                  </span>
                  {product.brand && brands.length > 0 && (
                    <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, marginLeft: 8 }}>
                      {brands.find(b => b._id === (product.brand._id || product.brand))?.name || ''}
                    </span>
                  )}
                  <span style={{ 
                    color: 'var(--color-accent)', 
                    fontWeight: 700, 
                    fontSize: 20 
                  }}>
                    {formatPrice(product.price)} ₮
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  onClick={() => handleEdit(product)} 
                  style={{ 
                    flex: 1,
                    background: 'var(--color-accent)', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    padding: '10px 16px', 
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  Засах
                </button>
                <button 
                  onClick={() => handleDelete(product._id)} 
                  style={{ 
                    flex: 1,
                    background: '#ef4444', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    padding: '10px 16px', 
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  Устгах
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductsAdmin; 