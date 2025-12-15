import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    // Return structured error
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// API methods
export const api = {
  // Auth
  auth: {
    login: (credentials) => apiClient.post('/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    logout: () => apiClient.post('/auth/logout'),
    me: () => apiClient.get('/auth/me'),
  },

  // Products
  products: {
    list: (params) => apiClient.get('/products', { params }),
    get: (id) => apiClient.get(`/products/${id}`),
    create: (data) => apiClient.post('/products', data),
    update: (id, data) => apiClient.put(`/products/${id}`, data),
    delete: (id) => apiClient.delete(`/products/${id}`),
  },

  // Orders
  orders: {
    list: (params) => apiClient.get('/orders', { params }),
    get: (id) => apiClient.get(`/orders/${id}`),
    create: (data) => apiClient.post('/orders', data),
    update: (id, data) => apiClient.put(`/orders/${id}`, data),
    delete: (id) => apiClient.delete(`/orders/${id}`),
    updateStatus: (id, status) => apiClient.patch(`/orders/${id}/status`, { status }),
  },

  // Suppliers
  suppliers: {
    list: (params) => apiClient.get('/suppliers', { params }),
    get: (id) => apiClient.get(`/suppliers/${id}`),
    create: (data) => apiClient.post('/suppliers', data),
    update: (id, data) => apiClient.put(`/suppliers/${id}`, data),
    delete: (id) => apiClient.delete(`/suppliers/${id}`),
  },

  // Purchases
  purchases: {
    list: (params) => apiClient.get('/purchases', { params }),
    get: (id) => apiClient.get(`/purchases/${id}`),
    create: (data) => apiClient.post('/purchases', data),
    update: (id, data) => apiClient.put(`/purchases/${id}`, data),
  },

  // Reports
  reports: {
    dashboard: () => apiClient.get('/reports/dashboard'),
    sales: (params) => apiClient.get('/reports/sales', { params }),
    topProducts: (params) => apiClient.get('/reports/top-products', { params }),
    lowStock: () => apiClient.get('/reports/low-stock'),
  },
};

export default apiClient;
