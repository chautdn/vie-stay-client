import { Routes, Route } from "react-router-dom"

// Layouts
import AuthLayout from "./layouts/AuthLayout"
import MainLayout from "./layouts/MainLayout"
import OwnerLayout from "./layouts/OwnerLayout"

// Auth Pages
import SignUpPage from "./pages/AuthPage/SignUpPage"
import LoginPage from "./pages/AuthPage/LoginPage"
import EmailVerificationPage from "./pages/AuthPage/EmailVerificationPage"
import ForgotPasswordPage from "./pages/AuthPage/ForgotPasswordPage"
import ResetPasswordPage from "./pages/AuthPage/ResetPasswordPage"

// Main Pages
import HomePage from "./pages/HomePage/HomePage"

// Owner Pages
import ListAccommodations from "./pages/OwnerPage/ListAccommodations"
import CreateAccommodation from "./pages/OwnerPage/CreateAccommodation"

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* Main layout routes */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* Owner routes */}
      <Route path="/owner" element={<OwnerLayout />}>
        <Route index element={<ListAccommodations />} />
        <Route path="accommodations" element={<ListAccommodations />} />
        <Route path="create" element={<CreateAccommodation />} />
        <Route path="edit/:id" element={<CreateAccommodation />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  )
}

export default App
