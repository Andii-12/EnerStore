import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });

  useEffect(() => {
    fetch(API_ENDPOINTS.CUSTOMER_USERS)
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch(API_ENDPOINTS.CUSTOMER_USERS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    });
    if (res.ok) {
      const newUser = await res.json();
      setUsers([...users, newUser]);
      setEditForm({ firstName: '', lastName: '', email: '', phone: '' });
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API_ENDPOINTS.CUSTOMER_USERS}/${id}`, { method: 'DELETE' });
    setUsers(users.filter(user => user._id !== id));
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setEditForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_ENDPOINTS.CUSTOMER_USERS}/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    });
    if (res.ok) {
      const updatedUser = await res.json();
      setUsers(users.map(user => user._id === editId ? updatedUser : user));
      setEditId(null);
      setEditForm({ firstName: '', lastName: '', email: '', phone: '' });
    }
  };

  const clearForm = () => {
    setEditId(null);
    setEditForm({ firstName: '', lastName: '', email: '', phone: '' });
  };

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: 32, background: '#f6f6f6', borderRadius: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(8,15,70,0.08)', padding: 32, marginBottom: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, color: 'var(--color-dark)' }}>Хэрэглэгч бүртгэл</h2>
        <form onSubmit={editId ? handleUpdate : handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'end', marginBottom: 0 }}>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Нэр</label>
            <input name="name" placeholder="Нэр" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Имэйл</label>
            <input name="email" placeholder="Имэйл" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Нууц үг</label>
            <input name="password" type="password" placeholder="Нууц үг" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Утас</label>
            <input name="phone" placeholder="Утас" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Хаяг</label>
            <input name="address" placeholder="Хаяг" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Эрх</label>
            <select name="role" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s', background: '#fff' }}>
              <option value="customer">Хэрэглэгч</option>
              <option value="admin">Админ</option>
            </select>
          </div>
          <div style={{ gridColumn: '1 / span 3', marginTop: 8 }}>
            <button type="submit" style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', transition: 'background-color 0.2s', minWidth: '120px' }}>{editId ? 'Шинэчлэх' : 'Нэмэх'}</button>
            {editId && <button type="button" onClick={clearForm} style={{ background: '#f8f9fa', color: '#6c757d', border: '2px solid #e1e5e9', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', transition: 'all 0.2s', minWidth: '120px', marginLeft: 16 }}>Болих</button>}
          </div>
        </form>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(8,15,70,0.08)', padding: 32 }}>
        <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 24, color: 'var(--color-dark)' }}>Хэрэглэгч жагсаалт</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {users.map(u => (
            <div key={u._id} style={{ background: '#f9f9f9', border: '1.5px solid #eee', borderRadius: 12, boxShadow: '0 2px 8px rgba(8,15,70,0.04)', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{u.name.charAt(0).toUpperCase()}</div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#222', marginBottom: 4, textAlign: 'center' }}>{u.name}</div>
              <div style={{ color: '#888', fontSize: 15, marginBottom: 4, textAlign: 'center' }}>{u.email}</div>
              <div style={{ color: '#888', fontSize: 15, marginBottom: 4, textAlign: 'center' }}>{u.phone}</div>
              <div style={{ color: '#888', fontSize: 15, marginBottom: 4, textAlign: 'center' }}>{u.address}</div>
              <div style={{ background: u.role === 'admin' ? '#ef4444' : '#10b981', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>{u.role === 'admin' ? 'Админ' : 'Хэрэглэгч'}</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => handleEdit(u)} style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}>Засах</button>
                <button onClick={() => handleDelete(u._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}>Устгах</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UsersAdmin; 