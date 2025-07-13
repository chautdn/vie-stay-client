import axiosInstance from "../utils/AxiosInstance";

const API_URL = "api/withdrawals";

export const withdrawalService = {
  // ✅ Tenant: Tạo yêu cầu rút tiền
  createWithdrawalRequest: async (confirmationId, requestData) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/request/${confirmationId}`,
        requestData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Tenant: Lấy lịch sử withdrawal
  getTenantWithdrawals: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/my-requests`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Tenant: Hủy withdrawal request
  cancelWithdrawal: async (requestId) => {
    try {
      const response = await axiosInstance.patch(
        `${API_URL}/cancel/${requestId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Landlord: Lấy pending withdrawals
  getPendingWithdrawals: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/pending`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Landlord: Approve withdrawal
  approveWithdrawal: async (requestId, approvalData) => {
    try {
      const response = await axiosInstance.patch(
        `${API_URL}/approve/${requestId}`,
        approvalData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Landlord: Reject withdrawal
  rejectWithdrawal: async (requestId, rejectionData) => {
    try {
      const response = await axiosInstance.patch(
        `${API_URL}/reject/${requestId}`,
        rejectionData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Common: Check withdrawal status
  checkWithdrawalStatus: async (requestId) => {
    try {
      const response = await axiosInstance.get(
        `${API_URL}/status/${requestId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Admin: Get all withdrawals
  getAllWithdrawals: async (params = {}) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/admin/all`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Admin: Get withdrawal stats
  getWithdrawalStats: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/admin/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
