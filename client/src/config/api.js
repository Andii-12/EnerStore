// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://enerstore-production.up.railway.app';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://enerstore-production.up.railway.app';

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