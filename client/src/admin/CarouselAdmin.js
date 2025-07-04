import React, { useState, useEffect } from 'react';

function CarouselAdmin() {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState({ image: '', title: '', subtitle: '', link: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/carousel')
      .then(res => res.json())
      .then(data => setSlides(data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setForm({ ...form, image: e.target.result });
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/carousel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const newSlide = await res.json();
      setSlides([...slides, newSlide]);
      setForm({ image: '', title: '', subtitle: '', link: '' });
      setImagePreview('');
    }
  };

  const handleDelete = async id => {
    await fetch(`http://localhost:5000/api/carousel/${id}`, { method: 'DELETE' });
    setSlides(slides.filter(s => s._id !== id));
  };

  const handleEdit = (slide) => {
    setEditId(slide._id);
    setForm({ image: slide.image, title: slide.title, subtitle: slide.subtitle, link: slide.link || '' });
    setImagePreview(slide.image);
  };

  const handleUpdate = async e => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/api/carousel/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const updated = await res.json();
      setSlides(slides.map(s => s._id === editId ? updated : s));
      setEditId(null);
      setForm({ image: '', title: '', subtitle: '', link: '' });
      setImagePreview('');
    }
  };

  const clearForm = () => {
    setEditId(null);
    setForm({ image: '', title: '', subtitle: '', link: '' });
    setImagePreview('');
  };

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: 32, background: '#f6f6f6', borderRadius: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(8,15,70,0.08)', padding: 32, marginBottom: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, color: 'var(--color-dark)' }}>Карусель удирдах</h2>
        <form onSubmit={editId ? handleUpdate : handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'end', marginBottom: 24 }}>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Зураг</label>
            <label style={{ display: 'inline-block', padding: '12px 24px', background: 'var(--color-accent)', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'background-color 0.2s', border: 'none', textAlign: 'center', minWidth: '120px' }}>
              📷 Зураг оруулах
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
            {imagePreview && (
              <div style={{ marginTop: 12 }}>
                <img src={imagePreview} alt="preview" style={{ maxWidth: 80, maxHeight: 80, border: '2px solid #e1e5e9', borderRadius: 8, objectFit: 'cover' }} />
              </div>
            )}
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Гарчиг</label>
            <input name="title" placeholder="Гарчиг" value={form.title} onChange={handleChange} required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', marginTop: 16 }}>Дэд гарчиг</label>
            <input name="subtitle" placeholder="Дэд гарчиг" value={form.subtitle} onChange={handleChange} required style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', marginTop: 16 }}>Холбоос</label>
            <input name="link" placeholder="/products/123 эсвэл https://..." value={form.link} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e1e5e9', borderRadius: 8, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' }} />
          </div>
          <div style={{ gridColumn: '1 / span 2', display: 'flex', gap: 16, marginTop: 8 }}>
            <button type="submit" style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', transition: 'background-color 0.2s', minWidth: '120px' }}>{editId ? 'Шинэчлэх' : 'Нэмэх'}</button>
            {editId && <button type="button" onClick={clearForm} style={{ background: '#f8f9fa', color: '#6c757d', border: '2px solid #e1e5e9', borderRadius: 8, padding: '12px 32px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', transition: 'all 0.2s', minWidth: '120px' }}>Болих</button>}
          </div>
        </form>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(8,15,70,0.08)', padding: 32 }}>
        <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 24, color: 'var(--color-dark)' }}>Карусель жагсаалт</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {slides.map((s) => (
            <div key={s._id} style={{ background: '#f9f9f9', border: '1.5px solid #eee', borderRadius: 12, boxShadow: '0 2px 8px rgba(8,15,70,0.04)', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <img src={s.image} alt={s.title} style={{ width: 120, height: 60, objectFit: 'cover', borderRadius: 8, marginBottom: 8, border: '1.5px solid #e1e5e9' }} />
              <div style={{ fontWeight: 700, fontSize: 17, color: '#222', marginBottom: 4, textAlign: 'center' }}>{s.title}</div>
              <div style={{ color: '#888', fontSize: 15, marginBottom: 8, textAlign: 'center' }}>{s.subtitle}</div>
              {s.link && <div style={{ color: '#0ea5e9', fontSize: 14, marginBottom: 8, textAlign: 'center', wordBreak: 'break-all' }}>{s.link}</div>}
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => handleDelete(s._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}>Устгах</button>
                <button onClick={() => handleEdit(s)} style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}>Засах</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CarouselAdmin; 