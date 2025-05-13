import axios from 'axios';
import { BASE_URL } from '../config';
import { getCachedToken, clearCachedToken } from '../token';
import { mmkvStorage } from '../storage';
import { Alert } from 'react-native';

// Custom error class for API errors
class ApiError extends Error {
  status: number;
  code?: string;
  details?: any;
  
  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Skip adding token for auth endpoints
    const isAuthEndpoint = config.url?.includes('/login') || 
                         config.url?.includes('/refresh-token');
    
    if (!isAuthEndpoint) {
      const token = await getCachedToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// // Response interceptor
// api.interceptors.response.use(
//   (response) => {
//     console.log(`[API] ${response.status} ${response.config.url}`);
//     return response;
//   },
//   async (error) => {
//     if (!error.response) {
//       // Network error
//       const networkError = new ApiError(
//         'Network Errorsnmknkljvklj: Please check your internet connection',
//         0,
//         'NETWORK_ERROR'
//       );
//       Alert.alert('Connection Problem', networkError.message);
//       return Promise.reject(networkError);
//     }

//     const { status, data } = error.response;
//     let apiError: ApiError;

//     // Handle specific error cases
//     if (status === 500 && data.includes('column d.AssayerId does not exist')) {
//       apiError = new ApiError(
//         'Database configuration error: Missing required column',
//         500,
//         'DB_COLUMN_MISSING',
//         { column: 'd.AssayerId', position: 194 }
//       );
//       Alert.alert(
//         'System Error',
//         'A database configuration issue was detected. Our team has been notified.'
//       );
//     } else if (status === 401) {
//       apiError = new ApiError(
//         'Session expired or invalid credentials',
//         401,
//         'UNAUTHORIZED'
//       );
//       clearCachedToken();
//       mmkvStorage.removeItem('token');
//       // Optionally redirect to login
//     } else if (status === 404) {
//       apiError = new ApiError(
//         'Requested resource not found',
//         404,
//         'NOT_FOUND'
//       );
//     } else {
//       // Generic error handling
//       apiError = new ApiError(
//         data?.message || 'An unexpected error occurred',
//         status,
//         'API_ERROR',
//         data
//       );
//     }

//     console.error('[API] Error details:', {
//       url: error.config.url,
//       status,
//       code: apiError.code,
//       message: apiError.message,
//       details: apiError.details
//     });

//     return Promise.reject(apiError);
//   }
// );


const MAX_RETRIES = 4;
const RETRY_DELAY = 1000; // 1 second
const RETRY_STATUS_CODES = [502, 503, 504, 500];

api.interceptors.response.use(
  undefined,
  async (error) => {
    const config = error.config;
    
    if (!config || 
        !RETRY_STATUS_CODES.includes(error.response?.status) || 
        config.__retryCount >= MAX_RETRIES) {
      return Promise.reject(error);
    }
    
    config.__retryCount = config.__retryCount || 0;
    config.__retryCount += 1;
    
    // Exponential backoff
    const delay = RETRY_DELAY * Math.pow(2, config.__retryCount - 1);
    console.log(`[API] Retry attempt ${config.__retryCount} after ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return api(config);
  }
);

export default api;