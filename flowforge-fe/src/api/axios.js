import axios from 'axios';
import { getCookie, setCookie, eraseCookie } from '../utils/cookies';

const api = axios.create({
  baseURL: 'http://localhost:3667',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach access token ──
api.interceptors.request.use(
  (config) => {
    const token = getCookie('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ── Response interceptor: auto refresh on 401 ──
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Only try refresh on 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry refresh endpoint itself
      if (originalRequest.url?.includes('/api/v1/auth/refresh')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getCookie('refreshToken');

      if (!refreshToken) {
        // No refresh token available, force logout
        isRefreshing = false;
        processQueue(new Error('No refresh token'), null);
        forceLogout();
        return Promise.reject(error);
      }

      try {
        // Call refresh endpoint directly with axios (not the api instance) to avoid interceptor loop
        const refreshResponse = await axios.post(
          'http://localhost:3667/api/v1/auth/refresh',
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        const newRefreshToken = refreshResponse.data?.data?.refreshToken;

        if (newAccessToken) {
          // Save new tokens
          setCookie('accessToken', newAccessToken, 7);
          if (newRefreshToken) {
            setCookie('refreshToken', newRefreshToken, 7);
          }

          // Update the auth_user cookie too
          try {
            const authUserStr = getCookie('auth_user');
            if (authUserStr) {
              const authUser = JSON.parse(authUserStr);
              authUser.accessToken = newAccessToken;
              if (newRefreshToken) authUser.refreshToken = newRefreshToken;
              setCookie('auth_user', JSON.stringify(authUser), 7);
            }
          } catch (e) {
            // Ignore parse errors
          }

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          isRefreshing = false;
          return api(originalRequest);
        } else {
          throw new Error('No access token in refresh response');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        forceLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

function forceLogout() {
  eraseCookie('accessToken');
  eraseCookie('refreshToken');
  eraseCookie('auth_user');
  // Redirect to login if not already there
  if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
    window.location.href = '/login';
  }
}

export default api;
