import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/authStore"; // ✅ THÊM: Import AuthStore

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import OwnerLayout from "./layouts/OwnerLayout";
import OwnerRoute from "./components/common/OwnerRoute"; // ✅ THÊM: Import OwnerRoute

// Import pages
import SignUpPage from "./pages/AuthPage/SignUpPage";
import LoginPage from "./pages/AuthPage/LoginPage";
import EmailVerificationPage from "./pages/AuthPage/EmailVerificationPage";
import ForgotPasswordPage from "./pages/AuthPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/AuthPage/ResetPasswordPage";
import HomePage from "./pages/HomePage/HomePage";
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

function App() {
  // ✅ THÊM: Initialize auth
  const { initializeAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // ✅ THÊM: Loading screen
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
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/rooms" element={<Room />} />
        <Route path="/detail/:id" element={<RoomDetail/>} />
        
        <Route path="/agreement/confirm/:token" element={<AgreementConfirmationPage />} />
        <Route path="/tenant/payment/:confirmationId" element={<PaymentPage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentSuccess />} />
        <Route path="/payment/vnpay/return" element={<PaymentSuccess />} />
      </Route>

      {/* Owner Routes - CHỈ LANDLORD MỚI VÀO ĐƯỢC */}
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

      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;
