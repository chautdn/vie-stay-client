import { create } from "zustand";
import axiosInstance from "../components/utils/AxiosInstance";
import useErrorStore from "./errorStore";
const API_URL = "/user";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ isCheckingAuth: false, isAuthenticated: false });
        return;
      }

      const response = await axiosInstance.get(`${API_URL}/check-auth`);

      set({
        isAuthenticated: true,
        user: response.data.data.user,
        isCheckingAuth: false,
      });
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem("token");
      set({
        isAuthenticated: false,
        user: null,
        isCheckingAuth: false,
      });
    }
  },

  signup: async (name, email, password, phoneNumber) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`${API_URL}/signup`, {
        name,
        email,
        password,
        phoneNumber,
      });

      const user = response.data.data?.user || null;

      set({
        user: user,
        isAuthenticated: false, // Still need email verification
        isLoading: false,
        message:
          response.data.message ||
          "Signup successful. Please verify your email.",
      });

      return response.data;
    } catch (error) {
      useErrorStore.getState().setError(error.displayMessage);
      set({ isLoading: false });
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
      const response = await axiosInstance.post(`${API_URL}/login`, {
        email: email.toLowerCase(), // Normalize email on frontend too
        password,
      });

      const { user, token } = response.data.data;

      if (user && token) {
        // Store token
        localStorage.setItem("token", token);

        // Update state
        set({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null,
        });

        return { success: true, user };
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.displayMessage || "Login failed";
      useErrorStore.getState().setError(errorMessage);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  // Google login
  googleLogin: async (credential) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`${API_URL}/google-login`, {
        credential,
      });

      // Store user data and token
      set({
        isAuthenticated: true,
        user: response.data.data.user,
        error: null,
        isLoading: false,
      });

      if (response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
      }

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
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post(`${API_URL}/logout`);
      // Clear token from localStorage
      localStorage.removeItem("token");
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging out",
        isLoading: false,
      });
      throw error;
    }
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
}));
