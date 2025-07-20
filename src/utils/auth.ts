import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // In a real app, you would make an API call to refresh the token
        // For this example, we'll simulate a successful token refresh
        console.log('Refreshing token...');
        
        // Simulate API call to refresh token
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would get a new token from your backend
        // const { data } = await axios.post(`${API_URL}/auth/refresh-token`, {
        //   refreshToken: Cookies.get('refreshToken'),
        // });
        
        // For demo purposes, we'll just use the existing token
        const newToken = 'new-dummy-auth-token';
        
        // Update the stored tokens
        Cookies.set('authToken', newToken, { 
          expires: 1, // 1 day expiry
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        });
        
        // Update the Authorization header
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Retry the original request with the new token
        return api(originalRequest);
      } catch (error) {
        // If refresh token fails, redirect to login
        console.error('Failed to refresh token:', error);
        Cookies.remove('authToken');
        Cookies.remove('refreshToken');
        // In a Next.js app, you might want to use the router to redirect
        // router.push('/login');
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  // In a real app, you would make an API call to authenticate
  console.log('Logging in with:', { email });
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, you would get these from your backend
  const authToken = 'dummy-auth-token';
  const refreshToken = 'dummy-refresh-token';
  
  return { authToken, refreshToken };
};

export const verifyOtp = async (otp: string) => {
  // In a real app, you would verify the OTP with your backend
  console.log('Verifying OTP:', otp);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, you would get a new token from your backend
  const authToken = 'dummy-auth-token';
  const refreshToken = 'dummy-refresh-token';
  
  return { authToken, refreshToken };
};

export const logout = () => {
  // Clear tokens from cookies
  Cookies.remove('authToken');
  Cookies.remove('refreshToken');
  Cookies.remove('tempUserData');
  Cookies.remove('tempLoginData');
  
  // In a real app, you might want to notify the backend about the logout
  // await api.post('/auth/logout');
  
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

export const isAuthenticated = (): boolean => {
  // Check if auth token exists and is not expired
  return !!Cookies.get('authToken');
};

export default api;
