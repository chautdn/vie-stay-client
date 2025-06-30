import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  AlertTriangle,
  MoreVertical,
  Download,
  RefreshCw,
  UserCheck,
  UserX
} from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
    verifiedUsers: 0,
    tenants: 0,
    landlords: 0
  });

  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const itemsPerPage = 10;

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // API call function with auth headers
  const apiCall = async (endpoint, options = {}) => {
    const token = getAuthToken();
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    };

    const response = await fetch(`http://localhost:8080${endpoint}`, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, statusFilter, verificationFilter, searchTerm, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        order: sortOrder
      });

      if (roleFilter !== "all") params.append("role", roleFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (verificationFilter !== "all") {
        if (verificationFilter === "verified") {
          params.append("verified", "true");
        } else if (verificationFilter === "unverified") {
          params.append("verified", "false");
        }
      }
      if (searchTerm) params.append("search", searchTerm);

      const response = await apiCall(`/admin/users?${params}`);
      
      if (response.status === 'success') {
        setUsers(response.data.users);
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async () => {
    try {
      if (!banReason.trim()) {
        alert("Please provide a ban reason");
        return;
      }

      const response = await apiCall(`/admin/users/${selectedUser._id}/ban`, {
        method: 'PATCH',
        body: JSON.stringify({ reason: banReason })
      });

      if (response.status === 'success') {
        // Update local state
        setUsers(prev =>
          prev.map(user =>
            user._id === selectedUser._id
              ? { ...user, isActive: false }
              : user
          )
        );
        // Update statistics
        setStatistics(prev => ({
          ...prev,
          activeUsers: prev.activeUsers - 1,
          bannedUsers: prev.bannedUsers + 1
        }));

        setShowBanModal(false);
        setBanReason("");
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error banning user:", error);
      alert("Failed to ban user. Please try again.");
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      const response = await apiCall(`/admin/users/${userId}/unban`, {
        method: 'PATCH'
      });

      if (response.status === 'success') {
        // Update local state
        setUsers(prev =>
          prev.map(user =>
            user._id === userId
              ? { ...user, isActive: true }
              : user
          )
        );
        // Update statistics
        setStatistics(prev => ({
          ...prev,
          activeUsers: prev.activeUsers + 1,
          bannedUsers: prev.bannedUsers - 1
        }));
      }
    } catch (error) {
      console.error("Error unbanning user:", error);
      alert("Failed to unban user. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (roles) => {
    const roleColors = {
      tenant: "bg-blue-100 text-blue-800",
      landlord: "bg-purple-100 text-purple-800",
      admin: "bg-red-100 text-red-800"
    };

    if (!roles || !Array.isArray(roles)) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          N/A
        </span>
      );
    }

    return roles.map(role => (
      <span key={role} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-1 ${roleColors[role] || 'bg-gray-100 text-gray-800'}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    ));
  };

  const getStatusBadge = (isActive, isVerified) => {
    if (!isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <Ban className="w-3 h-3 mr-1" />
          Banned
        </span>
      );
    }
    
    if (!isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Unverified
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users, roles, and account status</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchUsers}
            className="flex items-center px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <User className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-xl font-bold text-gray-900">{statistics.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-xl font-bold text-gray-900">{statistics.activeUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <UserX className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Banned</p>
              <p className="text-xl font-bold text-gray-900">{statistics.bannedUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-xl font-bold text-gray-900">{statistics.verifiedUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <User className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Tenants</p>
              <p className="text-xl font-bold text-gray-900">{statistics.tenants}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Landlords</p>
              <p className="text-xl font-bold text-gray-900">{statistics.landlords}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="tenant">Tenants</option>
            <option value="landlord">Landlords</option>
            <option value="admin">Admins</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>

          {/* Verification Filter */}
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Verification</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=6366f1&color=fff`}
                          alt={user.name || 'User'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">
                            Joined {formatDate(user.createdAt).split(',')[0]}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        {user.email || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        {user.phoneNumber || 'Not provided'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.isActive, user.isVerified)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {user.isActive ? (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowBanModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Ban User"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnbanUser(user._id)}
                            className="text-green-600 hover:text-green-900"
                            title="Unban User"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">User Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Profile Section */}
              <div className="flex items-center space-x-4">
                <img
                  src={selectedUser.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name || 'User')}&background=6366f1&color=fff&size=80`}
                  alt={selectedUser.name || 'User'}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedUser.name || 'N/A'}</h4>
                  <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                  <div className="mt-2">{getStatusBadge(selectedUser.isActive, selectedUser.isVerified)}</div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">Contact Information</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm">{selectedUser.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm">{selectedUser.phoneNumber || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Address */}
              {selectedUser.address?.fullAddress && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Address</h5>
                  <p className="text-sm text-gray-600">{selectedUser.address.fullAddress}</p>
                </div>
              )}

              {/* Account Information */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">Account Information</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Member since:</span>
                    <span className="ml-2">{formatDate(selectedUser.createdAt)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Last login:</span>
                    <span className="ml-2">{selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Never'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Email verified:</span>
                    <span className="ml-2">{selectedUser.isVerified ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Account status:</span>
                    <span className="ml-2">{selectedUser.isActive ? 'Active' : 'Banned'}</span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {selectedUser.dateOfBirth && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Personal Information</h5>
                  <div className="text-sm">
                    <span className="font-medium">Date of Birth:</span>
                    <span className="ml-2">{formatDate(selectedUser.dateOfBirth)}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 pt-4 border-t">
                {selectedUser.isActive ? (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowBanModal(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Ban User
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleUnbanUser(selectedUser._id);
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Unban User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ban User Modal */}
      {showBanModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-red-600">Ban User</h3>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
                <div>
                  <p className="font-medium">Ban {selectedUser.name || 'this user'}?</p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                Please provide a reason for banning this user:
              </p>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter ban reason..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
              />
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setBanReason("");
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBanUser}
                disabled={!banReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ban User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;