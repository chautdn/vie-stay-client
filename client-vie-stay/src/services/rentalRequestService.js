import axiosInstance from "../utils/AxiosInstance";

export const rentalRequestService = {
  // Lấy tất cả yêu cầu thuê của owner
  getRentalRequests: async (params = {}) => {
    try {
      const { status, page = 1, limit = 10 } = params;
      const queryParams = new URLSearchParams();

      if (status) queryParams.append("status", status);
      queryParams.append("page", page);
      queryParams.append("limit", limit);

      const response = await axiosInstance.get(
        `/rental-requests/me?${queryParams}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMyRentalRequests: async () => {
    try {
      const response = await axiosInstance.get("/rental-requests/my-request");
      console.log("✅ My rental requests:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching my rental requests:", error);
      throw error;
    }
  },

  // Lấy yêu cầu thuê theo accommodation ID
  getRentalRequestsByAccommodation: async (accommodationId, params = {}) => {
    try {
      const { status, page = 1, limit = 10 } = params;
      const queryParams = new URLSearchParams();

      if (status) queryParams.append("status", status);
      queryParams.append("page", page);
      queryParams.append("limit", limit);

      const response = await axiosInstance.get(
        `/rental-requests/accommodation/${accommodationId}?${queryParams}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy yêu cầu thuê theo room ID
  getRentalRequestsByRoom: async (roomId, params = {}) => {
    try {
      const { status, page = 1, limit = 10 } = params;
      const queryParams = new URLSearchParams();

      if (status) queryParams.append("status", status);
      queryParams.append("page", page);
      queryParams.append("limit", limit);

      const response = await axiosInstance.get(
        `/rental-requests/room/${roomId}?${queryParams}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Chấp nhận yêu cầu thuê nhà
  acceptRentalRequest: async (requestId, acceptData) => {
    try {
      console.log("📤 Sending accept request:", acceptData);
      const response = await axiosInstance.patch(
        `/rental-requests/${requestId}/accept`,
        acceptData
      );
      return response.data;
    } catch (error) {
      console.error("❌ Accept request error:", error.response?.data);
      throw error;
    }
  },

  // Từ chối yêu cầu thuê nhà
  rejectRentalRequest: async (requestId, responseMessage) => {
    try {
      const response = await axiosInstance.patch(
        `/rental-requests/${requestId}/reject`,
        { responseMessage }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Rút lại yêu cầu thuê (tenant)
  withdrawRentalRequest: async (requestId) => {
    try {
      const response = await axiosInstance.patch(
        `/rental-requests/${requestId}/withdraw`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo yêu cầu thuê nhà
  createRentalRequest: async (data) => {
    try {
      console.log("📤 Sending rental request data:", data);
      const response = await axiosInstance.post("/rental-requests", data);
      console.log("✅ Rental request response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Rental request error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },

  // Lấy chi tiết yêu cầu thuê nhà
  getRentalRequestDetails: async (requestId) => {
    try {
      const response = await axiosInstance.get(
        `/rental-requests/${requestId}/detail`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Đánh dấu đã xem
  markAsViewed: async (requestId) => {
    try {
      const response = await axiosInstance.patch(
        `/rental-requests/${requestId}/viewed`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thống kê yêu cầu
  getRequestStats: async () => {
    try {
      const response = await axiosInstance.get("/rental-requests/stats");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Lấy yêu cầu của tenant hiện tại
  getMyRequests: async (params = {}) => {
    try {
      const { status, page = 1, limit = 10 } = params;
      const queryParams = new URLSearchParams();

      if (status) queryParams.append("status", status);
      queryParams.append("page", page);
      queryParams.append("limit", limit);

      const response = await axiosInstance.get(
        `/rental-requests/my-requests?${queryParams}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete rental request
  deleteRentalRequest: async (requestId) => {
    try {
      const response = await axiosInstance.delete(
        `/rental-requests/${requestId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
