import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

function AdminLayout() {
  const location = useLocation();
  const { adminUser, isAuthenticated, isLoading, logout } = useAdminAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f6f6f6', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 600, color: 'var(--color-dark)', marginBottom: 16 }}>Нэвтрэх эрхийг шалгаж байна...</div>
          <div style={{ fontSize: 'clamp(14px, 3.5vw, 16px)', color: '#666' }}>Та түр хүлээнэ үү</div>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', background: '#f6f6f6' }}>
      {/* Mobile Header */}
      <div style={{ 
        background: '#fff', 
        borderBottom: '1px solid #e1e5e9', 
        padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(8,15,70,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={toggleMobileMenu}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 'clamp(20px, 5vw, 24px)',
              cursor: 'pointer',
              padding: 8,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-dark)'
            }}
          >
            ☰
          </button>
          <div style={{ fontSize: 'clamp(16px, 4vw, 18px)', fontWeight: 600, color: 'var(--color-dark)' }}>
            Админ удирдлага
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)' }}>
          <div style={{ 
            fontSize: 'clamp(12px, 3vw, 14px)', 
            color: '#666', 
            textAlign: 'right',
            display: 'none',
          }}>
            {adminUser?.username}
          </div>
          <button
            onClick={logout}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
              fontWeight: 600,
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              minHeight: '32px'
            }}
          >
            Гарах
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div
            onClick={closeMobileMenu}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
              display: 'block',
            }}
          />
        )}

        {/* Sidebar */}
        <div style={{
          background: '#fff',
          borderRight: '1px solid #e1e5e9',
          width: 'clamp(250px, 30vw, 280px)',
          position: 'fixed',
          top: 60,
          left: isMobileMenuOpen ? 0 : '-100%',
          height: 'calc(100vh - 60px)',
          zIndex: 1000,
          transition: 'left 0.3s ease',
          overflowY: 'auto',
          boxShadow: '2px 0 8px rgba(8,15,70,0.08)',
        }}>
          <nav style={{ padding: 'clamp(16px, 4vw, 24px) 0' }}>
            <div style={{ padding: '0 clamp(16px, 4vw, 24px)' }}>
              <div style={{ 
                fontSize: 'clamp(14px, 3.5vw, 16px)', 
                fontWeight: 600, 
                color: '#666', 
                marginBottom: 'clamp(16px, 4vw, 24px)',
                paddingBottom: 'clamp(8px, 2vw, 12px)',
                borderBottom: '1px solid #e1e5e9'
              }}>
                Удирдлага
              </div>
            </div>
            
            <div style={{ padding: '0 clamp(16px, 4vw, 24px)' }}>
              <Link
                to="/admin/dashboard"
                onClick={closeMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(8px, 2vw, 12px)',
                  padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: isActive('/admin/dashboard') ? '#fff' : '#333',
                  background: isActive('/admin/dashboard') ? 'var(--color-accent)' : 'transparent',
                  fontWeight: isActive('/admin/dashboard') ? 600 : 500,
                  marginBottom: 'clamp(4px, 1vw, 8px)',
                  transition: 'all 0.2s',
                  fontSize: 'clamp(14px, 3.5vw, 16px)'
                }}
              >
                📊 Dashboard
              </Link>
              
              <Link
                to="/admin/products"
                onClick={closeMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(8px, 2vw, 12px)',
                  padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: isActive('/admin/products') ? '#fff' : '#333',
                  background: isActive('/admin/products') ? 'var(--color-accent)' : 'transparent',
                  fontWeight: isActive('/admin/products') ? 600 : 500,
                  marginBottom: 'clamp(4px, 1vw, 8px)',
                  transition: 'all 0.2s',
                  fontSize: 'clamp(14px, 3.5vw, 16px)'
                }}
              >
                📦 Бүтээгдэхүүн
              </Link>
              
              <Link
                to="/admin/categories"
                onClick={closeMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(8px, 2vw, 12px)',
                  padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: isActive('/admin/categories') ? '#fff' : '#333',
                  background: isActive('/admin/categories') ? 'var(--color-accent)' : 'transparent',
                  fontWeight: isActive('/admin/categories') ? 600 : 500,
                  marginBottom: 'clamp(4px, 1vw, 8px)',
                  transition: 'all 0.2s',
                  fontSize: 'clamp(14px, 3.5vw, 16px)'
                }}
              >
                🏷️ Ангилал
              </Link>
              
              <Link
                to="/admin/brands"
                onClick={closeMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(8px, 2vw, 12px)',
                  padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: isActive('/admin/brands') ? '#fff' : '#333',
                  background: isActive('/admin/brands') ? 'var(--color-accent)' : 'transparent',
                  fontWeight: isActive('/admin/brands') ? 600 : 500,
                  marginBottom: 'clamp(4px, 1vw, 8px)',
                  transition: 'all 0.2s',
                  fontSize: 'clamp(14px, 3.5vw, 16px)'
                }}
              >
                🏢 Брэнд
              </Link>
              
              <Link
                to="/admin/orders"
                onClick={closeMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(8px, 2vw, 12px)',
                  padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: isActive('/admin/orders') ? '#fff' : '#333',
                  background: isActive('/admin/orders') ? 'var(--color-accent)' : 'transparent',
                  fontWeight: isActive('/admin/orders') ? 600 : 500,
                  marginBottom: 'clamp(4px, 1vw, 8px)',
                  transition: 'all 0.2s',
                  fontSize: 'clamp(14px, 3.5vw, 16px)'
                }}
              >
                📋 Захиалга
              </Link>
              
              <Link
                to="/admin/companies"
                onClick={closeMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(8px, 2vw, 12px)',
                  padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: isActive('/admin/companies') ? '#fff' : '#333',
                  background: isActive('/admin/companies') ? 'var(--color-accent)' : 'transparent',
                  fontWeight: isActive('/admin/companies') ? 600 : 500,
                  marginBottom: 'clamp(4px, 1vw, 8px)',
                  transition: 'all 0.2s',
                  fontSize: 'clamp(14px, 3.5vw, 16px)'
                }}
              >
                🏭 Компани
              </Link>
              
              <Link
                to="/admin/users"
                onClick={closeMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(8px, 2vw, 12px)',
                  padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: isActive('/admin/users') ? '#fff' : '#333',
                  background: isActive('/admin/users') ? 'var(--color-accent)' : 'transparent',
                  fontWeight: isActive('/admin/users') ? 600 : 500,
                  marginBottom: 'clamp(4px, 1vw, 8px)',
                  transition: 'all 0.2s',
                  fontSize: 'clamp(14px, 3.5vw, 16px)'
                }}
              >
                👥 Хэрэглэгч
              </Link>
              
              <Link
                to="/admin/carousel"
                onClick={closeMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(8px, 2vw, 12px)',
                  padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: isActive('/admin/carousel') ? '#fff' : '#333',
                  background: isActive('/admin/carousel') ? 'var(--color-accent)' : 'transparent',
                  fontWeight: isActive('/admin/carousel') ? 600 : 500,
                  marginBottom: 'clamp(4px, 1vw, 8px)',
                  transition: 'all 0.2s',
                  fontSize: 'clamp(14px, 3.5vw, 16px)'
                }}
              >
                🖼️ Карусель
              </Link>
              
              <Link
                to="/admin/header-menu"
                onClick={closeMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(8px, 2vw, 12px)',
                  padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: isActive('/admin/header-menu') ? '#fff' : '#333',
                  background: isActive('/admin/header-menu') ? 'var(--color-accent)' : 'transparent',
                  fontWeight: isActive('/admin/header-menu') ? 600 : 500,
                  marginBottom: 'clamp(4px, 1vw, 8px)',
                  transition: 'all 0.2s',
                  fontSize: 'clamp(14px, 3.5vw, 16px)'
                }}
              >
                📋 Цэс
              </Link>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ 
          flex: 1, 
          marginLeft: 0,
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout; 