import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Folder,
  ChevronDown,
  User,
  Pencil,
  LogOut,
  UserCog,
  Home,
  Building,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext"; // Adjust path as needed

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  // Force re-render when user data changes in storage
  useEffect(() => {
    const checkUserData = () => {
      // This will trigger on component mount and when dependencies change
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const storedUser = JSON.parse(
        localStorage.getItem("user") || 
        sessionStorage.getItem("user") || 
        "{}"
      );
      
      // Force a re-render by updating state or triggering auth context
      if (token && storedUser && Object.keys(storedUser).length > 0 && !user) {
        // Trigger auth context update
        window.dispatchEvent(new CustomEvent('userLogin', {
          detail: { user: storedUser, token }
        }));
      }
    };

    // Check immediately
    checkUserData();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        checkUserData();
      }
    };

    // Listen for login events from other components
    const handleUserLogin = () => {
      setTimeout(checkUserData, 100); // Small delay to ensure storage is updated
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleUserLogin);
    window.addEventListener('userLoggedIn', handleUserLogin); // Alternative event name

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleUserLogin);
      window.removeEventListener('userLoggedIn', handleUserLogin);
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/login");
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleNavigate = (path) => {
    setShowDropdown(false);
    navigate(path);
  };

  // Default fallback user data for when user is not logged in
  const displayUser = user || {
    name: "Khách",
    phoneNumber: null,
    profileImage: null
  };

  // Show loading state
  if (isLoading) {
    return (
      <nav className="w-full bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center text-2xl font-black tracking-tight">
                <span className="text-blue-600">VIE</span>
                <span className="text-orange-500">STAY</span>
                <span className="text-gray-400">.COM</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full bg-white shadow-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavigate("/home")}
          >
            <div className="flex items-center text-2xl font-black tracking-tight">
              <span className="text-blue-600 group-hover:text-blue-700 transition-colors">VIE</span>
              <span className="text-orange-500 group-hover:text-orange-600 transition-colors">STAY</span>
              <span className="text-gray-400">.COM</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/rooms"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate("/rooms");
              }}
              className="flex items-center gap-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              <Home size={18} />
              Tìm phòng
            </a>
            
            <a
              href="/accommodations"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate("/accommodations");
              }}
              className="flex items-center gap-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              <Building size={18} />
              Nhà trọ
            </a>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate("/contact");
              }}
              className="flex items-center gap-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              <Phone size={18} />
              Liên hệ
            </a>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Show different content based on login status */}
            {user ? (
              <>
                {/* Saved Items - Only show when logged in */}
                <button
                  onClick={() => handleNavigate("/saved")}
                  className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
                >
                  <Heart size={18} />
                  <span className="hidden lg:inline">Tin đã lưu</span>
                </button>

                {/* Management - Only show when logged in */}
                <button
                  onClick={() => handleNavigate("/dashboard")}
                  className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
                >
                  <Folder size={18} />
                  <span className="hidden lg:inline">Quản lý</span>
                </button>

                {/* User Account Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={
                        displayUser.profileImage
                          ? `http://localhost:8080${displayUser.profileImage}`
                          : displayUser.avatar
                          ? `http://localhost:8080${displayUser.avatar}`
                          : "https://via.placeholder.com/32"
                      }
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/32";
                      }}
                    />
                    <div className="hidden sm:flex items-center gap-1">
                      <span className="font-medium text-gray-700 max-w-20 truncate">
                        {displayUser?.name?.split(' ')[0] || displayUser?.fullName?.split(' ')[0] || "User"}
                      </span>
                      <ChevronDown size={16} className="text-gray-500" />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-200 w-64 py-2 z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              displayUser.profileImage
                                ? `http://localhost:8080${displayUser.profileImage}`
                                : displayUser.avatar
                                ? `http://localhost:8080${displayUser.avatar}`
                                : "https://via.placeholder.com/40"
                            }
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/40";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">
                              {displayUser.name || displayUser.fullName || "Người dùng"}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {displayUser.phoneNumber || displayUser.phone || displayUser.email || "Chưa có thông tin liên hệ"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => handleNavigate("/profile")}
                          className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <UserCog size={18} />
                          <span>Quản lý tài khoản</span>
                        </button>

                        <button
                          onClick={() => handleNavigate("/my-posts")}
                          className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <Folder size={18} />
                          <span>Bài đăng của tôi</span>
                        </button>

                        <button
                          onClick={() => handleNavigate("/saved")}
                          className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors sm:hidden"
                        >
                          <Heart size={18} />
                          <span>Tin đã lưu</span>
                        </button>

                        <hr className="my-2 border-gray-100" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={18} />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Post Button - Only show when logged in */}
                <button
                  onClick={() => handleNavigate("/create-post")}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors shadow-sm hover:shadow-md"
                >
                  <Pencil size={16} />
                  <span className="hidden sm:inline">Đăng tin</span>
                </button>
              </>
            ) : (
              /* Show login/register buttons when not logged in */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavigate("/login")}
                  className="text-gray-700 hover:text-orange-600 font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => handleNavigate("/register")}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-100 py-2">
          <div className="flex justify-around">
            <button
              onClick={() => handleNavigate("/rooms")}
              className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <Home size={18} />
              <span className="text-xs">Tìm phòng</span>
            </button>
            <button
              onClick={() => handleNavigate("/accommodations")}
              className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <Building size={18} />
              <span className="text-xs">Nhà trọ</span>
            </button>
            <button
              onClick={() => handleNavigate("/blog")}
              className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <MessageCircle size={18} />
              <span className="text-xs">Tin tức</span>
            </button>
            <button
              onClick={() => handleNavigate("/contact")}
              className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <Phone size={18} />
              <span className="text-xs">Liên hệ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;