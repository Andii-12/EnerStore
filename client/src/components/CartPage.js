import React, { useEffect, useState } from 'react';
import Header from './Header';
import MainHeader from './MainHeader';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

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
    <div className="cart-page">
      <Header />
      <MainHeader />
      <div className="cart-container">
        {/* Stepper */}
        <div className="cart-stepper">
          {['Сагс', 'Хаяг', 'Төлбөр', 'Дуусгах'].map((step, idx) => (
            <div key={step} className="stepper-step">
              <div className={`stepper-circle ${idx === 0 ? 'active' : ''}`}>
                {idx === 0 ? '✓' : ''}
              </div>
              <span className={`stepper-text ${idx === 0 ? 'active' : ''}`}>{step}</span>
              {idx < 3 && <div className="stepper-line" />}
            </div>
          ))}
        </div>
        
        <div className="cart-layout">
          {/* Cart List */}
          <div className="cart-list">
            <div className="cart-header">
              <h1 className="cart-title">Миний сагс ({cart.length})</h1>
              {cart.length > 0 && (
                <button onClick={handleClear} className="clear-cart-btn">
                  Сагс хоослох
                </button>
              )}
            </div>
            
            {cart.length === 0 ? (
              <div className="empty-cart">Сагс хоосон байна</div>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item._id} className="cart-item">
                    <img 
                      src={item.image || item.thumbnail} 
                      alt={item.name} 
                      className="cart-item-image" 
                    />
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-description">{item.description}</div>
                    </div>
                    <div className="cart-item-controls">
                      <button 
                        onClick={() => handleQty(item._id, -1)} 
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button 
                        onClick={() => handleQty(item._id, 1)} 
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-price">
                      {(item.price * item.quantity).toLocaleString()}₮
                    </div>
                    <button 
                      onClick={() => handleRemove(item._id)} 
                      className="remove-btn" 
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button onClick={() => navigate(-1)} className="back-btn">
                  ← Буцах
                </button>
              </>
            )}
          </div>
          
          {/* Cart Summary */}
          <div className="cart-summary">
            <div className="summary-title">Захиалгын мэдээлэл</div>
            {cart.map(item => (
              <div key={item._id} className="summary-item">
                <span className="summary-item-name">{item.name}</span>
                <span className="summary-item-quantity">x{item.quantity}</span>
                <span className="summary-item-price">{(item.price * item.quantity).toLocaleString()}₮</span>
              </div>
            ))}
            <div className="shipping-info">
              Хүргэлтийн үнэ: <span className="shipping-price">0₮</span>
            </div>
            <div className="summary-divider" />
            <div className="total-amount">
              Нийт дүн <span className="total-price">{total.toLocaleString()}₮</span>
            </div>
            <button className="action-btn buy-now-btn">ХУДАЛДАН АВАХ</button>
            <button className="action-btn credit-btn">Зээлээр авах</button>
            <div className="divider-text">Эсвэл</div>
            <button className="action-btn invoice-btn">Нэхэмжлэл авах</button>
            <button className="action-btn quote-btn">Үнийн санал авах</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CartPage; 