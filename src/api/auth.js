import axios from 'axios';

// In dev, VITE_API_URL is unset so requests hit /auth and Vite's proxy
// forwards them to localhost:8081. In production, DigitalOcean injects
// VITE_API_URL (e.g. https://api.yourdomain.com/auth) at build time.
const BASE_URL = import.meta.env.VITE_API_URL ?? '/auth';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends HttpOnly refresh_token cookie automatically
});

// Attach access token to every request if available
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, try one token refresh then retry original request
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retried) {
      original._retried = true;
      try {
        const { data } = await axios.post(`${BASE_URL}/refresh`, {}, { withCredentials: true });
        sessionStorage.setItem('accessToken', data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(original);
      } catch {
        sessionStorage.removeItem('accessToken');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (email, password) =>
    apiClient.post('/register', { email, password }),

  login: (email, password) =>
    apiClient.post('/login', { email, password }),

  logout: () =>
    apiClient.post('/logout'),

  refresh: () =>
    apiClient.post('/refresh'),

  requestPasswordReset: (email) =>
    apiClient.post('/password/reset-request', { email }),

  resetPassword: (token, newPassword) =>
    apiClient.post('/password/reset', { token, newPassword }),
};
