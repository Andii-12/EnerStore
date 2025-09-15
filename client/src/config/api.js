// API Configuration
// Use Railway API directly with CORS handling
const RAILWAY_URL = 'https://enerstore-production.up.railway.app';
const API_BASE_URL = RAILWAY_URL; // Always use Railway for now
const SOCKET_URL = RAILWAY_URL;

// CORS workaround for development
const corsHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Always use Railway API
export const getApiBaseUrl = async () => {
  console.log('🌐 Using Railway backend:', RAILWAY_URL);
  return RAILWAY_URL;
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

// Dynamic API endpoints - always use Railway
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
  corsHeaders,
}; 