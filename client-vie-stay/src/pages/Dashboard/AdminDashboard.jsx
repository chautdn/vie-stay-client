import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  Home,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Eye,
  MoreVertical
} from "lucide-react";

// Mock data - replace with actual API calls
const mockDashboardData = {
  overview: {
    totalUsers: 1245,
    activeUsers: 1120,
    bannedUsers: 125,
    totalAccommodations: 342,
    pendingAccommodations: 23,
    approvedAccommodations: 298,
    totalRooms: 1567,
    recentUsers: 45,
    recentAccommodations: 12
  },
  latestPendingAccommodations: [
    {
      _id: "1",
      name: "Sunshine Apartment",
      type: "apartment_building",
      createdAt: "2025-01-20T10:30:00Z",
      ownerId: { name: "Nguyen Van A", email: "nguyenvana@email.com" },
      address: { district: "Quận Hải Châu" }
    },
    {
      _id: "2", 
      name: "Modern Hostel",
      type: "hostel",
      createdAt: "2025-01-19T15:45:00Z",
      ownerId: { name: "Tran Thi B", email: "tranthib@email.com" },
      address: { district: "Quận Thanh Khê" }
    }
  ],
  latestUsers: [
    {
      _id: "1",
      name: "Le Van C",
      email: "levanc@email.com",
      role: ["tenant"],
      createdAt: "2025-01-20T14:20:00Z",
      isActive: true,
      isVerified: true
    },
    {
      _id: "2",
      name: "Pham Thi D", 
      email: "phamthid@email.com",
      role: ["landlord"],
      createdAt: "2025-01-20T11:10:00Z",
      isActive: true,
      isVerified: false
    }
  ]
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [loading, setLoading] = useState(false);

  // Mock API call
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setDashboardData(mockDashboardData);
        setLoading(false);
      }, 1000);
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { overview, latestPendingAccommodations, latestUsers } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString('vi-VN')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={overview.totalUsers}
          icon={Users}
          color="bg-blue-500"
          trend="up"
          trendValue={`+${overview.recentUsers} this week`}
        />
        <StatCard
          title="Active Users"
          value={overview.activeUsers}
          icon={CheckCircle}
          color="bg-green-500"
          trend="up"
          trendValue={`${((overview.activeUsers / overview.totalUsers) * 100).toFixed(1)}% active`}
        />
        <StatCard
          title="Total Accommodations"
          value={overview.totalAccommodations}
          icon={Building2}
          color="bg-purple-500"
          trend="up"
          trendValue={`+${overview.recentAccommodations} this week`}
        />
        <StatCard
          title="Pending Approvals"
          value={overview.pendingAccommodations}
          icon={Clock}
          color="bg-orange-500"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Accommodation Status</h3>
            <Building2 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Approved</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(overview.approvedAccommodations / overview.totalAccommodations) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{overview.approvedAccommodations}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${(overview.pendingAccommodations / overview.totalAccommodations) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{overview.pendingAccommodations}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Rooms</span>
              <span className="text-sm font-medium text-blue-600">{overview.totalRooms}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Analytics</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="text-sm font-medium text-green-600">{overview.activeUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Banned Users</span>
              <span className="text-sm font-medium text-red-600">{overview.bannedUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New This Week</span>
              <span className="text-sm font-medium text-blue-600">+{overview.recentUsers}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <AlertCircle className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Review Pending Accommodations ({overview.pendingAccommodations})
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
              Manage User Reports
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              View Revenue Reports
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Pending Accommodations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Pending Accommodations</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {latestPendingAccommodations.map((accommodation) => (
              <div key={accommodation._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{accommodation.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{accommodation.type.replace('_', ' ')}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span>{accommodation.ownerId.name}</span>
                      <span className="mx-1">•</span>
                      <span>{accommodation.address.district}</span>
                      <span className="mx-1">•</span>
                      <span>{formatDate(accommodation.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200">
                      Approve
                    </button>
                    <button className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {latestUsers.map((user) => (
              <div key={user._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role.includes('landlord') 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role[0]}
                    </span>
                    <div className="flex items-center space-x-1">
                      {user.isVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      {user.isActive ? (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      ) : (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other pages
const AccommodationManagement = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 className="text-xl font-bold mb-4">Accommodation Management</h2>
    <p className="text-gray-600">Accommodation management interface will be implemented here.</p>
  </div>
);

const UserManagement = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 className="text-xl font-bold mb-4">User Management</h2>
    <p className="text-gray-600">User management interface will be implemented here.</p>
  </div>
);

const RevenueReports = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 className="text-xl font-bold mb-4">Revenue Reports</h2>
    <p className="text-gray-600">Revenue reports interface will be implemented here.</p>
  </div>
);

const AdminSettings = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 className="text-xl font-bold mb-4">Admin Settings</h2>
    <p className="text-gray-600">Admin settings interface will be implemented here.</p>
  </div>
);

export default AdminDashboard;