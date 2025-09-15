import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    startDate: '',
    endDate: '',
    orderNumber: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [filters, sortBy]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.orderNumber) params.append('orderNumber', filters.orderNumber);
      if (sortBy) params.append('sort', sortBy);

      const response = await fetch(`${API_ENDPOINTS.ORDERS}?${params.toString()}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.ORDERS}/stats/overview`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.ORDERS}/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.ORDERS}/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newPaymentStatus })
      });
      
      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, paymentStatus: newPaymentStatus } : order
        ));
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      confirmed: '#17a2b8',
      processing: '#007bff',
      shipped: '#6f42c1',
      delivered: '#28a745',
      cancelled: '#dc3545',
      refunded: '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      paid: '#28a745',
      failed: '#dc3545',
      refunded: '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const statusOptions = [
    { value: '', label: 'Бүх статус' },
    { value: 'pending', label: 'Хүлээгдэж буй' },
    { value: 'confirmed', label: 'Баталгаажсан' },
    { value: 'processing', label: 'Бэлтгэгдэж буй' },
    { value: 'shipped', label: 'Хүргэгдсэн' },
    { value: 'delivered', label: 'Хүргэгдсэн' },
    { value: 'cancelled', label: 'Цуцлагдсан' },
    { value: 'refunded', label: 'Буцаан олгосон' }
  ];

  const paymentStatusOptions = [
    { value: '', label: 'Бүх төлбөрийн статус' },
    { value: 'pending', label: 'Хүлээгдэж буй' },
    { value: 'paid', label: 'Төлбөр төлөгдсөн' },
    { value: 'failed', label: 'Төлбөр амжилтгүй' },
    { value: 'refunded', label: 'Буцаан олгосон' }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Захиалгын удирдлага</h2>
      
      {/* Statistics Cards */}
      {stats && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <div style={{ 
            background: '#fff', 
            padding: '20px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Нийт захиалга</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
              {stats.overview.totalOrders}
            </div>
          </div>
          <div style={{ 
            background: '#fff', 
            padding: '20px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Нийт орлого</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
              {formatCurrency(stats.overview.totalRevenue)}
            </div>
          </div>
          <div style={{ 
            background: '#fff', 
            padding: '20px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Дундаж захиалга</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
              {formatCurrency(stats.overview.averageOrderValue)}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Шүүлтүүр</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px' 
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Статус:
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Төлбөрийн статус:
            </label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              {paymentStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Захиалгын дугаар:
            </label>
            <input
              type="text"
              value={filters.orderNumber}
              onChange={(e) => setFilters({...filters, orderNumber: e.target.value})}
              placeholder="Захиалгын дугаар..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Эхлэх огноо:
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Дуусах огноо:
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Эрэмбэлэх:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="newest">Шинэ захиалга</option>
              <option value="oldest">Хуучин захиалга</option>
              <option value="total-asc">Үнэ өсөх</option>
              <option value="total-desc">Үнэ буурах</option>
              <option value="status">Статус</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Захиалгууд</h3>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '18px', color: '#666' }}>Ачааллаж байна...</div>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '18px', color: '#666' }}>Захиалга олдсонгүй</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                    Захиалгын дугаар
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                    Үйлчлүүлэгч
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                    Нийт дүн
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                    Статус
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                    Төлбөрийн статус
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                    Огноо
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                    Үйлдэл
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '500', color: '#007bff' }}>
                        {order.orderNumber}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '500' }}>
                          {order.customerInfo?.name || order.customer?.name || 'N/A'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {order.customerInfo?.email || order.customer?.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '500' }}>
                        {formatCurrency(order.total)}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '12px',
                          background: getStatusColor(order.status),
                          color: 'white',
                          fontWeight: '500'
                        }}
                      >
                        {statusOptions.slice(1).map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '12px',
                          background: getPaymentStatusColor(order.paymentStatus),
                          color: 'white',
                          fontWeight: '500'
                        }}
                      >
                        {paymentStatusOptions.slice(1).map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontSize: '12px' }}>
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => handleViewOrder(order)}
                        style={{
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Дэлгэрэнгүй
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
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
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            width: '90%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#333' }}>
                Захиалгын дэлгэрэнгүй - {selectedOrder.orderNumber}
              </h3>
              <button
                onClick={handleCloseModal}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Хаах
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px', color: '#333' }}>Үйлчлүүлэгчийн мэдээлэл</h4>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
                <div><strong>Нэр:</strong> {selectedOrder.customerInfo?.name || selectedOrder.customer?.name || 'N/A'}</div>
                <div><strong>Имэйл:</strong> {selectedOrder.customerInfo?.email || selectedOrder.customer?.email || 'N/A'}</div>
                <div><strong>Утас:</strong> {selectedOrder.customerInfo?.phone || selectedOrder.customer?.phone || 'N/A'}</div>
                <div><strong>Хаяг:</strong> {selectedOrder.customerInfo?.address || 'N/A'}</div>
                <div><strong>Хот:</strong> {selectedOrder.customerInfo?.city || 'N/A'}</div>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px', color: '#333' }}>Захиалгын бараа</h4>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: index < selectedOrder.items.length - 1 ? '1px solid #ddd' : 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {item.productImage && (
                        <img 
                          src={item.productImage} 
                          alt={item.productName}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: '500' }}>{item.productName}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          Үнэ: {formatCurrency(item.price)} x {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: '500' }}>
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px', color: '#333' }}>Төлбөрийн мэдээлэл</h4>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
                <div><strong>Дэд дүн:</strong> {formatCurrency(selectedOrder.subtotal)}</div>
                <div><strong>Хүргэлтийн төлбөр:</strong> {formatCurrency(selectedOrder.shippingCost)}</div>
                <div><strong>Татвар:</strong> {formatCurrency(selectedOrder.tax)}</div>
                <div style={{ borderTop: '1px solid #ddd', paddingTop: '10px', marginTop: '10px' }}>
                  <strong>Нийт дүн:</strong> {formatCurrency(selectedOrder.total)}
                </div>
              </div>
            </div>
            
            {selectedOrder.notes && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '10px', color: '#333' }}>Тайлбар</h4>
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
                  {selectedOrder.notes}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersAdmin;
