import axios from "axios";
import { BASE_URL } from "./Constant";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json", //Dữ liệu gửi đi dạng JSON
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Return successful response as is
    return response;
  },
  (error) => {
    // Extract the error message from the backend response
    const errorMessage = error.response?.data?.message || 
                         "Something went wrong. Please try again.";
    
    // You can create a custom error object with the extracted message
    const enhancedError = {
      ...error,
      displayMessage: errorMessage
    };
    
    // If you're using a global error handling mechanism like a store or context,
    // you can update it here
    // Example: useErrorStore.getState().setError(errorMessage);
    
    return Promise.reject(enhancedError);
  }
);

export default axiosInstance;