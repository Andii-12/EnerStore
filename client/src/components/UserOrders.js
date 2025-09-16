import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import MainHeader from './MainHeader';
import NavBar from './NavBar';
import Footer from './Footer';
import { API_ENDPOINTS } from '../config/api';

function UserOrders() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      navigate('/');
      return;
    }
    setUser(loggedInUser);
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) {
      return;
    }
    
    setOrdersLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.ORDERS}?customer=${user._id}&sort=newest`);
      
      if (!response.ok) {
        const errorText = await response.text();
        setMessage(`API алдаа: ${response.status} - ${errorText}`);
        return;
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      setMessage('Захиалгуудыг татахад алдаа гарлаа: ' + error.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Filter orders based on selected status
  const filteredOrders = orders.filter(order => {
    if (selectedStatus === 'all') return true;
    return order.status === selectedStatus;
  });

  if (!user) return <div style={{ padding: 40 }}>Уншиж байна...</div>;

  return (
    <div style={{ background: '#f6f6f6', minHeight: '100vh' }}>
      <Header />
      <MainHeader />
      <NavBar />
      
      <div style={{ maxWidth: 1000, margin: '32px auto', padding: '0 16px' }}>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(8,15,70,0.06)', padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h1 style={{ margin: 0, color: '#222', fontSize: 28, fontWeight: 700 }}>
              Миний захиалгууд
            </h1>
            <button
              onClick={() => {
                if (user) {
                  fetchOrders();
                } else {
                  setMessage('Хэрэглэгчийн мэдээлэл олдсонгүй');
                }
              }}
              disabled={ordersLoading || !user}
              style={{
                background: (ordersLoading || !user) ? '#ccc' : '#f8991b',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 20px',
                fontWeight: 600,
                fontSize: 14,
                cursor: (ordersLoading || !user) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {ordersLoading ? '⏳' : '🔄'} {ordersLoading ? 'Татаж байна...' : 'Сэргээх'}
            </button>
          </div>

          {/* Status Filter Buttons */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              display: 'flex', 
              gap: 8, 
              flexWrap: 'wrap',
              marginBottom: 16
            }}>
              <button
                onClick={() => setSelectedStatus('all')}
                style={{
                  background: selectedStatus === 'all' ? '#f8991b' : '#f3f4f6',
                  color: selectedStatus === 'all' ? '#fff' : '#222',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 16px',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'background 0.18s',
                }}
              >
                Бүх бараа ({orders.length})
              </button>
              <button
                onClick={() => setSelectedStatus('pending')}
                style={{
                  background: selectedStatus === 'pending' ? '#f8991b' : '#f3f4f6',
                  color: selectedStatus === 'pending' ? '#fff' : '#222',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 16px',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'background 0.18s',
                }}
              >
                Хүлээгдэж буй ({orders.filter(o => o.status === 'pending').length})
              </button>
              <button
                onClick={() => setSelectedStatus('processing')}
                style={{
                  background: selectedStatus === 'processing' ? '#f8991b' : '#f3f4f6',
                  color: selectedStatus === 'processing' ? '#fff' : '#222',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 16px',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'background 0.18s',
                }}
              >
                Батлагдсан ({orders.filter(o => o.status === 'processing').length})
              </button>
              <button
                onClick={() => setSelectedStatus('shipped')}
                style={{
                  background: selectedStatus === 'shipped' ? '#f8991b' : '#f3f4f6',
                  color: selectedStatus === 'shipped' ? '#fff' : '#222',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 16px',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'background 0.18s',
                }}
              >
                Хүргэгдсэн ({orders.filter(o => o.status === 'shipped').length})
              </button>
              <button
                onClick={() => setSelectedStatus('cancelled')}
                style={{
                  background: selectedStatus === 'cancelled' ? '#f8991b' : '#f3f4f6',
                  color: selectedStatus === 'cancelled' ? '#fff' : '#222',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 16px',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'background 0.18s',
                }}
              >
                Цуцлагдсан ({orders.filter(o => o.status === 'cancelled').length})
              </button>
            </div>
          </div>

          {message && (
            <div style={{ 
              padding: 12, 
              borderRadius: 8, 
              marginBottom: 24, 
              textAlign: 'center',
              background: '#f8d7da',
              color: '#721c24',
              fontWeight: 600
            }}>
              {message}
            </div>
          )}

          
          {ordersLoading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 18, color: '#666' }}>Захиалгуудыг татаж байна...</div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: 60, 
              background: '#f8f9fa', 
              borderRadius: 8,
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>📦</div>
              <div style={{ fontSize: 20, color: '#666', marginBottom: 12 }}>
                {selectedStatus === 'all' ? 'Захиалга байхгүй байна' :
                 selectedStatus === 'pending' ? 'Хүлээгдэж буй захиалга байхгүй' :
                 selectedStatus === 'processing' ? 'Батлагдсан захиалга байхгүй' :
                 selectedStatus === 'shipped' ? 'Хүргэгдсэн захиалга байхгүй' :
                 'Цуцлагдсан захиалга байхгүй'}
              </div>
              <div style={{ fontSize: 16, color: '#999', marginBottom: 24 }}>
                {selectedStatus === 'all' ? 'Та эхлээд бүтээгдэхүүн захиалах хэрэгтэй' : 
                 'Энэ төрлийн захиалга одоогоор байхгүй байна'}
              </div>
              {selectedStatus === 'all' && (
                <button
                  onClick={() => navigate('/')}
                  style={{
                    background: '#f8991b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 24px',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer'
                  }}
                >
                  Дэлгүүрт очих
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    background: '#fff',
                    border: '1px solid #e9ecef',
                    borderRadius: 12,
                    padding: 24,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 600, color: '#222', marginBottom: 6 }}>
                        Захиалгын дугаар: {order.orderNumber}
                      </div>
                      <div style={{ fontSize: 14, color: '#666' }}>
                        {new Date(order.createdAt).toLocaleDateString('mn-MN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div style={{ 
                      background: order.status === 'pending' ? '#fff3cd' : 
                                 order.status === 'processing' ? '#d1ecf1' : 
                                 order.status === 'shipped' ? '#d4edda' : '#f8d7da',
                      color: order.status === 'pending' ? '#856404' : 
                             order.status === 'processing' ? '#0c5460' : 
                             order.status === 'shipped' ? '#155724' : '#721c24',
                      padding: '6px 16px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {order.status === 'pending' ? 'Хүлээгдэж байна' :
                       order.status === 'processing' ? 'Бэлтгэж байна' :
                       order.status === 'shipped' ? 'Хүргэгдсэн' : 'Цуцлагдсан'}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ 
                      fontSize: 18, 
                      color: '#333', 
                      marginBottom: 16, 
                      fontWeight: 600,
                      borderBottom: '2px solid #f0f0f0',
                      paddingBottom: '8px'
                    }}>
                      Захиалсан бүтээгдэхүүн ({order.items.length} ширхэг)
                    </div>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                      gap: 16 
                    }}>
                      {order.items.map((item, index) => (
                        <div 
                          key={index} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 16,
                            padding: '16px',
                            background: '#f8f9fa',
                            borderRadius: 8,
                            border: '1px solid #e9ecef'
                          }}
                        >
                          <img
                            src={item.productImage || '/api/placeholder/60/60'}
                            alt={item.productName}
                            style={{ 
                              width: 60, 
                              height: 60, 
                              borderRadius: 8, 
                              objectFit: 'cover',
                              background: '#fff',
                              border: '1px solid #ddd'
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontSize: 16, 
                              fontWeight: 600, 
                              color: '#222', 
                              marginBottom: 6,
                              lineHeight: 1.3
                            }}>
                              {item.productName}
                            </div>
                            <div style={{ 
                              fontSize: 14, 
                              color: '#666',
                              marginBottom: 4
                            }}>
                              Тоо ширхэг: {item.quantity}
                            </div>
                            <div style={{ 
                              fontSize: 14, 
                              color: '#666'
                            }}>
                              Нэгжийн үнэ: {item.price.toLocaleString()}₮
                            </div>
                          </div>
                          <div style={{ 
                            textAlign: 'right',
                            minWidth: '80px'
                          }}>
                            <div style={{ 
                              fontSize: 16, 
                              fontWeight: 700, 
                              color: '#f8991b',
                              marginBottom: 2
                            }}>
                              {(item.quantity * item.price).toLocaleString()}₮
                            </div>
                            <div style={{ 
                              fontSize: 12, 
                              color: '#999'
                            }}>
                              Нийт
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    paddingTop: 16, 
                    borderTop: '2px solid #f0f0f0' 
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#222' }}>
                      Нийт: {order.total.toLocaleString()}₮
                    </div>
                    <div style={{ fontSize: 14, color: '#666' }}>
                      {order.paymentMethod === 'cash' ? 'Бэлнээр төлбөр' : 'Картаар төлбөр'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default UserOrders;
