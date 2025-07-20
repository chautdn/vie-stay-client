import React, { useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useAccommodationStore } from '../../../store/owner/accommodationStore';
import { useRoomStore } from '../../../store/owner/roomStore';

const RequestFilters = ({ 
  filters, 
  onFilterChange
}) => {
  const {
    accommodations,
    getAllAccommodations,
    isLoading: accommodationsLoading
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
      } catch (error) {
        console.error('Error loading filter data:', error);
      }
    };
    
    loadData();
  }, [getAllAccommodations, getAllRooms]);

  // Load rooms when accommodation filter changes
  useEffect(() => {
    const loadRoomsByAccommodation = async () => {
      if (filters.accommodationId && filters.accommodationId !== 'all') {
        try {
          await getRoomsByAccommodationId(filters.accommodationId);
        } catch (error) {
          console.error('Error loading rooms by accommodation:', error);
        }
      }
    };

    if (filters.accommodationId && filters.accommodationId !== 'all') {
      loadRoomsByAccommodation();
    }
  }, [filters.accommodationId, getRoomsByAccommodationId]);

  // Get rooms for selected accommodation
  const accommodationRooms = filters.accommodationId === 'all' 
    ? [] 
    : rooms.filter(room => {
        const roomAccId = room.accommodationId?._id || room.accommodationId;
        return roomAccId === filters.accommodationId;
      });

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'accepted', label: 'Đã chấp nhận' },
    { value: 'rejected', label: 'Đã từ chối' },
    { value: 'withdrawn', label: 'Đã rút lại' }
  ];

  // Handler cho accommodation filter change
  const handleAccommodationChange = (accommodationId) => {
    onFilterChange({
      ...filters, 
      accommodationId: accommodationId,
      roomId: 'all'
    });
  };

  // Reset all filters
  const resetFilters = () => {
    onFilterChange({
      status: 'all',
      accommodationId: 'all',
      roomId: 'all',
      priority: 'all',
      search: ''
    });
  };

  // Check if any filter is active
  const hasActiveFilters = filters.status !== 'all' || 
                          filters.accommodationId !== 'all' || 
                          filters.roomId !== 'all' || 
                          filters.priority !== 'all' || 
                          filters.search;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">Bộ lọc</h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-3 py-1 text-xs text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={14} />
            Xóa bộ lọc
          </button>
        )}
      </div>

      <div className="grid grid-cols-5 gap-3">
        {/* Search */}
        <div className="col-span-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm khách thuê..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Accommodation Filter */}
        <div>
          <select
            value={filters.accommodationId || 'all'}
            onChange={(e) => handleAccommodationChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={accommodationsLoading}
          >
            <option value="all">
              {accommodationsLoading ? 'Đang tải...' : 'Tất cả tòa nhà'}
            </option>
            {accommodations.map(accommodation => (
              <option key={accommodation._id} value={accommodation._id}>
                {accommodation.name}
              </option>
            ))}
          </select>
        </div>

        {/* Room Filter */}
        <div>
          <select
            value={filters.roomId || 'all'}
            onChange={(e) => onFilterChange({ ...filters, roomId: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={filters.accommodationId === 'all' || roomsLoading}
          >
            <option value="all">
              {filters.accommodationId === 'all' 
                ? 'Chọn tòa nhà trước' 
                : roomsLoading 
                  ? 'Đang tải...' 
                  : accommodationRooms.length === 0 
                    ? 'Không có phòng' 
                    : 'Tất cả phòng'}
            </option>
            {accommodationRooms.map(room => (
              <option key={room._id} value={room._id}>
                {room.name || room.title || `Phòng ${room.roomNumber}`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default RequestFilters;