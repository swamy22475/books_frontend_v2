import apiClient, { api } from '../lib/api-client';

// Re-export the unified apiClient helpers
const axiosInstance = apiClient;

export default api; // Export the helper object so services get data directly
export { axiosInstance };
