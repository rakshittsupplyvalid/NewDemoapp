import { mmkvStorage } from './storage';

let cachedToken: string | null = null;

export const getCachedToken = async (): Promise<string | null> => {
  try {
    if (!cachedToken) {
      const storedToken = await mmkvStorage.getItem('token');
      if (storedToken && validateToken(storedToken)) {
        cachedToken = storedToken;
      } else {
        if (storedToken) {
          // Clear invalid token
          await clearCachedToken();
        }
      }
    }
    return cachedToken;
  } catch (error) {
    console.error('Error getting cached token:', error);
    return null;
  }
};

export const setCachedToken = (token: string): void => {
  if (!validateToken(token)) {
    throw new Error('Invalid token provided');
  }
  
  try {
    cachedToken = token;
    mmkvStorage.setItem('token', token);
  } catch (error) {
    console.error('Error setting token:', error);
    throw error;
  }
};

export const clearCachedToken = async (): Promise<void> => {
  try {
    cachedToken = null;
    await mmkvStorage.removeItem('token');
  } catch (error) {
    console.error('Error clearing token:', error);
    throw error;
  }
};

const validateToken = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // Basic JWT validation
  const parts = token.split('.');
  return parts.length === 3;
};