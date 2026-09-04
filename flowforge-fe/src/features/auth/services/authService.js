import api from '../../../api/axios';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/v1/auth/login', { email, password });
    return response;
  },

  register: async (name, email, password) => {
    const response = await api.post('/api/v1/auth/register', { name, email, password });
    return response;
  },

  refresh: async (refreshToken) => {
    const response = await api.post('/api/v1/auth/refresh', { refreshToken });
    return response;
  },

  logout: async (refreshToken) => {
    const response = await api.post('/api/v1/auth/logout', { refreshToken });
    return response;
  }
};

export default authService;
