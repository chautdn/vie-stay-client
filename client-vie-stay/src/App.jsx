import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import OwnerLayout from "./layouts/OwnerLayout";
import OwnerRoute from "./components/common/OwnerRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/common/AdminRoute";

// Import Auth pages
import SignUpPage from "./pages/AuthPage/SignUpPage";
import LoginPage from "./pages/AuthPage/LoginPage";
import EmailVerificationPage from "./pages/AuthPage/EmailVerificationPage";
import ForgotPasswordPage from "./pages/AuthPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/AuthPage/ResetPasswordPage";
import Home from "./pages/HomePage/Public/Home";
import HomePage from "./pages/HomePage/Public/HomePage";
import List from "./pages/HomePage/Public/List";
import SearchPage from "./pages/HomePage/Public/SearchPage";
import OwnerDashboard from "./components/ownerPageComponents/Dashboard";
import RoomManagement from "./pages/OwnerPage/RoomManagement";
import RentalRequestManagement from "./pages/OwnerPage/RentalRequestManagement";
import CoTenantsRequest from "./pages/OwnerPage/Co-tenantsRequest";
import Room from "./pages/HomePage/RoomPage/Room";
import RoomDetail from "./pages/HomePage/RoomPage/RoomDetail";

// Import Tenant Agreement Pages
import AgreementConfirmationPage from "./pages/TenantPage/AgreementPage/AgreementConfirmationPage";
import PaymentPage from "./pages/TenantPage/AgreementPage/PaymentPage";
import PaymentSuccess from "./pages/TenantPage/AgreementPage/PaymentSuccess";
import AccommodationManagement from "./pages/OwnerPage/AccommodationManagement";
import SavedPosts from "./pages/HomePage/Public/SavedPosts";
import { ServicePrice } from "./pages/HomePage/Public";

// Import Admin Pages
import AdminDashboard from "./pages/AdminPage/AdminDashboard";
import UserManagement from "./pages/AdminPage/UserManagement";
import RevenueReports from "./pages/AdminPage/RevenueReports";

// Import Profile Pages
import Profile from "./pages/ProfilePage/Profile";
import ChangePassword from "./pages/ProfilePage/ChangePassword";

// Import TopUp Pages
import TopUpSuccess from "./pages/TopUpPage/TopUpSuccess";
import TopUpCancel from "./pages/TopUpPage/TopUpCancel";

function App() {
  const { initializeAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">Đang tải...</span>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<MainLayout />}>
        {/* Home layout with nested routes */}
        <Route path="/" element={<Home />}>
          <Route index element={<HomePage />} />
          <Route path="saved" element={<SavedPosts />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="list" element={<List />} />
          <Route path="bang-gia-dich-vu" element={<ServicePrice />} />
          <Route path="*" element={<HomePage />} />
        </Route>

        {/* Direct routes không qua Home layout */}
        <Route path="/rooms" element={<Room />} />
        <Route path="/detail/:id" element={<RoomDetail />} />
        <Route path="/chi-tiet/:slug/:id" element={<RoomDetail />} />

        {/* TopUp Routes */}
        <Route path="/topup-success" element={<TopUpSuccess />} />
        <Route path="/topup-cancel" element={<TopUpCancel />} />

        {/* Tenant Agreement Routes */}
        <Route
          path="/agreement/confirm/:token"
          element={<AgreementConfirmationPage />}
        />
        <Route
          path="/tenant/payment/:confirmationId"
          element={<PaymentPage />}
        />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentSuccess />} />
        <Route path="/payment/vnpay/return" element={<PaymentSuccess />} />

        {/* Profile Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/change-password" element={<ChangePassword />} />
      </Route>

      {/* Owner Routes */}
      <Route element={<OwnerLayout />}>
        <Route
          path="/owner"
          element={
            <OwnerRoute>
              <OwnerDashboard />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/dashboard"
          element={
            <OwnerRoute>
              <OwnerDashboard />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/rooms/:accommodationId"
          element={
            <OwnerRoute>
              <RoomManagement />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/rental-requests"
          element={
            <OwnerRoute>
              <RentalRequestManagement />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/accommodations"
          element={
            <OwnerRoute>
              <AccommodationManagement />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/create"
          element={
            <OwnerRoute>
              <AccommodationManagement />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/edit/:id"
          element={
            <OwnerRoute>
              <AccommodationManagement />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/co-tenants"
          element={
            <OwnerRoute>
              <CoTenantsRequest />
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/reports"
          element={
            <OwnerRoute>
              <div className="p-6">Reports Page</div>
            </OwnerRoute>
          }
        />
        <Route
          path="/owner/settings"
          element={
            <OwnerRoute>
              <div className="p-6">Settings Page</div>
            </OwnerRoute>
          }
        />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <RevenueReports />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;
