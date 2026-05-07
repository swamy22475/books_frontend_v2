import axios from 'axios';

// Base URL points to your Render backend
// We keep it as the domain only to avoid double-prefix issues in services
const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const axiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Handles Auth and logs URLs for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    const tenantId = localStorage.getItem('tenant_id');
    if (tenantId) config.headers['X-Tenant-ID'] = tenantId;

    // Log the full URL being called for debugging
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Clean data return and error logging
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('[API Error Response]', error.response?.status, error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
