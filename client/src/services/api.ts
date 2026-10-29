import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('edunexa_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('edunexa_token');
      localStorage.removeItem('edunexa_user');
      // Only redirect if protected page
      if (
        window.location.pathname.startsWith('/student') ||
        window.location.pathname.startsWith('/faculty') ||
        window.location.pathname.startsWith('/university') ||
        window.location.pathname.startsWith('/admin')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
