import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomStore } from '../../store/owner/roomStore';
import { useAuthStore } from '../../store/authStore'; // ✅ THÊM: Import useAuthStore
import { useNotification } from '../../components/common/NotificationSystem';
import RoomList from '../../components/ownerPageComponents/RoomList';
import RoomForm from '../../components/ownerPageComponents/RoomForm';
import RoomDetails from '../../components/ownerPageComponents/RoomDetails';
import RoomToPostModal from '../../components/modals/RoomToPostModal';
import axiosInstance from '../../utils/AxiosInstance';
import { Plus, ArrowLeft, Home, Building } from 'lucide-react';

const RoomManagement = () => {
  const { accommodationId } = useParams();
  const navigate = useNavigate();
  
  // ✅ THÊM: Lấy user từ auth store
  const { user } = useAuthStore();
  const { success, error } = useNotification();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [roomForDetails, setRoomForDetails] = useState(null);
  
  // Post creation states
  const [showPostModal, setShowPostModal] = useState(false);
  const [roomForPost, setRoomForPost] = useState(null);
  const [accommodation, setAccommodation] = useState(null);
  const [loadingAccommodation, setLoadingAccommodation] = useState(false);

  const {
    rooms,
    isLoading: roomsLoading,
    getRoomsByAccommodationId,
    createRoom,
    updateRoom,
    deactivateRoom,
    reactivateRoom
  } = useRoomStore();

  useEffect(() => {
    console.log('🔄 accommodationId changed:', accommodationId);
    console.log('👤 Current user:', user);
    
    if (accommodationId) {
      console.log('📞 Calling getRoomsByAccommodationId and fetchAccommodationDetails');
      getRoomsByAccommodationId(accommodationId);
      fetchAccommodationDetails();
    } else {
      console.warn('⚠️ No accommodationId provided');
    }
  }, [accommodationId, getRoomsByAccommodationId, user]);

  // ✅ CẢI THIỆN: fetchAccommodationDetails với better error handling
  const fetchAccommodationDetails = async () => {
    try {
      setLoadingAccommodation(true);
      
      console.log('🔍 Fetching accommodation details for ID:', accommodationId);
      
      // Validate accommodationId
      if (!accommodationId) {
        throw new Error('Accommodation ID is missing');
      }

      if (!accommodationId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Invalid accommodation ID format');
      }

      const response = await axiosInstance.get(`/api/accommodations/${accommodationId}`);
      
      console.log('✅ Accommodation response:', response.data);
      
      // Handle different response formats
      const accommodationData = response.data.data?.accommodation || response.data.data || response.data;
      
      if (!accommodationData) {
        throw new Error('No accommodation data received from server');
      }

      setAccommodation(accommodationData);
      console.log('✅ Accommodation set successfully:', accommodationData.name);
      
    } catch (err) {
      console.error('❌ Error fetching accommodation:', err);
      
      // Detailed error handling
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error || 'Server error';
        
        switch (status) {
          case 401:
            error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            break;
          case 403:
            error('Bạn không có quyền truy cập tòa nhà này.');
            break;
          case 404:
            error('Không tìm thấy tòa nhà. Có thể tòa nhà đã bị xóa.');
            break;
          default:
            error(`Lỗi ${status}: ${message}`);
        }
      } else if (err.request) {
        error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        error(err.message || 'Có lỗi xảy ra khi tải thông tin tòa nhà');
      }
    } finally {
      setLoadingAccommodation(false);
    }
  };

  const handleCreateRoom = async (roomData) => {
    try {
      await createRoom(roomData);
      setShowCreateForm(false);
      success('Tạo phòng thành công!');
    } catch (err) {
      console.error('Error creating room:', err);
      error('Có lỗi xảy ra khi tạo phòng');
    }
  };

  const handleUpdateRoom = async (roomData) => {
    try {
      await updateRoom(selectedRoom._id, roomData);
      setSelectedRoom(null);
      success('Cập nhật phòng thành công!');
    } catch (err) {
      console.error('Error updating room:', err);
      error('Có lỗi xảy ra khi cập nhật phòng');
    }
  };

  const handleViewDetails = (room) => {
    setRoomForDetails(room);
    setShowRoomDetails(true);
  };

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
  };

  const handleToggleAvailability = async (room) => {
    try {
      if (room.isAvailable) {
        await deactivateRoom(room._id);
        success('Đã ẩn phòng thành công');
      } else {
        await reactivateRoom(room._id);
        success('Đã kích hoạt phòng thành công');
      }
      
      // Refresh room list
      await getRoomsByAccommodationId(accommodationId);
    } catch (err) {
      console.error('Error toggling room availability:', err);
      error(err.message || 'Có lỗi xảy ra khi thay đổi trạng thái phòng');
    }
  };

  const handleDeleteRoom = async (room) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      try {
        // Implement delete functionality
        console.log('Delete room:', room._id);
        success('Xóa phòng thành công!');
      } catch (err) {
        console.error('Error deleting room:', err);
        error(err.message || 'Có lỗi xảy ra khi xóa phòng');
      }
    }
  };

  // ✅ CẢI THIỆN: Handle create post from room
  const handleCreatePost = (room) => {
    console.log('🎯 handleCreatePost called with room:', room);
    console.log('📍 Current accommodation:', accommodation);
    console.log('🔄 Loading state:', loadingAccommodation);
    
    if (!accommodation) {
      console.warn('⚠️ No accommodation data available');
      error('Đang tải thông tin tòa nhà, vui lòng thử lại sau');
      return;
    }
    
    if (!room.isAvailable) {
      console.warn('⚠️ Room is not available:', room);
      error('Chỉ có thể tạo tin đăng cho phòng đang khả dụng');
      return;
    }

    console.log('✅ All checks passed, opening post modal');
    setRoomForPost(room);
    setShowPostModal(true);
  };

  // Handle post creation success
  const handlePostCreated = (createdPost) => {
    success('Tin đăng đã được tạo thành công!', {
      action: {
        label: 'Xem tin đăng',
        onClick: () => navigate('/owner/posts')
      }
    });
    setShowPostModal(false);
    setRoomForPost(null);
  };

  // ✅ THÊM: Debug info panel (chỉ hiển thị khi development)
  const renderDebugInfo = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
        <strong>Debug Info:</strong>
        <div>AccommodationId: {accommodationId || 'Missing'}</div>
        <div>User ID: {user?.id || 'Missing'}</div>
        <div>User Role: {user?.role?.join(', ') || 'Missing'}</div>
        <div>Accommodation: {accommodation ? accommodation.name : 'Not loaded'}</div>
        <div>Loading: {loadingAccommodation ? 'Yes' : 'No'}</div>
        <div>Rooms Count: {rooms?.length || 0}</div>
      </div>
    );
  };

  if (roomsLoading || loadingAccommodation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">
          {loadingAccommodation ? 'Đang tải thông tin tòa nhà...' : 'Đang tải danh sách phòng...'}
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/owner/accommodations')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                <span>Quay lại</span>
              </button>
              <div className="flex items-center space-x-2">
                <Building size={24} className="text-blue-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Quản lý phòng
                  </h1>
                  {accommodation && (
                    <p className="text-sm text-gray-500">{accommodation.name}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Quick stats */}
              {rooms && rooms.length > 0 && (
                <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600 mr-4">
                  <span className="flex items-center">
                    <Building size={16} className="mr-1" />
                    {rooms.length} phòng
                  </span>
                  <span className="flex items-center">
                    <Home size={16} className="mr-1 text-green-600" />
                    {rooms.filter(r => r.isAvailable && (!r.currentTenant || r.currentTenant.length === 0)).length} trống
                  </span>
                </div>
              )}
              
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>Thêm phòng</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ✅ THÊM: Debug info */}
        {renderDebugInfo()}

        {/* Info banner for post creation */}
        {accommodation && rooms && rooms.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-800 mb-1">
                  💡 Tạo tin đăng từ phòng
                </h3>
                <p className="text-sm text-green-700">
                  Bấm nút "Đăng tin cho phòng này" trên mỗi phòng để tạo tin đăng tự động với thông tin phòng và tòa nhà
                </p>
              </div>
              <button
                onClick={() => navigate('/owner/posts')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Xem tin đã đăng
              </button>
            </div>
          </div>
        )}

        <RoomList
          rooms={rooms}
          onViewDetails={handleViewDetails}
          onEdit={handleEditRoom}
          onDelete={handleDeleteRoom}
          onToggleAvailability={handleToggleAvailability}
          onCreatePost={handleCreatePost}
          isLoading={roomsLoading}
        />
      </div>

      {/* Create Room Modal */}
      {showCreateForm && (
        <RoomForm
          onSubmit={handleCreateRoom}
          onCancel={() => setShowCreateForm(false)}
          accommodationId={accommodationId}
        />
      )}

      {/* Edit Room Modal */}
      {selectedRoom && (
        <RoomForm
          room={selectedRoom}
          onSubmit={handleUpdateRoom}
          onCancel={() => setSelectedRoom(null)}
          accommodationId={accommodationId}
        />
      )}

      {/* Room Details Modal */}
      {showRoomDetails && roomForDetails && (
        <RoomDetails
          room={roomForDetails}
          onClose={() => {
            setShowRoomDetails(false);
            setRoomForDetails(null);
          }}
          onEdit={() => {
            setSelectedRoom(roomForDetails);
            setShowRoomDetails(false);
            setRoomForDetails(null);
          }}
        />
      )}

      {/* Room to Post Modal */}
      {showPostModal && roomForPost && accommodation && (
        <RoomToPostModal
          isOpen={showPostModal}
          onClose={() => {
            setShowPostModal(false);
            setRoomForPost(null);
          }}
          room={roomForPost}
          accommodation={accommodation}
          onSuccess={handlePostCreated}
        />
      )}
    </div>
  );
};

export default RoomManagement;