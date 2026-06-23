import axios from 'axios';

// Update this to match your actual backend URL
const API_URL = 'http://localhost:8081/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Attach the current Access Token to every request
// 1. Request Interceptor: The Smart Outbound Bouncer
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    const isAuthEndpoint =
      config.url?.endsWith('/auth/login') ||
      config.url?.endsWith('/auth/refresh');

    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Catch 401s and Refresh
api.interceptors.response.use(
  (response) => response, // If the request succeeds, just return it
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 AND we haven't already retried this request
    // Also ensure we aren't intercepting a failed login or refresh attempt itself
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true; // Mark as retried to prevent infinite loops

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log('Attempting to refresh token with refreshToken...' + refreshToken);
        
        if (!refreshToken) {
          throw new Error('No refresh token found');
        }

        // 🚀 Call your backend refresh endpoint using STANDARD axios
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: refreshToken,
        });

        console.log('Token refresh successful!', refreshToken, response.data);

        // 🚀 CRITICAL FIX: Make sure we map 'token' instead of 'accessToken'
        // based on your Spring Boot AuthenticationResponseDTO
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Save the new tokens
        localStorage.setItem('token', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Update the failed request with the fresh token and retry it!
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // 🚨 The refresh token was expired or revoked! 
        console.warn("Refresh token invalid. Scrubbing local state...");
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Dispatch event to open sign-in or redirect
        // window.dispatchEvent(new Event('open-signin'));
        // if (window.location.pathname !== '/login') {
        //     window.location.href = '/login'; 
        // }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;