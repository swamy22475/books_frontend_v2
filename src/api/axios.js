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
    const isLocal = localStorage.getItem('is_local_tenant') === 'true';
    
    // If it's a local tenant, we hijack the request to use localStorage instead of the network
    // This fulfills the "Fresh and Empty Data / Zero Integration" requirement
    if (isLocal) {
      config.adapter = async (config) => {
        const { localDb } = await import('../utils/mock_local_db');
        const url = config.url || '';
        const method = config.method?.toUpperCase();
        let data = null;

        // Route mapping
        if (url.includes('/dashboard')) {
          data = localDb.getDashboardSummary();
        } else if (url.includes('/vendors')) {
          if (method === 'GET') data = localDb.get('vendors');
          if (method === 'POST') data = localDb.post('vendors', JSON.parse(config.data));
        } else if (url.includes('/inventory')) {
          if (method === 'GET') data = localDb.get('inventory');
          if (method === 'POST') data = localDb.post('inventory', JSON.parse(config.data));
        } else if (url.includes('/sales')) {
          if (method === 'GET') data = localDb.get('sales');
          if (method === 'POST') data = localDb.post('sales', JSON.parse(config.data));
        } else if (url.includes('/returns')) {
          if (method === 'GET') data = localDb.get('returns');
          if (method === 'POST') data = localDb.post('returns', JSON.parse(config.data));
        } else if (url.includes('/stock')) {
          if (method === 'GET') data = localDb.get('stock');
          if (method === 'POST') data = localDb.post('stock', JSON.parse(config.data));
        }

        return {
          data,
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          config
        };
      };
    }

    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    const tenantId = localStorage.getItem('tenant_id');
    if (tenantId) config.headers['X-Tenant-ID'] = tenantId;

    // Log the full URL being called for debugging
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url} ${isLocal ? '(LOCAL MOCK)' : ''}`);
    
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
