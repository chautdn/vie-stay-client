import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  MapPin,
  User,
  Calendar,
  Star,
  MoreVertical,
  Download,
  RefreshCw
} from "lucide-react";

const AccommodationManagement = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
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
    fetchAccommodations();
  }, [currentPage, statusFilter, typeFilter, districtFilter, searchTerm, sortBy, sortOrder]);

  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        order: sortOrder
      });

      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (districtFilter !== "all") params.append("district", districtFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await apiCall(`/admin/accommodations?${params}`);
      
      if (response.status === 'success') {
        setAccommodations(response.data.accommodations);
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error("Error fetching accommodations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (accommodationId) => {
    try {
      const response = await apiCall(`/admin/accommodations/${accommodationId}/approve`, {
        method: 'PATCH'
      });

      if (response.status === 'success') {
        // Update local state
        setAccommodations(prev => 
          prev.map(acc => 
            acc._id === accommodationId 
              ? { ...acc, approvalStatus: "approved", approvedAt: new Date().toISOString() }
              : acc
          )
        );
        // Update statistics
        setStatistics(prev => ({
          ...prev,
          pending: prev.pending - 1,
          approved: prev.approved + 1
        }));
      }
    } catch (error) {
      console.error("Error approving accommodation:", error);
      alert("Failed to approve accommodation. Please try again.");
    }
  };

  const handleReject = async () => {
    try {
      if (!rejectReason.trim()) {
        alert("Please provide a rejection reason");
        return;
      }
      
      const response = await apiCall(`/admin/accommodations/${selectedAccommodation._id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason: rejectReason })
      });

      if (response.status === 'success') {
        // Update local state
        setAccommodations(prev => 
          prev.map(acc => 
            acc._id === selectedAccommodation._id 
              ? { ...acc, approvalStatus: "rejected", rejectionReason: rejectReason }
              : acc
          )
        );
        // Update statistics
        setStatistics(prev => ({
          ...prev,
          pending: prev.pending - 1,
          rejected: prev.rejected + 1
        }));
        
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedAccommodation(null);
      }
    } catch (error) {
      console.error("Error rejecting accommodation:", error);
      alert("Failed to reject accommodation. Please try again.");
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

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800", 
      rejected: "bg-red-100 text-red-800"
    };
    
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle
    };

    const Icon = icons[status];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status]}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const accommodationTypes = [
    { value: "all", label: "All Types" },
    { value: "apartment_building", label: "Apartment Building" },
    { value: "house", label: "House" },
    { value: "hostel", label: "Hostel" },
    { value: "hotel", label: "Hotel" },
    { value: "villa", label: "Villa" },
    { value: "duplex", label: "Duplex" }
  ];

  const districts = [
    { value: "all", label: "All Districts" },
    { value: "Quận Hải Châu", label: "Quận Hải Châu" },
    { value: "Quận Thanh Khê", label: "Quận Thanh Khê" },
    { value: "Quận Sơn Trà", label: "Quận Sơn Trà" },
    { value: "Quận Ngũ Hành Sơn", label: "Quận Ngũ Hành Sơn" },
    { value: "Quận Liên Chiểu", label: "Quận Liên Chiểu" },
    { value: "Quận Cẩm Lệ", label: "Quận Cẩm Lệ" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accommodation Management</h1>
          <p className="text-gray-600">Review and manage accommodation submissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAccommodations}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{statistics.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-xl font-bold text-gray-900">{statistics.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-xl font-bold text-gray-900">{statistics.approved}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-xl font-bold text-gray-900">{statistics.rejected}</p>
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
                placeholder="Search accommodations, owners, addresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {accommodationTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {/* District Filter */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {districts.map(district => (
              <option key={district.value} value={district.value}>{district.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Accommodations Table */}
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
                    Accommodation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accommodations.map((accommodation) => (
                  <tr key={accommodation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={accommodation.images?.[0] || "https://via.placeholder.com/48x48"}
                          alt={accommodation.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {accommodation.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {accommodation.totalRooms || 0} rooms
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{accommodation.ownerId?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{accommodation.ownerId?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {accommodation.type?.replace('_', ' ') || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {accommodation.address?.district || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(accommodation.approvalStatus)}
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(accommodation.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {accommodation.averageRating > 0 ? (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{accommodation.averageRating.toFixed(1)}</span>
                          <span className="ml-1">({accommodation.totalReviews || 0})</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No reviews</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedAccommodation(accommodation);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {accommodation.approvalStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(accommodation._id)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedAccommodation(accommodation);
                                setShowRejectModal(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {accommodations.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No accommodations found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedAccommodation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Accommodation Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedAccommodation.name}</p>
                    <p><span className="font-medium">Type:</span> {selectedAccommodation.type?.replace('_', ' ') || 'N/A'}</p>
                    <p><span className="font-medium">Total Rooms:</span> {selectedAccommodation.totalRooms || 0}</p>
                    <p><span className="font-medium">Status:</span> {getStatusBadge(selectedAccommodation.approvalStatus)}</p>
                    <p><span className="font-medium">Created:</span> {formatDate(selectedAccommodation.createdAt)}</p>
                    {selectedAccommodation.description && (
                      <p><span className="font-medium">Description:</span> {selectedAccommodation.description}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Owner Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedAccommodation.ownerId?.name || 'N/A'}</p>
                    <p><span className="font-medium">Email:</span> {selectedAccommodation.ownerId?.email || 'N/A'}</p>
                    <p><span className="font-medium">Phone:</span> {selectedAccommodation.ownerId?.phoneNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Address</h4>
                <p>{selectedAccommodation.address?.fullAddress || 'N/A'}</p>
              </div>

              {/* Images */}
              {selectedAccommodation.images && selectedAccommodation.images.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Images</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedAccommodation.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedAccommodation.approvalStatus === 'rejected' && selectedAccommodation.rejectionReason && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Rejection Reason</h4>
                  <p className="text-red-600">{selectedAccommodation.rejectionReason}</p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedAccommodation.approvalStatus === 'pending' && (
                <div className="flex items-center space-x-4 pt-4 border-t">
                  <button
                    onClick={() => {
                      handleApprove(selectedAccommodation._id);
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowRejectModal(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedAccommodation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full m-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Reject Accommodation</h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting "{selectedAccommodation.name}":
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={4}
              />
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccommodationManagement;