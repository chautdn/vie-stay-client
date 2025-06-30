import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomStore } from '../../store/owner/roomStore';
import RoomList from '../../components/ownerPageComponents/RoomList';
import RoomForm from '../../components/ownerPageComponents/RoomForm';
import RoomDetails from '../../components/ownerPageComponents/RoomDetails';
import { Plus, ArrowLeft, Home, Building } from 'lucide-react';

const RoomManagement = () => {
  const { accommodationId } = useParams();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [roomForDetails, setRoomForDetails] = useState(null);

  const {
    rooms,
    isLoading: roomsLoading,
    getRoomsByAccommodationId,
    createRoom,
    updateRoom,
    deactivateRoom,
    reactivateRoom // ✅ THÊM: Import reactivateRoom
  } = useRoomStore();

  useEffect(() => {
    if (accommodationId) {
      getRoomsByAccommodationId(accommodationId);
    }
  }, [accommodationId, getRoomsByAccommodationId]);

  const handleCreateRoom = async (roomData) => {
    try {
      await createRoom(roomData);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleUpdateRoom = async (roomData) => {
    try {
      await updateRoom(selectedRoom._id, roomData);
      setSelectedRoom(null);
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const handleViewDetails = (room) => {
    setRoomForDetails(room);
    setShowRoomDetails(true);
  };

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
  };

  // ✅ SỬA: Toggle availability handler
  const handleToggleAvailability = async (room) => {
    try {
      if (room.isAvailable) {
        await deactivateRoom(room._id);
      } else {
        await reactivateRoom(room._id);
      }
      
      // Refresh room list
      await getRoomsByAccommodationId(accommodationId);
    } catch (error) {
      console.error('Error toggling room availability:', error);
      // ✅ THÊM: Handle backend error nếu cần
      alert(error.message || 'Có lỗi xảy ra khi thay đổi trạng thái phòng');
    }
  };

  // ✅ SỬA: Tương tự cho handleDeleteRoom
  const handleDeleteRoom = async (room) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      try {
        // Implement delete functionality
        console.log('Delete room:', room._id);
      } catch (error) {
        console.error('Error deleting room:', error);
        // ✅ THÊM: Handle backend error
        alert(error.message || 'Có lỗi xảy ra khi xóa phòng');
      }
    }
  };

  if (roomsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                <h1 className="text-xl font-semibold text-gray-900">
                  Quản lý phòng
                </h1>
              </div>
            </div>

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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoomList
          rooms={rooms}
          onViewDetails={handleViewDetails}
          onEdit={handleEditRoom}
          onDelete={handleDeleteRoom}
          onToggleAvailability={handleToggleAvailability} // ✅ SỬA: Pass toggle handler
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
    </div>
  );
};

export default RoomManagement;