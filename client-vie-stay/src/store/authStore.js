import { create } from "zustand";
import axiosInstance from "../utils/AxiosInstance";
import { BASE_URL } from "../utils/Constant";

const API_URL = "/user";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isCheckingAuth: true,
  message: null,

  // Initialize auth state from localStorage (chỉ kiểm tra token)
  initializeAuth: async () => {
  set({ isCheckingAuth: true, user: null }); // Explicitly set user to null
  try {
    const token = localStorage.getItem("token");
    if (token) {
      set({
        token,
        isAuthenticated: true,
        error: null,
      });
      // Don't set isCheckingAuth to false until getMe completes
      await get().getMe();
      set({ isCheckingAuth: false }); // Set after getMe completes
    } else {
      console.log("❌ No token found in localStorage");
      set({
        isCheckingAuth: false,
        isAuthenticated: false,
        user: null,
        token: null,
      });
    }
  } catch (error) {
    console.error("❌ Error initializing auth:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      isCheckingAuth: false,
      isAuthenticated: false,
      user: null,
      token: null,
      error: "Failed to initialize authentication",
    });
  }
},

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`${API_URL}/signup`, {
        name,
        email,
        password,
      });
      set({
        isAuthenticated: false,
        isLoading: false,
        message: "Signup successful. Please verify your email.",
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (email, otp) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`${API_URL}/verify-email`, {
        email,
        otp,
      });
      set({
        isAuthenticated: true,
        isLoading: false,
        message: "Email verified successfully",
      });
      await get().getMe(); // Cập nhật thông tin user sau khi verify
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  resendVerification: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axiosInstance.post(
        `${API_URL}/resend-verification`,
        {
          email,
        }
      );
      set({
        isLoading: false,
        message: "Verification code resent successfully",
      });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to resend verification code",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      console.log("🔐 [AUTH STORE] Attempting login for:", email);
      const response = await axiosInstance.post(`${API_URL}/login`, {
        email,
        password,
      });
      console.log("✅ [AUTH STORE] Login response received:", response.data);

      const token = response.data.token;
      if (!token) {
        throw new Error("No token received from server");
      }

      // Lưu token vào localStorage và Zustand
      localStorage.setItem("token", token);
      set({
        token,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      });

      // Gọi getMe để lấy thông tin user
      await get().getMe();

      // Dispatch event
      window.dispatchEvent(
        new CustomEvent("userLoggedIn", {
          detail: { user: get().user, token },
        })
      );

      console.log("✅ [AUTH STORE] Login successful");
      return response.data;
    } catch (error) {
      console.error("❌ [AUTH STORE] Login failed:", error);
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  getMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`${API_URL}/me`);
      const userData = response.data.data.user;
      if (!userData) {
        throw new Error("No user data received from server");
      }

      // Lưu vào localStorage (tùy chọn)
      localStorage.setItem("user", JSON.stringify(userData));

      // Cập nhật Zustand state
      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log("✅ [AUTH STORE] User data fetched:", userData.email);
      return userData;
    } catch (error) {
      console.error("❌ [AUTH STORE] Error fetching user profile:", error);
      set({
        error: error.response?.data?.message || "Error fetching user profile",
        isLoading: false,
        user: null,
      });
      localStorage.removeItem("user");
      throw error;
    }
  },

  googleLogin: async (credential) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`${API_URL}/google-login`, {
        credential,
      });
      const token = response.data.token;
      if (!token) {
        throw new Error("No token received from server");
      }

      // Lưu token vào localStorage và Zustand
      localStorage.setItem("token", token);
      set({
        token,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      });

      // Gọi getMe để lấy thông tin user
      await get().getMe();

      // Dispatch event
      window.dispatchEvent(
        new CustomEvent("userLoggedIn", {
          detail: { user: get().user, token },
        })
      );

      console.log("✅ [AUTH STORE] Google login successful");
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in with Google",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    console.log("🚪 Logging out...");
    set({ isLoading: true });
    try {
      await axiosInstance.post(`${API_URL}/logout`);
    } catch (error) {
      console.error("Backend logout error:", error);
    }

    // Xóa localStorage và Zustand state
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      message: null,
    });

    window.dispatchEvent(new CustomEvent("userLogout"));
    console.log("✅ Logout completed");
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({
        message: response.data.message,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch(
        `${API_URL}/reset-password/${token}`,
        {
          password,
        }
      );
      set({
        message: response.data.message,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  clearMessage: () => set({ message: null }),

  // Manual setter for user data (vẫn giữ nhưng chỉ sử dụng khi cần)
  setUser: (userData) => {
    console.log("🔄 Updating user data:", userData);
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData });
  },

  // Update wallet balance
  updateWalletBalance: (newBalance) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        wallet: {
          ...currentUser.wallet,
          balance: newBalance,
        },
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      set({ user: updatedUser });
      console.log("💰 Wallet balance updated:", newBalance);
    }
  },

  // Sửa refreshUser để sử dụng getMe
  refreshUser: async () => {
    await get().getMe();
  },
}));
