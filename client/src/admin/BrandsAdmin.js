import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

function BrandsAdmin() {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ name: '', logo: '' });
  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetch(API_ENDPOINTS.BRANDS)
      .then(res => res.json())
      .then(data => {
        // Sort brands alphabetically by name
        const sortedBrands = data.sort((a, b) => a.name.localeCompare(b.name, 'mn'));
        setBrands(sortedBrands);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setForm(prev => ({ ...prev, logo: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch(API_ENDPOINTS.BRANDS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const newBrand = await res.json();
      // Add new brand and sort the list
      const updatedBrands = [...brands, newBrand].sort((a, b) => a.name.localeCompare(b.name, 'mn'));
      setBrands(updatedBrands);
      setForm({ name: '', logo: '' });
      setImagePreview('');
    }
  };

  const handleEdit = (brand) => {
    setEditId(brand._id);
    setForm({ name: brand.name, logo: brand.logo });
    setImagePreview(brand.logo);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_ENDPOINTS.BRANDS}/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const updatedBrand = await res.json();
      // Update brand and sort the list
      const updatedBrands = brands.map(brand => 
        brand._id === editId ? updatedBrand : brand
      ).sort((a, b) => a.name.localeCompare(b.name, 'mn'));
      setBrands(updatedBrands);
      setEditId(null);
      setForm({ name: '', logo: '' });
      setImagePreview('');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      const res = await fetch(`${API_ENDPOINTS.BRANDS}/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setBrands(brands.filter(brand => brand._id !== id));
      }
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ name: '', logo: '' });
    setImagePreview('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Brands Management</h2>
      
      {/* Add/Edit Form */}
      <div style={{ 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>
          {editId ? 'Edit Brand' : 'Add New Brand'}
        </h3>
        <form onSubmit={editId ? handleUpdate : handleAdd}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Brand Name:
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Brand Logo:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            {imagePreview && (
              <div style={{ marginTop: '10px' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100px', 
                    maxHeight: '100px', 
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} 
                />
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {editId ? 'Update Brand' : 'Add Brand'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Brands List */}
      <div style={{ 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Existing Brands</h3>
        {brands.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No brands found.</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '15px' 
          }}>
            {brands.map(brand => (
              <div key={brand._id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                background: '#f9f9f9'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                  {brand.logo && (
                    <img 
                      src={brand.logo} 
                      alt={brand.name}
                      style={{ 
                        maxWidth: '80px', 
                        maxHeight: '80px', 
                        objectFit: 'contain',
                        marginBottom: '10px'
                      }} 
                    />
                  )}
                  <h4 style={{ margin: '0', color: '#333' }}>{brand.name}</h4>
                </div>
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                  <button
                    onClick={() => handleEdit(brand)}
                    style={{
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(brand._id)}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
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

export default BrandsAdmin;
