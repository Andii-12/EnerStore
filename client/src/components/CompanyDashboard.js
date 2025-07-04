import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CompanyDashboard() {
  const [products, setProducts] = useState([]);
  const [company, setCompany] = useState(null);
  const [view, setView] = useState('products');
  const [settingsForm, setSettingsForm] = useState({ name: '', email: '', password: '', logo: '' });
  const [logoPreview, setLogoPreview] = useState('');
  const [settingsMsg, setSettingsMsg] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({ 
    name: '', 
    price: '', 
    description: '', 
    thumbnail: '', 
    images: [], 
    categories: [],
    piece: '',
    brand: '' // Add brand field
  });
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [imagesPreview, setImagesPreview] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productMsg, setProductMsg] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', description: '', thumbnail: '', categories: [], piece: '', brand: '' });
  const [editImagePreview, setEditImagePreview] = useState('');
  const [editImagesPreview, setEditImagesPreview] = useState([]);
  const [saleProduct, setSaleProduct] = useState(null);
  const [salePercent, setSalePercent] = useState(10);
  const [saleDuration, setSaleDuration] = useState(1); // in days
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [brands, setBrands] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Get company info from localStorage (after login)
    const companyData = JSON.parse(localStorage.getItem('company'));
    setCompany(companyData);
    if (companyData) {
      setSettingsForm({ name: companyData.name, email: companyData.email, password: '', logo: companyData.logo });
      setLogoPreview(companyData.logo);
      fetch(`http://localhost:5000/api/products/company/${companyData._id}`)
        .then(res => res.json())
        .then(data => setProducts(data));
      
      // Fetch categories for product form
      fetch('http://localhost:5000/api/categories')
        .then(res => res.json())
        .then(data => {
          setCategories(data);
          // Automatically select "Бүх бараа" category
          const allProductsCategory = data.find(cat => cat.name === 'Бүх бараа');
          if (allProductsCategory) {
            setProductForm(prev => ({ ...prev, categories: [allProductsCategory._id] }));
          }
        });
    }
    // Fetch brands for product form
    axios.get('http://localhost:5000/api/brands').then(res => setBrands(res.data));
  }, []);

  if (!company) return <div style={{ padding: 40 }}>Та эхлээд нэвтэрнэ үү.</div>;

  const handleLogoChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setSettingsForm({ ...settingsForm, logo: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSettingsChange = e => setSettingsForm({ ...settingsForm, [e.target.name]: e.target.value });

  const handleSettingsSave = async e => {
    e.preventDefault();
    setSettingsMsg('');
    const res = await fetch(`http://localhost:5000/api/companies/${company._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsForm)
    });
    if (res.ok) {
      const updated = await res.json();
      setCompany(updated);
      localStorage.setItem('company', JSON.stringify(updated));
      setSettingsMsg('Амжилттай хадгаллаа!');
    } else {
      setSettingsMsg('Алдаа гарлаа.');
    }
  };

  const handleThumbnailChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
        setProductForm({ ...productForm, thumbnail: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = e => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [];
      const newPreviews = [];
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push(e.target.result);
          newPreviews.push(e.target.result);
          
          if (newImages.length === files.length) {
            setProductForm({ ...productForm, images: [...productForm.images, ...newImages] });
            setImagesPreview([...imagesPreview, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    const newImages = productForm.images.filter((_, i) => i !== index);
    const newPreviews = imagesPreview.filter((_, i) => i !== index);
    setProductForm({ ...productForm, images: newImages });
    setImagesPreview(newPreviews);
  };

  const handleProductChange = e => setProductForm({ ...productForm, [e.target.name]: e.target.value });

  const handleCategoryChange = (categoryId) => {
    const newCategories = productForm.categories.includes(categoryId)
      ? productForm.categories.filter(id => id !== categoryId)
      : [...productForm.categories, categoryId];
    setProductForm({ ...productForm, categories: newCategories });
  };

  const handleAddProduct = async e => {
    e.preventDefault();
    setProductMsg('');
    
    const newProduct = {
      ...productForm,
      companyId: company._id,
      soldCount: 0
    };

    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });

    if (res.ok) {
      const createdProduct = await res.json();
      setProducts([...products, createdProduct]);
      
      // Reset form with default "Бүх бараа" category selected
      const allProductsCategory = categories.find(cat => cat.name === 'Бүх бараа');
      setProductForm({ 
        name: '', 
        price: '', 
        description: '', 
        thumbnail: '', 
        images: [], 
        categories: allProductsCategory ? [allProductsCategory._id] : [],
        piece: '', // Reset piece
        brand: '' // Reset brand
      });
      setThumbnailPreview('');
      setImagesPreview([]);
      setShowAddProduct(false);
      setProductMsg('Бүтээгдэхүүн амжилттай нэмэгдлээ!');
      setTimeout(() => setProductMsg(''), 3000);
    } else {
      setProductMsg('Алдаа гарлаа.');
    }
  };

  // Delete product handler
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Та энэ бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?')) return;
    const res = await fetch(`http://localhost:5000/api/products/${productId}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts(products.filter(p => p._id !== productId));
    }
  };

  function handleEditProduct(product) {
    setEditProduct(product);
    setEditForm({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      thumbnail: product.thumbnail || product.image || '',
      images: Array.isArray(product.images) ? product.images : [],
      categories: Array.isArray(product.categories) ? product.categories.map(cat => cat._id || cat) : [],
      piece: product.piece || '',
      brand: product.brand?._id || product.brand || ''
    });
    setEditImagePreview(product.thumbnail || product.image || '');
    setEditImagesPreview(Array.isArray(product.images) ? product.images : []);
  }

  function handleEditFormChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  async function handleEditFormSubmit(e) {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/api/products/${editProduct._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editProduct, ...editForm, price: Number(editForm.price) })
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts(products.map(p => p._id === updated._id ? updated : p));
      setEditProduct(null);
    } else {
      alert('Засахад алдаа гарлаа!');
    }
  }

  function handleEditImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditImagePreview(ev.target.result);
        setEditForm(form => ({ ...form, thumbnail: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  function handleEditImagesChange(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [];
      const newPreviews = [];
      let loaded = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          newImages.push(ev.target.result);
          newPreviews.push(ev.target.result);
          loaded++;
          if (loaded === files.length) {
            setEditForm(form => ({ ...form, images: [...form.images, ...newImages] }));
            setEditImagesPreview(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  function removeEditImage(index) {
    setEditForm(form => ({ ...form, images: form.images.filter((_, i) => i !== index) }));
    setEditImagesPreview(prev => prev.filter((_, i) => i !== index));
  }

  function handleEditCategoryChange(categoryId) {
    setEditForm(form => ({
      ...form,
      categories: form.categories.includes(categoryId)
        ? form.categories.filter(id => id !== categoryId)
        : [...form.categories, categoryId]
    }));
  }

  function handleEditModalClose() {
    setEditProduct(null);
  }

  // Sale handler: decrease price by 10% and update backend, with confirmation
  async function handleSaleProduct(product) {
    if (!window.confirm('Энэ барааны үнийг 10%-иар бууруулах уу?')) return;
    const newPrice = Math.round(product.price * 0.9);
    const res = await fetch(`http://localhost:5000/api/products/${product._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, price: newPrice })
    });
    if (res.ok) {
      setProducts(products.map(p => p._id === product._id ? { ...p, price: newPrice } : p));
    } else {
      alert('Хямдруулахад алдаа гарлаа!');
    }
  }

  function handleSaleProductModal(product) {
    setSaleProduct(product);
    setSalePercent(10);
    setSaleDuration(1);
  }

  function handleSalePercentChange(e) {
    let val = e.target.value;
    // Allow empty string for flexible editing
    if (val === '') {
      setSalePercent('');
      return;
    }
    val = parseInt(val, 10);
    if (isNaN(val)) val = '';
    else if (val < 1) val = 1;
    else if (val > 99) val = 99;
    setSalePercent(val);
  }

  function handleSaleDurationChange(e) {
    let val = e.target.value;
    if (val === '') {
      setSaleDuration('');
      return;
    }
    val = parseInt(val, 10);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 365) val = 365;
    setSaleDuration(val);
  }

  async function handleSaleConfirm() {
    if (!saleProduct) return;
    let percent = parseInt(salePercent, 10);
    if (isNaN(percent) || percent < 1) percent = 1;
    if (percent > 99) percent = 99;
    // Only set originalPrice if not already set
    const oldPrice = saleProduct.originalPrice || saleProduct.price;
    const newPrice = Math.round(oldPrice * (1 - percent / 100));
    const now = new Date();
    const end = new Date(now.getTime() + (parseInt(saleDuration, 10) || 1) * 24 * 60 * 60 * 1000);
    const body = {
      ...saleProduct,
      price: newPrice,
      thumbnail: saleProduct.thumbnail || saleProduct.image || '',
      image: saleProduct.image || saleProduct.thumbnail || '',
      images: saleProduct.images || [],
      saleEnd: end,
      originalPrice: saleProduct.originalPrice || saleProduct.price,
    };
    const res = await fetch(`http://localhost:5000/api/products/${saleProduct._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      setProducts(products.map(p => p._id === saleProduct._id ? { ...p, price: newPrice, saleEnd: end, originalPrice: body.originalPrice } : p));
      setSaleProduct(null);
    } else {
      alert('Хямдруулахад алдаа гарлаа!');
    }
  }

  async function handleRemoveSale() {
    if (!saleProduct) return;
    const body = {
      ...saleProduct,
      price: saleProduct.originalPrice || saleProduct.price,
      thumbnail: saleProduct.thumbnail || saleProduct.image || '',
      image: saleProduct.image || saleProduct.thumbnail || '',
      images: saleProduct.images || [],
      saleEnd: null,
      originalPrice: null,
    };
    const res = await fetch(`http://localhost:5000/api/products/${saleProduct._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      setProducts(products.map(p => p._id === saleProduct._id ? { ...p, price: body.price, saleEnd: null, originalPrice: null } : p));
      setSaleProduct(null);
    } else {
      alert('Хямдрал устгахад алдаа гарлаа!');
    }
  }

  function handleSaleModalClose() {
    setSaleProduct(null);
  }

  const handleLogout = () => {
    localStorage.removeItem('company');
    setCompany(null);
    navigate('/');
  };

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => Array.isArray(p.categories) && p.categories.includes(selectedCategory));

  return (
    <div style={{ minHeight: '100vh', background: '#f6f6f6' }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside style={{ width: 220, background: 'var(--color-dark)', color: '#fff', display: 'flex', flexDirection: 'column', padding: '32px 0', boxShadow: '2px 0 12px rgba(8,15,70,0.06)' }}>
          <div style={{ fontWeight: 700, fontSize: 24, letterSpacing: 1, textAlign: 'center', marginBottom: 40 }}>
            <span style={{ color: 'var(--color-accent)' }}>Companies</span>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 24px' }}>
            <span onClick={() => setView('products')} style={{ color: '#fff', textDecoration: 'none', padding: '10px 16px', borderRadius: 6, background: view === 'products' ? 'rgba(248,153,27,0.12)' : 'none', fontWeight: 600, cursor: 'pointer' }}>Бүтээгдэхүүн</span>
            <span onClick={() => setView('settings')} style={{ color: '#fff', textDecoration: 'none', padding: '10px 16px', borderRadius: 6, background: view === 'settings' ? 'rgba(248,153,27,0.12)' : 'none', fontWeight: 600, cursor: 'pointer' }}>Тохиргоо</span>
          </nav>
          <div style={{ flex: 1 }} />
          <div style={{ textAlign: 'center', fontSize: 12, opacity: 0.7, marginBottom: 12 }}>© EnerStore Company</div>
        </aside>
        {/* Main Content */}
        <main style={{ flex: 1, minHeight: '100vh' }}>
          {/* Topbar */}
          <div style={{ height: 64, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 36px', boxShadow: '0 2px 8px rgba(8,15,70,0.04)' }}>
            <div style={{ fontWeight: 600, fontSize: 22 }}>Компани Самбар</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontWeight: 500 }}>{company.name}</span>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>{company.name ? company.name[0] : 'C'}</div>
              <button onClick={handleLogout} style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Гарах</button>
            </div>
          </div>
          <div style={{ padding: 32 }}>
            {view === 'products' && <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h2>Таны бүтээгдэхүүнүүд</h2>
                <button 
                  onClick={() => setShowAddProduct(true)} 
                  style={{ 
                    background: 'var(--color-accent)', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    padding: '12px 24px', 
                    fontWeight: 600, 
                    fontSize: 15, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  ➕ Шинэ бараа нэмэх
                </button>
              </div>
              {/* Category filter dropdown */}
              <div style={{ marginBottom: 24 }}>
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', fontSize: 15 }}>
                  <option value="all">Бүх ангилал</option>
                  {categories.filter(cat => cat.name !== 'Бүх бараа').map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24, marginTop: 24 }}>
                {filteredProducts.map(p => (
                  <div key={p._id} style={{ 
                    background: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: 16, 
                    boxShadow: '0 2px 8px rgba(8,15,70,0.06)', 
                    padding: 24,
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    position: 'relative'
                  }}>
                    {/* Product Image */}
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                      <img 
                        src={p.image || p.thumbnail} 
                        alt={p.name} 
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
                        {p.name}
                      </h3>
                      <p style={{ color: '#666', fontSize: 14, margin: '0 0 12px 0', lineHeight: 1.4 }}>
                        {p.description}
                      </p>
                      <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>
                        Үлдэгдэл: {p.piece || 0} ширхэг
                      </div>
                      <div style={{ display: 'flex', justifyContent: p.originalPrice && p.price < p.originalPrice ? 'space-between' : 'flex-start', alignItems: 'center', marginTop: 8 }}>
                        {p.originalPrice && p.price < p.originalPrice ? (
                          <>
                            <span style={{
                              color: '#888',
                              fontWeight: 600,
                              fontSize: 20,
                              textDecoration: 'line-through',
                              marginRight: 12,
                              minWidth: 90,
                            }}>
                              {new Intl.NumberFormat('mn-MN').format(p.originalPrice)}
                              <span style={{ fontSize: 16, marginLeft: 2 }}>₮</span>
                            </span>
                            <span style={{
                              color: 'var(--color-accent)',
                              fontWeight: 700,
                              fontSize: 22,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              minWidth: 110,
                              justifyContent: 'flex-end',
                            }}>
                              {new Intl.NumberFormat('mn-MN').format(p.price)}
                              <span style={{ fontSize: 18, marginLeft: 2 }}>₮</span>
                            </span>
                          </>
                        ) : (
                          <span style={{
                            color: 'var(--color-accent)',
                            fontWeight: 700,
                            fontSize: 22,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            minWidth: 110,
                            justifyContent: 'flex-start',
                          }}>
                            {new Intl.NumberFormat('mn-MN').format(p.price)}
                            <span style={{ fontSize: 18, marginLeft: 2 }}>₮</span>
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button 
                        onClick={() => handleEditProduct(p)} 
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
                        onClick={() => handleSaleProductModal(p)} 
                        style={{ 
                          flex: 1,
                          background: '#22c55e', 
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
                        Хямдрал
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(p._id)} 
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
                {filteredProducts.length === 0 && <div>Бүтээгдэхүүн алга байна.</div>}
              </div>
            </>}
            {view === 'settings' && <>
              <h2 style={{ marginBottom: 32 }}>Тохиргоо</h2>
              <form onSubmit={handleSettingsSave} style={{ maxWidth: 400, background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(8,15,70,0.06)', padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <label style={{ fontWeight: 600, marginBottom: 4 }}>Лого</label>
                <label style={{ display: 'inline-block', padding: '8px 14px', background: 'var(--color-accent)', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginBottom: 0, width: 'fit-content' }}>
                  📷 Лого оруулах
                  <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
                </label>
                {logoPreview && <img src={logoPreview} alt="logo preview" style={{ maxWidth: 80, maxHeight: 80, borderRadius: 8, marginTop: 8 }} />}
                <label style={{ fontWeight: 600, marginBottom: 4 }}>Нэр</label>
                <input name="name" value={settingsForm.name} onChange={handleSettingsChange} required style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
                <label style={{ fontWeight: 600, marginBottom: 4 }}>Имэйл</label>
                <input name="email" value={settingsForm.email} onChange={handleSettingsChange} required style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
                <label style={{ fontWeight: 600, marginBottom: 4 }}>Нууц үг</label>
                <input name="password" type="password" value={settingsForm.password} onChange={handleSettingsChange} required style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }} />
                <button type="submit" style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 0', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', marginTop: 12 }}>Хадгалах</button>
                {settingsMsg && <div style={{ color: settingsMsg.includes('Амжилттай') ? 'green' : 'red', marginTop: 8 }}>{settingsMsg}</div>}
              </form>
            </>}
          </div>
        </main>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 32,
            width: '90%',
            maxWidth: 600,
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0 }}>Шинэ бараа нэмэх</h2>
              <button 
                onClick={() => {
                  // Reset form with default "Бүх бараа" category selected
                  const allProductsCategory = categories.find(cat => cat.name === 'Бүх бараа');
                  setProductForm({ 
                    name: '', 
                    price: '', 
                    description: '', 
                    thumbnail: '', 
                    images: [], 
                    categories: allProductsCategory ? [allProductsCategory._id] : [],
                    piece: '', // Reset piece
                    brand: '' // Reset brand
                  });
                  setThumbnailPreview('');
                  setImagesPreview([]);
                  setShowAddProduct(false);
                }} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: 24, 
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Thumbnail Image Section */}
              <div>
                <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Үндсэн зураг (Thumbnail)</label>
                <label style={{ display: 'inline-block', padding: '8px 14px', background: 'var(--color-accent)', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginBottom: 8, width: 'fit-content' }}>
                  📷 Үндсэн зураг оруулах
                  <input type="file" accept="image/*" onChange={handleThumbnailChange} style={{ display: 'none' }} />
                </label>
                {thumbnailPreview && (
                  <div style={{ marginTop: 8 }}>
                    <img src={thumbnailPreview} alt="thumbnail preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, border: '2px solid #ddd' }} />
                  </div>
                )}
              </div>

              {/* Multiple Images Section */}
              <div>
                <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Нэмэлт зургууд</label>
                <label style={{ display: 'inline-block', padding: '8px 14px', background: '#28a745', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginBottom: 8, width: 'fit-content' }}>
                  🖼️ Олон зураг оруулах
                  <input type="file" accept="image/*" multiple onChange={handleImagesChange} style={{ display: 'none' }} />
                </label>
                {imagesPreview.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    {imagesPreview.map((img, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img 
                          src={img} 
                          alt={`preview ${index + 1}`} 
                          style={{ 
                            width: 80, 
                            height: 80, 
                            objectFit: 'cover', 
                            borderRadius: 8, 
                            border: '2px solid #ddd' 
                          }} 
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            background: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            fontSize: 12,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Барааны нэр</label>
                <input 
                  name="name" 
                  value={productForm.name} 
                  onChange={handleProductChange} 
                  required 
                  style={{ padding: 12, borderRadius: 6, border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' }} 
                />
              </div>
              
              <div>
                <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Үнэ (₮)</label>
                <input 
                  name="price" 
                  type="number" 
                  value={productForm.price} 
                  onChange={handleProductChange} 
                  required 
                  style={{ padding: 12, borderRadius: 6, border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' }} 
                />
              </div>
              
              <div>
                <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Тайлбар</label>
                <textarea 
                  name="description" 
                  value={productForm.description} 
                  onChange={handleProductChange} 
                  required 
                  style={{ padding: 12, borderRadius: 6, border: '1px solid #ddd', width: '100%', boxSizing: 'border-box', minHeight: 80, resize: 'vertical' }} 
                />
              </div>
              
              <div>
                <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Үлдэгдэл (ширхэг)</label>
                <input 
                  name="piece" 
                  type="number" 
                  value={productForm.piece} 
                  onChange={handleProductChange} 
                  required 
                  style={{ padding: 12, borderRadius: 6, border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' }} 
                />
              </div>
              
              {/* Multiple Categories Section */}
              <div>
                <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Ангилалууд</label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                  gap: 8,
                  maxHeight: 120,
                  overflowY: 'auto',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  padding: 12
                }}>
                  {categories.map(cat => (
                    <label key={cat._id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8, 
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: 4,
                      background: productForm.categories.includes(cat._id) ? 'rgba(248,153,27,0.1)' : 'transparent'
                    }}>
                      <input 
                        type="checkbox" 
                        checked={productForm.categories.includes(cat._id)}
                        onChange={() => handleCategoryChange(cat._id)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: 14 }}>{cat.name}</span>
                    </label>
                  ))}
                </div>
                {productForm.categories.length === 0 && (
                  <div style={{ color: '#dc3545', fontSize: 12, marginTop: 4 }}>
                    Хамгийн багадаа нэг ангилал сонгоно уу
                  </div>
                )}
              </div>
              
              <div>
                <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Брэнд сонгох</label>
                <select name="brand" value={productForm.brand} onChange={handleProductChange} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', fontSize: 15, minWidth: 120, marginBottom: 8 }}>
                  <option value=''>Брэнд сонгох</option>
                  {brands.map(brand => (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button 
                  type="submit" 
                  disabled={productForm.categories.length === 0}
                  style={{ 
                    background: productForm.categories.length === 0 ? '#ccc' : 'var(--color-accent)', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 6, 
                    padding: '12px 24px', 
                    fontWeight: 'bold', 
                    fontSize: 16, 
                    cursor: productForm.categories.length === 0 ? 'not-allowed' : 'pointer',
                    flex: 1
                  }}
                >
                  Нэмэх
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    // Reset form with default "Бүх бараа" category selected
                    const allProductsCategory = categories.find(cat => cat.name === 'Бүх бараа');
                    setProductForm({ 
                      name: '', 
                      price: '', 
                      description: '', 
                      thumbnail: '', 
                      images: [], 
                      categories: allProductsCategory ? [allProductsCategory._id] : [],
                      piece: '', // Reset piece
                      brand: '' // Reset brand
                    });
                    setThumbnailPreview('');
                    setImagesPreview([]);
                    setShowAddProduct(false);
                  }}
                  style={{ 
                    background: '#f0f0f0', 
                    color: '#333', 
                    border: 'none', 
                    borderRadius: 6, 
                    padding: '12px 24px', 
                    fontWeight: 'bold', 
                    fontSize: 16, 
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Цуцлах
                </button>
              </div>
              
              {productMsg && (
                <div style={{ 
                  color: productMsg.includes('амжилттай') ? 'green' : 'red', 
                  marginTop: 8, 
                  textAlign: 'center',
                  fontWeight: 600
                }}>
                  {productMsg}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 32,
            width: '90%',
            maxWidth: 500,
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0 }}>Бараа засах</h2>
              <button onClick={handleEditModalClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#666' }}>×</button>
            </div>
            <form onSubmit={handleEditFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input name="name" value={editForm.name} onChange={handleEditFormChange} required placeholder="Барааны нэр" style={{ padding: 12, borderRadius: 6, border: '1px solid #ddd' }} />
              <input name="price" value={editForm.price} onChange={handleEditFormChange} required type="number" placeholder="Үнэ" style={{ padding: 12, borderRadius: 6, border: '1px solid #ddd' }} />
              <input name="piece" value={editForm.piece} onChange={handleEditFormChange} required type="number" placeholder="Үлдэгдэл (ширхэг)" style={{ padding: 12, borderRadius: 6, border: '1px solid #ddd' }} />
              {/* Image upload and preview */}
              <div>
                <label style={{ display: 'inline-block', padding: '8px 14px', background: 'var(--color-accent)', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginBottom: 8, width: 'fit-content' }}>
                  📷 Зураг оруулах
                  <input type="file" accept="image/*" onChange={handleEditImageChange} style={{ display: 'none' }} />
                </label>
                {editImagePreview && (
                  <div style={{ marginTop: 8 }}>
                    <img src={editImagePreview} alt="preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, border: '2px solid #ddd' }} />
                  </div>
                )}
              </div>
              {/* Multi-image upload and preview */}
              <div>
                <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Нэмэлт зургууд</label>
                <label style={{ display: 'inline-block', padding: '8px 14px', background: '#28a745', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginBottom: 8, width: 'fit-content' }}>
                  🖼️ Олон зураг оруулах
                  <input type="file" accept="image/*" multiple onChange={handleEditImagesChange} style={{ display: 'none' }} />
                </label>
                {editImagesPreview.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    {editImagesPreview.map((img, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img 
                          src={img} 
                          alt={`preview ${index + 1}`} 
                          style={{ 
                            width: 80, 
                            height: 80, 
                            objectFit: 'cover', 
                            borderRadius: 8, 
                            border: '2px solid #ddd' 
                          }} 
                        />
                        <button
                          type="button"
                          onClick={() => removeEditImage(index)}
                          style={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            background: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            fontSize: 12,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Multi-category select */}
              <div>
                <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Ангилалууд</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: 8,
                  maxHeight: 120,
                  overflowY: 'auto',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  padding: 12
                }}>
                  {categories.map(cat => (
                    <label key={cat._id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: 4,
                      background: editForm.categories.includes(cat._id) ? 'rgba(248,153,27,0.1)' : 'transparent'
                    }}>
                      <input
                        type="checkbox"
                        checked={editForm.categories.includes(cat._id)}
                        onChange={() => handleEditCategoryChange(cat._id)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: 14 }}>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Брэнд сонгох</label>
                <select name="brand" value={editForm.brand} onChange={e => setEditForm({ ...editForm, brand: e.target.value })} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', fontSize: 15, minWidth: 120, marginBottom: 8 }}>
                  <option value=''>Брэнд сонгох</option>
                  {brands.map(brand => (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                  ))}
                </select>
              </div>
              <textarea name="description" value={editForm.description} onChange={handleEditFormChange} required placeholder="Тайлбар" style={{ padding: 12, borderRadius: 6, border: '1px solid #ddd', minHeight: 80, resize: 'vertical' }} />
              <button type="submit" style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 0', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', marginTop: 12 }}>Хадгалах</button>
            </form>
          </div>
        </div>
      )}

      {/* Sale Product Modal */}
      {saleProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 32,
            width: '90%',
            maxWidth: 400,
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0 }}>Хямдрал</h2>
              <button onClick={handleSaleModalClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#666' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ fontWeight: 600 }}>Хуучин үнэ</label>
              <input value={saleProduct.originalPrice || saleProduct.price} readOnly style={{ padding: 12, borderRadius: 6, border: '1px solid #ddd', background: '#f3f4f6', fontWeight: 700, color: '#888' }} />
              <label style={{ fontWeight: 600 }}>Хямдралын хувь (%)</label>
              <input type="number" min={1} max={99} value={salePercent} onChange={handleSalePercentChange} style={{ padding: 12, borderRadius: 6, border: '1px solid #ddd', fontWeight: 700 }} />
              <label style={{ fontWeight: 600 }}>Шинэ үнэ</label>
              <input value={salePercent === '' ? '' : Math.round((saleProduct.originalPrice || saleProduct.price) * (1 - (parseInt(salePercent, 10) || 0) / 100))} readOnly style={{ padding: 12, borderRadius: 6, border: '1px solid #ddd', background: '#f3f4f6', fontWeight: 700, color: 'var(--color-accent)' }} />
              <label style={{ fontWeight: 600 }}>Хямдрал үргэлжлэх хугацаа (өдөр)</label>
              <input type="number" min={1} max={365} value={saleDuration} onChange={handleSaleDurationChange} style={{ padding: 12, borderRadius: 6, border: '1px solid #ddd', fontWeight: 700 }} />
              <button onClick={handleSaleConfirm} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 0', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', marginTop: 12 }}>Хямдрал хийх</button>
              {(saleProduct.originalPrice && saleProduct.price < saleProduct.originalPrice) && (
                <button onClick={handleRemoveSale} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 0', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', marginTop: 8 }}>Хямдралыг устгах</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyDashboard; 