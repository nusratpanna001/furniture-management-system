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
    console.log('API Request to:', config.url, 'Token exists:', !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header added');
    }
    
    // Handle FormData - remove Content-Type to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
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
    updateProfile: (data) => apiClient.put('/user/profile', data),
    changePassword: (data) => apiClient.put('/user/password', data),
  },

  // Products
  products: {
    list: (params) => apiClient.get('/products', { params }),
    get: (id) => apiClient.get(`/products/${id}`),
    create: (data) => apiClient.post('/admin/products', data),
    update: (id, data) => apiClient.put(`/admin/products/${id}`, data),
    updateWithFormData: (id, data) => apiClient.post(`/admin/products/${id}`, data), // For FormData with _method
    delete: (id) => apiClient.delete(`/admin/products/${id}`),
    getByCategory: (category) => apiClient.get(`/products/category/${category}`),
    getFeatured: () => apiClient.get('/products/featured/list'),
    updateStock: (id, stock) => apiClient.put(`/admin/products/${id}/stock`, { stock }),
  },

  // Orders
  orders: {
    // Admin routes
    list: (params) => apiClient.get('/admin/orders', { params }),
    get: (id) => apiClient.get(`/admin/orders/${id}`),
    updateStatus: (id, status) => apiClient.put(`/admin/orders/${id}/status`, { status }),
    updatePaymentStatus: (id, payment_status) => apiClient.put(`/admin/orders/${id}/payment-status`, { payment_status }),
    cancel: (id) => apiClient.post(`/admin/orders/${id}/cancel`),
    delete: (id) => apiClient.delete(`/admin/orders/${id}`),
    
    // User routes
    create: (data) => apiClient.post('/orders', data),
    getUserOrders: () => apiClient.get('/user/orders'),
    getUserOrder: (id) => apiClient.get(`/user/orders/${id}`),
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
  // Categories
  categories: {
    list: () => apiClient.get('/categories'),
    create: (data) => apiClient.post('/admin/categories', data),
    update: (id, data) => {
      // Use POST for FormData with _method=PUT (Laravel requirement)
      if (data instanceof FormData) {
        return apiClient.post(`/admin/categories/${id}`, data);
      }
      return apiClient.put(`/admin/categories/${id}`, data);
    },
    delete: (id) => apiClient.delete(`/admin/categories/${id}`),
  },

  // Wishlist
  wishlist: {
    list: () => apiClient.get('/user/wishlist'),
    add: (productId) => apiClient.post('/user/wishlist', { product_id: productId }),
    remove: (id) => apiClient.delete(`/user/wishlist/${id}`),
    removeByProduct: (productId) => apiClient.delete(`/user/wishlist/product/${productId}`),
    check: (productId) => apiClient.get(`/user/wishlist/check/${productId}`),
  },
};

export default api;
