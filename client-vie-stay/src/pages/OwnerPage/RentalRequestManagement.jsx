import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Filter, 
  Search, 
  X,
  Eye
} from 'lucide-react';

import { useRentalRequestStore } from '../../store/owner/rentalRequestStore';
import { useAccommodationStore } from '../../store/owner/accommodationStore';
import { useRoomStore } from '../../store/owner/roomStore';
import RentalRequestCard from '../../components/ownerPageComponents/RentalRequestCard';
import RentalRequestDetails from '../../components/ownerPageComponents/RentalRequestDetails';

const RentalRequestManagement = () => {
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    accommodationId: 'all',
    roomId: 'all',
    priority: 'all',
    search: ''
  });

  const {
    rentalRequests,
    isLoading,
    getRentalRequests,
    acceptRentalRequest,
    rejectRentalRequest,
    getRentalRequestDetails
  } = useRentalRequestStore();

  const {
    accommodations,
    getAllAccommodations
  } = useAccommodationStore();

  const {
    rooms,
    getAllRooms,
    getRoomsByAccommodationId,
    isLoading: roomsLoading
  } = useRoomStore();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        await getAllAccommodations();
        await getAllRooms();
        await getRentalRequests();
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    
    loadData();
  }, []);

  // Load rooms when accommodation filter changes
  useEffect(() => {
    const loadRoomsByAccommodation = async () => {
      if (filters.accommodationId !== 'all') {
        try {
          await getRoomsByAccommodationId(filters.accommodationId);
        } catch (error) {
          console.error('Error loading rooms by accommodation:', error);
        }
      }
    };

    if (filters.accommodationId !== 'all') {
      loadRoomsByAccommodation();
    }
  }, [filters.accommodationId]);

  // Load rental requests when filters change
  useEffect(() => {
    const loadRentalRequests = async () => {
      try {
        const params = {};
        
        if (filters.accommodationId !== 'all') {
          params.accommodationId = filters.accommodationId;
        }
        
        if (filters.roomId !== 'all') {
          params.roomId = filters.roomId;
        }
        
        await getRentalRequests(params);
      } catch (error) {
        console.error('Error loading rental requests:', error);
      }
    };

    loadRentalRequests();
  }, [filters.accommodationId, filters.roomId]);

  // Filter requests based on current filters
  const filteredRequests = rentalRequests.filter(request => {
    let matches = true;

    // Status filter
    if (filters.status !== 'all' && request.status !== filters.status) {
      matches = false;
    }

    // Priority filter
    if (filters.priority !== 'all' && request.priority !== filters.priority) {
      matches = false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const tenantName = request.tenantId?.name?.toLowerCase() || '';
      const tenantEmail = request.tenantId?.email?.toLowerCase() || '';
      
      if (!tenantName.includes(searchLower) && !tenantEmail.includes(searchLower)) {
        matches = false;
      }
    }

    return matches;
  });

  // Get rooms for selected accommodation
  const accommodationRooms = filters.accommodationId === 'all' 
    ? [] 
    : rooms.filter(room => room.accommodationId?._id === filters.accommodationId);

  const handleViewDetails = async (request) => {
    try {
      setSelectedRequest(request);
      await getRentalRequestDetails(request._id);
      setShowDetails(true);
    } catch (error) {
      console.error('Error loading request details:', error);
    }
  };

  const handleAcceptRequest = async (requestId, responseMessage) => {
    try {
      await acceptRentalRequest(requestId, responseMessage);
      setShowDetails(false);
      // Refresh data
      const params = {};
      if (filters.accommodationId !== 'all') params.accommodationId = filters.accommodationId;
      if (filters.roomId !== 'all') params.roomId = filters.roomId;
      await getRentalRequests(params);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleRejectRequest = async (requestId, responseMessage) => {
    try {
      await rejectRentalRequest(requestId, responseMessage);
      setShowDetails(false);
      // Refresh data
      const params = {};
      if (filters.accommodationId !== 'all') params.accommodationId = filters.accommodationId;
      if (filters.roomId !== 'all') params.roomId = filters.roomId;
      await getRentalRequests(params);
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  // Helper function để lấy tên accommodation từ ID
  const getAccommodationName = (accommodationId) => {
    const accId = typeof accommodationId === 'string' ? accommodationId : accommodationId?._id;
    const accommodation = accommodations.find(acc => acc._id === accId);
    return accommodation?.name || `Accommodation ${accId?.slice(-6)}`;
  };

  // Helper function để lấy tên room từ ID
  const getRoomInfo = (roomId) => {
    const room = rooms.find(r => r._id === roomId);
    return room ? {
      name: room.name || `Phòng ${room.roomNumber}`,
      roomNumber: room.roomNumber,
      baseRent: room.baseRent
    } : {
      name: `Room ${roomId?.slice(-6)}`,
      roomNumber: 'N/A',
      baseRent: null
    };
  };

  const getStatusStats = () => {
    return {
      total: filteredRequests.length,
      pending: filteredRequests.filter(r => r.status === 'pending').length,
      accepted: filteredRequests.filter(r => r.status === 'accepted').length,
      rejected: filteredRequests.filter(r => r.status === 'rejected').length,
    };
  };

  const stats = getStatusStats();

  // Handler cho accommodation filter change
  const handleAccommodationChange = (accommodationId) => {
    setFilters({
      ...filters, 
      accommodationId: accommodationId,
      roomId: 'all'
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      status: 'all',
      accommodationId: 'all',
      roomId: 'all',
      priority: 'all',
      search: ''
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/owner/dashboard')}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              Quay lại Dashboard
            </button>
            <div className="h-6 border-l border-gray-300" />
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Quản lý yêu cầu thuê
                </h1>
                <p className="text-sm text-gray-600">
                  Xử lý các yêu cầu thuê phòng từ khách hàng
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Tổng yêu cầu</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Chờ xử lý</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Đã chấp nhận</p>
                <p className="text-2xl font-bold text-green-900">{stats.accepted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Đã từ chối</p>
                <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-700">Bộ lọc</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm khách thuê..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="accepted">Đã chấp nhận</option>
              <option value="rejected">Đã từ chối</option>
            </select>

            {/* Accommodation Filter */}
            <select
              value={filters.accommodationId}
              onChange={(e) => handleAccommodationChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả tòa nhà</option>
              {accommodations.map(accommodation => (
                <option key={accommodation._id} value={accommodation._id}>
                  {accommodation.name}
                </option>
              ))}
            </select>

            {/* Room Filter */}
            <select
              value={filters.roomId}
              onChange={(e) => setFilters({...filters, roomId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={filters.accommodationId === 'all' || roomsLoading}
            >
              <option value="all">
                {filters.accommodationId === 'all' 
                  ? 'Chọn tòa nhà trước' 
                  : roomsLoading 
                    ? 'Đang tải phòng...' 
                    : accommodationRooms.length === 0 
                      ? 'Không có phòng nào' 
                      : 'Tất cả phòng'}
              </option>
              {accommodationRooms.map(room => (
                <option key={room._id} value={room._id}>
                  {room.name || `Phòng ${room.roomNumber}`}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="low">Thấp</option>
              <option value="normal">Bình thường</option>
              <option value="high">Cao</option>
              <option value="urgent">Khẩn cấp</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(filters.status !== 'all' || filters.accommodationId !== 'all' || 
            filters.roomId !== 'all' || filters.priority !== 'all' || filters.search) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <X size={16} />
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Danh sách yêu cầu ({filteredRequests.length})
          </h2>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có yêu cầu nào
            </h3>
            <p className="text-gray-500">
              {filters.status !== 'all' || filters.accommodationId !== 'all' || 
               filters.roomId !== 'all' || filters.search
                ? 'Không tìm thấy yêu cầu nào phù hợp với bộ lọc'
                : 'Chưa có yêu cầu thuê nào được gửi đến'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <RentalRequestCard
                key={request._id}
                request={request}
                accommodationName={getAccommodationName(request.accommodationId)}
                roomInfo={getRoomInfo(request.roomId)}
                onViewDetails={() => handleViewDetails(request)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {showDetails && selectedRequest && (
        <RentalRequestDetails
          request={selectedRequest}
          onClose={() => setShowDetails(false)}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
        />
      )}
    </div>
  );
};

export default RentalRequestManagement;