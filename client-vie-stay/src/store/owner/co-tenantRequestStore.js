import { create } from "zustand";
import coTenantRequestService from "../../services/co-tenantRequestService";
import useErrorStore from "../errorStore";

export const useCoTenantRequestStore = create((set, get) => ({
  requests: [],
  isLoading: false,
  selectedRequest: null,

  // Lấy danh sách yêu cầu của landlord
  getRequestsByLandlord: async () => {
    set({ isLoading: true });
    try {
      const requests = await coTenantRequestService.getRequestsByLandlord();
      set({ requests, isLoading: false });
      return requests;
    } catch (error) {
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message || "Lỗi khi tải danh sách yêu cầu"
        );
      set({ isLoading: false });
      throw error;
    }
  },
  // Gửi yêu cầu thêm người ở cùng
  requestCoTenant: async ({ roomId, name, phoneNumber, imageCCCD }) => {
    set({ isLoading: true, successMessage: "", error: null });
    try {
      const result = await coTenantRequestService.requestCoTenant({
        roomId,
        name,
        phoneNumber,
        imageCCCD,
      });
      set({ isLoading: false, successMessage: result.message, error: null });
      return result;
    } catch (error) {
      const msg =
        error.response?.data?.message || "Lỗi khi gửi yêu cầu thêm bạn ở chung";
      set({ isLoading: false, error: msg });
      useErrorStore.getState().setError(msg);
      throw error;
    }
  },

  clearStatus: () => set({ successMessage: "", error: null }),

  // Phê duyệt yêu cầu
  approveRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      await coTenantRequestService.approveRequest(requestId);

      // Cập nhật state local
      const currentRequests = get().requests;
      const updatedRequests = currentRequests.map((request) =>
        request._id === requestId ? { ...request, status: "approved" } : request
      );

      set({ requests: updatedRequests, isLoading: false });
      return true;
    } catch (error) {
      useErrorStore
        .getState()
        .setError(error.response?.data?.message || "Lỗi khi phê duyệt yêu cầu");
      set({ isLoading: false });
      throw error;
    }
  },

  // Từ chối yêu cầu
  rejectRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      await coTenantRequestService.rejectRequest(requestId);

      // Cập nhật state local
      const currentRequests = get().requests;
      const updatedRequests = currentRequests.map((request) =>
        request._id === requestId ? { ...request, status: "rejected" } : request
      );

      set({ requests: updatedRequests, isLoading: false });
      return true;
    } catch (error) {
      useErrorStore
        .getState()
        .setError(error.response?.data?.message || "Lỗi khi từ chối yêu cầu");
      set({ isLoading: false });
      throw error;
    }
  },

  // Set request được chọn
  setSelectedRequest: (request) => {
    set({ selectedRequest: request });
  },

  // Clear requests
  clearRequests: () => {
    set({ requests: [], selectedRequest: null });
  },
}));
