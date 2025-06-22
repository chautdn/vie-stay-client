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

  initializeAuth: () => {
    try {
      const token = sessionStorage.getItem("token");
      const storedUser = sessionStorage.getItem("user");

      if (
        token &&
        storedUser &&
        storedUser !== "undefined" &&
        storedUser !== "null"
      ) {
        try {
          const user = JSON.parse(storedUser);
          if (user && typeof user === "object" && user._id) {
            set({
              user,
              token,
              isAuthenticated: true,
              isCheckingAuth: false,
            });
            return;
          }
        } catch (parseError) {
          console.error("Error parsing stored user:", parseError);
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
        }
      }

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    } catch (error) {
      console.error("Error initializing auth:", error);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`${BASE_URL}/user/signup`, {
        name,
        email,
        password,
      });
      set({
        user: response.data.data.user,
        isAuthenticated: false, // User not verified yet
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
      const response = await axiosInstance.post(`${BASE_URL}/user/login`, {
        email,
        password,
      });

      const userData = response.data.data.user;
      const token = response.data.token;

      // Store both token AND user data in sessionStorage
      if (token) {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(userData));
      }

      // Update state
      set({
        isAuthenticated: true,
        user: userData,
        error: null,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  googleLogin: async (credential) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/user/google-login`,
        {
          credential,
        }
      );

      const userData = response.data.data.user;
      const token = response.data.token;

      // Store both token AND user data in sessionStorage
      if (token) {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(userData));
      }

      // Update state
      set({
        isAuthenticated: true,
        user: userData,
        error: null,
        isLoading: false,
      });

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
    set({ isLoading: true });
    try {
      // Call backend logout endpoint
      await axiosInstance.post(`${API_URL}/logout`);

      // Clear all authentication data
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Reset store state
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });

      console.log("✅ Logout successful");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);

      // Even if backend fails, clear frontend data
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });

      // Don't throw error, logout should always succeed on frontend
      return { success: true };
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/user/forgot-password`,
        {
          email,
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
        `${BASE_URL}/user/reset-password/${token}`,
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
}));
