import axios from 'axios';

// Professional API configuration
// This URL will automatically switch between Render (prod) and Localhost (dev)
const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '') + '/api/v1';

const axiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Handles Auth and Tenant isolation
axiosInstance.interceptors.request.use(
  (config) => {
    // Attach JWT token from localStorage
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Attach Tenant ID for multi-school isolation
    const tenantId = localStorage.getItem('tenant_id');
    if (tenantId) config.headers['X-Tenant-ID'] = tenantId;

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global error handling and auto-logout on session expiry
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    
    // Auto-logout if token is expired (401)
    if (status === 401) {
      localStorage.removeItem('auth_token');
      // window.location.href = '/auth/login'; // Enable this if you have a login page
    }

    const errorMessage = error.response?.data?.detail || error.message || 'An unexpected error occurred';
    console.error('[API Error]', errorMessage);
    
    return Promise.reject({
      message: errorMessage,
      status: status,
      originalError: error
    });
  }
);

export default axiosInstance;
