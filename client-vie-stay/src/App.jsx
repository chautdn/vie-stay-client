import { Route, Routes } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import OwnerLayout from "./layouts/OwnerLayout";

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

// Import Tenant Agreement Pages
import AgreementConfirmationPage from "./pages/TenantPage/AgreementPage/AgreementConfirmationPage";
import PaymentPage from "./pages/TenantPage/AgreementPage/PaymentPage";
import PaymentSuccess from "./pages/TenantPage/AgreementPage/PaymentSuccess";
import AccommodationManagement from "./pages/OwnerPage/AccommodationManagement";

function App() {
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
        
    
        <Route path="/agreement/confirm/:token" element={<AgreementConfirmationPage />} />
        <Route path="/tenant/payment/:confirmationId" element={<PaymentPage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentSuccess />} />
        
        {/* ✅ THÊM: VNPay return route */}
        <Route path="/payment/vnpay/return" element={<PaymentSuccess />} />
      </Route>

      {/* Owner Routes với OwnerLayout */}
      <Route element={<OwnerLayout />}>
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/rooms/:accommodationId" element={<RoomManagement />} />
        <Route path="/owner/rental-requests" element={<RentalRequestManagement />} />
        <Route path="/owner/accommodations" element={<AccommodationManagement />} />
  <Route path="/owner/create" element={<AccommodationManagement />} />
  <Route path="/owner/edit/:id" element={<AccommodationManagement />} />
  
        <Route path="/owner/tenants" element={<div className="p-6">Tenants Page</div>} />
        <Route path="/owner/reports" element={<div className="p-6">Reports Page</div>} />
        <Route path="/owner/settings" element={<div className="p-6">Settings Page</div>} />
      </Route>

      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
