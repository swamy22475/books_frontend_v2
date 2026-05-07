import api from './axios';

const PREFIX = '/api/v1/reports';

export const reportsService = {
  getStats: () => 
    api.get(`${PREFIX}/stats`),
};
