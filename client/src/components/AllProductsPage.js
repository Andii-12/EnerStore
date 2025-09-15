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
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(API_ENDPOINTS.CATEGORIES).then(res => res.json()),
      fetch(API_ENDPOINTS.BRANDS).then(res => res.json()),
      fetch(API_ENDPOINTS.COMPANIES).then(res => res.json())
    ]).then(([catData, brandData, companyData]) => {
      // Sort categories alphabetically
      const sortedCategories = catData
        .filter(cat => cat.name !== 'Бүх бараа')
        .sort((a, b) => a.name.localeCompare(b.name, 'mn'));
      setCategories(sortedCategories);
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
    setLoading(true);
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
    
    console.log('🔍 Fetching products with URL:', url);
    console.log('🔍 Selected category:', selectedCategory);
    console.log('🔍 Selected brand:', selectedBrand);
    console.log('🔍 Selected company:', selectedCompany);
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('📦 Raw API response:', data);
        if (!Array.isArray(data)) {
          console.log('❌ API response is not an array:', data);
          setProducts([]);
          setLoading(false);
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
        console.log('📦 Processed products:', mapped.length);
        setProducts(mapped);
        setLoading(false);
      })
      .catch(error => {
        console.error('❌ Error fetching products:', error);
        setLoading(false);
      });
  }, [ready, selectedCategory, selectedBrand, selectedCompany, sort]);

  // Responsive sidebar toggle for mobile
  const handleSidebarToggle = () => setSidebarOpen(v => !v);
  
  // Close sidebar when filter is selected on mobile
  const handleFilterSelect = (filterType, value) => {
    if (filterType === 'category') {
      setSelectedCategory(value);
      // Update URL with category parameter
      const params = new URLSearchParams(location.search);
      if (value) {
        params.set('category', value);
      } else {
        params.delete('category');
      }
      const newUrl = `${location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.pushState({}, '', newUrl);
    } else if (filterType === 'brand') {
      setSelectedBrand(value);
      // Update URL with brand parameter
      const params = new URLSearchParams(location.search);
      if (value) {
        params.set('brand', value);
      } else {
        params.delete('brand');
      }
      const newUrl = `${location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.pushState({}, '', newUrl);
    } else if (filterType === 'company') {
      setSelectedCompany(value);
      // Update URL with company parameter
      const params = new URLSearchParams(location.search);
      if (value) {
        params.set('company', value);
      } else {
        params.delete('company');
      }
      const newUrl = `${location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.pushState({}, '', newUrl);
    }
    
    // Close sidebar on mobile after filter selection
    if (window.innerWidth <= 600) {
      setTimeout(() => setSidebarOpen(false), 300);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedCompany('');
    
    // Clear URL parameters
    const newUrl = location.pathname;
    window.history.pushState({}, '', newUrl);
    
    // Close sidebar on mobile after clearing filters
    if (window.innerWidth <= 600) {
      setTimeout(() => setSidebarOpen(false), 300);
    }
  };

  return (
    <div className="all-products-page">
      <Header />
      <MainHeader />
      <NavBar />
      <div className="all-products-layout">
        {/* Mobile Sidebar Toggle */}
        <button className="sidebar-toggle-btn" onClick={handleSidebarToggle}>
          {sidebarOpen ? '✕ Фильтер хаах' : '☰ Фильтер харах'}
        </button>
        
        {/* Sidebar */}
        <aside className={`all-products-sidebar${sidebarOpen ? ' open' : ''}`}>
          {/* Clear Filters Button */}
          <div className="sidebar-header">
            <button
              onClick={handleClearFilters}
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
                  onClick={() => handleFilterSelect('company', company._id)}
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
                onClick={() => handleFilterSelect('category', '')}
                className={`sidebar-nav-item ${selectedCategory === '' ? 'active' : ''}`}
              >
                Бүх бараа
              </button>
              {categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => handleFilterSelect('category', cat.name)}
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
                onClick={() => handleFilterSelect('brand', '')}
                className={`sidebar-nav-item ${selectedBrand === '' ? 'active' : ''}`}
              >
                Бүх брэнд
              </button>
              {brands.map(brand => (
                <button
                  key={brand._id}
                  onClick={() => handleFilterSelect('brand', brand.name)}
                  className={`sidebar-nav-item ${selectedBrand === brand.name ? 'active' : ''}`}
                >
                  {brand.name}
                </button>
              ))}
            </nav>
          </div>
        </aside>
        
        {/* Main Content */}
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
            <ProductGrid products={products} loading={loading} />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AllProductsPage; 