import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import MainHeader from './MainHeader';
import NavBar from './NavBar';
import Footer from './Footer';

const paymentOptions = [
  { name: 'Голомт банк', desc: 'Хэрэглээний зээл' },
  { name: 'StorePay', desc: 'Төлбөрөө 4 хувааж төл' },
  { name: 'Omniway', desc: 'Төлбөрөө 2-4 хувааж төл' },
  { name: 'Pocket', desc: 'Урьдчилгаагүй шуурхай' },
  { name: 'Sono', desc: 'Хүү ТЭГ, шимтгэл ТЭГ.' },
];

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

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
    // Fetch all products for similar section
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setAllProducts(data));
  }, [id]);

  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem('favorites') || '[]'));
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
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

  if (!product) return <div style={{ padding: 40 }}>Түр хүлээнэ үү...</div>;

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

  const addToCart = () => {
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

  // Similar products: same category, not current, up to 6
  const similarProducts = allProducts.filter(
    p => p._id !== product._id && (p.category === product.category || (Array.isArray(p.categories) && p.categories.includes(product.category)))
  ).slice(0, 6);

  // Last seen products: not current, up to 6
  const lastSeenProducts = lastSeen.filter(p => p._id !== product._id).slice(0, 6);

  const renderProductCard = p => (
    <div
      key={p._id}
      style={{
        width: 180,
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: 8,
        boxShadow: hoveredCard === p._id ? '0 6px 24px rgba(0,0,0,0.10)' : '0 2px 8px rgba(8,15,70,0.06)',
        marginRight: 18,
        cursor: 'pointer',
        padding: 10,
        transform: hoveredCard === p._id ? 'scale(1.035)' : 'scale(1)',
        transition: 'box-shadow 0.18s, border 0.18s, transform 0.18s',
      }}
      onClick={() => navigate(`/products/${p._id}`)}
      onMouseEnter={() => setHoveredCard(p._id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <img src={p.image || p.thumbnail} alt={p.name} style={{ width: '100%', height: 100, objectFit: 'contain', borderRadius: 6, background: '#f8f8f8', marginBottom: 8 }} />
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
      <div style={{ color: '#f8991b', fontWeight: 700, fontSize: 16 }}>{p.price?.toLocaleString()} ₮</div>
    </div>
  );

  const renderSimilarProductCard = p => (
    <div
      key={p._id}
      style={{
        width: 180,
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: 8,
        boxShadow: hoveredSimilar === p._id ? '0 6px 24px rgba(0,0,0,0.10)' : '0 2px 8px rgba(8,15,70,0.06)',
        marginRight: 18,
        cursor: 'pointer',
        padding: 10,
        transform: hoveredSimilar === p._id ? 'scale(1.035)' : 'scale(1)',
        transition: 'box-shadow 0.18s, border 0.18s, transform 0.18s',
      }}
      onClick={() => navigate(`/products/${p._id}`)}
      onMouseEnter={() => setHoveredSimilar(p._id)}
      onMouseLeave={() => setHoveredSimilar(null)}
    >
      <img src={p.image || p.thumbnail} alt={p.name} style={{ width: '100%', height: 100, objectFit: 'contain', borderRadius: 6, background: '#f8f8f8', marginBottom: 8 }} />
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
      <div style={{ color: '#f8991b', fontWeight: 700, fontSize: 16 }}>{p.price?.toLocaleString()} ₮</div>
    </div>
  );

  const renderLastSeenProductCard = p => (
    <div
      key={p._id}
      style={{
        width: 180,
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: 8,
        boxShadow: hoveredLastSeen === p._id ? '0 6px 24px rgba(0,0,0,0.10)' : '0 2px 8px rgba(8,15,70,0.06)',
        marginRight: 18,
        cursor: 'pointer',
        padding: 10,
        transform: hoveredLastSeen === p._id ? 'scale(1.035)' : 'scale(1)',
        transition: 'box-shadow 0.18s, border 0.18s, transform 0.18s',
      }}
      onClick={() => navigate(`/products/${p._id}`)}
      onMouseEnter={() => setHoveredLastSeen(p._id)}
      onMouseLeave={() => setHoveredLastSeen(null)}
    >
      <img src={p.image || p.thumbnail} alt={p.name} style={{ width: '100%', height: 100, objectFit: 'contain', borderRadius: 6, background: '#f8f8f8', marginBottom: 8 }} />
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
      <div style={{ color: '#f8991b', fontWeight: 700, fontSize: 16 }}>{p.price?.toLocaleString()} ₮</div>
    </div>
  );

  return (
    <>
      <Header />
      <MainHeader />
      <NavBar />
      <div style={{ maxWidth: 1200, margin: '32px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(8,15,70,0.06)', padding: 32, display: 'flex', gap: 32 }}>
        {/* Left: Images */}
        <div style={{ flex: '0 0 500px', display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
          {/* Image List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 6, border: selectedImage === idx ? '2px solid #f8991b' : '1px solid #eee', cursor: 'pointer', background: '#fff' }}
                onClick={() => setSelectedImage(idx)}
              />
            ))}
          </div>
          {/* Main Image */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: 400, height: 400, background: '#f8f8f8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={images[selectedImage]} alt={product.name} style={{ maxWidth: 380, maxHeight: 380, objectFit: 'contain' }} />
            </div>
          </div>
        </div>
        {/* Right: Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 22, fontWeight: 700 }}>{product.name}</span>
            {product.brand && product.brand.name && (
              <span style={{ background: '#f3f4f6', color: '#374151', padding: '4px 12px', borderRadius: 6, fontSize: 14, fontWeight: 600 }}>{product.brand.name}</span>
            )}
            <span style={{ color: '#888', fontSize: 15, marginLeft: 8 }}>Барааны код: <b>#{product._id?.slice(-5)}</b></span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <button onClick={toggleFavorite} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 6, padding: '6px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 18 }}>
              {isFav ? '❤️ Хадгалсан' : '🤍 Хадгалах'}
            </button>
            <button style={{ background: '#fff', border: '1px solid #eee', borderRadius: 6, padding: '6px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 18 }}>Хуваалцах</button>
          </div>
          {/* Price and Sale Info */}
          <div style={{ marginBottom: 8 }}>
            {product.originalPrice && product.price < product.originalPrice && product.saleEnd && (() => {
              const now = new Date();
              const end = new Date(product.saleEnd);
              const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
              return diff > 0;
            })() ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ color: '#aaa', fontWeight: 500, fontSize: 18, textDecoration: 'line-through' }}>
                  {product.originalPrice?.toLocaleString()} ₮
                </span>
                <span style={{ fontSize: 28, fontWeight: 700, color: '#f8991b' }}>
                  {product.price?.toLocaleString()} ₮
                </span>
                <span style={{ color: '#22c55e', fontWeight: 700, fontSize: 18, background: 'rgba(34,197,94,0.10)', borderRadius: 8, padding: '2px 10px' }}>
                  -{Math.round(100 - (product.price / product.originalPrice) * 100)}%
                </span>
                {saleCountdown && (
                  <span style={{ color: '#f59e42', fontWeight: 600, fontSize: 15, marginLeft: 8 }}>
                    {saleCountdown}
                  </span>
                )}
              </div>
            ) : (
              <span style={{ fontSize: 28, fontWeight: 700, color: '#f8991b' }}>{product.price?.toLocaleString()} ₮</span>
            )}
          </div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>{product.piece > 0 ? `${product.piece} ширхэг байна` : 'Бэлэн бараа дууссан'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #eee', background: '#fff', fontWeight: 700, fontSize: 18 }}>-</button>
            <span style={{ fontSize: 18, fontWeight: 600 }}>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #eee', background: '#fff', fontWeight: 700, fontSize: 18 }}>+</button>
            <span style={{ color: '#888', fontSize: 15, marginLeft: 12 }}>Сагсанд байгаа: {isInCart ? isInCart.quantity : 0}</span>
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <button style={{ flex: 1, background: '#fff', color: '#f8991b', border: '2px solid #f8991b', borderRadius: 8, padding: '14px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer' }} onClick={addToCart}>Сагсанд хийх</button>
            <button style={{ flex: 1, background: '#f8991b', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer' }} onClick={() => { addToCart(); navigate('/cart'); }}>Худалдан авах</button>
          </div>
          <div style={{ color: '#222', fontSize: 15, marginBottom: 8 }}>Бэлэн бараа 08-48 цагт хүргэгдэнэ</div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
            {paymentOptions.map(opt => (
              <div key={opt.name} style={{ background: '#f3f4f6', borderRadius: 8, padding: '10px 18px', minWidth: 180, fontWeight: 600, color: '#222', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16 }}>{opt.name}</span>
                <span style={{ fontSize: 13, color: '#888', fontWeight: 400 }}>{opt.desc}</span>
              </div>
            ))}
          </div>
          {/* Specs grid */}
          <div style={{ borderTop: '1px solid #eee', marginTop: 24, paddingTop: 18 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
              <button onClick={() => setTab('specs')} style={{ background: tab === 'specs' ? '#f8991b' : '#f3f4f6', color: tab === 'specs' ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Техникийн үзүүлэлт</button>
              <button onClick={() => setTab('desc')} style={{ background: tab === 'desc' ? '#f8991b' : '#f3f4f6', color: tab === 'desc' ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Танилцуулга</button>
            </div>
            {tab === 'specs' && (
              <div>
                {product.specifications ? (
                  <div style={{ color: '#444', fontSize: 16, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {product.specifications}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
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
              <div style={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>{product.description || 'Тайлбар байхгүй.'}</div>
            )}
          </div>
        </div>
      </div>
      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div style={{ maxWidth: 1200, margin: '32px auto 0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(8,15,70,0.06)', padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Ижил төстэй бүтээгдэхүүнүүд</h2>
          <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: 8 }}>
            {similarProducts.map(renderSimilarProductCard)}
          </div>
        </div>
      )}
      {/* Last Seen Products */}
      {lastSeenProducts.length > 0 && (
        <div style={{ maxWidth: 1200, margin: '32px auto 0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(8,15,70,0.06)', padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Сүүлд үзсэн бүтээгдэхүүнүүд</h2>
          <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: 8 }}>
            {lastSeenProducts.map(renderLastSeenProductCard)}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default ProductDetail; 