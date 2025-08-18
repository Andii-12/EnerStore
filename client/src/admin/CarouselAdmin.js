import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

function CarouselAdmin() {
  const [slides, setSlides] = useState([]);
  const [formData, setFormData] = useState({ title: '', subtitle: '', image: '', link: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', subtitle: '', image: '', link: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [editImagePreview, setEditImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('CarouselAdmin component mounted');
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      console.log('Fetching carousel slides from:', API_ENDPOINTS.CAROUSEL);
      setIsLoading(true);
      setError('');
      
      const res = await fetch(API_ENDPOINTS.CAROUSEL);
      console.log('Response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Carousel slides fetched:', data);
        setSlides(data);
      } else {
        console.error('Failed to fetch carousel slides:', res.status, res.statusText);
        setError(`Failed to fetch slides: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching carousel slides:', error);
      setError(`Error fetching slides: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editId) {
      setEditForm(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editId) {
          setEditForm(prev => ({ ...prev, image: reader.result }));
          setEditImagePreview(reader.result);
        } else {
          setFormData(prev => ({ ...prev, image: reader.result }));
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Submitting carousel slide:', formData);
      const res = await fetch(API_ENDPOINTS.CAROUSEL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const newSlide = await res.json();
        console.log('New slide created:', newSlide);
        setFormData({ title: '', subtitle: '', image: '', link: '' });
        setImagePreview('');
        await fetchSlides();
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Failed to create slide:', res.status, errorData);
        setError(`Failed to create slide: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      console.error('Error creating slide:', error);
      setError(`Error creating slide: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Энэ слайдыг устгахдаа итгэлтэй байна уу?')) {
      try {
        setError('');
        const res = await fetch(`${API_ENDPOINTS.CAROUSEL}/${id}`, { 
          method: 'DELETE' 
        });
        if (res.ok) {
          console.log('Slide deleted successfully');
          await fetchSlides();
        } else {
          console.error('Failed to delete slide:', res.status);
          setError(`Failed to delete slide: ${res.status}`);
        }
      } catch (error) {
        console.error('Error deleting slide:', error);
        setError(`Error deleting slide: ${error.message}`);
      }
    }
  };

  const handleEdit = (slide) => {
    console.log('Editing slide:', slide);
    setEditId(slide._id);
    setEditForm({ 
      title: slide.title || '', 
      subtitle: slide.subtitle || '', 
      image: slide.image || '', 
      link: slide.link || '' 
    });
    setEditImagePreview(slide.image || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Updating slide:', editForm);
      const res = await fetch(`${API_ENDPOINTS.CAROUSEL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      if (res.ok) {
        const updatedSlide = await res.json();
        console.log('Slide updated successfully:', updatedSlide);
        setEditId(null);
        setEditForm({ title: '', subtitle: '', image: '', link: '' });
        setEditImagePreview('');
        await fetchSlides();
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Failed to update slide:', res.status, errorData);
        setError(`Failed to update slide: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      console.error('Error updating slide:', error);
      setError(`Error updating slide: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setEditId(null);
    setEditForm({ title: '', subtitle: '', image: '', link: '' });
    setEditImagePreview('');
    setFormData({ title: '', subtitle: '', image: '', link: '' });
    setImagePreview('');
    setError('');
  };

  console.log('CarouselAdmin render - slides:', slides, 'isLoading:', isLoading, 'error:', error);

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: 'clamp(16px, 4vw, 32px)', 
      background: '#f6f6f6', 
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      {/* Debug Info */}
      <div style={{ 
        background: '#fff', 
        borderRadius: 8, 
        padding: 'clamp(12px, 3vw, 16px)', 
        marginBottom: 16, 
        border: '1px solid #ddd' 
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#666', fontSize: 'clamp(14px, 3.5vw, 16px)' }}>Debug Info:</h4>
        <div style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#888' }}>
          <div>API Endpoint: {API_ENDPOINTS.CAROUSEL}</div>
          <div>Slides Count: {slides.length}</div>
          <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
          <div>Error: {error || 'None'}</div>
        </div>
      </div>

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
          Карусель удирдах
        </h2>
        
        {error && (
          <div style={{ 
            background: '#fee', 
            border: '1px solid #fcc', 
            borderRadius: 8, 
            padding: 'clamp(12px, 3vw, 16px)', 
            marginBottom: 'clamp(20px, 4vw, 32px)', 
            color: '#c33',
            fontSize: 'clamp(13px, 3vw, 14px)',
            lineHeight: 1.4
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {editId ? (
          // Edit Form
          <form onSubmit={handleUpdate} style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 'clamp(16px, 3vw, 24px)', 
            alignItems: 'end',
            marginBottom: 24
          }}>
            <div>
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', fontSize: 'clamp(13px, 3vw, 14px)' }}>Зураг</label>
              <label style={{ 
                display: 'inline-block', 
                padding: 'clamp(10px, 2.5vw, 12px) clamp(20px, 5vw, 24px)', 
                background: 'var(--color-accent)', 
                color: '#fff', 
                borderRadius: 8, 
                cursor: 'pointer', 
                fontWeight: 'bold', 
                fontSize: 'clamp(12px, 3vw, 14px)', 
                transition: 'background-color 0.2s', 
                border: 'none', 
                textAlign: 'center', 
                minWidth: 'clamp(100px, 25vw, 120px)',
                boxSizing: 'border-box'
              }}>
                📷 Зураг сонгох
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
              {editImagePreview && (
                <div style={{ marginTop: 12 }}>
                  <img src={editImagePreview} alt="preview" style={{ maxWidth: 80, maxHeight: 80, border: '2px solid #e1e5e9', borderRadius: 8, objectFit: 'cover' }} />
                </div>
              )}
            </div>
            <div>
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', fontSize: 'clamp(13px, 3vw, 14px)' }}>Гарчиг</label>
              <input name="title" placeholder="Гарчиг" value={editForm.title} onChange={handleChange} required style={{ 
                width: '100%', 
                padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)', 
                border: '2px solid #e1e5e9', 
                borderRadius: 8, 
                fontSize: 'clamp(14px, 3.5vw, 15px)', 
                outline: 'none', 
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }} />
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', marginTop: 'clamp(12px, 3vw, 16px)', fontSize: 'clamp(13px, 3vw, 14px)' }}>Дэд гарчиг</label>
              <input name="subtitle" placeholder="Дэд гарчиг" value={editForm.subtitle} onChange={handleChange} required style={{ 
                width: '100%', 
                padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)', 
                border: '2px solid #e1e5e9', 
                borderRadius: 8, 
                fontSize: 'clamp(14px, 3.5vw, 15px)', 
                outline: 'none', 
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }} />
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', marginTop: 'clamp(12px, 3vw, 16px)', fontSize: 'clamp(13px, 3vw, 14px)' }}>Холбоос</label>
              <input name="link" placeholder="/products/123 эсвэл https://..." value={editForm.link} onChange={handleChange} style={{ 
                width: '100%', 
                padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)', 
                border: '2px solid #e1e5e9', 
                borderRadius: 8, 
                fontSize: 'clamp(14px, 3.5vw, 15px)', 
                outline: 'none', 
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }} />
            </div>
            <div style={{ 
              gridColumn: '1 / span 2', 
              display: 'flex', 
              gap: 'clamp(12px, 3vw, 16px)', 
              marginTop: 8,
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <button type="submit" disabled={isLoading} style={{ 
                background: 'var(--color-accent)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 8, 
                padding: 'clamp(10px, 2.5vw, 12px) clamp(24px, 6vw, 32px)', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                fontSize: 'clamp(13px, 3vw, 15px)', 
                transition: 'background-color 0.2s', 
                minWidth: 'clamp(100px, 25vw, 120px)',
                minHeight: '44px'
              }}>
                {isLoading ? 'Шинэчлэж байна...' : 'Шинэчлэх'}
              </button>
              <button type="button" onClick={clearForm} style={{ 
                background: '#f8f9fa', 
                color: '#6c757d', 
                border: '2px solid #e1e5e9', 
                borderRadius: 8, 
                padding: 'clamp(10px, 2.5vw, 12px) clamp(24px, 6vw, 32px)', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                fontSize: 'clamp(13px, 3vw, 15px)', 
                transition: 'all 0.2s', 
                minWidth: 'clamp(100px, 25vw, 120px)',
                minHeight: '44px'
              }}>
                Болих
              </button>
            </div>
          </form>
        ) : (
          // Add Form
          <form onSubmit={handleSubmit} style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 'clamp(16px, 3vw, 24px)', 
            alignItems: 'end',
            marginBottom: 24
          }}>
            <div>
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', fontSize: 'clamp(13px, 3vw, 14px)' }}>Зураг</label>
              <label style={{ 
                display: 'inline-block', 
                padding: 'clamp(10px, 2.5vw, 12px) clamp(20px, 5vw, 24px)', 
                background: 'var(--color-accent)', 
                color: '#fff', 
                borderRadius: 8, 
                cursor: 'pointer', 
                fontWeight: 'bold', 
                fontSize: 'clamp(12px, 3vw, 14px)', 
                transition: 'background-color 0.2s', 
                border: 'none', 
                textAlign: 'center', 
                minWidth: 'clamp(100px, 25vw, 120px)',
                boxSizing: 'border-box'
              }}>
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
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', fontSize: 'clamp(13px, 3vw, 14px)' }}>Гарчиг</label>
              <input name="title" placeholder="Гарчиг" value={formData.title} onChange={handleChange} required style={{ 
                width: '100%', 
                padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)', 
                border: '2px solid #e1e5e9', 
                borderRadius: 8, 
                fontSize: 'clamp(14px, 3.5vw, 15px)', 
                outline: 'none', 
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }} />
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', marginTop: 'clamp(12px, 3vw, 16px)', fontSize: 'clamp(13px, 3vw, 14px)' }}>Дэд гарчиг</label>
              <input name="subtitle" placeholder="Дэд гарчиг" value={formData.subtitle} onChange={handleChange} required style={{ 
                width: '100%', 
                padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)', 
                border: '2px solid #e1e5e9', 
                borderRadius: 8, 
                fontSize: 'clamp(14px, 3.5vw, 15px)', 
                outline: 'none', 
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }} />
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block', marginTop: 'clamp(12px, 3vw, 16px)', fontSize: 'clamp(13px, 3vw, 14px)' }}>Холбоос</label>
              <input name="link" placeholder="/products/123 эсвэл https://..." value={formData.link} onChange={handleChange} style={{ 
                width: '100%', 
                padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)', 
                border: '2px solid #e1e5e9', 
                borderRadius: 8, 
                fontSize: 'clamp(14px, 3.5vw, 15px)', 
                outline: 'none', 
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }} />
            </div>
            <div style={{ 
              gridColumn: '1 / span 2', 
              display: 'flex', 
              gap: 'clamp(12px, 3vw, 16px)', 
              marginTop: 8,
              justifyContent: 'center'
            }}>
              <button type="submit" disabled={isLoading} style={{ 
                background: 'var(--color-accent)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 8, 
                padding: 'clamp(10px, 2.5vw, 12px) clamp(24px, 6vw, 32px)', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                fontSize: 'clamp(13px, 3vw, 15px)', 
                transition: 'background-color 0.2s', 
                minWidth: 'clamp(100px, 25vw, 120px)',
                minHeight: '44px'
              }}>
                {isLoading ? 'Нэмж байна...' : 'Нэмэх'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div style={{ 
        background: '#fff', 
        borderRadius: 16, 
        boxShadow: '0 2px 12px rgba(8,15,70,0.08)', 
        padding: 'clamp(20px, 4vw, 32px)' 
      }}>
        <h3 style={{ 
          fontWeight: 700, 
          fontSize: 'clamp(18px, 4.5vw, 20px)', 
          marginBottom: 'clamp(20px, 4vw, 32px)', 
          color: 'var(--color-dark)',
          textAlign: 'center'
        }}>
          Карусель жагсаалт
        </h3>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 'clamp(32px, 8vw, 40px) clamp(16px, 4vw, 20px)', color: '#666' }}>
            <div style={{ fontSize: 'clamp(16px, 4vw, 18px)' }}>Уншиж байна...</div>
          </div>
        ) : slides.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'clamp(32px, 8vw, 40px) clamp(16px, 4vw, 20px)', color: '#666' }}>
            <div style={{ fontSize: 'clamp(16px, 4vw, 18px)', marginBottom: 8 }}>Одоогоор карусель слайд байхгүй байна</div>
            <div style={{ fontSize: 'clamp(14px, 3.5vw, 16px)' }}>Дээрх форм ашиглан анхны слайд нэмнэ үү</div>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: 'clamp(16px, 3vw, 24px)' 
          }}>
            {slides.map((slide) => (
              <div key={slide._id} style={{ 
                background: '#f9f9f9', 
                border: '1.5px solid #eee', 
                borderRadius: 12, 
                boxShadow: '0 2px 8px rgba(8,15,70,0.04)', 
                padding: 'clamp(16px, 3vw, 20px)', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 'clamp(10px, 2.5vw, 12px)' 
              }}>
                {slide.image && (
                  <img src={slide.image} alt={slide.title} style={{ 
                    width: 'clamp(100px, 25vw, 120px)', 
                    height: 'clamp(50px, 12.5vw, 60px)', 
                    objectFit: 'cover', 
                    marginBottom: 8, 
                    border: '1.5px solid #e1e5e9', 
                    borderRadius: 8 
                  }} />
                )}
                <div style={{ 
                  fontWeight: 700, 
                  fontSize: 'clamp(14px, 3.5vw, 16px)', 
                  color: '#222', 
                  marginBottom: 4, 
                  textAlign: 'center' 
                }}>
                  {slide.title || 'Гарчиггүй'}
                </div>
                <div style={{ 
                  color: '#888', 
                  fontSize: 'clamp(13px, 3vw, 15px)', 
                  marginBottom: 8, 
                  textAlign: 'center' 
                }}>
                  {slide.subtitle || 'Дэд гарчиггүй'}
                </div>
                {slide.link && (
                  <div style={{ 
                    color: '#0ea5e9', 
                    fontSize: 'clamp(12px, 2.5vw, 14px)', 
                    marginBottom: 8, 
                    textAlign: 'center', 
                    wordBreak: 'break-all' 
                  }}>
                    {slide.link}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 10px)', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button onClick={() => handleDelete(slide._id)} style={{ 
                    background: '#ef4444', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 6, 
                    padding: 'clamp(6px, 1.5vw, 8px) clamp(14px, 3.5vw, 18px)', 
                    fontWeight: 600, 
                    fontSize: 'clamp(12px, 2.5vw, 13px)', 
                    cursor: 'pointer', 
                    transition: 'background 0.2s',
                    minWidth: 'clamp(70px, 17.5vw, 80px)',
                    minHeight: '36px'
                  }}>
                    Устгах
                  </button>
                  <button onClick={() => handleEdit(slide)} style={{ 
                    background: 'var(--color-accent)', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 6, 
                    padding: 'clamp(6px, 1.5vw, 8px) clamp(14px, 3.5vw, 18px)', 
                    fontWeight: 600, 
                    fontSize: 'clamp(12px, 2.5vw, 13px)', 
                    cursor: 'pointer', 
                    transition: 'background-color 0.2s',
                    minWidth: 'clamp(70px, 17.5vw, 80px)',
                    minHeight: '36px'
                  }}>
                    Засах
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CarouselAdmin; 