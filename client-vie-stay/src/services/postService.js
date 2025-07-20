import axiosInstance from "../utils/AxiosInstance";

const API_URL = "api/posts";

export const postService = {
  // Lấy tất cả posts
  getAllPosts: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_URL, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy posts nổi bật (featured)
  getFeaturedPosts: async (params = {}) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/featured`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy posts mới nhất
  getNewestPosts: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/newest`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy post theo ID
  getPostById: async (postId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${postId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tìm kiếm posts
  searchPosts: async (searchParams) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/search`, {
        params: searchParams,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo post mới
  createPost: async (postData) => {
    try {
      const response = await axiosInstance.post(API_URL, postData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật post
  updatePost: async (postId, postData) => {
    try {
      const response = await axiosInstance.put(
        `${API_URL}/${postId}`,
        postData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa post
  deletePost: async (postId) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/${postId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy posts của user hiện tại
  getUserPosts: async (params = {}) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/user/me`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Nâng cấp post lên featured
  upgradeToFeatured: async (postId, upgradeData) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/${postId}/upgrade`,
        upgradeData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Gia hạn featured post
  extendFeatured: async (postId, extensionData) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/${postId}/extend`,
        extensionData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tăng số lượt liên hệ
  incrementContactCount: async (postId) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/${postId}/contact`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
