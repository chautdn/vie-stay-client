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
    console.log("🔄 Initializing auth from localStorage...");
    set({ isCheckingAuth: true });

    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      console.log("Debug localStorage:", {
        token: token ? "exists" : "not found",
        tokenLength: token?.length || 0,
        user: userData ? "exists" : "not found",
      });

      if (token && userData) {
        const user = JSON.parse(userData);
        console.log("✅ Auth data found in localStorage:", {
          user: user.email,
          role: user.role,
          tokenPreview: token.substring(0, 20) + "...",
        });

        // Set auth state immediately without validation
        // This prevents the login loop issue
        set({
          token,
          user,
          isAuthenticated: true,
          isCheckingAuth: false,
          error: null,
        });

        // Optional: Validate token in background (don't wait for it)
        axiosInstance
          .get("/user/profile")
          .then((response) => {
            console.log("✅ Background token validation successful");
            // Token is valid, update user data if needed
            const freshUser = response.data.data.user;
            set({ user: freshUser });
          })
          .catch((error) => {
            console.warn(
              "⚠️ Background token validation failed:",
              error.response?.status
            );
            // Only clear auth if it's a 401 (unauthorized)
            if (error.response?.status === 401) {
              console.log("🔄 Token expired, clearing auth...");
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              set({
                isAuthenticated: false,
                user: null,
                token: null,
                error: "Session expired. Please login again.",
              });
            }
          });
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

  // Fixed login function in authStore.js
  // Add this to your Zustand store after the login function

  // In your useAuthStore, add this to the login function after successful login:
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

      // 🔥 NEW: Dispatch event to notify React Context
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

  // And update the googleLogin function similarly:
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

      // 🔥 NEW: Dispatch event to notify React Context
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

  // And update the logout function:
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

    // 🔥 NEW: Dispatch event to notify React Context
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

  // Helper function to refresh user data
  refreshUser: async () => {
    try {
      const response = await axiosInstance.get("/user/profile");
      const userData = response.data.data.user;

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // Update store
      set({ user: userData });

      return userData;
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      throw error;
    }
  },
}));
