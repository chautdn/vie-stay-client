import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut } from 'lucide-react';

const LogoutButton = ({ className = "" }) => {
  const navigate = useNavigate();
  const { logout, isLoading } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate to login even if logout fails
      navigate('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 ${className}`}
    >
      <LogOut size={20} />
      {isLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
    </button>
  );
};

export default LogoutButton;