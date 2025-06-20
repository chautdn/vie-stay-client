import axiosInstance from "../../utils/AxiosInstance";

// ✅ SỬA: API Routes phải match với backend
const API_CONFIG = {
  ACCOMMODATION: {
    BASE: "/api/accommodations",
    LIST: "/api/accommodations",
    CREATE: "/api/accommodations",
    UPDATE_STATUS: (id) => `/api/accommodations/${id}/status`,
  },
};

// Export individual routes for convenience
export const ACCOMMODATION_ROUTES = {
  LIST: API_CONFIG.ACCOMMODATION.LIST,
  CREATE: API_CONFIG.ACCOMMODATION.CREATE,
  UPDATE_STATUS: (id) => API_CONFIG.ACCOMMODATION.UPDATE_STATUS(id),
};

// sử dụng axiosInstance thay axios để gọi API
export const apiClient = {
  get: async (url, config = {}) => {
    try {
      const response = await axiosInstance.get(url, config);

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Network error";
      throw new Error(errorMessage);
    }
  },

  post: async (url, data, config = {}) => {
    try {
      const response = await axiosInstance.post(url, data, config);

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Network error";
      throw new Error(errorMessage);
    }
  },

  put: async (url, data, config = {}) => {
    try {
      const response = await axiosInstance.put(url, data, config);

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Network error";
      throw new Error(errorMessage);
    }
  },

  delete: async (url, config = {}) => {
    try {
      const response = await axiosInstance.delete(url, config);

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Network error";
      throw new Error(errorMessage);
    }
  },
};
