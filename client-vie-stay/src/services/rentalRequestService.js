import axiosInstance from "../utils/AxiosInstance";

export const rentalRequestService = {
  // Lấy tất cả yêu cầu thuê của owner
  getRentalRequests: async () => {
    try {
      const response = await axiosInstance.get("/rental-requests/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy yêu cầu thuê theo accommodation ID
  getRentalRequestsByAccommodation: async (accommodationId) => {
    try {
      const response = await axiosInstance.get(
        `/rental-requests/accommodation/${accommodationId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy yêu cầu thuê theo room ID
  getRentalRequestsByRoom: async (roomId) => {
    try {
      const response = await axiosInstance.get(
        `/rental-requests/room/${roomId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Chấp nhận yêu cầu thuê nhà
  acceptRentalRequest: async (requestId, acceptData) => {
    try {
      const response = await axiosInstance.patch(
        `/rental-requests/${requestId}/accept`,
        acceptData // Gửi full object thay vì chỉ responseMessage
      );
      return response.data;
    } catch (error) {
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

  // Tạo yêu cầu thuê nhà
  createRentalRequest: async (requestData) => {
    try {
      const response = await axiosInstance.post(
        "/rental-requests",
        requestData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết yêu cầu thuê nhà
  getRentalRequestDetails: async (requestId) => {
    try {
      const response = await axiosInstance.get(`/rental-requests/${requestId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
