import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import MainHeader from './MainHeader';
import NavBar from './NavBar';
import Footer from './Footer';
import { API_ENDPOINTS } from '../config/api';
import './ProductDetail.css';


function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('specs');
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [lastSeen, setLastSeen] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredSimilar, setHoveredSimilar] = useState(null);
  const [hoveredLastSeen, setHoveredLastSeen] = useState(null);
  const [saleCountdown, setSaleCountdown] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
    // Fetch all products for similar section
    fetch(API_ENDPOINTS.PRODUCTS)
      .then(res => res.json())
      .then(data => setAllProducts(data));
  }, [id]);

  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem('favorites') || '[]'));
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
    
    // Check for logged in user
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setLoggedInUser(user);
  }, [id]);

  // Last seen logic
  useEffect(() => {
    if (!product) return;
    let seen = JSON.parse(localStorage.getItem('lastSeen') || '[]');
    seen = seen.filter(p => p._id !== product._id); // Remove if already exists
    seen.unshift(product); // Add to front
    if (seen.length > 12) seen = seen.slice(0, 12);
    localStorage.setItem('lastSeen', JSON.stringify(seen));
    setLastSeen(seen);
  }, [product]);

  // Live countdown for sale
  useEffect(() => {
    if (!product || !product.saleEnd || !(product.originalPrice && product.price < product.originalPrice)) return;
    const end = new Date(product.saleEnd);
    function updateCountdown() {
      const now = new Date();
      const diff = end - now;
      if (diff <= 0) {
        setSaleCountdown("");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setSaleCountdown(
        (days > 0 ? `${days} өдөр ` : "") +
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} үлдлээ`
      );
    }
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [product]);

  if (!product) return <div className="loading-container">Түр хүлээнэ үү...</div>;

  const images = [product.image, ...(product.images || [])].filter(Boolean);
  const isFav = favorites.find(p => p._id === product._id);
  const isInCart = cart.find(p => p._id === product._id);

  const toggleFavorite = () => {
    let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const exists = favs.find(p => p._id === product._id);
    if (exists) {
      favs = favs.filter(p => p._id !== product._id);
    } else {
      favs.push(product);
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
    setFavorites(favs);
    window.dispatchEvent(new Event('storage'));
  };

  const handleLogin = async () => {
    setLoginError('');
    try {
      const res = await fetch(API_ENDPOINTS.CUSTOMER_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      if (res.ok) {
        const user = await res.json();
        localStorage.setItem('user', JSON.stringify(user));
        setLoggedInUser(user);
        setShowLoginModal(false);
        setLoginEmail('');
        setLoginPassword('');
        setLoginError('');
      } else {
        const data = await res.json();
        setLoginError(data.error || 'Имэйл эсвэл нууц үг буруу байна.');
      }
    } catch (error) {
      setLoginError('Серверт холбогдоход алдаа гарлаа.');
    }
  };

  const addToCart = () => {
    if (!loggedInUser) {
      setShowLoginModal(true);
      return;
    }
    
    let c = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = c.find(p => p._id === product._id);
    if (!exists) {
      c.push({ ...product, quantity });
    } else {
      c = c.map(p => p._id === product._id ? { ...p, quantity: p.quantity + quantity } : p);
    }
    localStorage.setItem('cart', JSON.stringify(c));
    setCart(c);
    window.dispatchEvent(new Event('storage'));
  };

  const handleBuyNow = () => {
    if (!loggedInUser) {
      setShowLoginModal(true);
      return;
    }
    
    addToCart();
    navigate('/cart');
  };

  // Similar products: same category, not current, up to 6
  const similarProducts = allProducts.filter(
    p => p._id !== product._id && (p.category === product.category || (Array.isArray(p.categories) && p.categories.includes(product.category)))
  ).slice(0, 6);

  // Last seen products: not current, up to 6
  const lastSeenProducts = lastSeen.filter(p => p._id !== product._id).slice(0, 6);

  const renderProductCard = p => (
    <div
      key={p._id}
      className="product-card-small"
      onClick={() => navigate(`/products/${p._id}`)}
      onMouseEnter={() => setHoveredCard(p._id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <img src={p.image || p.thumbnail} alt={p.name} className="product-card-image" />
      <div className="product-card-name">{p.name}</div>
      <div className="product-card-price">{p.price?.toLocaleString()} ₮</div>
    </div>
  );

  const renderSimilarProductCard = p => (
    <div
      key={p._id}
      className="product-card-small"
      onClick={() => navigate(`/products/${p._id}`)}
      onMouseEnter={() => setHoveredSimilar(p._id)}
      onMouseLeave={() => setHoveredSimilar(null)}
    >
      <img src={p.image || p.thumbnail} alt={p.name} className="product-card-image" />
      <div className="product-card-name">{p.name}</div>
      <div className="product-card-price">{p.price?.toLocaleString()} ₮</div>
    </div>
  );

  const renderLastSeenProductCard = p => (
    <div
      key={p._id}
      className="product-card-small"
      onClick={() => navigate(`/products/${p._id}`)}
      onMouseEnter={() => setHoveredLastSeen(p._id)}
      onMouseLeave={() => setHoveredLastSeen(null)}
    >
      <img src={p.image || p.thumbnail} alt={p.name} className="product-card-image" />
      <div className="product-card-name">{p.name}</div>
      <div className="product-card-price">{p.price?.toLocaleString()} ₮</div>
    </div>
  );

  return (
    <>
      <Header />
      <MainHeader />
      <NavBar />
      <div className="product-detail-container">
        {/* Left: Images */}
        <div className="product-images-section">
          {/* Image List */}
          <div className="image-thumbnails">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={`thumbnail-image ${selectedImage === idx ? 'selected' : ''}`}
                onClick={() => setSelectedImage(idx)}
              />
            ))}
          </div>
          {/* Main Image */}
          <div className="main-image-container">
            <div className="main-image-wrapper">
              <img 
                src={images[selectedImage]} 
                alt={product.name} 
                className="main-image"
              />
            </div>
          </div>
        </div>
        {/* Right: Info */}
        <div className="product-info-section">
          <div className="product-header">
            <span className="product-title">{product.name}</span>
            {product.brand && product.brand.name && (
              <span className="brand-badge">{product.brand.name}</span>
            )}
            <span className="product-code">Барааны код: <b>#{product._id?.slice(-5)}</b></span>
          </div>
          <div className="product-actions">
            <button onClick={toggleFavorite} className="action-button">
              {isFav ? '❤️ Хадгалсан' : '🤍 Хадгалах'}
            </button>
            <button className="action-button">Хуваалцах</button>
          </div>
          {/* Price and Sale Info */}
          <div className="price-section">
            {product.originalPrice && product.price < product.originalPrice && product.saleEnd && (() => {
              const now = new Date();
              const end = new Date(product.saleEnd);
              const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
              return diff > 0;
            })() ? (
              <div className="sale-price-container">
                <span className="original-price">
                  {product.originalPrice?.toLocaleString()} ₮
                </span>
                <div className="current-price-container">
                  <span className="current-price">
                    {product.price?.toLocaleString()} ₮
                  </span>
                  <span className="discount-badge">
                    -{Math.round(100 - (product.price / product.originalPrice) * 100)}%
                  </span>
                </div>
                {saleCountdown && (
                  <span className="sale-countdown">
                    {saleCountdown}
                  </span>
                )}
              </div>
            ) : (
              <span className="current-price">{product.price?.toLocaleString()} ₮</span>
            )}
          </div>
          <div className="stock-info">{product.piece > 0 ? `${product.piece} ширхэг байна` : 'Бэлэн бараа дууссан'}</div>
          <div className="quantity-section">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="quantity-btn">-</button>
            <span className="quantity-display">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="quantity-btn">+</button>
            <span className="cart-info">Сагсанд байгаа: {isInCart ? isInCart.quantity : 0}</span>
          </div>
          <div className="purchase-buttons">
            <button className="add-to-cart-btn" onClick={addToCart}>Сагсанд хийх</button>
            <button className="buy-now-btn" onClick={handleBuyNow}>Худалдан авах</button>
          </div>
          <div className="delivery-info">Таны бараа 24-48 цагийн дотор бэлэн болно</div>
          {/* Specs grid */}
          <div className="product-tabs">
            <div className="tab-buttons">
              <button onClick={() => setTab('specs')} className={`tab-btn ${tab === 'specs' ? 'active' : ''}`}>
                Техникийн үзүүлэлт
              </button>
              <button onClick={() => setTab('desc')} className={`tab-btn ${tab === 'desc' ? 'active' : ''}`}>
                Танилцуулга
              </button>
            </div>
            {tab === 'specs' && (
              <div className="tab-content">
                {product.specifications ? (
                  <div className="specifications-text">
                    {product.specifications}
                  </div>
                ) : (
                  <div className="specs-grid">
                    {product.brand && product.brand.name && <div><b>Брэнд:</b> {product.brand.name}</div>}
                    {product.processor && <div><b>Процессор:</b> {product.processor}</div>}
                    {product.gpu && <div><b>График карт:</b> {product.gpu}</div>}
                    {product.ram && <div><b>Санах ой:</b> {product.ram}</div>}
                    {product.storage && <div><b>Багтаамж:</b> {product.storage}</div>}
                    {product.display && <div><b>Дэлгэцийн хэмжээ:</b> {product.display}</div>}
                    {product.modelYear && <div><b>Model Year:</b> {product.modelYear}</div>}
                    {product.category && <div><b>Ангилал:</b> {product.category}</div>}
                  </div>
                )}
              </div>
            )}
            {tab === 'desc' && (
              <div className="tab-content">
                <div className="description-text">{product.description || 'Тайлбар байхгүй.'}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="related-products-section">
          <h2 className="section-title">Ижил төстэй бүтээгдэхүүнүүд</h2>
          <div className="products-scroll">
            {similarProducts.map(renderSimilarProductCard)}
          </div>
        </div>
      )}
      {/* Last Seen Products */}
      {lastSeenProducts.length > 0 && (
        <div className="related-products-section">
          <h2 className="section-title">Сүүлд үзсэн бүтээгдэхүүнүүд</h2>
          <div className="products-scroll">
            {lastSeenProducts.map(renderLastSeenProductCard)}
          </div>
        </div>
      )}
      
      {/* Login Modal */}
      {showLoginModal && (
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
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '24px', fontWeight: '700' }}>
                Нэвтрэх
              </h2>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                Захиалга хийхийн тулд нэвтрэх шаардлагатай
              </p>
            </div>
            
            {loginError && (
              <div style={{
                background: '#f8d7da',
                color: '#721c24',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {loginError}
              </div>
            )}
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Имэйл
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Имэйл хаягаа оруулна уу"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Нууц үг
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Нууц үгээ оруулна уу"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleLogin}
                style={{
                  flex: 1,
                  background: '#f8991b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Нэвтрэх
              </button>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError('');
                  setLoginEmail('');
                  setLoginPassword('');
                }}
                style={{
                  flex: 1,
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Цуцлах
              </button>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>Бүртгэлгүй юу? </span>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/register');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f8991b',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Бүртгүүлэх
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
}

export default ProductDetail; 