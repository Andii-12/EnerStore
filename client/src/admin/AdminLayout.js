import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  React.useEffect(() => {
    if (localStorage.getItem('admin') !== 'true') {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-light)' }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside style={{ width: 220, background: 'var(--color-dark)', color: '#fff', display: 'flex', flexDirection: 'column', padding: '32px 0', boxShadow: '2px 0 12px rgba(8,15,70,0.06)' }}>
          <div style={{ fontWeight: 700, fontSize: 24, letterSpacing: 1, textAlign: 'center', marginBottom: 40 }}>
            <span style={{ color: 'var(--color-accent)' }}>Ener</span>Admin
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 24px' }}>
            <Link to="/admin/dashboard" style={{ color: '#fff', textDecoration: 'none', padding: '10px 16px', borderRadius: 6, background: location.pathname === '/admin/dashboard' ? 'rgba(248,153,27,0.12)' : 'none', fontWeight: 600 }}>Dashboard</Link>
            <Link to="/admin/products" style={{ color: '#fff', textDecoration: 'none', padding: '10px 16px', borderRadius: 6, background: location.pathname === '/admin/products' ? 'rgba(248,153,27,0.12)' : 'none' }}>Бараа</Link>
            <Link to="/admin/categories" style={{ color: '#fff', textDecoration: 'none', padding: '10px 16px', borderRadius: 6, background: location.pathname === '/admin/categories' ? 'rgba(248,153,27,0.12)' : 'none' }}>Ангилал</Link>
            <Link to="/admin/carousel" style={{ color: '#fff', textDecoration: 'none', padding: '10px 16px', borderRadius: 6, background: location.pathname === '/admin/carousel' ? 'rgba(248,153,27,0.12)' : 'none' }}>Карусель</Link>
            <Link to="/admin/companies" style={{ color: '#fff', textDecoration: 'none', padding: '10px 16px', borderRadius: 6, background: location.pathname === '/admin/companies' ? 'rgba(248,153,27,0.12)' : 'none' }}>Компани</Link>
            <Link to="/admin/users" style={{ color: '#fff', textDecoration: 'none', padding: '10px 16px', borderRadius: 6, background: location.pathname === '/admin/users' ? 'rgba(248,153,27,0.12)' : 'none' }}>Хэрэглэгч</Link>
            <Link to="/admin/header-menu" style={{ color: '#fff', textDecoration: 'none', padding: '10px 16px', borderRadius: 6, background: location.pathname === '/admin/header-menu' ? 'rgba(248,153,27,0.12)' : 'none' }}>Хэдэр цэс</Link>
          </nav>
          <div style={{ flex: 1 }} />
          <div style={{ textAlign: 'center', fontSize: 12, opacity: 0.7, marginBottom: 12 }}>© EnerStore Admin</div>
        </aside>
        {/* Main Content */}
        <main style={{ flex: 1, minHeight: '100vh' }}>
          {/* Topbar */}
          <div style={{ height: 64, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 36px', boxShadow: '0 2px 8px rgba(8,15,70,0.04)' }}>
            <div style={{ fontWeight: 600, fontSize: 22 }}>Админ Самбар</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontWeight: 500 }}>Админ</span>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>A</div>
              <button onClick={handleLogout} style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Гарах</button>
            </div>
          </div>
          <div style={{ padding: '0 0 0 0' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout; 