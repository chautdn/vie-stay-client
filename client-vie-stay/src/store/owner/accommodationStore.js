import { create } from "zustand";
import { apiClient } from "./accommodationRoutes"; // ✅ SỬA: Import từ accommodationRoutes

export const useAccommodationStore = create((set, get) => ({
  accommodations: [],
  selectedAccommodation: null,
  isLoading: false,
  error: null,

  getAllAccommodations: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.get("/api/accommodations/me");

      let accommodations = [];

      if (response && response.data) {
        accommodations = response.data;
      }

      set({
        accommodations: accommodations,
        isLoading: false,
        error: null,
      });

      return accommodations;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.displayMessage ||
        error.message ||
        "Lỗi khi tải danh sách tòa nhà";

      set({
        isLoading: false,
        accommodations: [],
        error: errorMessage,
      });

      throw error;
    }
  },

  clearSelectedAccommodation: () => set({ selectedAccommodation: null }),

  clearError: () => set({ error: null }),
}));
