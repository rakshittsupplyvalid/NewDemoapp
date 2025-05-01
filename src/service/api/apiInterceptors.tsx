import axios from 'axios';
import { mmkvStorage } from '../storage';
import { BASE_URL } from '../config';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000, // Slightly increased to handle real-world network latency better
});

// Cache token in memory after first fetch
let cachedToken: string | null = null;

api.interceptors.request.use(
  async (config) => {
    if (!cachedToken) {
      cachedToken = await mmkvStorage.getItem('token');
      console.log('Token fetched from storage:', cachedToken);
    }
    if (cachedToken) {
      config.headers.Authorization = `Bearer ${cachedToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error('Unauthorized. Token may have expired.');
        // Optional: mmkvStorage.delete('token'); or navigate to login
      }
      return Promise.reject(error.response);
    } else if (error.request) {
      console.error('No response from server:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
