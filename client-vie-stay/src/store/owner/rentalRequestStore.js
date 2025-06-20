import { create } from "zustand";
import { rentalRequestService } from "../../services/rentalRequestService";
import useErrorStore from "../errorStore";

export const useRentalRequestStore = create((set, get) => ({
  rentalRequests: [],
  selectedRequest: null,
  isLoading: false,

  // Lấy danh sách yêu cầu thuê nhà
  getRentalRequests: async (params = {}) => {
    set({ isLoading: true });
    try {
      let response;
      let rentalRequests = [];

      // Nếu có roomId, lấy theo room
      if (params.roomId && params.roomId !== "all") {
        response = await rentalRequestService.getRentalRequestsByRoom(
          params.roomId
        );
      }
      // Nếu có accommodationId, lấy theo accommodation
      else if (params.accommodationId && params.accommodationId !== "all") {
        response = await rentalRequestService.getRentalRequestsByAccommodation(
          params.accommodationId
        );
      }
      // Lấy tất cả yêu cầu của owner
      else {
        response = await rentalRequestService.getRentalRequests();
      }

      // Xử lý dữ liệu trả về
      rentalRequests = Array.isArray(response) ? response : response.data || [];

      set({
        rentalRequests: rentalRequests,
        isLoading: false,
      });

      return { data: rentalRequests };
    } catch (error) {
      console.error("Failed to load rental requests:", error);
      set({
        rentalRequests: [],
        isLoading: false,
      });

      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            "Lỗi khi tải danh sách yêu cầu thuê nhà"
        );
      throw error;
    }
  },

  // Chấp nhận yêu cầu thuê nhà
  acceptRentalRequest: async (requestId, acceptData) => {
    set({ isLoading: true });
    try {
      const response = await rentalRequestService.acceptRentalRequest(
        requestId,
        acceptData
      );

      // Cập nhật trạng thái trong danh sách
      const currentRequests = get().rentalRequests;
      const updatedRequests = currentRequests.map((request) =>
        request._id === requestId
          ? {
              ...request,
              status: "accepted",
              responseMessage: acceptData.responseMessage,
              updatedAt: new Date().toISOString(),
            }
          : request
      );

      set({
        rentalRequests: updatedRequests,
        isLoading: false,
      });

      return response;
    } catch (error) {
      console.error("Failed to accept rental request:", error);
      set({ isLoading: false });

      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message || "Lỗi khi chấp nhận yêu cầu thuê nhà"
        );
      throw error;
    }
  },

  // Từ chối yêu cầu thuê nhà
  rejectRentalRequest: async (requestId, responseMessage) => {
    set({ isLoading: true });
    try {
      const response = await rentalRequestService.rejectRentalRequest(
        requestId,
        responseMessage
      );

      // Cập nhật trạng thái trong danh sách
      const currentRequests = get().rentalRequests;
      const updatedRequests = currentRequests.map((request) =>
        request._id === requestId
          ? {
              ...request,
              status: "rejected",
              responseMessage: responseMessage,
              updatedAt: new Date().toISOString(),
            }
          : request
      );

      set({
        rentalRequests: updatedRequests,
        isLoading: false,
      });

      return response;
    } catch (error) {
      console.error("Failed to reject rental request:", error);
      set({ isLoading: false });

      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message || "Lỗi khi từ chối yêu cầu thuê nhà"
        );
      throw error;
    }
  },

  // Lấy chi tiết yêu cầu thuê nhà
  getRentalRequestDetails: async (requestId) => {
    set({ isLoading: true });
    try {
      const response = await rentalRequestService.getRentalRequestDetails(
        requestId
      );

      const requestDetail = response.data || response;
      set({
        selectedRequest: requestDetail,
        isLoading: false,
      });
      return { data: requestDetail };
    } catch (error) {
      console.error("Failed to load rental request details:", error);
      set({ isLoading: false });

      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            "Lỗi khi tải chi tiết yêu cầu thuê nhà"
        );
      throw error;
    }
  },

  // Clear selected request
  clearSelectedRequest: () => set({ selectedRequest: null }),
}));
