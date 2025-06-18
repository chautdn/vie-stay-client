import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore"; 
import { LogOut } from "lucide-react"; 

const Homepage = () => {
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      alert("Error logging out. Please try again.");
    }
  };

  return (
    <div className="p-8 flex flex-col items-end">
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition font-semibold"
      >
        <LogOut className="w-5 h-5" />
        {isLoading ? "Logging out..." : "Logout"}
      </button>
      {/*code giao dien homepage*/}
    </div>
  );
};

export default Homepage;
