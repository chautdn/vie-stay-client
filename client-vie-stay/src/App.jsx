import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import OwnerLayout from "./layouts/OwnerLayout";
import OwnerRoute from "./components/common/OwnerRoute";
import TenantLayout from "./layouts/TenantLayout";
import TenantRoute from "./components/common/TenantRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/common/AdminRoute";

import { NotificationProvider } from "./components/common/NotificationSystem";

// Import Auth pages
import SignUpPage from "./pages/AuthPage/SignUpPage";
import LoginPage from "./pages/AuthPage/LoginPage";
import EmailVerificationPage from "./pages/AuthPage/EmailVerificationPage";
import ForgotPasswordPage from "./pages/AuthPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/AuthPage/ResetPasswordPage";

// Import Public/Home pages
import Home from "./pages/HomePage/Public/Home";
import HomePage from "./pages/HomePage/Public/HomePage";
import List from "./pages/HomePage/Public/List";
import SearchPage from "./pages/HomePage/Public/SearchPage";
import SavedPosts from "./pages/HomePage/Public/SavedPosts";
import MyRentalRequest from "./pages/HomePage/Public/MyRentalRequest";
import ServicePrice from "./pages/HomePage/Public/ServicePrice";

// Import Room pages
import Room from "./pages/HomePage/RoomPage/Room";
import RoomDetail from "./pages/HomePage/RoomPage/RoomDetail";
import PostDetail from "./pages/HomePage/RoomPage/PostDetail";

// Import Owner pages
import OwnerDashboard from "./components/ownerPageComponents/Dashboard";
import RoomManagement from "./pages/OwnerPage/RoomManagement";
import RentalRequestManagement from "./pages/OwnerPage/RentalRequestManagement";
import CoTenantsRequest from "./pages/OwnerPage/CoTenantsRequest";
import AccommodationManagement from "./pages/OwnerPage/AccommodationManagement";
import OwnerPostManagement from "./pages/OwnerPage/OwnerPostManagement";
import PendingWithdrawalsPage from "./pages/OwnerPage/PendingWithdrawalsPage";

// Import Tenant pages
import TenantDashboard from "./pages/TenantPage/TenantDashboard";
import AgreementConfirmationPage from "./pages/TenantPage/AgreementPage/AgreementConfirmationPage";
import PaymentPage from "./pages/TenantPage/AgreementPage/PaymentPage";
import PaymentSuccess from "./pages/TenantPage/AgreementPage/PaymentSuccess";
import WithdrawalRequestPage from "./pages/TenantPage/WithdrawalRequestPage";
import WithdrawalHistoryPage from "./pages/TenantPage/WithdrawalHistoryPage";

// Import Transaction pages
import TransactionHistoryPage from "./pages/TransactionPage/TransactionHistoryPage";

// Import Post Management pages
import CreatePostPage from "./pages/PostPage/CreatePostPage";
import PostManagementPage from "./pages/PostPage/PostManagementPage";

// Import Admin pages
import AdminDashboard from "./pages/AdminPage/AdminDashboard";
import UserManagement from "./pages/AdminPage/UserManagement";
import RevenueReports from "./pages/AdminPage/RevenueReports";
import ReportManagement from "./components/admin/ReportManagement";

// Import Profile pages
import Profile from "./pages/ProfilePage/Profile";
import ChangePassword from "./pages/ProfilePage/ChangePassword";

// Import TopUp pages
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
    <NotificationProvider>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* Main Layout Routes */}
        <Route element={<MainLayout />}>
          {/* Home nested routes */}
          <Route path="/" element={<Home />}>
            <Route index element={<HomePage />} />
            <Route path="saved" element={<SavedPosts />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="list" element={<List />} />
            <Route path="bang-gia-dich-vu" element={<ServicePrice />} />
            <Route path="my-rental-requests" element={<MyRentalRequest />} />
            <Route path="profile" element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="transaction-history" element={<TransactionHistoryPage />} />
            <Route path="posts" element={<PostManagementPage />} />
            <Route path="create-post" element={<CreatePostPage />} />
            <Route path="detail/:id" element={<RoomDetail />} />
            <Route path="chi-tiet/:slug/:id" element={<RoomDetail />} />
            <Route path="tin-dang/:id" element={<PostDetail />} />
            <Route path="topup-success" element={<TopUpSuccess />} />
            <Route path="topup-cancel" element={<TopUpCancel />} />
          </Route>

          {/* Room Routes */}
          <Route path="/rooms" element={<Room />} />

          {/* Agreement and Payment Routes */}
          <Route path="/agreement/confirm/:token" element={<AgreementConfirmationPage />} />
          <Route path="/payment/:confirmationId" element={<PaymentPage />} />
          <Route path="/tenant/payment/:confirmationId" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentSuccess />} />
          <Route path="/payment/vnpay/return" element={<PaymentSuccess />} />

          {/* Withdrawal Routes */}
          <Route path="/withdrawal/request/:confirmationId" element={<WithdrawalRequestPage />} />
          <Route path="/withdrawal/history" element={<WithdrawalHistoryPage />} />
          <Route path="/withdrawal/success" element={<PaymentSuccess />} />
          <Route path="/withdrawal/failure" element={<PaymentSuccess />} />
          <Route path="/withdrawal/vnpay/return" element={<PaymentSuccess />} />

          {/* Accommodation Management */}
          <Route path="/owner/create" element={<AccommodationManagement />} />
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
            path="/owner/posts"
            element={
              <OwnerRoute>
                <OwnerPostManagement />
              </OwnerRoute>
            }
          />
          <Route
            path="/owner/withdrawals"
            element={
              <OwnerRoute>
                <PendingWithdrawalsPage />
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

        {/* Tenant Routes */}
        <Route element={<TenantLayout />}>
          <Route
            path="/tenant/dashboard"
            element={
              <TenantRoute>
                <TenantDashboard />
              </TenantRoute>
            }
          />
          <Route
            path="/tenant/documents"
            element={
              <TenantRoute>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Giấy tờ của tôi</h1>
                  <p className="text-gray-600">Tính năng đang phát triển...</p>
                </div>
              </TenantRoute>
            }
          />
          <Route
            path="/tenant/contracts"
            element={
              <TenantRoute>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Hợp đồng thuê</h1>
                  <p className="text-gray-600">Tính năng đang phát triển...</p>
                </div>
              </TenantRoute>
            }
          />
          <Route
            path="/tenant/approvals"
            element={
              <TenantRoute>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Yêu cầu phê duyệt</h1>
                  <p className="text-gray-600">Tính năng đang phát triển...</p>
                </div>
              </TenantRoute>
            }
          />
          <Route
            path="/tenant/settings"
            element={
              <TenantRoute>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt</h1>
                  <p className="text-gray-600">Tính năng đang phát triển...</p>
                </div>
              </TenantRoute>
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
          <Route
            path="/admin/report-management"
            element={
              <AdminRoute>
                <ReportManagement />
              </AdminRoute>
            }
          />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </NotificationProvider>
  );
}

export default App;