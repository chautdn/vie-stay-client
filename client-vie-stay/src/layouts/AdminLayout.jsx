import React, { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  FileText,
  Flag,
  ArrowDownCircle,
  CreditCard
} from "lucide-react";

// Import the real data components
import AdminDashboard from "../pages/AdminPage/AdminDashboard";
import AccommodationManagement from "../pages/AdminPage/AccommodationManagement";
import UserManagement from "../pages/AdminPage/UserManagement";
import RevenueReports from "../pages/AdminPage/RevenueReports";
import AdminPostManagement from "../pages/AdminPage/AdminPostManagement";
import ReportManagement from "../components/admin/ReportManagement";
// ✅ ADDED: Import withdrawal management component
import AdminWithdrawalManagement from "../pages/AdminPage/AdminWithdrawalManagement";
// ✅ ADDED: Import bank account verification component
import AdminBankAccountVerification from "../pages/AdminPage/AdminBankAccountVerification";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Get user data from localStorage
  const getUserFromStorage = () => {
    try {
      const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const user = getUserFromStorage() || {
    name: "Admin User",
    profileImage: "https://cdn-icons-png.flaticon.com/512/847/847969.png"
  };

  // ✅ UPDATED: Added bank account verification menu item
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      description: "Overview & Statistics"
    },
    {
      name: "Posts",
      icon: FileText,
      path: "/admin/posts",
      description: "Manage & Monitor Posts"
    },
    {
      name: "Accommodations",
      icon: Building2,
      path: "/admin/accommodations",
      description: "Approve & Manage Properties"
    },
    {
      name: "Users",
      icon: Users,
      path: "/admin/users",
      description: "User Management"
    },
    {
      name: "Withdrawals", // ✅ ADDED: Withdrawal Management
      icon: ArrowDownCircle,
      path: "/admin/withdrawals",
      description: "Review Withdrawal Requests",
      badge: "8" // Number of pending withdrawals
    },
    {
      name: "Bank Accounts", // ✅ ADDED: Bank Account Verification
      icon: CreditCard,
      path: "/admin/bank-verification",
      description: "Verify Bank Accounts",
      badge: "3" // Number of pending verifications
    },
    {
      name: "Revenue Reports",
      icon: BarChart3,
      path: "/admin/reports",
      description: "Analytics & Revenue"
    },
    {
      name: "Report Management",
      icon: Flag,
      path: "/admin/report-management",
      description: "Manage User Reports"
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/admin/settings",
      description: "System Configuration"
    }
  ];

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    
    // Redirect to login page
    window.location.href = "/login";
  };

  const handleNavigation = (path) => {
    setCurrentPage(path.split('/').pop());
    setSidebarOpen(false);
    
    // Update URL without causing a page reload
    window.history.pushState({}, '', path);
  };

  const isActivePath = (path) => {
    return currentPage === path.split('/').pop();
  };

  // ✅ UPDATED: Added bank account verification case
  const renderPageContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <AdminDashboard />;
      case "posts":
        return <AdminPostManagement />;
      case "accommodations":
        return <AccommodationManagement />;
      case "users":
        return <UserManagement />;
      case "withdrawals": // ✅ ADDED: Withdrawal Management
        return <AdminWithdrawalManagement />;
      case "bank-verification": // ✅ ADDED: Bank Account Verification
        return <AdminBankAccountVerification />;
      case "reports":
        return <RevenueReports />;
      case "report-management":
        return <ReportManagement />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  // ✅ UPDATED: Enhanced page title mapping
  const getPageTitle = () => {
    const titles = {
      dashboard: "Dashboard",
      posts: "Post Management",
      accommodations: "Accommodation Management",
      users: "User Management",
      withdrawals: "Withdrawal Management", // ✅ ADDED
      "bank-verification": "Bank Account Verification", // ✅ ADDED
      reports: "Revenue Reports",
      "report-management": "Report Management",
      settings: "System Settings"
    };
    return titles[currentPage] || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-800">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Admin Info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <img
              src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=6366f1&color=fff`}
              alt="Admin"
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=6366f1&color=fff`;
              }}
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">{user?.name || "Admin"}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 mr-3 transition-colors ${
                      isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <div className="text-left flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                  </div>
                  {/* ✅ ADDED: Badge for pending items */}
                  {item.badge && (
                    <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
                      item.path === '/admin/withdrawals' 
                        ? 'bg-orange-100 text-orange-600' 
                        : item.path === '/admin/bank-verification'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.path === '/admin/posts' && !item.badge && (
                    <span className="ml-auto bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* ✅ UPDATED: Enhanced Quick Stats Section */}
        <div className="px-3 mt-6 space-y-3">
          {/* Pending Withdrawals Card */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <ArrowDownCircle className="w-6 h-6 text-orange-600" />
              <span className="text-lg font-bold text-orange-800">8</span>
            </div>
            <h3 className="text-sm font-medium text-orange-800 mb-1">Pending Withdrawals</h3>
            <p className="text-xs text-orange-600 mb-2">Requiring attention</p>
            <button
              onClick={() => handleNavigation('/admin/withdrawals')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-1.5 px-3 rounded text-xs font-medium transition-colors"
            >
              Review Now
            </button>
          </div>

          {/* Bank Account Verifications Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold text-blue-800">3</span>
            </div>
            <h3 className="text-sm font-medium text-blue-800 mb-1">Bank Verifications</h3>
            <p className="text-xs text-blue-600 mb-2">Pending approval</p>
            <button
              onClick={() => handleNavigation('/admin/bank-verification')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded text-xs font-medium transition-colors"
            >
              Verify Now
            </button>
          </div>
          
          {/* Additional stats */}
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Today's Posts:</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Pending Reviews:</span>
              <span className="font-medium text-yellow-600">5</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Active Users:</span>
              <span className="font-medium text-green-600">1,234</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-400 hover:text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4 md:mx-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              {/* ✅ ADDED: Multiple notification indicators */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>

            {/* Current Page Title */}
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-gray-800">
                {getPageTitle()}
              </h1>
              {/* ✅ UPDATED: Page-specific subtitles */}
              {currentPage === 'posts' && (
                <p className="text-xs text-gray-500">Monitor and manage all posts</p>
              )}
              {currentPage === 'withdrawals' && (
                <p className="text-xs text-gray-500">Review and approve withdrawal requests</p>
              )}
              {currentPage === 'bank-verification' && (
                <p className="text-xs text-gray-500">Verify user bank account information</p>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-6">
            {renderPageContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

// ✅ UPDATED: Enhanced Admin Settings Component
const AdminSettings = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 className="text-xl font-bold mb-4">Admin Settings</h2>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">System Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform Commission Rate (%)
            </label>
            <input
              type="number"
              defaultValue="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auto-approval Threshold
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Manual approval only</option>
              <option>Auto-approve verified landlords</option>
              <option>Auto-approve all</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* ✅ ADDED: Withdrawal Management Settings */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Withdrawal Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Withdrawal Amount (₫)
            </label>
            <input
              type="number"
              defaultValue="50000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Withdrawal Amount (₫)
            </label>
            <input
              type="number"
              defaultValue="10000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auto-approve Bank Accounts
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Manual verification required</option>
              <option>Auto-approve verified users</option>
              <option>Auto-approve all accounts</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Processing Time (days)
            </label>
            <input
              type="number"
              defaultValue="7"
              min="1"
              max="30"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* ✅ ADDED: Bank Account Verification Settings */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Bank Account Verification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auto-verification for Trusted Banks
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Manual verification required</option>
              <option>Auto-verify major banks</option>
              <option>Auto-verify all banks</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Documents
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Bank statement required</option>
              <option>ID verification only</option>
              <option>Both required</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Timeout (days)
            </label>
            <input
              type="number"
              defaultValue="3"
              min="1"
              max="14"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Verification Attempts
            </label>
            <input
              type="number"
              defaultValue="3"
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Post Management Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auto-approve Posts
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Manual approval required</option>
              <option>Auto-approve from verified users</option>
              <option>Auto-approve all posts</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Post Duration (days)
            </label>
            <input
              type="number"
              defaultValue="365"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Notification Settings</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="rounded border-gray-300" />
            <span className="ml-2 text-sm">Email notifications for new accommodations</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="rounded border-gray-300" />
            <span className="ml-2 text-sm">Email notifications for new posts</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="rounded border-gray-300" />
            <span className="ml-2 text-sm">Email notifications for withdrawal requests</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="rounded border-gray-300" />
            <span className="ml-2 text-sm">Email notifications for bank account verifications</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="rounded border-gray-300" />
            <span className="ml-2 text-sm">Daily revenue reports</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="ml-2 text-sm">User activity alerts</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Security Settings</h3>
        <div className="space-y-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Change Admin Password
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 ml-3">
            Download Security Logs
          </button>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Save Settings
        </button>
      </div>
    </div>
  </div>
);

export default AdminLayout;