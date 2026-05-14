import api from './axios';

const PREFIX = '/api/v1/returns';

export const returnsService = {
  getAll: (skip = 0, limit = 10000) => 
    api.get(`${PREFIX}/?skip=${skip}&limit=${limit}`),

  create: (data) => 
    api.post(`${PREFIX}/`, data),

  update: (id, data) => 
    api.put(`${PREFIX}/${id}`, data),

  delete: (id) => 
    api.delete(`${PREFIX}/${id}`),
};
