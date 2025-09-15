import React, { useEffect, useState } from 'react';
import Header from './Header';
import MainHeader from './MainHeader';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

function CartPage() {
  const [cart, setCart] = useState([]);
  const [showBankModal, setShowBankModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
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

  const handleBuyNow = () => {
    // Generate random 5-digit order number
    const randomOrderNumber = Math.floor(10000 + Math.random() * 90000).toString();
    setOrderNumber(randomOrderNumber);
    setShowBankModal(true);
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart-page">
      <Header />
      <MainHeader />
      <div className="cart-container">
        
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
            <div className="down-payment-info">
              Урьдчилгаа 60% төлнө: <span className="down-payment-price">{Math.round(total * 0.6).toLocaleString()}₮</span>
            </div>
            <div className="summary-divider" />
            <div className="total-amount">
              Нийт дүн <span className="total-price">{total.toLocaleString()}₮</span>
            </div>
            <button className="action-btn buy-now-btn" onClick={handleBuyNow}>ХУДАЛДАН АВАХ</button>
          </div>
        </div>
      </div>
      
      {/* Bank Transfer Modal */}
      {showBankModal && (
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
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '24px', fontWeight: '700' }}>
                Төлбөрийн мэдээлэл
              </h2>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                Дараах банкны данс руу шилжүүлэг хийж захиалгаа баталгаажуулна уу
              </p>
            </div>
            
            {/* Order Number */}
            <div style={{
              background: '#e3f2fd',
              border: '2px solid #2196f3',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{ color: '#1976d2', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
                Захиалгын дугаар:
              </div>
              <div style={{
                background: '#fff',
                border: '2px solid #2196f3',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1976d2',
                fontFamily: 'monospace',
                letterSpacing: '2px'
              }}>
                {orderNumber}
              </div>
              <div style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
                Гүйлгээний утга дээр бичнэ үү !
              </div>
            </div>
            
            <div style={{
              background: '#f8f9fa',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                  Банкны дансны дугаар:
                </div>
                <div style={{
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#333',
                  fontFamily: 'monospace',
                  letterSpacing: '1px'
                }}>
                  BAN 37000500 5133562350
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                  Байгууллагын нэр:
                </div>
                <div style={{
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Enerstore LLC
                </div>
              </div>
              
              <div>
                <div style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                  Төлөх дүн:
                </div>
                <div style={{
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#f8991b'
                }}>
                  {Math.round(total * 0.6).toLocaleString()}₮
                </div>
                <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
                  (Урьдчилгаа 60%)
                </div>
              </div>
            </div>
            
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowBankModal(false);
                  // Clear cart after successful order
                  updateCart([]);
                }}
                style={{
                  flex: 1,
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Захиалга хийсэн
              </button>
              <button
                onClick={() => setShowBankModal(false)}
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
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default CartPage; 