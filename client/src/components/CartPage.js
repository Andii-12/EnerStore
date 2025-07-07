import React, { useEffect, useState } from 'react';
import Header from './Header';
import MainHeader from './MainHeader';
import NavBar from './NavBar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const handleRemove = (id) => {
    const newCart = cart.filter(item => item._id !== id);
    updateCart(newCart);
  };

  const handleQty = (id, delta) => {
    const newCart = cart.map(item =>
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    updateCart(newCart);
  };

  const handleClear = () => {
    updateCart([]);
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div style={{ background: '#f6f6f6', minHeight: '100vh' }}>
      <Header />
      <MainHeader />
      <NavBar />
      <div style={{ maxWidth: 1200, margin: '32px auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Stepper */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 48, marginBottom: 24 }}>
          {['Сагс', 'Хаяг', 'Төлбөр', 'Дуусгах'].map((step, idx) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: idx === 0 ? '#f8991b' : '#fff', border: '2px solid #f8991b', color: idx === 0 ? '#fff' : '#f8991b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20 }}>{idx === 0 ? '✓' : ''}</div>
              <span style={{ fontWeight: idx === 0 ? 700 : 500, color: idx === 0 ? '#f8991b' : '#888', fontSize: 18 }}>{step}</span>
              {idx < 3 && <div style={{ width: 48, height: 2, background: '#eee' }} />}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {/* Cart List */}
          <div style={{ flex: 2, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(8,15,70,0.06)', padding: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 24 }}>Миний сагс ({cart.length})</div>
            {cart.length === 0 ? (
              <div style={{ color: '#888', fontSize: 18, textAlign: 'center', margin: '48px 0' }}>Сагс хоосон байна</div>
            ) : (
              <>
                <button onClick={handleClear} style={{ float: 'right', background: '#f8f3ed', color: '#f8991b', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginBottom: 18 }}>Сагс хоослох</button>
                <div style={{ clear: 'both' }} />
                {cart.map(item => (
                  <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 18, borderBottom: '1px solid #eee', padding: '18px 0' }}>
                    <img src={item.image || item.thumbnail} alt={item.name} style={{ width: 90, height: 90, objectFit: 'contain', borderRadius: 8, background: '#f8f8f8' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{item.name}</div>
                      <div style={{ color: '#888', fontSize: 15 }}>{item.description}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => handleQty(item._id, -1)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #eee', background: '#fff', fontWeight: 700, fontSize: 18 }}>-</button>
                      <span style={{ fontSize: 18, fontWeight: 600 }}>{item.quantity}</span>
                      <button onClick={() => handleQty(item._id, 1)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #eee', background: '#fff', fontWeight: 700, fontSize: 18 }}>+</button>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: '#f8991b', minWidth: 120, textAlign: 'right' }}>{(item.price * item.quantity).toLocaleString()}₮</div>
                    <button onClick={() => handleRemove(item._id)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 22, cursor: 'pointer', marginLeft: 8 }} title="Remove">✕</button>
                  </div>
                ))}
                <div style={{ marginTop: 32 }}>
                  <button onClick={() => navigate(-1)} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: '10px 32px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>← Буцах</button>
                </div>
              </>
            )}
          </div>
          {/* Cart Summary */}
          <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(8,15,70,0.06)', padding: 32, minWidth: 320 }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Захиалгын мэдээлэл</div>
            {cart.map(item => (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                <span>x{item.quantity}</span>
                <span style={{ fontWeight: 600 }}>{(item.price * item.quantity).toLocaleString()}₮</span>
              </div>
            ))}
            <div style={{ color: '#888', fontSize: 15, margin: '12px 0 0 0' }}>Хүргэлтийн үнэ: <span style={{ color: '#222', fontWeight: 600 }}>0₮</span></div>
            <div style={{ borderTop: '1px solid #eee', margin: '18px 0' }} />
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Нийт дүн <span style={{ float: 'right', color: '#f8991b' }}>{total.toLocaleString()}₮</span></div>
            <button style={{ width: '100%', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 0', fontWeight: 700, fontSize: 18, marginBottom: 12, cursor: 'pointer' }}>ХУДАЛДАН АВАХ</button>
            <button style={{ width: '100%', background: '#fff', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 16, marginBottom: 8, cursor: 'pointer' }}>Зээлээр авах</button>
            <div style={{ textAlign: 'center', color: '#888', margin: '12px 0' }}>Эсвэл</div>
            <button style={{ width: '100%', background: '#fff', color: '#222', border: '1px solid #eee', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 16, marginBottom: 8, cursor: 'pointer' }}>Нэхэмжлэл авах</button>
            <button style={{ width: '100%', background: '#fff', color: '#222', border: '1px solid #eee', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Үнийн санал авах</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CartPage; 