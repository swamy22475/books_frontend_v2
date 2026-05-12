import axios from 'axios';

const normalizeApiBaseUrl = (url) => {
  const trimmedUrl = (url || 'http://localhost:8000').replace(/\/+$/, '');
  const apiOrigin = trimmedUrl.replace(/\/api\/v1$/i, '');
  return apiOrigin.replace(/^http:\/\/localhost:10000$/i, 'http://localhost:8000');
};

// ── Configuration ──
const API_BASE_URL = normalizeApiBaseUrl(import.meta.env?.VITE_API_URL);

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
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const hasHeader = (headerName) => {
      const headers = config.headers || {};
      return Object.keys(headers).some((key) => key.toLowerCase() === headerName.toLowerCase());
    };

    // Auth token
    const token = isAdminRoute
      ? localStorage.getItem('auth_token')
      : sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Tenant header (for multi-school isolation)
    const tenantId = isAdminRoute
      ? 'default'
      : sessionStorage.getItem('tenant_id') || localStorage.getItem('tenant_id');
    if (tenantId && !hasHeader('X-Tenant-ID')) {
      config.headers['X-Tenant-ID'] = tenantId;
    }

    const loggedTenantId = config.headers['X-Tenant-ID'] || (isAdminRoute
      ? localStorage.getItem('tenant_id')
      : sessionStorage.getItem('tenant_id') || localStorage.getItem('tenant_id'));

    console.log(`[lib/api-client] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
        tenantId: loggedTenantId,
        headers: config.headers
    });

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle 401 globally ──
let isRedirecting = false;
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    // Only handle 401 (not 403) — and skip login/public endpoints
    const isAuthEndpoint = requestUrl.includes('/login') || requestUrl.includes('/public');
    if (status === 401 && !isAuthEndpoint && !isRedirecting) {
      isRedirecting = true;
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
      sessionStorage.removeItem('tenant_id');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/books/login';
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
    apiClient.get(url, config),

  post: (url, data, config) =>
    apiClient.post(url, data, config),

  put: (url, data, config) =>
    apiClient.put(url, data, config),

  patch: (url, data, config) =>
    apiClient.patch(url, data, config),

  delete: (url, config) =>
    apiClient.delete(url, config)
};
