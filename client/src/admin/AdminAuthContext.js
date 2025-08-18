import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('adminUser');
        const storedToken = localStorage.getItem('adminToken');
        
        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser);
          setAdminUser(user);
          setIsAuthenticated(true);
        } else {
          // Clear any invalid data
          localStorage.removeItem('adminUser');
          localStorage.removeItem('adminToken');
          setAdminUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking admin auth:', error);
        // Clear invalid data
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
        setAdminUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    try {
      localStorage.setItem('adminUser', JSON.stringify(userData));
      localStorage.setItem('adminToken', 'admin-logged-in');
      setAdminUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
      setAdminUser(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  };

  const value = {
    adminUser,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
