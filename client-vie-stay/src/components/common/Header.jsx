import React, { useState } from "react";
import {
  Heart,
  Folder,
  ChevronDown,
  User,
  Pencil,
  UserCog,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import LogoutButton from "./LogOutButton";
import axiosInstance from "../utils/AxiosInstance";

// Login Prompt Modal
const LoginPromptModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">
        Yêu cầu đăng nhập
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Bạn cần đăng nhập để đăng tin. Vui lòng đăng nhập trước khi tiếp tục.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            onClose();
            window.location.href = "/login";
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
        >
          Đăng nhập
        </button>
        <button
          onClick={onClose}
          className="border px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          Hủy
        </button>
      </div>
    </div>
  </div>
);

// Top-Up Modal
const TopUpModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const amounts = [2000, 100000, 500000, 1000000, 5000000];

  const handleTopUp = async (amount) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const res = await axiosInstance.post(
        "/api/payment/create-topup-session",
        { amount }
      );
      const data = res.data;
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert("Không thể tạo phiên thanh toán.");
      }
    } catch (err) {
      console.error("Top-up error:", err);
      alert("Đã xảy ra lỗi khi tạo thanh toán.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Nạp tiền vào ví
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {amounts.map((amt) => (
            <button
              key={amt}
              onClick={() => handleTopUp(amt)}
              className="py-3 rounded-md border hover:bg-orange-50 text-sm font-medium"
            >
              {amt.toLocaleString("vi-VN")}₫
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-2 text-sm text-gray-600 hover:underline"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleNavigate = (path) => {
    setShowDropdown(false);
    navigate(path);
  };

  const isOwner = () => {
    return user?.role?.includes("landlord");
  };

  const handlePostClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      navigate("/create-post");
    }
  };

  return (
    <div className="w-full shadow-sm border-b bg-white relative z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-3">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center text-xl font-extrabold">
            <span className="text-blue-600">VIE</span>
            <span className="text-orange-500">STAY</span>
          </div>
          <span className="text-xs text-gray-500 hidden sm:inline ml-1">
            Kênh thông tin phòng trọ số 1 Việt Nam
          </span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4 text-sm text-gray-700 relative">
          {/* Balance Display */}
          {isAuthenticated && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-700 font-medium">
                Số dư: {(user?.wallet?.balance || 0).toLocaleString("vi-VN")}₫
              </span>
              <button
                onClick={() => setShowTopUpModal(true)}
                className="text-orange-500 hover:text-orange-600"
              >
                +
              </button>
            </div>
          )}

          {/* Saved Posts */}
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-orange-600"
            onClick={() => handleNavigate("/saved")}
          >
            <Heart size={16} /> Tin đã lưu
          </div>

          {/* Authenticated User Options */}
          {isAuthenticated ? (
            <>
              {/* My Posts - Available to all authenticated users */}
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-orange-600"
                onClick={() => handleNavigate("/posts")}
              >
                <FileText size={16} /> Tin của tôi
              </div>

              {/* Owner Management - Only for owners */}
              {isOwner() && (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-orange-600"
                  onClick={() => handleNavigate("/owner")}
                >
                  <Folder size={16} /> Quản lý chủ nhà
                </div>
              )}

              <div
                className="flex items-center gap-1 cursor-pointer hover:text-orange-600"
                onClick={toggleDropdown}
              >
                <User size={16} />
                <span>{user?.name || "Tài khoản"}</span>
                <ChevronDown size={14} />
              </div>
            </>
          ) : (
            <>
              <button
                className="px-4 py-1.5 text-orange-600 hover:text-orange-700 font-medium"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </button>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-full font-semibold"
                onClick={() => navigate("/signup")}
              >
                Đăng ký
              </button>
            </>
          )}

          {/* Post Ad Button */}
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-full flex items-center gap-1 font-semibold"
            onClick={handlePostClick}
          >
            <Pencil size={14} /> Đăng tin
          </button>

          {/* Dropdown for Authenticated Users */}
          {showDropdown && isAuthenticated && (
            <div className="absolute right-0 top-14 bg-white rounded-2xl shadow-2xl w-80 border border-gray-200 z-50 animate-fadeIn">
              <div className="flex items-center gap-4 p-4 border-b">
                <img
                  src={
                    user.profileImage
                      ? `http://localhost:8080${user.profileImage}`
                      : "https://via.placeholder.com/80"
                  }
                  alt="avatar"
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-base text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.phoneNumber || "Chưa có số điện thoại"}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    {user.role?.includes("landlord") ? "Chủ nhà" : "Người dùng"}
                  </p>
                </div>
              </div>
              <div className="p-4 space-y-2 text-sm text-gray-700">
                <button
                  onClick={() => handleNavigate("/posts")}
                  className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-orange-50 transition"
                >
                  <FileText size={18} /> <span>Quản lý tin đăng</span>
                </button>
                <button
                  onClick={() => handleNavigate("/profile")}
                  className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-orange-50 transition"
                >
                  <UserCog size={18} /> <span>Quản lý tài khoản</span>
                </button>
                <LogoutButton className="w-full p-2 rounded-lg hover:bg-red-50 text-red-600 transition text-sm" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showLoginModal && (
        <LoginPromptModal onClose={() => setShowLoginModal(false)} />
      )}
      {showTopUpModal && (
        <TopUpModal onClose={() => setShowTopUpModal(false)} />
      )}
    </div>
  );
};

export default Navbar;