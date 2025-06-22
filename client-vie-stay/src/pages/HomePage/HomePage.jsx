import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore"; 
import Room from "./RoomPage/Room";


const Homepage = () => {

  return (
  <div className="p-8">
    <div className="flex justify-end mb-6">
      {/* <button
        onClick={handleLogout}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition font-semibold"
      >
        <LogOut className="w-5 h-5" />
        {isLoading ? "Logging out..." : "Logout"}
      </button> */}
    </div>

    {/* Hiển thị danh sách phòng */}
    <Room />
  </div>
);
};

export default Homepage;