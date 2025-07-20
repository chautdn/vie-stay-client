import { create } from "zustand";
import { rentalRequestService } from "../../services/rentalRequestService";
import useErrorStore from "../errorStore";

export const useRentalRequestStore = create((set, get) => ({
  rentalRequests: [],
  selectedRequest: null,
  pagination: null,
  stats: null,
  urgentRequests: [],
  isLoading: false,
  error: null,

  // Clear error
  clearError: () => set({ error: null }),

  // Lấy danh sách yêu cầu thuê nhà
  getRentalRequests: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      let response;

      // Nếu có roomId, lấy theo room
      if (params.roomId && params.roomId !== "all") {
        response = await rentalRequestService.getRentalRequestsByRoom(
          params.roomId,
          params
        );
      }
      // Nếu có accommodationId, lấy theo accommodation
      else if (params.accommodationId && params.accommodationId !== "all") {
        response = await rentalRequestService.getRentalRequestsByAccommodation(
          params.accommodationId,
          params
        );
      }
      // Lấy tất cả yêu cầu của owner
      else {
        response = await rentalRequestService.getRentalRequests(params);
      }

      // Xử lý dữ liệu trả về
      const rentalRequests = response.data || [];
      const pagination = response.pagination || null;

      set({
        rentalRequests,
        pagination,
        isLoading: false,
        error: null,
      });

      return { data: rentalRequests, pagination };
    } catch (error) {
      console.error("Failed to load rental requests:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Lỗi khi tải danh sách yêu cầu thuê nhà";

      set({
        rentalRequests: [],
        pagination: null,
        isLoading: false,
        error: errorMessage,
      });

      useErrorStore.getState().setError(errorMessage);
      throw error;
    }
  },

  getMyRentalRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await rentalRequestService.getMyRentalRequests();
      const rentalRequests = response.data || [];
      set({
        rentalRequests,
        isLoading: false,
        error: null,
      });
      return { data: rentalRequests };
    } catch (error) {
      console.error("Failed to load my rental requests:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Lỗi khi tải yêu cầu thuê nhà của tôi";
      set({
        rentalRequests: [],
        isLoading: false,
        error: errorMessage,
      });
      useErrorStore.getState().setError(errorMessage);
      throw error;
    }
  },

  // Chấp nhận yêu cầu thuê nhà
  acceptRentalRequest: async (requestId, acceptData) => {
    set({ isLoading: true, error: null });
    try {
      console.log("🏠 Store: Accepting request with data:", acceptData);

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
              respondedAt: new Date().toISOString(),
            }
          : request
      );

      set({
        rentalRequests: updatedRequests,
        isLoading: false,
        error: null,
      });

      return response;
    } catch (error) {
      console.error("Failed to accept rental request:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Lỗi khi chấp nhận yêu cầu thuê nhà";

      set({
        isLoading: false,
        error: errorMessage,
      });

      useErrorStore.getState().setError(errorMessage);
      throw error;
    }
  },

  // Từ chối yêu cầu thuê nhà
  rejectRentalRequest: async (requestId, responseMessage) => {
    set({ isLoading: true, error: null });
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
              respondedAt: new Date().toISOString(),
            }
          : request
      );

      set({
        rentalRequests: updatedRequests,
        isLoading: false,
        error: null,
      });

      return response;
    } catch (error) {
      console.error("Failed to reject rental request:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Lỗi khi từ chối yêu cầu thuê nhà";

      set({
        isLoading: false,
        error: errorMessage,
      });

      useErrorStore.getState().setError(errorMessage);
      throw error;
    }
  },

  // Tạo yêu cầu thuê nhà (cho tenant)
  createRentalRequest: async (data) => {
    set({ isLoading: true, error: null });

    try {
      console.log("🏠 Creating rental request with data:", data);

      // Validate required fields
      if (!data.roomId) {
        throw new Error("Room ID is required");
      }

      if (!data.proposedStartDate) {
        throw new Error("Proposed start date is required");
      }

      // Clean up data before sending
      const cleanData = {
        roomId: data.roomId,
        accommodationId: data.accommodationId || null,
        landlordId: data.landlordId || null,
        message: data.message || "",
        proposedStartDate: data.proposedStartDate,
        proposedEndDate: data.proposedEndDate || null,
        proposedRent: data.proposedRent || null,
        guestCount: parseInt(data.guestCount) || 1,
        specialRequests: data.specialRequests || "",
        priority: data.priority || "normal",
        tenantProfile: data.tenantProfile || {},
      };

      console.log("🔧 Cleaned data for API:", cleanData);

      const response = await rentalRequestService.createRentalRequest(
        cleanData
      );

      if (response.success) {
        set({
          isLoading: false,
          error: null,
          currentRequest: response.data,
        });

        // Update requests list if exists
        const currentRequests = get().rentalRequests;
        set({
          rentalRequests: [response.data, ...currentRequests],
        });

        return response;
      } else {
        throw new Error(response.message || "Failed to create rental request");
      }
    } catch (error) {
      console.error("Failed to create rental request:", error);
      const errorMessage =
        error.response?.data?.error || error.message || "An error occurred";

      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Lấy chi tiết yêu cầu thuê nhà
  getRentalRequestDetails: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rentalRequestService.getRentalRequestDetails(
        requestId
      );

      const requestDetail = response.data || response;
      set({
        selectedRequest: requestDetail,
        isLoading: false,
        error: null,
      });

      // Mark as viewed if user is landlord
      try {
        await rentalRequestService.markAsViewed(requestId);
      } catch (viewError) {
        // Không cần throw error nếu mark as viewed thất bại
        console.warn("Failed to mark as viewed:", viewError);
      }

      return { data: requestDetail };
    } catch (error) {
      console.error("Failed to load rental request details:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Lỗi khi tải chi tiết yêu cầu thuê nhà";

      set({
        isLoading: false,
        error: errorMessage,
      });

      useErrorStore.getState().setError(errorMessage);
      throw error;
    }
  },

  // Rút lại yêu cầu (tenant)
  withdrawRentalRequest: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rentalRequestService.withdrawRentalRequest(
        requestId
      );

      // Cập nhật trạng thái trong danh sách
      const currentRequests = get().rentalRequests;
      const updatedRequests = currentRequests.map((request) =>
        request._id === requestId
          ? {
              ...request,
              status: "withdrawn",
              respondedAt: new Date().toISOString(),
            }
          : request
      );

      set({
        rentalRequests: updatedRequests,
        isLoading: false,
        error: null,
      });

      return response;
    } catch (error) {
      console.error("Failed to withdraw rental request:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Lỗi khi rút lại yêu cầu thuê nhà";

      set({
        isLoading: false,
        error: errorMessage,
      });

      useErrorStore.getState().setError(errorMessage);
      throw error;
    }
  },

  // Lấy thống kê
  getStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await rentalRequestService.getRequestStats();
      const stats = response.data || response;

      set({
        stats,
        isLoading: false,
        error: null,
      });

      return stats;
    } catch (error) {
      console.error("Failed to load stats:", error);
      const errorMessage =
        error.response?.data?.error || error.message || "Lỗi khi tải thống kê";

      set({
        isLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  // Delete rental request
  deleteRentalRequest: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rentalRequestService.deleteRentalRequest(
        requestId
      );

      // Remove from list
      const currentRequests = get().rentalRequests;
      const updatedRequests = currentRequests.filter(
        (request) => request._id !== requestId
      );

      set({
        rentalRequests: updatedRequests,
        isLoading: false,
        error: null,
      });

      return response;
    } catch (error) {
      console.error("Failed to delete rental request:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Lỗi khi xóa yêu cầu thuê nhà";

      set({
        isLoading: false,
        error: errorMessage,
      });

      useErrorStore.getState().setError(errorMessage);
      throw error;
    }
  },

  // Clear selected request
  clearSelectedRequest: () => set({ selectedRequest: null }),

  // Clear all data
  clearAll: () =>
    set({
      rentalRequests: [],
      selectedRequest: null,
      pagination: null,
      stats: null,
      urgentRequests: [],
      error: null,
    }),
}));
