import { Route, Routes } from "react-router-dom";

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
import Navbar from "./pages/Navbar/Navbar";
import Profile from "./pages/ProfilePage/Profile";
import Footer from "./pages/Navbar/Footer"; // ✅ THÊM DÒNG NÀY
import ChangePassword from "./pages/ProfilePage/ChangePassword";

function App() {
  return (
    <>
      {/* Navbar hiển thị trên mọi trang */}
      <Navbar />

      {/* Routes hiển thị phần chính */}
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="*" element={<LoginPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/rooms" element={<Room />} />
          <Route path="/detail/:id" element={<RoomDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Routes>

      {/* ✅ Footer ở sau Routes để luôn hiển thị */}
      <Footer />
    </>
  );
}

export default App;
