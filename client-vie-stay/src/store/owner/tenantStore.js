import { create } from "zustand";
import { tenantService } from "../../services/tenantService";
import useErrorStore from "../errorStore";

export const useTenantStore = create((set, get) => ({
  tenantsByRoom: {}, // State để lưu tenant theo room
  isLoading: false,

  // Lấy danh sách tenant theo roomId
  getMyTenantsByRoomId: async (roomId) => {
    set({ isLoading: true });
    try {
      const response = await tenantService.getMyTenantsByRoomId(roomId);

      let tenants = [];

      // Backend trả về format: {tenant: {...}, contract: {...}}
      if (response && response.tenant && response.contract) {
        // Combine tenant và contract data thành 1 object
        const combinedTenantData = {
          // Tenant basic info
          _id: response.tenant._id,
          name: response.tenant.name,
          email: response.tenant.email,
          phoneNumber: response.tenant.phoneNumber,
          profileImage: response.tenant.profileImage,

          // Contract info
          agreementId: response.contract._id,
          moveInDate: response.contract.startDate,
          contractEndDate: response.contract.endDate,
          monthlyRent: response.contract.monthlyRent,
          deposit: response.contract.deposit,
          totalMonthlyCost: response.contract.totalMonthlyCost,
          remainingDays: response.contract.remainingDays,
          status: response.contract.status,
          contractDuration: response.contract.contractDuration,
          utilityRates: response.contract.utilityRates,
          additionalFees: response.contract.additionalFees,
          notes: response.contract.notes,
        };

        tenants = [combinedTenantData]; // Array với 1 tenant
      }

      // Lưu vào tenantsByRoom
      set((state) => ({
        tenantsByRoom: {
          ...state.tenantsByRoom,
          [roomId]: tenants,
        },
        isLoading: false,
      }));

      return { data: tenants };
    } catch (error) {
      // Nếu 404 (không có tenant) thì không phải error
      if (error.response?.status === 404) {
        set((state) => ({
          tenantsByRoom: {
            ...state.tenantsByRoom,
            [roomId]: [], // Empty array = no tenants
          },
          isLoading: false,
        }));
        return { data: [] };
      }

      // Error thật sự
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            error.displayMessage ||
            "Lỗi khi tải danh sách người thuê theo phòng"
        );

      set((state) => ({
        tenantsByRoom: {
          ...state.tenantsByRoom,
          [roomId]: [],
        },
        isLoading: false,
      }));
      throw error;
    }
  },

  // Clear tenants by room
  clearTenantsByRoom: () => set({ tenantsByRoom: {} }),

  // Get tenants for specific room
  getTenantsByRoomFromStore: (roomId) => {
    const state = get();
    return state.tenantsByRoom[roomId] || [];
  },
}));
