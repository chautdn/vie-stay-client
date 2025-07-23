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

  // Initialize auth state from localStorage
  initializeAuth: () => {
    set({ isCheckingAuth: true });

    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        const user = JSON.parse(userData);

        // Set auth state immediately without validation
        set({
          token,
          user,
          isAuthenticated: true,
          isCheckingAuth: false,
          error: null,
        });

        // Note: Removed the background token validation since /user/profile doesn't exist
        // If you want to validate tokens, create the appropriate endpoint first
      } else {
        console.log("❌ No valid auth data found in localStorage");
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
      const response = await axiosInstance.post(`/user/signup`, {
        name,
        email,
        password,
      });
      set({
        user: response.data.data.user,
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
      const response = await axiosInstance.post(`/user/verify-email`, {
        email,
        otp,
      });
      set({
        isAuthenticated: true,
        isLoading: false,
        message: "Email verified successfully",
      });
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
      const response = await axiosInstance.post(`/user/resend-verification`, {
        email,
      });
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

      const response = await axiosInstance.post(`/user/login`, {
        email,
        password,
      });

      console.log("✅ [AUTH STORE] Login response received:", response.data);

      const userData = response.data.data?.user || response.data.user;
      const token = response.data.token;

      if (!token || !userData) {
        throw new Error("No token or user data received from server");
      }

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update Zustand state
      set({
        isAuthenticated: true,
        user: userData,
        token: token,
        error: null,
        isLoading: false,
      });

      // Dispatch event to notify React Context
      window.dispatchEvent(
        new CustomEvent("userLoggedIn", {
          detail: { user: userData, token: token },
        })
      );

      console.log("✅ [AUTH STORE] Login successful - user:", userData.email);

      return response.data;
    } catch (error) {
      console.error("❌ [AUTH STORE] Login failed:", error);
      set({
        error:
          error.response?.data?.message || error.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  googleLogin: async (credential) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/user/google-login`, {
        credential,
      });

      const userData = response.data.data.user;
      const token = response.data.token;

      if (!token || !userData) {
        throw new Error("Invalid response: missing token or user data");
      }

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update Zustand state
      set({
        isAuthenticated: true,
        user: userData,
        token: token,
        error: null,
        isLoading: false,
      });

      // Dispatch event to notify React Context
      window.dispatchEvent(
        new CustomEvent("userLoggedIn", {
          detail: { user: userData, token: token },
        })
      );

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
      await axiosInstance.post(`/user/logout`);
    } catch (error) {
      console.error("Backend logout error:", error);
    }

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Update Zustand state
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      message: null,
    });

    // Dispatch event to notify React Context
    window.dispatchEvent(new CustomEvent("userLogout"));

    console.log("✅ Logout completed");
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/user/forgot-password`, {
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
        `/user/reset-password/${token}`,
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

  // NEW: Manual setter for user data
  setUser: (userData) => {
    console.log("🔄 Updating user data:", userData);

    // Update localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    // Update store
    set({ user: userData });
  },

  // NEW: Update wallet balance specifically
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

      // Update both localStorage and store
      localStorage.setItem("user", JSON.stringify(updatedUser));
      set({ user: updatedUser });

      console.log("💰 Wallet balance updated:", newBalance);
    }
  },

  // FIXED: Remove the problematic refreshUser function for now
  // You can add this back when you create the appropriate backend endpoint
  refreshUser: async () => {
    console.log(
      "⚠️ refreshUser called but /user/profile endpoint doesn't exist"
    );
    console.log(
      "💡 Consider creating a user profile endpoint or removing this call"
    );

    // For now, just return the current user data
    const currentUser = get().user;
    return currentUser;
  },
}));
