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
    // Lấy từ sessionStorage thay vì localStorage
    const accessToken = sessionStorage.getItem("token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.log("❌ No token in sessionStorage");
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
    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    if (error.response?.data?.message) {
      error.displayMessage = error.response.data.message;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
