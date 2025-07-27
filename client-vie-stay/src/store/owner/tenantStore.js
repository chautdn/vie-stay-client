import { create } from "zustand";
import { tenantService } from "../../services/tenantService";
import useErrorStore from "../errorStore";

export const useTenantStore = create((set, get) => ({
  tenantsByRoom: {}, // State để lưu tenant theo room
  isLoading: false,

  // Lấy danh sách tenant theo roomId từ currentTenant
  getMyTenantsByRoomId: async (roomId) => {
    set({ isLoading: true });
    try {
      const response = await tenantService.getMyTenantsByRoomId(roomId);

      let tenants = [];

      // Backend trả về format: {room: {...}, tenants: [...]}
      if (response && response.tenants && Array.isArray(response.tenants)) {
        tenants = response.tenants.map((tenant) => ({
          // Basic tenant info
          _id: tenant._id,
          name: tenant.name,
          email: tenant.email,
          phoneNumber: tenant.phoneNumber,
          profileImage: tenant.profileImage,
          nationalIdFrontImage: tenant.nationalIdFrontImage,
          nationalIdBackImage: tenant.nationalIdBackImage,
          nationalIdVerified: tenant.nationalIdVerified,
          role: tenant.role,
          joinedAt: tenant.joinedAt,

          // Tenant type flags
          isPrimaryTenant: tenant.isPrimaryTenant,
          isCoTenant: tenant.isCoTenant,

          // Room info from response
          roomInfo: response.room,
        }));
      }

      // Lưu vào tenantsByRoom
      set((state) => ({
        tenantsByRoom: {
          ...state.tenantsByRoom,
          [roomId]: tenants,
        },
        isLoading: false,
      }));

      return { data: tenants, roomInfo: response.room };
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
        return { data: [], roomInfo: null };
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

  // Lấy chi tiết tenant
  getTenantDetails: async (tenantId) => {
    try {
      const response = await tenantService.getTenantDetails(tenantId);
      return response.data;
    } catch (error) {
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message || "Lỗi khi tải thông tin người thuê"
        );
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
