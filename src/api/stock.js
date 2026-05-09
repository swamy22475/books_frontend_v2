import api from './axios';

const PREFIX = '/api/v1/stock';

export const stockService = {
  getAll: (skip = 0, limit = 100) => 
    api.get(`${PREFIX}/?skip=${skip}&limit=${limit}`),

  create: (data) => 
    api.post(`${PREFIX}/`, data),

  getLog: () => 
    api.get(`${PREFIX}/`), // Matches your backend route
};
