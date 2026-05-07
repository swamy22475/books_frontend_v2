import api from './axios';

const PREFIX = '/api/v1/dashboard';

export const dashboardService = {
  getSummary: (period = 'Today') => 
    api.get(`${PREFIX}/?period=${period}`),
};
