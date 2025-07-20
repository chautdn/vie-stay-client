import { create } from "zustand";
import { postService } from "../services/postService";
import useErrorStore from "./errorStore";

export const usePostStore = create((set, get) => ({
  posts: [],
  selectedPost: null,
  isLoading: false,
  searchResults: [],
  featuredPosts: [],
  newestPosts: [],

  // Lấy tất cả posts
  getAllPosts: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await postService.getAllPosts(params);

      let postsData = [];

      // Xử lý response structure
      if (response?.status === "success" && response?.data?.posts) {
        postsData = response.data.posts;
      } else if (response?.posts) {
        postsData = response.posts;
      } else if (Array.isArray(response)) {
        postsData = response;
      } else if (response?.data?.posts) {
        postsData = response.data.posts;
      }

      set({
        posts: Array.isArray(postsData) ? postsData : [],
        isLoading: false,
      });

      return postsData;
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            error.message ||
            "Lỗi khi tải danh sách tin đăng"
        );
      set({ isLoading: false, posts: [] });
      throw error;
    }
  },

  // Lấy posts nổi bật (featured)
  getFeaturedPosts: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await postService.getFeaturedPosts(params);

      let featuredData = [];
      if (response?.posts) {
        featuredData = response.posts;
      } else if (Array.isArray(response)) {
        featuredData = response;
      }

      set({
        featuredPosts: Array.isArray(featuredData) ? featuredData : [],
        isLoading: false,
      });

      return featuredData;
    } catch (error) {
      console.error("❌ Error fetching featured posts:", error);
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            error.message ||
            "Lỗi khi tải tin đăng nổi bật"
        );
      set({ isLoading: false, featuredPosts: [] });
      throw error;
    }
  },

  // Lấy posts mới nhất
  getNewestPosts: async () => {
    set({ isLoading: true });
    try {
      const response = await postService.getNewestPosts();

      let newestData = [];
      if (response?.posts) {
        newestData = response.posts;
      } else if (Array.isArray(response)) {
        newestData = response;
      }

      set({
        newestPosts: Array.isArray(newestData) ? newestData : [],
        isLoading: false,
      });

      return newestData;
    } catch (error) {
      console.error("❌ Error fetching newest posts:", error);
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            error.message ||
            "Lỗi khi tải tin đăng mới nhất"
        );
      set({ isLoading: false, newestPosts: [] });
      throw error;
    }
  },

  // Lấy chi tiết post
  getPostById: async (postId) => {
    set({ isLoading: true });
    try {
      const response = await postService.getPostById(postId);
      const post = response.post || response.data || response;

      set({
        selectedPost: post,
        isLoading: false,
      });

      return response;
    } catch (error) {
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            error.message ||
            "Lỗi khi tải chi tiết tin đăng"
        );
      set({ isLoading: false });
      throw error;
    }
  },

  // Tìm kiếm posts
  searchPosts: async (searchParams) => {
    set({ isLoading: true });
    try {
      const cleanedParams = {};

      Object.keys(searchParams).forEach((key) => {
        const value = searchParams[key];
        if (value !== null && value !== undefined && value !== "") {
          cleanedParams[key] = value;
        }
      });

      const response = await postService.searchPosts(cleanedParams);

      let searchResults = [];
      let totalResults = 0;

      if (response?.status === "success" && response?.data) {
        searchResults = response.data.posts || [];
        totalResults = response.results || searchResults.length;
      } else if (response?.posts) {
        searchResults = response.posts;
        totalResults = response.results || searchResults.length;
      } else if (Array.isArray(response)) {
        searchResults = response;
        totalResults = response.length;
      }

      set({
        searchResults: Array.isArray(searchResults) ? searchResults : [],
        isLoading: false,
      });

      return {
        ...response,
        results: totalResults,
        data: { posts: searchResults },
      };
    } catch (error) {
      console.error("❌ Post search error:", error);
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            error.message ||
            "Lỗi khi tìm kiếm tin đăng"
        );
      set({ isLoading: false, searchResults: [] });
      throw error;
    }
  },

  // Tạo post mới
  createPost: async (postData) => {
    set({ isLoading: true });
    try {
      const response = await postService.createPost(postData);

      const newPost = response.post || response.data || response;
      const currentPosts = get().posts;

      set({
        posts: [newPost, ...currentPosts],
        isLoading: false,
      });

      return response;
    } catch (error) {
      useErrorStore
        .getState()
        .setError(
          error.response?.data?.message ||
            error.message ||
            "Lỗi khi tạo tin đăng mới"
        );
      set({ isLoading: false });
      throw error;
    }
  },

  // Clear selected post
  clearSelectedPost: () => set({ selectedPost: null }),

  // Clear search results
  clearSearchResults: () => set({ searchResults: [] }),

  // Clear all data
  clearAll: () =>
    set({
      posts: [],
      selectedPost: null,
      searchResults: [],
      featuredPosts: [],
      newestPosts: [],
    }),
}));
