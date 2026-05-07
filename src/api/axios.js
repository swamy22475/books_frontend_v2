import axios from 'axios';

const rawURL = import.meta.env.VITE_API_URL;
if (!rawURL) {
  console.warn('VITE_API_URL is missing! Falling back to localhost:8000. Please check your .env file and restart your server.');
}
const baseURL = (rawURL || 'http://localhost:8000').replace(/\/$/, '');

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
