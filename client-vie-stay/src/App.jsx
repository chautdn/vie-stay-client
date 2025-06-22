import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/authStore";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import OwnerLayout from "./layouts/OwnerLayout";

// Import Auth pages
import SignUpPage from "./pages/AuthPage/SignUpPage";
import LoginPage from "./pages/AuthPage/LoginPage";
import EmailVerificationPage from "./pages/AuthPage/EmailVerificationPage";
import ForgotPasswordPage from "./pages/AuthPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/AuthPage/ResetPasswordPage";

// Import Main pages
import HomePage from "./pages/HomePage/HomePage";
import Room from "./pages/RoomPage/Room";
import RoomDetail from "./pages/RoomPage/RoomDetail";
import Profile from "./pages/ProfilePage/Profile";
import ChangePassword from "./pages/ProfilePage/ChangePassword";

// Import Owner pages
import OwnerDashboard from "./components/ownerPageComponents/Dashboard";
import RoomManagement from "./pages/OwnerPage/RoomManagement";
import RentalRequestManagement from "./pages/OwnerPage/RentalRequestManagement";
import AccommodationManagement from "./pages/OwnerPage/AccommodationManagement";

// Import Tenant Agreement Pages
import AgreementConfirmationPage from "./pages/TenantPage/AgreementPage/AgreementConfirmationPage";
import PaymentPage from "./pages/TenantPage/AgreementPage/PaymentPage";
import PaymentSuccess from "./pages/TenantPage/AgreementPage/PaymentSuccess";

// Import ProtectedRoute
import ProtectedRoute from "./components/authRoutes/ProtectedRoute";
import { AuthProvider } from "./pages/contexts/AuthContext";

function App() {
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and validate it
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-80 z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Routes>
        {/* Public Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* Public Pages (accessible to everyone) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/rooms" element={<Room />} />
          <Route path="/detail/:id" element={<RoomDetail />} />
        </Route>

        {/* Tenant-specific Routes */}
        <Route element={<ProtectedRoute allowedRoles={["tenant"]} />}>
          <Route element={<MainLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/change-password" element={<ChangePassword />} />
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
          </Route>
        </Route>

        {/* Landlord-specific Routes */}
        <Route element={<ProtectedRoute allowedRoles={["landlord"]} />}>
          <Route element={<OwnerLayout />}>
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route
              path="/owner/rooms/:accommodationId"
              element={<RoomManagement />}
            />
            <Route
              path="/owner/rental-requests"
              element={<RentalRequestManagement />}
            />
            <Route
              path="/owner/accommodations"
              element={<AccommodationManagement />}
            />
            <Route path="/owner/create" element={<AccommodationManagement />} />
            <Route path="/owner/edit/:id" element={<AccommodationManagement />} />
            <Route
              path="/owner/tenants"
              element={<div className="p-6">Tenants Page</div>}
            />
            <Route
              path="/owner/reports"
              element={<div className="p-6">Reports Page</div>}
            />
            <Route
              path="/owner/settings"
              element={<div className="p-6">Settings Page</div>}
            />
          </Route>
        </Route>

        {/* Admin-specific Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<OwnerLayout />}>
            <Route
              path="/admin/dashboard"
              element={<div className="p-6">Admin Dashboard</div>}
            />
            <Route
              path="/admin/users"
              element={<div className="p-6">User Management</div>}
            />
            <Route
              path="/admin/accommodations"
              element={<div className="p-6">Accommodation Approval</div>}
            />
          </Route>
        </Route>

        {/* Multi-role Routes (accessible to both landlord and tenant) */}
        <Route element={<ProtectedRoute allowedRoles={["landlord", "tenant"]} />}>
          <Route element={<MainLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;