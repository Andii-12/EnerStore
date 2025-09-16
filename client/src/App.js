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
import BrandsAdmin from './admin/BrandsAdmin';
import OrdersAdmin from './admin/OrdersAdmin';
import UsersAdmin from './admin/UsersAdmin';
import HeaderMenuAdmin from './admin/HeaderMenuAdmin';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import AdminRoute from './admin/AdminRoute';
import CompanyDashboard from './components/CompanyDashboard';
import AllProductsPage from './components/AllProductsPage';
import BrandCarousel from './components/BrandCarousel';
import './components/BrandCarousel.css';
import './responsive.css';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import UserRegistration from './components/UserRegistration';
import UserEdit from './components/UserEdit';
import UserOrders from './components/UserOrders';
import { API_ENDPOINTS, getDynamicApiEndpoints, getApiBaseUrl } from './config/api';

// Debug: Log API endpoints to see what's being used
console.log('🔍 Debug: API Endpoints being used:', API_ENDPOINTS);
console.log('🔍 Debug: Environment variables:', {
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  REACT_APP_SOCKET_URL: process.env.REACT_APP_SOCKET_URL
});
console.log('🔍 Debug: Using Railway API:', 'https://enerstore-production.up.railway.app');
console.log('🔍 Debug: Products endpoint:', API_ENDPOINTS.PRODUCTS);
console.log('🔍 Debug: Categories endpoint:', API_ENDPOINTS.CATEGORIES);

function formatPrice(price) {
  if (!price && price !== 0) return '';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function NewProductsSection({ products }) {
  const navigate = useNavigate();
  const newProducts = [...products].slice(-9).reverse();
  return (
    <div style={{ margin: 'clamp(32px, 8vw, 48px) 0' }}>
      <div style={{ 
          background: '#fff', 
          border: '1px solid #e5e7eb', 
          borderRadius: 'clamp(12px, 3vw, 18px)', 
          boxShadow: '0 2px 12px rgba(8,15,70,0.06)', 
          padding: 'clamp(20px, 4vw, 32px)', 
          marginBottom: 'clamp(32px, 8vw, 48px)' 
        }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 'clamp(20px, 4vw, 24px)',
          flexWrap: 'wrap',
          gap: 'clamp(12px, 3vw, 16px)'
        }}>
          <h2 style={{ 
            fontWeight: 700, 
            fontSize: 'clamp(20px, 5vw, 2rem)', 
            color: 'var(--color-dark)', 
            margin: 0 
          }}>Шинэ бараа</h2>
          <button
            style={{ 
              background: 'var(--color-accent)', 
              color: '#fff', 
              border: 'none', 
              padding: 'clamp(10px, 2.5vw, 12px) clamp(20px, 5vw, 32px)', 
              borderRadius: 'clamp(6px, 1.5vw, 8px)', 
              fontSize: 'clamp(14px, 3.5vw, 16px)', 
              fontWeight: 600, 
              cursor: 'pointer', 
              transition: 'background 0.2s',
              minHeight: 'clamp(40px, 10vw, 44px)',
              whiteSpace: 'nowrap'
            }}
            onClick={() => navigate('/products?sort=newest')}
          >
            Бүгдийг үзэх
          </button>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 'clamp(16px, 3vw, 24px)',
        }}>
          {newProducts.map(product => (
            <div
              key={product._id}
              className="new-product-card"
              style={{ 
                background: '#fff', 
                border: '1px solid #eee', 
                borderRadius: 'clamp(8px, 2vw, 12px)', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
                display: 'flex', 
                flexDirection: 'column', 
                padding: 'clamp(16px, 3vw, 18px)', 
                minHeight: 'clamp(250px, 60vw, 280px)', 
                position: 'relative', 
                cursor: 'pointer', 
                transition: 'box-shadow 0.18s, border 0.18s, transform 0.18s',
              }}
              onClick={() => navigate(`/products/${product._id}`)}
            >
              {/* Product image */}
              <img 
                src={product.image || product.thumbnail} 
                alt={product.name} 
                style={{ 
                  width: '100%', 
                  height: 'clamp(120px, 30vw, 160px)', 
                  objectFit: 'contain', 
                  borderRadius: 'clamp(6px, 1.5vw, 8px)', 
                  background: '#f8f8f8', 
                  marginBottom: 'clamp(12px, 3vw, 16px)',
                }} 
              />
              {/* Details */}
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
              }}>
                <div style={{ 
                  color: '#888', 
                  fontSize: 'clamp(12px, 3vw, 14px)', 
                  fontWeight: 500, 
                  marginBottom: 4 
                }}>
                  {product.processor || product.spec || ''}
                </div>
                <div style={{ 
                  fontWeight: 700, 
                  fontSize: 'clamp(14px, 3.5vw, 16px)', 
                  color: '#222', 
                  marginBottom: 'clamp(6px, 1.5vw, 8px)', 
                  lineHeight: 1.3, 
                  display: '-webkit-box', 
                  WebkitLineClamp: 2, 
                  WebkitBoxOrient: 'vertical', 
                  overflow: 'hidden',
                }}>
                  {product.name}
                </div>
                <div style={{ 
                  color: '#666', 
                  fontSize: 'clamp(12px, 3vw, 14px)', 
                  marginBottom: 'clamp(6px, 1.5vw, 8px)', 
                  lineHeight: 1.4, 
                  display: '-webkit-box', 
                  WebkitLineClamp: 2, 
                  WebkitBoxOrient: 'vertical', 
                  overflow: 'hidden', 
                  flex: 1,
                }}>
                  {product.description}
                </div>
                {product.company && (product.company.logo || product.company.name) && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'clamp(6px, 1.5vw, 8px)', 
                    color: '#888', 
                    fontSize: 'clamp(11px, 2.5vw, 13px)', 
                    marginBottom: 'clamp(6px, 1.5vw, 8px)',
                  }}>
                    {product.company.logo && (
                      <img 
                        src={product.company.logo} 
                        alt={product.company.name} 
                        style={{ 
                          width: 'clamp(20px, 5vw, 24px)', 
                          height: 'clamp(20px, 5vw, 24px)', 
                          borderRadius: '50%', 
                          objectFit: 'cover', 
                          background: '#fff', 
                          border: '1.5px solid #eee' 
                        }} 
                      />
                    )}
                    <span style={{ 
                      color: '#222', 
                      fontWeight: 600,
                      fontSize: 'clamp(11px, 2.5vw, 13px)'
                    }}>
                      {product.company.name}
                    </span>
                  </div>
                )}
                {product.originalPrice && product.price < product.originalPrice ? (
                  <div style={{ 
                    marginTop: 'auto', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-start', 
                    gap: 2,
                  }}>
                    <span style={{ 
                      color: '#aaa', 
                      fontWeight: 500, 
                      fontSize: 'clamp(13px, 3vw, 15px)', 
                      textDecoration: 'line-through', 
                      marginBottom: 2 
                    }}>
                      {formatPrice(product.originalPrice)} ₮
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 8px)', flexWrap: 'wrap' }}>
                      <span style={{ 
                        color: 'var(--color-accent)', 
                        fontWeight: 700, 
                        fontSize: 'clamp(18px, 4.5vw, 22px)' 
                      }}>
                        {formatPrice(product.price)} ₮
                      </span>
                      <span style={{ 
                        color: '#22c55e', 
                        fontWeight: 700, 
                        fontSize: 'clamp(12px, 3vw, 15px)', 
                        background: 'rgba(34,197,94,0.10)', 
                        borderRadius: 'clamp(6px, 1.5vw, 8px)', 
                        padding: 'clamp(2px, 0.5vw, 4px) clamp(8px, 2vw, 10px)', 
                        marginLeft: 2 
                      }}>
                        -{Math.round(100 - (product.price / product.originalPrice) * 100)}%
                      </span>
                    </div>
                    {product.saleEnd && (
                      <span style={{ 
                        color: '#f59e42', 
                        fontWeight: 600, 
                        fontSize: 'clamp(12px, 3vw, 14px)', 
                        marginTop: 2 
                      }}>
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
                  <div style={{ 
                    color: 'var(--color-accent)', 
                    fontWeight: 700, 
                    fontSize: 'clamp(16px, 4vw, 20px)', 
                    marginTop: 'auto',
                  }}>
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
    <div style={{ margin: 'clamp(32px, 8vw, 48px) 0' }}>
      <div style={{ 
        background: '#fff', 
        border: '1px solid #e5e7eb', 
        borderRadius: 'clamp(12px, 3vw, 18px)', 
        boxShadow: '0 2px 12px rgba(8,15,70,0.06)', 
        padding: 'clamp(20px, 4vw, 32px)', 
        marginBottom: 'clamp(32px, 8vw, 48px)' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 'clamp(20px, 4vw, 24px)',
          flexWrap: 'wrap',
          gap: 'clamp(12px, 3vw, 16px)'
        }}>
          <h2 style={{ 
            fontWeight: 700, 
            fontSize: 'clamp(20px, 5vw, 2rem)', 
            color: 'var(--color-dark)', 
            margin: 0 
          }}>Хямдралтай бараа</h2>
          <button
            style={{ 
              background: 'var(--color-accent)', 
              color: '#fff', 
              border: 'none', 
              padding: 'clamp(10px, 2.5vw, 12px) clamp(20px, 5vw, 32px)', 
              borderRadius: 'clamp(6px, 1.5vw, 8px)', 
              fontSize: 'clamp(14px, 3.5vw, 16px)', 
              fontWeight: 600, 
              cursor: 'pointer', 
              transition: 'background 0.2s',
              minHeight: 'clamp(40px, 10vw, 44px)',
              whiteSpace: 'nowrap'
            }}
            onClick={() => navigate('/products?sort=sale')}
          >
            Бүгдийг үзэх
          </button>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 'clamp(16px, 3vw, 24px)',
        }}>
          {saleProducts.map(product => {
            const now = new Date();
            const end = new Date(product.saleEnd);
            const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
            const isSale = diff > 0;
            return (
              <div
                key={product._id}
                className="new-product-card"
                style={{ 
                  background: '#fff', 
                  border: '1px solid #eee', 
                  borderRadius: 'clamp(8px, 2vw, 12px)', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  padding: 'clamp(16px, 3vw, 18px)', 
                  minHeight: 'clamp(250px, 60vw, 280px)', 
                  position: 'relative', 
                  cursor: 'pointer', 
                  transition: 'box-shadow 0.18s, border 0.18s, transform 0.18s',
                }}
                onClick={() => navigate(`/products/${product._id}`)}
              >
                {/* Product image */}
                <img 
                  src={product.image || product.thumbnail} 
                  alt={product.name} 
                  style={{ 
                    width: '100%', 
                    height: 'clamp(120px, 30vw, 160px)', 
                    objectFit: 'contain', 
                    borderRadius: 'clamp(6px, 1.5vw, 8px)', 
                    background: '#f8f8f8', 
                    marginBottom: 'clamp(12px, 3vw, 16px)',
                  }} 
                />
                {/* Details */}
                <div style={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                }}>
                  <div style={{ 
                    color: '#888', 
                    fontSize: 'clamp(12px, 3vw, 14px)', 
                    fontWeight: 500, 
                    marginBottom: 4 
                  }}>
                    {product.processor || product.spec || ''}
                  </div>
                  <div style={{ 
                    fontWeight: 700, 
                    fontSize: 'clamp(14px, 3.5vw, 16px)', 
                    color: '#222', 
                    marginBottom: 'clamp(6px, 1.5vw, 8px)', 
                    lineHeight: 1.3, 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                  }}>
                    {product.name}
                  </div>
                  <div style={{ 
                    color: '#666', 
                    fontSize: 'clamp(12px, 3vw, 14px)', 
                    marginBottom: 'clamp(6px, 1.5vw, 8px)', 
                    lineHeight: 1.4, 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden', 
                    flex: 1,
                  }}>
                    {product.description}
                  </div>
                  {product.company && (product.company.logo || product.company.name) && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'clamp(6px, 1.5vw, 8px)', 
                      color: '#888', 
                      fontSize: 'clamp(11px, 2.5vw, 13px)', 
                      marginBottom: 'clamp(6px, 1.5vw, 8px)',
                    }}>
                      {product.company.logo && (
                        <img 
                          src={product.company.logo} 
                          alt={product.company.name} 
                          style={{ 
                            width: 'clamp(20px, 5vw, 24px)', 
                            height: 'clamp(20px, 5vw, 24px)', 
                            borderRadius: '50%', 
                            objectFit: 'cover', 
                            background: '#fff', 
                            border: '1.5px solid #eee' 
                          }} 
                        />
                      )}
                      <span style={{ 
                        color: '#222', 
                        fontWeight: 600,
                        fontSize: 'clamp(11px, 2.5vw, 13px)'
                      }}>
                        {product.company.name}
                      </span>
                    </div>
                  )}
                  <div style={{ 
                    marginTop: 'auto', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-start', 
                    gap: 2,
                  }}>
                    {isSale ? (
                      <>
                        <span style={{ 
                          color: '#aaa', 
                          fontWeight: 500, 
                          fontSize: 'clamp(13px, 3vw, 15px)', 
                          textDecoration: 'line-through', 
                          marginBottom: 2 
                        }}>
                          {formatPrice(product.originalPrice)} ₮
                        </span>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 'clamp(6px, 1.5vw, 8px)', 
                          flexWrap: 'wrap' 
                        }}>
                          <span style={{ 
                            color: 'var(--color-accent)', 
                            fontWeight: 700, 
                            fontSize: 'clamp(18px, 4.5vw, 22px)' 
                          }}>
                            {formatPrice(product.price)} ₮
                          </span>
                          <span style={{ 
                            color: '#22c55e', 
                            fontWeight: 700, 
                            fontSize: 'clamp(12px, 3vw, 15px)', 
                            background: 'rgba(34,197,94,0.10)', 
                            borderRadius: 'clamp(6px, 1.5vw, 8px)', 
                            padding: 'clamp(2px, 0.5vw, 4px) clamp(8px, 2vw, 10px)', 
                            marginLeft: 2 
                          }}>
                            -{Math.round(100 - (product.price / product.originalPrice) * 100)}%
                          </span>
                        </div>
                        <SaleCountdown saleEnd={product.saleEnd} />
                      </>
                    ) : (
                      <span style={{ 
                        color: 'var(--color-accent)', 
                        fontWeight: 700, 
                        fontSize: 'clamp(16px, 4vw, 20px)',
                      }}>
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
    <div style={{ margin: 'clamp(32px, 8vw, 48px) 0' }}>
      <h2 style={{ 
        fontWeight: 700, 
        fontSize: 'clamp(20px, 5vw, 2rem)', 
        marginBottom: 'clamp(20px, 4vw, 24px)', 
        color: 'var(--color-dark)' 
      }}>Best Seller</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 'clamp(16px, 3vw, 32px)', 
        justifyContent: 'flex-start' 
      }}>
        {bestSellers.map(product => (
          <div key={product._id} style={{ 
            background: '#fff', 
            border: '1px solid #eee', 
            borderRadius: 'clamp(6px, 1.5vw, 8px)', 
            width: '100%', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            padding: 'clamp(12px, 3vw, 16px)' 
          }}>
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ 
                width: 'clamp(80px, 20vw, 120px)', 
                height: 'clamp(80px, 20vw, 120px)', 
                objectFit: 'contain', 
                marginBottom: 'clamp(8px, 2vw, 12px)' 
              }} 
            />
            <div style={{ 
              fontWeight: 500, 
              fontSize: 'clamp(14px, 3.5vw, 16px)', 
              marginBottom: 'clamp(4px, 1vw, 6px)', 
              textAlign: 'center', 
              color: 'var(--color-dark)' 
            }}>
              {product.name}
            </div>
            <div style={{ 
              color: 'var(--color-accent)', 
              fontWeight: 700, 
              fontSize: 'clamp(16px, 4vw, 18px)' 
            }}>
              {product.price} ₮
            </div>
            <div style={{ 
              color: '#888', 
              fontSize: 'clamp(11px, 2.5vw, 13px)', 
              marginTop: 'clamp(2px, 1vw, 4px)' 
            }}>
              Зарагдсан: {product.soldCount}
            </div>
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
    const initializeApp = async () => {
      try {
        // Get Railway API endpoints
        const dynamicEndpoints = await getDynamicApiEndpoints();
        const baseUrl = await getApiBaseUrl();
        
        console.log('🔍 Fetching data from Railway...');
        console.log('🔍 Using backend:', baseUrl);
        console.log('🔍 Calling:', dynamicEndpoints.PRODUCTS);
        
        // Fetch products from Railway
        const productsRes = await fetch(dynamicEndpoints.PRODUCTS);
        
        console.log('🔍 Response status:', productsRes.status);
        console.log('🔍 Response headers:', Object.fromEntries(productsRes.headers.entries()));
        
        if (productsRes.ok) {
          const data = await productsRes.json();
          console.log('✅ API Data received:', data.length, 'products');
          setProducts(data);
        } else {
          const errorText = await productsRes.text();
          console.error('❌ API Response not ok:', productsRes.status);
          console.error('❌ Response text:', errorText);
        }
      } catch (error) {
        console.error('❌ API Error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const dynamicEndpoints = await getDynamicApiEndpoints();
        const categoriesRes = await fetch(dynamicEndpoints.CATEGORIES);
        
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          // Sort categories alphabetically
          const sortedCategories = data.sort((a, b) => a.name.localeCompare(b.name, 'mn'));
          setCategories(sortedCategories);
        } else {
          const errorText = await categoriesRes.text();
          console.error('❌ Categories API Response not ok:', categoriesRes.status);
          console.error('❌ Categories Response text:', errorText);
        }
      } catch (error) {
        console.error('❌ Categories fetch error:', error);
      }
    };

    fetchCategories();
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
          <Route path="brands" element={<BrandsAdmin />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
          <Route path="header-menu" element={<HeaderMenuAdmin />} />
        </Route>
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products" element={<AllProductsPage />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/register" element={<UserRegistration />} />
        <Route path="/user/edit" element={<UserEdit />} />
        <Route path="/user-orders" element={<UserOrders />} />
        <Route path="/" element={<MainSite products={products} categories={categories} />} />
      </Routes>
    </Router>
  );
}

export default App; 