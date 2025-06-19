import React, { useEffect, useState } from "react";
import {
  Heart,
  Filter,
  Folder,
  ChevronDown,
  User,
  Pencil,
  LogOut,
  UserCog,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem("token");
      const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
      const userId = storedUser._id || storedUser.id;
      if (!token || !userId) return;

      try {
        const res = await fetch(`http://localhost:8080/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Không thể lấy thông tin người dùng");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Lỗi khi fetch user từ DB:", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    window.location.href = "/login";
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
            <span className="text-orange-500">TOT</span>
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
          <div className="flex items-center gap-1 cursor-pointer hover:text-orange-600">
            <Heart size={16} /> Tin đã lưu
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-orange-600">
            <Folder size={16} /> Quản lý
          </div>

          {/* Account dropdown */}
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-orange-600"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <User size={16} />
            <span>{user?.name || "Tài khoản"}</span>
            <ChevronDown size={14} />
          </div>

          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-full flex items-center gap-1 font-semibold">
            <Pencil size={14} /> Đăng tin
          </button>

          {/* Dropdown content */}
          {showDropdown && user && (
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
              <p className="font-semibold text-base text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">{user.phoneNumber}</p>
            </div>
          </div>

          <div className="p-4 space-y-2 text-sm text-gray-700">
            <button
              onClick={() => {
                setShowDropdown(false);
                navigate("/profile");
              }}
              className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-orange-50 transition"
            >
              <UserCog size={18} /> <span>Quản lý tài khoản</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                  >
                <LogOut size={18} /> <span>Đăng xuất</span>
              </button>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
