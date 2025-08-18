import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import MainHeader from './components/MainHeader';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Carousel from './components/Carousel';
import CategoryGrid from './components/CategoryGrid';
import ProductGrid from './components/ProductGrid';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ProductsAdmin from './admin/ProductsAdmin';
import CategoriesAdmin from './admin/CategoriesAdmin';
import CarouselAdmin from './admin/CarouselAdmin';
import AdminLayout from './admin/AdminLayout';
import CompaniesAdmin from './admin/CompaniesAdmin';
import UsersAdmin from './admin/UsersAdmin';
import HeaderMenuAdmin from './admin/HeaderMenuAdmin';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import AdminRoute from './admin/AdminRoute';
import CompanyDashboard from './components/CompanyDashboard';
import AllProductsPage from './components/AllProductsPage';
import BrandCarousel from './components/BrandCarousel';
import './components/BrandCarousel.css';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import UserRegistration from './components/UserRegistration';
import UserEdit from './components/UserEdit';
import { API_ENDPOINTS } from './config/api';

function formatPrice(price) {
  if (!price && price !== 0) return '';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function NewProductsSection({ products }) {
  const navigate = useNavigate();
  const newProducts = [...products].slice(-9).reverse();
  return (
    <div style={{ margin: '48px 0' }}>
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 18, boxShadow: '0 2px 12px rgba(8,15,70,0.06)', padding: 32, marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: '2rem', color: 'var(--color-dark)', margin: 0 }}>Шинэ бараа</h2>
          <button
            style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
            onClick={() => navigate('/products?sort=newest')}
          >
            Бүгдийг үзэх
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {newProducts.map(product => (
            <div
              key={product._id}
              className="new-product-card"
              style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', padding: 18, minHeight: 280, position: 'relative', cursor: 'pointer', transition: 'box-shadow 0.18s, border 0.18s, transform 0.18s' }}
              onClick={() => navigate(`/products/${product._id}`)}
            >
              {/* Product image */}
              <img src={product.image || product.thumbnail} alt={product.name} style={{ width: '100%', height: 160, objectFit: 'contain', borderRadius: 8, background: '#f8f8f8', marginBottom: 16 }} />
              {/* Details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: '#888', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                  {product.processor || product.spec || ''}
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#222', marginBottom: 8, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.name}
                </div>
                <div style={{ color: '#666', fontSize: 14, marginBottom: 8, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                  {product.description}
                </div>
                {product.company && (product.company.logo || product.company.name) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#888', fontSize: 13, marginBottom: 8 }}>
                    {product.company.logo && (
                      <img src={product.company.logo} alt={product.company.name} style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', background: '#fff', border: '1.5px solid #eee' }} />
                    )}
                    <span style={{ color: '#222', fontWeight: 600 }}>{product.company.name}</span>
                  </div>
                )}
                {product.originalPrice && product.price < product.originalPrice ? (
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                    <span style={{ color: '#aaa', fontWeight: 500, fontSize: 15, textDecoration: 'line-through', marginBottom: 2 }}>
                      {formatPrice(product.originalPrice)} ₮
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 22 }}>
                        {formatPrice(product.price)} ₮
                      </span>
                      <span style={{ color: '#22c55e', fontWeight: 700, fontSize: 15, background: 'rgba(34,197,94,0.10)', borderRadius: 8, padding: '2px 10px', marginLeft: 2 }}>
                        -{Math.round(100 - (product.price / product.originalPrice) * 100)}%
                      </span>
                    </div>
                    {product.saleEnd && (
                      <span style={{ color: '#f59e42', fontWeight: 600, fontSize: 14, marginTop: 2 }}>
                        {(() => {
                          const now = new Date();
                          const end = new Date(product.saleEnd);
                          const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
                          return diff > 0 ? `${diff} өдөр үлдлээ` : 'Дууссан';
                        })()}
                      </span>
                    )}
                  </div>
                ) : (
                  <div style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 20, marginTop: 'auto' }}>
                    {formatPrice(product.price)} ₮
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SaleCountdown({ saleEnd }) {
  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    if (!saleEnd) return;
    const end = new Date(saleEnd);
    function updateCountdown() {
      const now = new Date();
      const diff = end - now;
      if (diff <= 0) {
        setCountdown("");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown(
        (days > 0 ? `${days} өдөр ` : "") +
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} үлдлээ`
      );
    }
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [saleEnd]);
  if (!countdown) return null;
  return <span style={{ color: '#f59e42', fontWeight: 600, fontSize: 14, marginTop: 2 }}>{countdown}</span>;
}

function SaleProductsSection({ products }) {
  const navigate = useNavigate();
  const saleProducts = products.filter(p => p.originalPrice && p.price < p.originalPrice && p.saleEnd && (() => {
    const now = new Date();
    const end = new Date(p.saleEnd);
    return end > now;
  })());
  if (saleProducts.length === 0) return null;
  return (
    <div style={{ margin: '48px 0' }}>
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 18, boxShadow: '0 2px 12px rgba(8,15,70,0.06)', padding: 32, marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: '2rem', color: 'var(--color-dark)', margin: 0 }}>Хямдралтай бараа</h2>
          <button
            style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
            onClick={() => navigate('/products?sort=sale')}
          >
            Бүгдийг үзэх
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {saleProducts.map(product => {
            const now = new Date();
            const end = new Date(product.saleEnd);
            const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
            const isSale = diff > 0;
            return (
              <div
                key={product._id}
                className="new-product-card"
                style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', padding: 18, minHeight: 280, position: 'relative', cursor: 'pointer', transition: 'box-shadow 0.18s, border 0.18s, transform 0.18s' }}
                onClick={() => navigate(`/products/${product._id}`)}
              >
                {/* Product image */}
                <img src={product.image || product.thumbnail} alt={product.name} style={{ width: '100%', height: 160, objectFit: 'contain', borderRadius: 8, background: '#f8f8f8', marginBottom: 16 }} />
                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: '#888', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                    {product.processor || product.spec || ''}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#222', marginBottom: 8, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.name}
                  </div>
                  <div style={{ color: '#666', fontSize: 14, marginBottom: 8, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                    {product.description}
                  </div>
                  {product.company && (product.company.logo || product.company.name) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#888', fontSize: 13, marginBottom: 8 }}>
                      {product.company.logo && (
                        <img src={product.company.logo} alt={product.company.name} style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', background: '#fff', border: '1.5px solid #eee' }} />
                      )}
                      <span style={{ color: '#222', fontWeight: 600 }}>{product.company.name}</span>
                    </div>
                  )}
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                    {isSale ? (
                      <>
                        <span style={{ color: '#aaa', fontWeight: 500, fontSize: 15, textDecoration: 'line-through', marginBottom: 2 }}>
                          {formatPrice(product.originalPrice)} ₮
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 22 }}>
                            {formatPrice(product.price)} ₮
                          </span>
                          <span style={{ color: '#22c55e', fontWeight: 700, fontSize: 15, background: 'rgba(34,197,94,0.10)', borderRadius: 8, padding: '2px 10px', marginLeft: 2 }}>
                            -{Math.round(100 - (product.price / product.originalPrice) * 100)}%
                          </span>
                        </div>
                        <SaleCountdown saleEnd={product.saleEnd} />
                      </>
                    ) : (
                      <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 20 }}>
                        {formatPrice(product.price)} ₮
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BestSellerSection({ products }) {
  const bestSellers = [...products]
    .filter(p => p.soldCount > 0)
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 8);
  if (bestSellers.length === 0) return null;
  return (
    <div style={{ margin: '48px 0' }}>
      <h2 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: 24, color: 'var(--color-dark)' }}>Best Seller</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'flex-start' }}>
        {bestSellers.map(product => (
          <div key={product._id} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, width: 220, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 16 }}>
            <img src={product.image} alt={product.name} style={{ width: 120, height: 120, objectFit: 'contain', marginBottom: 12 }} />
            <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 6, textAlign: 'center', color: 'var(--color-dark)' }}>{product.name}</div>
            <div style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 18 }}>{product.price} ₮</div>
            <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>Зарагдсан: {product.soldCount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MainSite({ products, categories }) {
  return (
    <div style={{ background: '#f6f6f6', minHeight: '100vh' }}>
      <Header />
      <MainHeader />
      <NavBar />
      <div className="home-content">
        <div className="home-main-section home-card">
          <Carousel />
        </div>
        <div className="home-main-section home-card">
          <CategoryGrid categories={categories} />
        </div>
        <div className="home-main-section">
          <BrandCarousel />
        </div>
        <div className="home-main-section home-card">
          <NewProductsSection products={products} />
          <SaleProductsSection products={products} />
        </div>
        <div className="home-main-section home-card">
          <BestSellerSection products={products} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(API_ENDPOINTS.PRODUCTS)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  useEffect(() => {
    fetch(API_ENDPOINTS.CATEGORIES)
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={
          <AdminAuthProvider>
            <AdminLogin />
          </AdminAuthProvider>
        } />
        <Route path="/admin" element={
          <AdminAuthProvider>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </AdminAuthProvider>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="carousel" element={<CarouselAdmin />} />
          <Route path="companies" element={<CompaniesAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
          <Route path="header-menu" element={<HeaderMenuAdmin />} />
        </Route>
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products" element={<AllProductsPage />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/register" element={<UserRegistration />} />
        <Route path="/user/edit" element={<UserEdit />} />
        <Route path="/" element={<MainSite products={products} categories={categories} />} />
      </Routes>
    </Router>
  );
}

export default App; 