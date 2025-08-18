import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

function HeaderMenuAdmin() {
  const [menuItems, setMenuItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', link: '', order: '' });

  useEffect(() => {
    fetch(API_ENDPOINTS.HEADER_MENU_ITEMS)
      .then(res => res.json())
      .then(data => setMenuItems(data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch(API_ENDPOINTS.HEADER_MENU_ITEMS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    });
    if (res.ok) {
      const newItem = await res.json();
      setMenuItems([...menuItems, newItem]);
      setEditForm({ name: '', link: '', order: '' });
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API_ENDPOINTS.HEADER_MENU_ITEMS}/${id}`, { method: 'DELETE' });
    setMenuItems(menuItems.filter(item => item._id !== id));
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditForm({ name: item.name, link: item.link, order: item.order });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_ENDPOINTS.HEADER_MENU_ITEMS}/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    });
    if (res.ok) {
      const updatedItem = await res.json();
      setMenuItems(menuItems.map(item => item._id === editId ? updatedItem : item));
      setEditId(null);
      setEditForm({ name: '', link: '', order: '' });
    }
  };

  const clearForm = () => {
    setEditId(null);
    setEditForm({ name: '', link: '', order: '' });
  };

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: 32, background: '#f6f6f6', borderRadius: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(8,15,70,0.08)', padding: 32, marginBottom: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, color: 'var(--color-dark)' }}>Хэдэр цэс удирдах</h2>
        <form onSubmit={editId ? handleUpdate : handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'end', marginBottom: 24 }}>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Цэсний нэр</label>
            <input name="label" placeholder="Цэсний нэр" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Холбоос</label>
            <input name="link" placeholder="Холбоос (e.g. /products)" value={editForm.link} onChange={e => setEditForm({ ...editForm, link: e.target.value })} required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Дараалал</label>
            <input name="order" placeholder="Дараалал" value={editForm.order} onChange={e => setEditForm({ ...editForm, order: e.target.value })} required type="number" style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
          </div>
          <div style={{ gridColumn: '1 / span 3', display: 'flex', gap: 16, marginTop: 8 }}>
            <button type="submit" style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', transition: 'background-color 0.2s', minWidth: '120px' }}>{editId ? 'Шинэчлэх' : 'Нэмэх'}</button>
            {editId && <button type="button" onClick={clearForm} style={{ background: '#f8f9fa', color: '#6c757d', border: '2px solid #e1e5e9', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', transition: 'all 0.2s', minWidth: '120px' }}>Болих</button>}
          </div>
        </form>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(8,15,70,0.08)', padding: 32 }}>
        <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 24, color: 'var(--color-dark)' }}>Цэсний элемент жагсаалт</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {menuItems.map(item => (
            <div key={item._id} style={{ background: '#f9f9f9', border: '1.5px solid #eee', borderRadius: 12, boxShadow: '0 2px 8px rgba(8,15,70,0.04)', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
                📋
              </div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#222', marginBottom: 4, textAlign: 'center' }}>{item.name}</div>
              <div style={{ color: '#888', fontSize: 15, marginBottom: 4, textAlign: 'center', wordBreak: 'break-all' }}>{item.link}</div>
              <div style={{ background: '#e1e5e9', color: '#666', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Дараалал: {item.order}</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => handleEdit(item)} style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}>Засах</button>
                <button onClick={() => handleDelete(item._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}>Устгах</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeaderMenuAdmin; 