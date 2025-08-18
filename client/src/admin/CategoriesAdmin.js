import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', image: '' });
  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetch(API_ENDPOINTS.CATEGORIES)
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setForm({ ...form, image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch(API_ENDPOINTS.CATEGORIES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const newCategory = await res.json();
      setCategories([...categories, newCategory]);
      setForm({ name: '', image: '' });
      setImagePreview('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API_ENDPOINTS.CATEGORIES}/${id}`, { method: 'DELETE' });
    setCategories(categories.filter(category => category._id !== id));
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setForm({ name: cat.name, image: cat.image });
    setImagePreview(cat.image);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_ENDPOINTS.CATEGORIES}/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const updatedCategory = await res.json();
      setCategories(categories.map(category => category._id === editId ? updatedCategory : category));
      setEditId(null);
      setForm({ name: '', image: '' });
      setImagePreview('');
    }
  };

  const clearForm = () => {
    setEditId(null);
    setForm({ name: '', image: '' });
    setImagePreview('');
  };

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: 32, background: '#f6f6f6', borderRadius: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(8,15,70,0.08)', padding: 32, marginBottom: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, color: 'var(--color-dark)' }}>Ангилал удирдах</h2>
        <form onSubmit={editId ? handleUpdate : handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'end', marginBottom: 0 }}>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Ангиллын нэр</label>
            <input name="name" placeholder="Ангиллын нэр" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Зураг</label>
            <label style={{ display: 'inline-block', padding: '12px 24px', background: 'var(--color-accent)', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'background-color 0.2s', border: 'none', textAlign: 'center', minWidth: '120px' }}>
              🖼 Зураг оруулах
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
            {imagePreview && <img src={imagePreview} alt="preview" style={{ maxWidth: 48, maxHeight: 48, borderRadius: 8, marginTop: 8, display: 'block' }} />}
          </div>
          <div style={{ gridColumn: '1 / span 2', marginTop: 8 }}>
            <button type="submit" style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', transition: 'background-color 0.2s', minWidth: '120px' }}>{editId ? 'Шинэчлэх' : 'Нэмэх'}</button>
            {editId && <button type="button" onClick={clearForm} style={{ background: '#f8f9fa', color: '#6c757d', border: '2px solid #e1e5e9', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', transition: 'all 0.2s', minWidth: '120px', marginLeft: 16 }}>Болих</button>}
          </div>
        </form>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(8,15,70,0.08)', padding: 32 }}>
        <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 24, color: 'var(--color-dark)' }}>Ангиллын жагсаалт</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
          {categories.map(c => (
            <div key={c._id} style={{ background: '#f9f9f9', border: '1.5px solid #eee', borderRadius: 12, boxShadow: '0 2px 8px rgba(8,15,70,0.04)', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <img src={c.image} alt={c.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginBottom: 8, border: '1.5px solid #e1e5e9' }} />
              <div style={{ fontWeight: 700, fontSize: 17, color: '#222', marginBottom: 8, textAlign: 'center' }}>{c.name}</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => handleEdit(c)} style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}>Засах</button>
                <button onClick={() => handleDelete(c._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}>Устгах</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoriesAdmin; 