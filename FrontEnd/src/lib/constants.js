// User Roles
export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CUSTOMER: 'customer',
};

// Application Info
export const APP_NAME = 'LuxeHome Furniture';
// Use the local project logo so admin and landing page match
export const LOGO_URL = 'assets/logo.png';

// Order Statuses
export const ORDER_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

// Payment Statuses
export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};

// Product Categories
export const CATEGORIES = [
  'Bed',
  'Shelf',
  'Dressing Table',
  'Almirah',
  'Dining Set',
  'Chair',
  'Sofa',
  'Bed Side Table',
  'Coffee Table',
  'Wardrobe',
  'Office Desk',
];

// Materials
export const MATERIALS = ['Wood', 'Metal', 'Glass', 'Plastic', 'Fabric', 'Leather', 'Mixed'];

// Sizes
export const SIZES = ['Small', 'Medium', 'Large', 'Extra Large', 'Custom'];

// Low Stock Threshold
export const LOW_STOCK_THRESHOLD = 10;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date Formats
export const DATE_FORMAT = 'MMM DD, YYYY';
export const DATETIME_FORMAT = 'MMM DD, YYYY HH:mm';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    GET: (id) => `/products/${id}`,
  },
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    UPDATE: (id) => `/orders/${id}`,
    DELETE: (id) => `/orders/${id}`,
    GET: (id) => `/orders/${id}`,
  },
  SUPPLIERS: {
    LIST: '/suppliers',
    CREATE: '/suppliers',
    UPDATE: (id) => `/suppliers/${id}`,
    DELETE: (id) => `/suppliers/${id}`,
  },
  PURCHASES: {
    LIST: '/purchases',
    CREATE: '/purchases',
    UPDATE: (id) => `/purchases/${id}`,
  },
  REPORTS: {
    SALES: '/reports/sales',
    TOP_PRODUCTS: '/reports/top-products',
    LOW_STOCK: '/reports/low-stock',
    DASHBOARD: '/reports/dashboard',
  },
};

// Chart Colors
export const CHART_COLORS = {
  primary: '#B45309',
  secondary: '#D97706',
  accent: '#F59E0B',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
};

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};
