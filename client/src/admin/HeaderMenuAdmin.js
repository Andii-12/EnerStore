import React, { useEffect, useState } from 'react';

function HeaderMenuAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ label: '', link: '', order: 0 });
  const [editId, setEditId] = useState(null);

  const fetchItems = () => {
    fetch('http://localhost:5000/api/header-menu-items')
      .then(res => res.json())
      .then(data => setItems(data));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = e => {
    e.preventDefault();
    fetch('http://localhost:5000/api/header-menu-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, order: Number(form.order) })
    })
      .then(res => res.json())
      .then(() => {
        setForm({ label: '', link: '', order: 0 });
        fetchItems();
      });
  };

  const handleDelete = id => {
    fetch(`http://localhost:5000/api/header-menu-items/${id}`, { method: 'DELETE' })
      .then(() => fetchItems());
  };

  const handleEdit = item => {
    setEditId(item._id);
    setForm({ label: item.label, link: item.link, order: item.order });
  };

  const handleUpdate = e => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/header-menu-items/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, order: Number(form.order) })
    })
      .then(res => res.json())
      .then(() => {
        setEditId(null);
        setForm({ label: '', link: '', order: 0 });
        fetchItems();
      });
  };

  const clearForm = () => {
    setEditId(null);
    setForm({ label: '', link: '', order: 0 });
  };

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: 32, background: '#f6f6f6', borderRadius: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(8,15,70,0.08)', padding: 32, marginBottom: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, color: 'var(--color-dark)' }}>Хэдэр цэс удирдах</h2>
        <form onSubmit={editId ? handleUpdate : handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'end', marginBottom: 24 }}>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Цэсний нэр</label>
            <input name="label" placeholder="Цэсний нэр" value={form.label} onChange={handleChange} required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Холбоос</label>
            <input name="link" placeholder="Холбоос (e.g. /products)" value={form.link} onChange={handleChange} required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Дараалал</label>
            <input name="order" placeholder="Дараалал" value={form.order} onChange={handleChange} required type="number" style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
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
          {items.map(item => (
            <div key={item._id} style={{ background: '#f9f9f9', border: '1.5px solid #eee', borderRadius: 12, boxShadow: '0 2px 8px rgba(8,15,70,0.04)', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
                📋
              </div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#222', marginBottom: 4, textAlign: 'center' }}>{item.label}</div>
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