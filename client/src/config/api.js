// API Configuration
// Supports both local development and Railway deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Fallback to Railway if local server is not available
const FALLBACK_RAILWAY_URL = 'https://enerstore-production.up.railway.app';

// Smart API configuration that can fallback to Railway
export const getApiBaseUrl = async () => {
  // If environment variable is set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Try local server first
  try {
    const response = await fetch('http://localhost:5000/health', { 
      method: 'GET',
      timeout: 3000 
    });
    if (response.ok) {
      console.log('✅ Local server available, using localhost:5000');
      return 'http://localhost:5000';
    }
  } catch (error) {
    console.log('⚠️ Local server not available, falling back to Railway');
  }
  
  // Fallback to Railway
  console.log('🌐 Using Railway backend:', FALLBACK_RAILWAY_URL);
  return FALLBACK_RAILWAY_URL;
};

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCT_SEARCH: `${API_BASE_URL}/api/products/search`,
  
  // Categories
  CATEGORIES: `${API_BASE_URL}/api/categories`,
  
  // Brands
  BRANDS: `${API_BASE_URL}/api/brands`,
  
  // Companies
  COMPANIES: `${API_BASE_URL}/api/companies`,
  COMPANY_LOGIN: `${API_BASE_URL}/api/companies/login`,
  
  // Users
  CUSTOMER_USERS: `${API_BASE_URL}/api/customer-users`,
  CUSTOMER_LOGIN: `${API_BASE_URL}/api/customer-users/login`,
  
  // Admin
  ADMIN: `${API_BASE_URL}/api/admin`,
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  
  // Header Menu
  HEADER_MENU_ITEMS: `${API_BASE_URL}/api/header-menu-items`,
  
  // Carousel
  CAROUSEL: `${API_BASE_URL}/api/carousel`,
};

// Dynamic API endpoints that can switch between local and Railway
export const getDynamicApiEndpoints = async () => {
  const baseUrl = await getApiBaseUrl();
  return {
    PRODUCTS: `${baseUrl}/api/products`,
    PRODUCT_SEARCH: `${baseUrl}/api/products/search`,
    CATEGORIES: `${baseUrl}/api/categories`,
    BRANDS: `${baseUrl}/api/brands`,
    COMPANIES: `${baseUrl}/api/companies`,
    COMPANY_LOGIN: `${baseUrl}/api/companies/login`,
    CUSTOMER_USERS: `${baseUrl}/api/customer-users`,
    CUSTOMER_LOGIN: `${baseUrl}/api/customer-users/login`,
    ADMIN: `${baseUrl}/api/admin`,
    ADMIN_LOGIN: `${baseUrl}/api/admin/login`,
    HEADER_MENU_ITEMS: `${baseUrl}/api/header-menu-items`,
    CAROUSEL: `${baseUrl}/api/carousel`,
  };
};

export const SOCKET_CONFIG = {
  url: SOCKET_URL,
  options: {
    transports: ['polling', 'websocket'], // Try polling first, then websocket
    autoConnect: false, // Don't auto-connect
    reconnection: false, // Disable reconnection to prevent infinite loops
    timeout: 5000, // Shorter timeout
    forceNew: true,
    upgrade: true,
    rememberUpgrade: false,
    maxReconnectionAttempts: 0, // No reconnection attempts
    reconnectionDelay: 0
  }
};

export default {
  API_BASE_URL,
  SOCKET_URL,
  API_ENDPOINTS,
  SOCKET_CONFIG,
}; 