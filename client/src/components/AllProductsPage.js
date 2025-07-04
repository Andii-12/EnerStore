import React, { useEffect, useState } from 'react';
import Header from './Header';
import MainHeader from './MainHeader';
import NavBar from './NavBar';
import Footer from './Footer';
import ProductGrid from './ProductGrid';
import './BrandCarousel.css';
import { useLocation } from 'react-router-dom';
import './AllProductsPage.css';

function AllProductsPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [sort, setSort] = useState('newest');
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/categories').then(res => res.json()),
      fetch('http://localhost:5000/api/brands').then(res => res.json()),
      fetch('http://localhost:5000/api/companies').then(res => res.json())
    ]).then(([catData, brandData, companyData]) => {
      setCategories(catData.filter(cat => cat.name !== 'Бүх бараа'));
      setBrands(brandData);
      setCompanies(companyData);
      // Set initial category, brand, company from URL
      const params = new URLSearchParams(location.search);
      const cat = params.get('category');
      const brand = params.get('brand');
      const company = params.get('company');
      if (cat) setSelectedCategory(cat);
      if (brand) setSelectedBrand(brand);
      if (company) setSelectedCompany(company);
      setReady(true);
    });
  }, [location.search]);

  useEffect(() => {
    if (!ready) return;
    let url = 'http://localhost:5000/api/products';
    const params = [];
    if (selectedCategory) {
      params.push(`category=${encodeURIComponent(selectedCategory)}`);
    }
    if (selectedBrand) {
      params.push(`brand=${encodeURIComponent(selectedBrand)}`);
    }
    if (selectedCompany) {
      params.push(`company=${encodeURIComponent(selectedCompany)}`);
    }
    if (sort) {
      params.push(`sort=${encodeURIComponent(sort)}`);
    }
    if (params.length) {
      url += '?' + params.join('&');
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          setProducts([]);
          return;
        }
        const mapped = data.map(p => ({
          ...p,
          companyLogo: p.company && p.company.logo ? p.company.logo : '',
          companyName: p.company && p.company.name ? p.company.name : '',
        }));
        setProducts(mapped);
      });
  }, [ready, selectedCategory, selectedBrand, selectedCompany, sort]);

  // Responsive sidebar toggle for mobile
  const handleSidebarToggle = () => setSidebarOpen(v => !v);

  return (
    <div style={{ background: '#f6f6f6', minHeight: '100vh' }}>
      <Header />
      <MainHeader />
      <NavBar />
      <div className="all-products-layout">
        <button className="sidebar-toggle-btn" onClick={handleSidebarToggle}>
          {sidebarOpen ? '✕ Фильтер хаах' : '☰ Фильтер харах'}
        </button>
        <aside className={`all-products-sidebar${sidebarOpen ? ' open' : ''}`}>
          {/* Sidebar content (unchanged, but remove layout inline styles) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '24px 32px 0 32px', gap: 12 }}>
            <button
              onClick={() => { setSelectedCategory(''); setSelectedBrand(''); setSelectedCompany(''); }}
              style={{ background: '#f8f3ed', color: 'var(--color-accent)', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 8 }}
            >
              Фильтер цэвэрлэх
            </button>
          </div>
          <div style={{ fontWeight: 700, fontSize: 18, margin: '32px 0 8px 32px', color: '#222' }}>Дэлгүүрүүд</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <button
              onClick={() => setSelectedCompany('')}
              style={{
                background: selectedCompany === '' ? '#f8f3ed' : 'none',
                color: selectedCompany === '' ? 'var(--color-accent)' : '#222',
                border: 'none',
                textAlign: 'left',
                padding: '10px 32px',
                fontWeight: selectedCompany === '' ? 700 : 500,
                fontSize: 15,
                cursor: 'pointer',
                borderLeft: selectedCompany === '' ? '4px solid var(--color-accent)' : '4px solid transparent',
                outline: 'none',
                transition: 'background 0.18s, color 0.18s',
                width: '100%',
                marginBottom: 2
              }}
            >
              Бүх дэлгүүр
            </button>
            {companies.map(company => (
              <button
                key={company._id}
                onClick={() => setSelectedCompany(company._id)}
                style={{
                  background: selectedCompany === company._id ? '#f8f3ed' : 'none',
                  color: selectedCompany === company._id ? 'var(--color-accent)' : '#222',
                  border: 'none',
                  textAlign: 'left',
                  padding: '10px 32px',
                  fontWeight: selectedCompany === company._id ? 700 : 500,
                  fontSize: 15,
                  cursor: 'pointer',
                  borderLeft: selectedCompany === company._id ? '4px solid var(--color-accent)' : '4px solid transparent',
                  outline: 'none',
                  transition: 'background 0.18s, color 0.18s',
                  width: '100%',
                  marginBottom: 2,
                  display: 'flex', alignItems: 'center', gap: 10
                }}
              >
                {company.logo && <img src={company.logo} alt={company.name} style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', background: '#fff', border: '1.5px solid #eee', marginRight: 8 }} />}
                {company.name}
              </button>
            ))}
          </nav>
          <div style={{ fontWeight: 700, fontSize: 18, margin: '32px 0 8px 32px', color: '#222' }}>Ангилал</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <button
              onClick={() => setSelectedCategory('')}
              style={{
                background: selectedCategory === '' ? '#f8f3ed' : 'none',
                color: selectedCategory === '' ? 'var(--color-accent)' : '#222',
                border: 'none',
                textAlign: 'left',
                padding: '12px 32px',
                fontWeight: selectedCategory === '' ? 700 : 500,
                fontSize: 15,
                cursor: 'pointer',
                borderLeft: selectedCategory === '' ? '4px solid var(--color-accent)' : '4px solid transparent',
                outline: 'none',
                transition: 'background 0.18s, color 0.18s',
                width: '100%',
                marginBottom: 2
              }}
            >
              Бүх бараа
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.name)} // use name
                style={{
                  background: selectedCategory === cat.name ? '#f8f3ed' : 'none',
                  color: selectedCategory === cat.name ? 'var(--color-accent)' : '#222',
                  border: 'none',
                  textAlign: 'left',
                  padding: '12px 32px',
                  fontWeight: selectedCategory === cat.name ? 700 : 500,
                  fontSize: 15,
                  cursor: 'pointer',
                  borderLeft: selectedCategory === cat.name ? '4px solid var(--color-accent)' : '4px solid transparent',
                  outline: 'none',
                  transition: 'background 0.18s, color 0.18s',
                  width: '100%',
                  marginBottom: 2
                }}
              >
                {cat.name}
              </button>
            ))}
          </nav>
          <div style={{ fontWeight: 700, fontSize: 18, margin: '32px 0 8px 32px', color: '#222' }}>Брэнд</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <button
              onClick={() => setSelectedBrand('')}
              style={{
                background: selectedBrand === '' ? '#f8f3ed' : 'none',
                color: selectedBrand === '' ? 'var(--color-accent)' : '#222',
                border: 'none',
                textAlign: 'left',
                padding: '10px 32px',
                fontWeight: selectedBrand === '' ? 700 : 500,
                fontSize: 15,
                cursor: 'pointer',
                borderLeft: selectedBrand === '' ? '4px solid var(--color-accent)' : '4px solid transparent',
                outline: 'none',
                transition: 'background 0.18s, color 0.18s',
                width: '100%',
                marginBottom: 2
              }}
            >
              Бүх брэнд
            </button>
            {brands.map(brand => (
              <button
                key={brand._id}
                onClick={() => setSelectedBrand(brand.name)}
                style={{
                  background: selectedBrand === brand.name ? '#f8f3ed' : 'none',
                  color: selectedBrand === brand.name ? 'var(--color-accent)' : '#222',
                  border: 'none',
                  textAlign: 'left',
                  padding: '10px 32px',
                  fontWeight: selectedBrand === brand.name ? 700 : 500,
                  fontSize: 15,
                  cursor: 'pointer',
                  borderLeft: selectedBrand === brand.name ? '4px solid var(--color-accent)' : '4px solid transparent',
                  outline: 'none',
                  transition: 'background 0.18s, color 0.18s',
                  width: '100%',
                  marginBottom: 2
                }}
              >
                {brand.name}
              </button>
            ))}
          </nav>
        </aside>
        <main className="all-products-main">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 26, color: '#222' }}>
              {selectedCategory || 'Бүх бараа'}
            </div>
            <div style={{ color: '#888', fontSize: 15 }}>
              Нийт <b>{products.length}</b> бүтээгдэхүүн байна
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 18, gap: 12 }}>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 18px', borderRadius: 6, border: '1px solid #e5e7eb', fontWeight: 500, fontSize: 15, background: '#fff', color: '#222', outline: 'none', cursor: 'pointer' }}>
              <option value="newest">Шинэ нь эхэндээ</option>
              <option value="price-asc">Үнэ өсөхөөр</option>
              <option value="price-desc">Үнэ буурахаар</option>
            </select>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', padding: 24, minHeight: 400 }}>
            <ProductGrid products={products} />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AllProductsPage; 