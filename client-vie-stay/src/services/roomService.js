import axiosInstance from "../utils/AxiosInstance";

const API_URL = "/rooms";

export const roomService = {
  // Lấy danh sách phòng
  getAllRooms: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_URL, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy phòng theo accommodation ID
  getRoomsByAccommodationId: async (accommodationId) => {
    try {
      const response = await axiosInstance.get(
        `${API_URL}/accommodation/${accommodationId}`
      );
      console.log("Response from getRoomsByAccommodationId:", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thông tin một phòng
  getRoomById: async (roomId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${roomId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo phòng mới
  createRoom: async (roomData, accommodationId) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/${accommodationId}/create`,
        roomData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thông tin phòng
  updateRoom: async (roomId, roomData) => {
    try {
      const response = await axiosInstance.put(
        `${API_URL}/${roomId}/update`,
        roomData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Vô hiệu hóa phòng
  deactivateRoom: async (roomId) => {
    try {
      const response = await axiosInstance.patch(
        `${API_URL}/${roomId}/deactivate`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Khôi phục phòng
  reactivateRoom: async (roomId) => {
    try {
      const response = await axiosInstance.patch(
        `${API_URL}/${roomId}/reactivate`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tìm kiếm phòng
  searchRooms: async (searchParams) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/search`, {
        params: searchParams,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload ảnh phòng
  uploadRoomImages: async (roomId, formData) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/${roomId}/upload-images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
