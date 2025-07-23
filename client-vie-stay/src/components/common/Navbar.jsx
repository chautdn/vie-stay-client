import React, { useState } from "react";
import {
  Heart,
  Filter,
  Folder,
  ChevronDown,
  User,
  Pencil,
  UserCog,
  HousePlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore"; // ✅ SỬA: Import AuthStore
import LogoutButton from "./LogOutButton"; // ✅ GIỮ: Import LogoutButton

const Navbar = () => {
  // ✅ SỬA: Sử dụng AuthStore thay vì AuthContext
  const { user, isAuthenticated } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleNavigate = (path) => {
    setShowDropdown(false);
    navigate(path);
  };

  // ✅ Check user role
  const isOwner = () => {
    return user?.role?.includes('landlord') || user?.role === 'owner';
  };

  return (
    <div className="w-full shadow-sm border-b bg-white relative z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-3">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <div className="flex items-center text-xl font-extrabold">
            <span className="text-blue-600">PHONGTRO</span>
            <span className="text-orange-500">STAY</span>
            <span className="text-gray-400">.COM</span>
          </div>
          <span className="text-xs text-gray-500 hidden sm:inline ml-1">
            Kênh thông tin phòng trọ số 1 Việt Nam
          </span>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">
            <span className="text-gray-500">📍</span>
            <input
              type="text"
              placeholder="Tìm theo khu vực"
              className="ml-2 bg-transparent outline-none w-40 placeholder-gray-500"
            />
          </div>
          <button className="flex items-center border px-3 py-1.5 rounded-full text-sm hover:bg-gray-50 transition">
            <Filter size={16} className="mr-1" />
            Bộ lọc
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4 text-sm text-gray-700 relative">
          {/* ✅ SỬA: Conditional rendering based on authentication */}
          {isAuthenticated ? (
            <>
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-orange-600"
                onClick={() => handleNavigate("/saved")}
              >
                <Heart size={16} /> Tin đã lưu
              </div>

              {/* ✅ Dashboard link chỉ cho tenant (không phải owner) */}
              {isAuthenticated && !isOwner() && (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-orange-600"
                  onClick={() => handleNavigate("/tenant/dashboard")}
                >
                  <Folder size={16} /> 
                  <span>Dashboard</span>
                </div>
              )}

              {/* ✅ THÊM: Owner link riêng (nếu là owner) */}
              {isOwner() && (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-orange-600"
                  onClick={() => handleNavigate("/owner")}
                >
                  <UserCog size={16} /> 
                  <span>Quản lý nhà</span>
                </div>
              )}

              {/* Account dropdown */}
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-orange-600"
                onClick={toggleDropdown}
              >
                <User size={16} />
                <span>{user?.name || "Tài khoản"}</span>
                <ChevronDown size={14} />
              </div>

              {/* ✅ SỬA: Role-based post creation */}
              {isOwner() && (
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-full flex items-center gap-1 font-semibold"
                  onClick={() => navigate("/owner/create-post")}
                >
                  <Pencil size={14} /> Đăng tin
                </button>
              )}
            </>
          ) : (
            <>
              {/* ✅ THÊM: Login/Register buttons for unauthenticated users */}
              <button
                className="px-4 py-1.5 text-orange-600 hover:text-orange-700 font-medium"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </button>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-full font-semibold"
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </button>
            </>
          )}

          {/* ✅ SỬA: Dropdown chỉ hiện khi authenticated */}
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
                  {/* ✅ THÊM: Display role */}
                  <p className="text-xs text-blue-600 font-medium">
                    {user.role === "owner" ? "Chủ nhà" : "Người thuê"}
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-2 text-sm text-gray-700">
                <button
                  onClick={() => handleNavigate("/profile")}
                  className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-orange-50 transition"
                >
                  <UserCog size={18} /> <span>Quản lý tài khoản</span>
                </button>

                {/* ✅ GIỮ: Sử dụng LogoutButton component có sẵn */}
                <LogoutButton className="w-full p-2 rounded-lg hover:bg-red-50 text-red-600 transition text-sm" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;