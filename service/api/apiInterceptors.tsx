import axios from 'axios';
import { mmkvStorage } from '../storage';
import { BASE_URL } from '../config';

const api = axios.create({
  baseURL: BASE_URL,  
  timeout: 2000,  
});


api.interceptors.request.use(
  async (config) => {
    const token = await mmkvStorage.getItem('token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);  
  }
);

api.interceptors.response.use(
  (response) => {
    return response;  
  },
  (error) => {
    if (error.response) {

      if (error.response.status === 401) {
        // Token might be expired, you can redirect the user to login page
        console.error('Unauthorized access. Redirecting to login...');
      }
      return Promise.reject(error.response);
    } else if (error.request) {
  
      console.error('No response received:', error.request);
      return Promise.reject(error);
    } else {
     
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default api;
