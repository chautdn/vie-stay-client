import axios from 'axios';
import { BASE_URL } from './Constant';

console.log("🚀 Creating axios instance with BASE_URL:", BASE_URL);

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent infinite loops
let isRefreshing = false;

// Request interceptor to add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("🔧 Request interceptor executing...");
    console.log("📍 Request URL:", `${config.baseURL}${config.url}`);
    console.log("🔧 Request method:", config.method?.toUpperCase());
    
    // Get token from localStorage every time (fresh read)
    let token = null;
    try {
      token = localStorage.getItem('token');
      console.log("🔍 Token from localStorage:", token ? `${token.substring(0, 20)}...` : 'NOT FOUND');
    } catch (error) {
      console.error("❌ Error reading from localStorage:", error);
    }
    
    if (token) {
      // Ensure headers object exists
      if (!config.headers) {
        config.headers = {};
      }
      
      // Set Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Authorization header set:", config.headers.Authorization.substring(0, 30) + "...");
      
      // Verify it's actually set
      console.log("🔍 Final headers check:", {
        hasAuthorization: !!config.headers.Authorization,
        authPreview: config.headers.Authorization ? config.headers.Authorization.substring(0, 20) + "..." : "missing",
        allHeaders: Object.keys(config.headers)
      });
    } else {
      console.log("⚠️ No token available - request will be sent without authorization");
    }
    
    // Log the complete request configuration
    console.log("📤 Complete request config:", {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      headers: config.headers,
      hasAuth: !!config.headers?.Authorization
    });
    
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error("❌ Response error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message || error.message,
      url: originalRequest?.url,
      method: originalRequest?.method,
      hadAuthHeader: !!originalRequest?.headers?.Authorization
    });
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !isRefreshing) {
      console.log("🚨 401 Unauthorized received");
      
      // Prevent infinite loops
      if (originalRequest._retry) {
        console.log("🔄 Already retried, clearing auth and redirecting");
        clearAuthAndRedirect();
        return Promise.reject(error);
      }
      
      isRefreshing = true;
      originalRequest._retry = true;
      
      // Check if we still have a token
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("🚫 No token found, clearing auth");
        clearAuthAndRedirect();
        isRefreshing = false;
        return Promise.reject(error);
      }
      
      // If we have a token but got 401, it means token is invalid
      console.log("🗑️ Token invalid, clearing auth data");
      clearAuthAndRedirect();
      isRefreshing = false;
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to clear auth and redirect
function clearAuthAndRedirect() {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log("🗑️ Auth data cleared from localStorage");
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
  
  // Only redirect if not already on login page
  if (typeof window !== 'undefined' && 
      !window.location.pathname.includes('/login') && 
      !window.location.pathname.includes('/signup')) {
    console.log("🔄 Redirecting to login page");
    window.location.href = '/login';
  }
}

// Test function to manually verify the interceptor
axiosInstance.testAuth = async () => {
  console.log("🧪 Testing axios auth setup...");
  
  const token = localStorage.getItem('token');
  console.log("📦 Current token in localStorage:", token ? "EXISTS" : "MISSING");
  
  if (!token) {
    console.log("❌ No token to test with");
    return;
  }
  
  try {
    console.log("🔬 Making test request to /user/profile...");
    const response = await axiosInstance.get('/user/profile');
    console.log("✅ Test request successful:", response.data);
    return response;
  } catch (error) {
    console.log("❌ Test request failed:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      hadAuthHeader: !!error.config?.headers?.Authorization
    });
    throw error;
  }
};

// Global function for easy debugging
if (typeof window !== 'undefined') {
  window.testAxiosAuth = axiosInstance.testAuth;
  console.log("💡 Run 'window.testAxiosAuth()' in console to test auth");
}

export default axiosInstance;