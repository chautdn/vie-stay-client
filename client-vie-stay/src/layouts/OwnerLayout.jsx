import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'; // ✅ THÊM: Import AuthStore
import LogoutButton from '../components/common/LogOutButton';
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  FileText, 
  Settings, 
  Menu,
  X,
  Bell,
  User,
  UserCheck
} from 'lucide-react';

const OwnerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ THÊM: Get auth state
  const { user, isAuthenticated, isCheckingAuth } = useAuthStore();

  // ✅ THÊM: Auto hide welcome message after 5 seconds with fade effect
  useEffect(() => {
    if (showWelcome && user?.name) {
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 4500); // Start fading at 4.5s

      const hideTimer = setTimeout(() => {
        setShowWelcome(false);
        setFadeOut(false);
      }, 5000); // Completely hide at 5s

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [showWelcome, user?.name]);

  const navigation = [
    { name: 'Dashboard', href: '/owner/dashboard', icon: LayoutDashboard, current: false },
    { name: 'Tòa nhà', href: '/owner/accommodations', icon: Building, current: false },
    { name: 'Yêu cầu thuê', href: '/owner/rental-requests', icon: UserCheck, current: false },
    { name: 'Yêu cầu bạn chung phòng', href: '/owner/co-tenants', icon: Users, current: false },
    { name: 'Báo cáo', href: '/owner/reports', icon: FileText, current: false },
    { name: 'Cài đặt', href: '/owner/settings', icon: Settings, current: false },
  ];

  // ✅ THÊM: Loading state
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang kiểm tra quyền truy cập...</span>
      </div>
    );
  }

  // ✅ SỬA: Role protection cho array role
  if (!isAuthenticated || !user?.role?.includes('landlord')) {
    return <Navigate to="/login" replace />;
  }

  // Update current based on location
  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: location.pathname === item.href || location.pathname.startsWith(item.href)
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white transform transition ease-in-out duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-shrink-0 flex items-center px-4">
            <h1 className="text-2xl font-bold text-blue-600">VietStay</h1>
          </div>
          
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {updatedNavigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full text-left ${
                    item.current
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-4 flex-shrink-0 h-6 w-6 ${item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          {/* ✅ SỬA: Mobile user section với AuthStore */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                {user?.profileImage ? (
                  <img
                    src={`http://localhost:8080${user.profileImage}`}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">{user?.name || 'Chủ nhà'}</p>
                <p className="text-xs text-gray-500">Chủ nhà</p>
              </div>
              <LogoutButton className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-2xl font-bold text-blue-600">VietStay</h1>
            <span className="ml-2 text-sm text-gray-500">Owner</span>
          </div>
          
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {updatedNavigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors ${
                    item.current
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          {/* ✅ SỬA: Desktop user section với AuthStore */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                {user?.profileImage ? (
                  <img
                    src={`http://localhost:8080${user.profileImage}`}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">{user?.name || 'Chủ nhà'}</p>
                <p className="text-xs text-gray-500">Chủ nhà</p>
                {user?.email && (
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                )}
              </div>
              <LogoutButton className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded text-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* ✅ SỬA: Top bar với user info */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>            <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1">
              {showWelcome && user?.name ? (
                <h2 className={`text-lg font-semibold text-gray-900 hidden md:block transition-opacity duration-500 ease-in-out ${
                  fadeOut ? 'opacity-0' : 'opacity-100'
                }`}>
                  Xin chào, {user.name}! 👋
                </h2>
              ) : (
                <h2 className="text-lg font-semibold text-gray-900 hidden md:block transition-opacity duration-300 ease-in-out opacity-100">
                  Dashboard
                </h2>
              )}
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Bell className="h-6 w-6" />
              </button>
              
              {/* ✅ THÊM: Mobile user info */}
              <div className="ml-3 flex items-center md:hidden">
                {user?.profileImage ? (
                  <img
                    src={`http://localhost:8080${user.profileImage}`}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;