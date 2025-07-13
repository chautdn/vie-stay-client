import React, { useState, useEffect } from 'react';
import { useRentalRequestStore } from '../../store/owner/rentalRequestStore';
import { useAccommodationStore } from '../../store/owner/accommodationStore';
import { useRoomStore } from '../../store/owner/roomStore';
import {
  RequestStats,
  RequestFilters, 
  RentalRequestList
} from '../../components/ownerPageComponents/rentalRequestComponent';
import { RefreshCw, Users, AlertCircle } from 'lucide-react';

const RentalRequestManagement = () => {
  const {
    rentalRequests,
    pagination,
    stats,
    isLoading,
    error,
    getRentalRequests,
    getRentalRequestDetails,
    acceptRentalRequest,
    rejectRentalRequest,
    deleteRentalRequest,
    getStats,
    clearError
  } = useRentalRequestStore();

  const { accommodations } = useAccommodationStore();
  const { rooms } = useRoomStore();

  const [filters, setFilters] = useState({
    status: 'all',
    accommodationId: 'all',
    roomId: 'all',
    priority: 'all',
    search: '',
    page: 1,
    limit: 10
  });

  useEffect(() => {
    loadData();
    // Tạm thời bỏ loadStats vì API chưa có
    // loadStats();
  }, [filters.accommodationId, filters.roomId, filters.status]);

  const loadData = async () => {
    try {
      const params = {
        page: filters.page,
        limit: filters.limit
      };

      if (filters.status !== 'all') {
        params.status = filters.status;
      }
      
      if (filters.accommodationId !== 'all') {
        params.accommodationId = filters.accommodationId;
      }
      
      if (filters.roomId !== 'all') {
        params.roomId = filters.roomId;
      }

      await getRentalRequests(params);
    } catch (error) {
      console.error('Failed to load rental requests:', error);
    }
  };

  const loadStats = async () => {
    try {
      // await getStats();
      console.log('Stats API not available yet');
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  // Filter requests client-side for search and priority
  const filteredRequests = rentalRequests.filter(request => {
    let matches = true;

    // Priority filter (client-side)
    if (filters.priority !== 'all' && request.priority !== filters.priority) {
      matches = false;
    }

    // Search filter (client-side)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const tenantName = request.tenantId?.fullName?.toLowerCase() || '';
      const tenantEmail = request.tenantId?.email?.toLowerCase() || '';
      
      if (!tenantName.includes(searchLower) && !tenantEmail.includes(searchLower)) {
        matches = false;
      }
    }

    return matches;
  });

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const handleRefresh = () => {
    loadData();
    loadStats();
  };

  const handleAcceptRequest = async (requestId, acceptData) => {
    try {
      await acceptRentalRequest(requestId, acceptData);
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleRejectRequest = async (requestId, responseMessage) => {
    try {
      await rejectRentalRequest(requestId, responseMessage);
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa yêu cầu này?')) {
      try {
        await deleteRentalRequest(requestId);
        await loadData(); // Refresh data
      } catch (error) {
        console.error('Failed to delete request:', error);
      }
    }
  };

  // Helper functions
  const getAccommodationName = (accommodationId) => {
    const accId = typeof accommodationId === 'string' ? accommodationId : accommodationId?._id;
    const accommodation = accommodations.find(acc => acc._id === accId);
    return accommodation?.name || `Accommodation ${accId?.slice(-6)}`;
  };

  const getRoomInfo = (roomId) => {
    const roomIdStr = typeof roomId === 'object' ? roomId?._id : roomId;
    const room = rooms.find(r => r._id === roomIdStr);
    
    return room ? {
      name: room.name || `Phòng ${room.roomNumber}`,
      roomNumber: room.roomNumber,
      price: room.baseRent
    } : {
      name: roomIdStr ? `Room ${roomIdStr.slice(-6)}` : 'N/A',
      roomNumber: 'N/A',
      price: null
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Quản lý yêu cầu thuê nhà
                </h1>
                <p className="text-gray-600 mt-1">
                  Xem và xử lý các yêu cầu thuê nhà từ khách hàng
                </p>
              </div>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <span className="text-xl">&times;</span>
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <RequestStats stats={stats} isLoading={isLoading} requests={filteredRequests} />

        {/* Filters */}
        <RequestFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Request List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Danh sách yêu cầu ({filteredRequests.length})
            </h2>
          </div>

          <RentalRequestList
            requests={filteredRequests}
            isLoading={isLoading}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
            onDelete={handleDeleteRequest}
            onViewDetails={getRentalRequestDetails}
            getAccommodationName={getAccommodationName}
            getRoomInfo={getRoomInfo}
          />
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border p-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>
              
              {[...Array(pagination.totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      page === pagination.currentPage
                        ? 'text-blue-600 bg-blue-50 border border-blue-200'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalRequestManagement;