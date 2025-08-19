import React, { useEffect, useState } from 'react';
import Header from './Header';
import MainHeader from './MainHeader';
import NavBar from './NavBar';
import Footer from './Footer';
import ProductGrid from './ProductGrid';
import './BrandCarousel.css';
import { useLocation } from 'react-router-dom';
import './AllProductsPage.css';
import { API_ENDPOINTS } from '../config/api';

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
      fetch(API_ENDPOINTS.CATEGORIES).then(res => res.json()),
      fetch(API_ENDPOINTS.BRANDS).then(res => res.json()),
      fetch(API_ENDPOINTS.COMPANIES).then(res => res.json())
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
    let url = API_ENDPOINTS.PRODUCTS;
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
        let mapped = data.map(p => ({
          ...p,
          companyLogo: p.company && p.company.logo ? p.company.logo : '',
          companyName: p.company && p.company.name ? p.company.name : '',
        }));
        if (sort === 'sale') {
          const now = new Date();
          mapped = mapped.filter(p => p.originalPrice && p.price < p.originalPrice && p.saleEnd && new Date(p.saleEnd) > now);
        }
        setProducts(mapped);
      });
  }, [ready, selectedCategory, selectedBrand, selectedCompany, sort]);

  // Responsive sidebar toggle for mobile
  const handleSidebarToggle = () => setSidebarOpen(v => !v);

  return (
    <div className="all-products-page">
      <Header />
      <MainHeader />
      <NavBar />
      <div className="all-products-layout">
        <button className="sidebar-toggle-btn" onClick={handleSidebarToggle}>
          {sidebarOpen ? '✕ Фильтер хаах' : '☰ Фильтер харах'}
        </button>
        
        <aside className={`all-products-sidebar${sidebarOpen ? ' open' : ''}`}>
          {/* Clear Filters Button */}
          <div className="sidebar-header">
            <button
              onClick={() => { setSelectedCategory(''); setSelectedBrand(''); setSelectedCompany(''); }}
              className="clear-filters-btn"
            >
              Фильтер цэвэрлэх
            </button>
          </div>
          
          {/* Companies Section */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Дэлгүүрүүд</h3>
            <nav className="sidebar-nav">
              {companies.map(company => (
                <button
                  key={company._id}
                  onClick={() => setSelectedCompany(company._id)}
                  className={`sidebar-nav-item ${selectedCompany === company._id ? 'active' : ''}`}
                >
                  {company.logo && (
                    <img 
                      src={company.logo} 
                      alt={company.name} 
                      className="company-logo" 
                    />
                  )}
                  {company.name}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Categories Section */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Ангилал</h3>
            <nav className="sidebar-nav">
              <button
                onClick={() => setSelectedCategory('')}
                className={`sidebar-nav-item ${selectedCategory === '' ? 'active' : ''}`}
              >
                Бүх бараа
              </button>
              {categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`sidebar-nav-item ${selectedCategory === cat.name ? 'active' : ''}`}
                >
                  {cat.name}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Brands Section */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Брэнд</h3>
            <nav className="sidebar-nav">
              <button
                onClick={() => setSelectedBrand('')}
                className={`sidebar-nav-item ${selectedBrand === '' ? 'active' : ''}`}
              >
                Бүх брэнд
              </button>
              {brands.map(brand => (
                <button
                  key={brand._id}
                  onClick={() => setSelectedBrand(brand.name)}
                  className={`sidebar-nav-item ${selectedBrand === brand.name ? 'active' : ''}`}
                >
                  {brand.name}
                </button>
              ))}
            </nav>
          </div>
        </aside>
        
        <main className="all-products-main">
          {/* Page Header */}
          <div className="page-header">
            <div className="page-title">
              {selectedCategory || 'Бүх бараа'}
            </div>
            <div className="products-count">
              Нийт <b>{products.length}</b> бүтээгдэхүүн байна
            </div>
          </div>
          
          {/* Sort Controls */}
          <div className="sort-controls">
            <select 
              value={sort} 
              onChange={e => setSort(e.target.value)} 
              className="sort-select"
            >
              <option value="newest">Шинэ нь эхэндээ</option>
              <option value="price-asc">Үнэ өсөхөөр</option>
              <option value="price-desc">Үнэ буурахаар</option>
            </select>
          </div>
          
          {/* Products Grid */}
          <div className="products-container">
            <ProductGrid products={products} />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AllProductsPage; 