import axiosInstance from "../utils/AxiosInstance";

const API_URL = "api/accommodations"; // Sửa lại URL cho đúng

export const accommodationService = {
  getAllAccommodationByLandlord: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/me`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
