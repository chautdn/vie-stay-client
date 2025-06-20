import { create } from "zustand";
import { roomService } from "../../services/roomService";
import useErrorStore from "../errorStore";

export const useRoomStore = create((set, get) => ({
  rooms: [],
  selectedRoom: null,
  isLoading: false,
  searchResults: [],

  // Lấy tất cả phòng
  getAllRooms: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await roomService.getAllRooms(params);
      // Xử lý response data từ backend
      const rooms = response.data || response.rooms || response || [];
      set({
        rooms: Array.isArray(rooms) ? rooms : [],
        isLoading: false,
      });
      return response;
    } catch (error) {
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            error.displayMessage ||
            "Lỗi khi tải danh sách phòng"
        );
      set({ isLoading: false });
      throw error;
    }
  },

  // Sửa function này để xử lý đúng response structure
  getRoomsByAccommodationId: async (accommodationId) => {
    set({ isLoading: true });
    try {
      const response = await roomService.getRoomsByAccommodationId(
        accommodationId
      );

      let rooms = [];

      if (response.status === "success" && response.data) {
        if (response.data.rooms) {
          rooms = response.data.rooms;
        } else if (Array.isArray(response.data)) {
          rooms = response.data;
        }
      } else if (response.rooms) {
        rooms = response.rooms;
      } else if (response.data && response.data.rooms) {
        rooms = response.data.rooms;
      } else if (response.data && Array.isArray(response.data)) {
        rooms = response.data;
      } else if (Array.isArray(response)) {
        rooms = response;
      }

      set({
        rooms: Array.isArray(rooms) ? rooms : [],
        isLoading: false,
      });

      return response;
    } catch (error) {
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            error.displayMessage ||
            "Lỗi khi tải danh sách phòng theo chỗ ở"
        );
      set({ isLoading: false, rooms: [] });
      throw error;
    }
  },

  // Lấy chi tiết phòng
  getRoomById: async (roomId) => {
    set({ isLoading: true });
    try {
      const response = await roomService.getRoomById(roomId);
      const room = response.data || response.room || response;
      set({
        selectedRoom: room,
        isLoading: false,
      });
      return response;
    } catch (error) {
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            error.displayMessage ||
            "Lỗi khi tải chi tiết phòng"
        );
      set({ isLoading: false });
      throw error;
    }
  },

  createRoom: async (roomData) => {
    set({ isLoading: true });
    try {
      const { accommodationId, ...roomDataWithoutAccommodationId } = roomData;

      const response = await roomService.createRoom(
        roomDataWithoutAccommodationId,
        accommodationId
      );
      let newRoom = null;

      if (response.status === "success" && response.data) {
        newRoom = response.data.room || response.data;
      } else {
        newRoom = response.data || response.room || response;
      }

      const currentRooms = get().rooms;
      set({
        rooms: [...currentRooms, newRoom],
        isLoading: false,
      });

      return response;
    } catch (error) {
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            error.displayMessage ||
            "Lỗi khi tạo phòng mới"
        );
      set({ isLoading: false });
      throw error;
    }
  },

  // Cập nhật phòng
  updateRoom: async (roomId, updateData) => {
    set({ isLoading: true });
    try {
      const response = await roomService.updateRoom(roomId, updateData);
      let updatedRoom = null;

      if (response.status === "success" && response.data) {
        updatedRoom = response.data.room || response.data;
      } else {
        updatedRoom = response.data || response.room || response;
      }

      const currentRooms = get().rooms;
      const updatedRooms = currentRooms.map((room) =>
        room._id === roomId ? { ...room, ...updatedRoom } : room
      );

      set({
        rooms: updatedRooms,
        selectedRoom: updatedRoom,
        isLoading: false,
      });

      return response;
    } catch (error) {
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            error.displayMessage ||
            "Lỗi khi cập nhật phòng"
        );
      set({ isLoading: false });
      throw error;
    }
  },

  // Vô hiệu hóa phòng
  deactivateRoom: async (roomId) => {
    set({ isLoading: true });
    try {
      const response = await roomService.deactivateRoom(roomId);

      // Update room in the list
      const currentRooms = get().rooms;
      const updatedRooms = currentRooms.map((room) =>
        room._id === roomId ? { ...room, isAvailable: false } : room
      );

      set({
        rooms: updatedRooms,
        isLoading: false,
      });

      return response;
    } catch (error) {
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            error.displayMessage ||
            "Lỗi khi vô hiệu hóa phòng"
        );
      set({ isLoading: false });
      throw error;
    }
  },

  // Kích hoạt lại phòng
  reactivateRoom: async (roomId) => {
    set({ isLoading: true });
    try {
      const response = await roomService.reactivateRoom(roomId);

      // Update room in the list
      const currentRooms = get().rooms;
      const updatedRooms = currentRooms.map((room) =>
        room._id === roomId ? { ...room, isAvailable: true } : room
      );

      set({
        rooms: updatedRooms,
        isLoading: false,
      });

      return response;
    } catch (error) {
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            error.displayMessage ||
            "Lỗi khi kích hoạt phòng"
        );
      set({ isLoading: false });
      throw error;
    }
  },

  // Tìm kiếm phòng
  searchRooms: async (searchParams) => {
    set({ isLoading: true });
    try {
      const response = await roomService.searchRooms(searchParams);
      const searchResults = response.data || response.rooms || response || [];
      set({
        searchResults: Array.isArray(searchResults) ? searchResults : [],
        isLoading: false,
      });
      return response;
    } catch (error) {
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            error.displayMessage ||
            "Lỗi khi tìm kiếm phòng"
        );
      set({ isLoading: false });
      throw error;
    }
  },

  // Upload ảnh phòng
  uploadRoomImages: async (roomId, formData) => {
    set({ isLoading: true });
    try {
      const response = await roomService.uploadRoomImages(roomId, formData);
      set({ isLoading: false });
      return response;
    } catch (error) {
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            error.displayMessage ||
            "Lỗi khi upload ảnh phòng"
        );
      set({ isLoading: false });
      throw error;
    }
  },

  // Clear selected room
  clearSelectedRoom: () => set({ selectedRoom: null }),

  // Clear search results
  clearSearchResults: () => set({ searchResults: [] }),
}));
