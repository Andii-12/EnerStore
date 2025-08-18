import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

function CompaniesAdmin() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ name: '', logo: '', address: '', contact: '', email: '', password: '' });
  const [editId, setEditId] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    fetch(API_ENDPOINTS.COMPANIES)
      .then(res => res.json())
      .then(data => setCompanies(data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogoChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setForm({ ...form, logo: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch(API_ENDPOINTS.COMPANIES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const newCompany = await res.json();
      setCompanies([...companies, newCompany]);
      setForm({ name: '', logo: '', address: '', contact: '', email: '', password: '' });
      setLogoPreview('');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API_ENDPOINTS.COMPANIES}/${id}`, { method: 'DELETE' });
    setCompanies(companies.filter(company => company._id !== id));
  };

  const handleEdit = (company) => {
    setEditId(company._id);
    setForm({ name: company.name, logo: company.logo, address: company.address, contact: company.contact, email: company.email || '', password: '' });
    setLogoPreview(company.logo);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_ENDPOINTS.COMPANIES}/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const updatedCompany = await res.json();
      setCompanies(companies.map(company => company._id === editId ? updatedCompany : company));
      setEditId(null);
      setForm({ name: '', logo: '', address: '', contact: '', email: '', password: '' });
      setLogoPreview('');
    }
  };

  const clearForm = () => {
    setEditId(null);
    setForm({ name: '', logo: '', address: '', contact: '', email: '', password: '' });
    setLogoPreview('');
  };

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: 32, background: '#f6f6f6', borderRadius: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(8,15,70,0.08)', padding: 32, marginBottom: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, color: 'var(--color-dark)' }}>Компани бүртгэл</h2>
        <form onSubmit={editId ? handleUpdate : handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'end', marginBottom: 0 }}>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Нэр</label>
            <input name="name" placeholder="Нэр" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Имэйл</label>
            <input name="email" placeholder="Имэйл" value={form.email} onChange={handleChange} required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Нууц үг</label>
            <input name="password" type="password" placeholder="Нууц үг" value={form.password} onChange={handleChange} required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Хаяг</label>
            <input name="address" placeholder="Хаяг" value={form.address} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Холбоо барих</label>
            <input name="contact" placeholder="Холбоо барих" value={form.contact} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Лого</label>
            <label style={{ display: 'inline-block', padding: '12px 24px', background: 'var(--color-accent)', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'background-color 0.2s', border: 'none', textAlign: 'center', minWidth: '120px' }}>
              🖼 Лого оруулах
              <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
            </label>
            {logoPreview && <img src={logoPreview} alt="logo preview" style={{ maxWidth: 48, maxHeight: 48, borderRadius: 8, marginTop: 8 }} />}
          </div>
          <div style={{ gridColumn: '1 / span 3', marginTop: 8 }}>
            <button type="submit" style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', transition: 'background-color 0.2s', minWidth: '120px' }}>{editId ? 'Шинэчлэх' : 'Нэмэх'}</button>
            {editId && <button type="button" onClick={clearForm} style={{ background: '#f8f9fa', color: '#6c757d', border: '2px solid #e1e5e9', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', transition: 'all 0.2s', minWidth: '120px', marginLeft: 16 }}>Болих</button>}
          </div>
        </form>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(8,15,70,0.08)', padding: 32 }}>
        <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 24, color: 'var(--color-dark)' }}>Компани жагсаалт</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {companies.map(c => (
            <div key={c._id} style={{ background: '#f9f9f9', border: '1.5px solid #eee', borderRadius: 12, boxShadow: '0 2px 8px rgba(8,15,70,0.04)', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              {c.logo && <img src={c.logo} alt={c.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginBottom: 8, border: '1.5px solid #e1e5e9' }} />}
              <div style={{ fontWeight: 700, fontSize: 17, color: '#222', marginBottom: 4, textAlign: 'center' }}>{c.name}</div>
              <div style={{ color: '#888', fontSize: 15, marginBottom: 4, textAlign: 'center' }}>{c.email}</div>
              <div style={{ color: '#888', fontSize: 15, marginBottom: 4, textAlign: 'center' }}>{c.address}</div>
              <div style={{ color: '#888', fontSize: 15, marginBottom: 8, textAlign: 'center' }}>{c.contact}</div>
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

export default CompaniesAdmin; 