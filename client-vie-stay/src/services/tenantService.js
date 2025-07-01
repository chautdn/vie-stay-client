import axiosInstance from "../utils/AxiosInstance";

const API_URL = "/tenants";

export const tenantService = {
  // Lấy danh sách tenant theo roomId từ currentTenant
  getMyTenantsByRoomId: async (roomId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/room/${roomId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết tenant theo ID
  getTenantDetails: async (tenantId) => {
    try {
      const response = await axiosInstance.get(
        `${API_URL}/details/${tenantId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
