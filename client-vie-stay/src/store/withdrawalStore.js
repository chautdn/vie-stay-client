import { create } from "zustand";
import { withdrawalService } from "../services/withdrawalService";
import useErrorStore from "./errorStore";

export const useWithdrawalStore = create((set, get) => ({
  // State
  withdrawalRequests: [],
  pendingWithdrawals: [],
  selectedRequest: null,
  stats: null,
  isLoading: false,
  error: null,

  // Clear error
  clearError: () => set({ error: null }),

  // ✅ Tenant: Tạo yêu cầu rút tiền
  createWithdrawalRequest: async (confirmationId, requestData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await withdrawalService.createWithdrawalRequest(
        confirmationId,
        requestData
      );

      // Thêm vào danh sách nếu thành công
      const currentRequests = get().withdrawalRequests;
      set({
        withdrawalRequests: [response.data, ...currentRequests],
        isLoading: false,
      });

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Lỗi khi tạo yêu cầu rút tiền";

      useErrorStore.getState().setError(errorMessage);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  // ✅ Tenant: Lấy lịch sử withdrawal
  getTenantWithdrawals: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await withdrawalService.getTenantWithdrawals();

      set({
        withdrawalRequests: response.data || [],
        isLoading: false,
      });

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Lỗi khi tải lịch sử withdrawal";

      useErrorStore.getState().setError(errorMessage);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  // ✅ Tenant: Hủy withdrawal request
  cancelWithdrawal: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await withdrawalService.cancelWithdrawal(requestId);

      // Cập nhật trạng thái trong danh sách
      const currentRequests = get().withdrawalRequests;
      const updatedRequests = currentRequests.map((request) =>
        request._id === requestId
          ? { ...request, status: "cancelled" }
          : request
      );

      set({
        withdrawalRequests: updatedRequests,
        isLoading: false,
      });

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Lỗi khi hủy yêu cầu rút tiền";

      useErrorStore.getState().setError(errorMessage);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  // ✅ Landlord: Lấy pending withdrawals
  getPendingWithdrawals: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await withdrawalService.getPendingWithdrawals();

      set({
        pendingWithdrawals: response.data || [],
        isLoading: false,
      });

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Lỗi khi tải pending withdrawals";

      useErrorStore.getState().setError(errorMessage);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  // ✅ Landlord: Approve withdrawal
  approveWithdrawal: async (requestId, approvalData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await withdrawalService.approveWithdrawal(
        requestId,
        approvalData
      );

      // Cập nhật trong pending list
      const currentPending = get().pendingWithdrawals;
      const updatedPending = currentPending.filter(
        (request) => request._id !== requestId
      );

      set({
        pendingWithdrawals: updatedPending,
        isLoading: false,
      });

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Lỗi khi phê duyệt withdrawal";

      useErrorStore.getState().setError(errorMessage);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  // ✅ Landlord: Reject withdrawal
  rejectWithdrawal: async (requestId, rejectionData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await withdrawalService.rejectWithdrawal(
        requestId,
        rejectionData
      );

      // Cập nhật trong pending list
      const currentPending = get().pendingWithdrawals;
      const updatedPending = currentPending.filter(
        (request) => request._id !== requestId
      );

      set({
        pendingWithdrawals: updatedPending,
        isLoading: false,
      });

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Lỗi khi từ chối withdrawal";

      useErrorStore.getState().setError(errorMessage);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  // ✅ Check withdrawal status
  checkWithdrawalStatus: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await withdrawalService.checkWithdrawalStatus(requestId);

      set({
        selectedRequest: response.data,
        isLoading: false,
      });

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Lỗi khi kiểm tra trạng thái withdrawal";

      useErrorStore.getState().setError(errorMessage);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  // ✅ Admin: Get all withdrawals
  getAllWithdrawals: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await withdrawalService.getAllWithdrawals(params);

      set({
        withdrawalRequests: response.data || [],
        isLoading: false,
      });

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Lỗi khi tải tất cả withdrawals";

      useErrorStore.getState().setError(errorMessage);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  // ✅ Admin: Get withdrawal stats
  getWithdrawalStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await withdrawalService.getWithdrawalStats();

      set({
        stats: response.data,
        isLoading: false,
      });

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Lỗi khi tải withdrawal statistics";

      useErrorStore.getState().setError(errorMessage);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  // ✅ Set selected request
  setSelectedRequest: (request) => {
    set({ selectedRequest: request });
  },

  // ✅ Clear data
  clearWithdrawals: () => {
    set({
      withdrawalRequests: [],
      pendingWithdrawals: [],
      selectedRequest: null,
      stats: null,
    });
  },
}));
