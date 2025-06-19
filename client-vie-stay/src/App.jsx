import { Route, Routes, useLocation } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import SignUpPage from "./pages/AuthPage/SignUpPage";
import LoginPage from "./pages/AuthPage/LoginPage";
import EmailVerificationPage from "./pages/AuthPage/EmailVerificationPage";
import ForgotPasswordPage from "./pages/AuthPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/AuthPage/ResetPasswordPage";

import HomePage from "./pages/HomePage/HomePage";
import Room from "./pages/RoomPage/Room";
import RoomDetail from "./pages/RoomPage/RoomDetail";
import Profile from "./pages/ProfilePage/Profile";
import ChangePassword from "./pages/ProfilePage/ChangePassword";

import Navbar from "./pages/Navbar/Navbar";
import Footer from "./pages/Navbar/Footer";

import { AuthProvider } from "./pages/contexts/AuthContext";

function App() {
  const location = useLocation();

  // Những route không cần hiển thị Navbar/Footer (trang auth)
  const isAuthRoute = location.pathname.startsWith("/login") ||
                      location.pathname.startsWith("/signup") ||
                      location.pathname.startsWith("/forgot-password") ||
                      location.pathname.startsWith("/reset-password") ||
                      location.pathname.startsWith("/verify-email");

  return (
    <AuthProvider>
      {!isAuthRoute && <Navbar />}

      <Routes>
        {/* Auth pages */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="*" element={<LoginPage />} />
        </Route>

        {/* Main pages */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/rooms" element={<Room />} />
          <Route path="/detail/:id" element={<RoomDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Routes>

      {!isAuthRoute && <Footer />}
    </AuthProvider>
  );
}

export default App;
