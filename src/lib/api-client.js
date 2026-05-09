import axios from 'axios';

// ── Configuration ──
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8000/api/v1/';

/**
 * Centralized Axios instance for all API calls.
 * Automatically attaches auth token and tenant headers.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ── Request Interceptor: Attach auth token + tenant header ──
apiClient.interceptors.request.use(
  (config) => {
    // Ensure relative URLs don't start with / to prevent them from being origin-relative
    if (config.url && config.url.startsWith('/')) {
      config.url = config.url.substring(1);
    }
    
    // Auth token
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Tenant header (for multi-school isolation)
    const tenantId = localStorage.getItem('tenant_id');
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle 401 globally ──
let isRedirecting = false;
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    // Only handle 401 (not 403) — and skip login/public endpoints
    const isAuthEndpoint = requestUrl.includes('/login') || requestUrl.includes('/public');
    if (status === 401 && !isAuthEndpoint && !isRedirecting) {
      isRedirecting = true;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/auth/auth2/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// ── Convenience typed helpers ──

/**
 * Generic GET request.
 *  const students = await api.get<Student[]>('/students');
 */
export const api = {
  get: (url, config) =>
    apiClient.get(url, config).then((res) => res.data),

  post: (url, data, config) =>
    apiClient.post(url, data, config).then((res) => res.data),

  put: (url, data, config) =>
    apiClient.put(url, data, config).then((res) => res.data),

  patch: (url, data, config) =>
    apiClient.patch(url, data, config).then((res) => res.data),

  delete: (url, config) =>
    apiClient.delete(url, config).then((res) => res.data)
};