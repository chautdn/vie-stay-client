import React from 'react';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Users, 
  DollarSign, 
  Home,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const RoomList = ({ 
  rooms, 
  onViewDetails, 
  onEdit, 
  onDelete, 
  onToggleAvailability,  // ✅ SỬA: Đổi tên từ onDeactivate
  isLoading 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusColor = (room) => {
    if (!room.isAvailable) return 'bg-red-100 text-red-800 border-red-200';
    
    const hasCurrentTenant = room.currentTenantCount > 0;
    if (hasCurrentTenant) return 'bg-blue-100 text-blue-800 border-blue-200';
    
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusText = (room) => {
    if (!room.isAvailable) return 'Không khả dụng';
    
    const hasCurrentTenant = room.currentTenantCount > 0;
    if (hasCurrentTenant) return 'Đã có người thuê';
    
    return 'Phòng trống';
  };

  const getStatusIcon = (room) => {
    if (!room.isAvailable) return <XCircle size={16} />;
    
    const hasCurrentTenant = room.currentTenantCount > 0;
    if (hasCurrentTenant) return <User size={16} />;
    
    return <CheckCircle size={16} />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <Home size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Chưa có phòng nào
        </h3>
        <p className="text-gray-500">
          Bắt đầu thêm phòng mới để quản lý chỗ ở của bạn
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Danh sách phòng ({rooms.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            {/* Room Image */}
            {room.images && room.images.length > 0 && (
              <div className="mb-4 aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={room.images[0]} 
                  alt={room.name || `Phòng ${room.roomNumber}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Room Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {room.name || `Phòng ${room.roomNumber}`}
                </h3>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(room)}`}>
                  {getStatusIcon(room)}
                  {getStatusText(room)}
                </div>
              </div>
            </div>

            {/* Room Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Loại phòng:</span>
                <span className="font-medium">{room.type}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sức chứa:</span>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span className="font-medium">{room.capacity} người</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Giá thuê:</span>
                <div className="flex items-center gap-1">
                  <DollarSign size={14} />
                  <span className="font-semibold text-blue-600">
                    {formatPrice(room.baseRent)}/tháng
                  </span>
                </div>
              </div>

              {/* Tenant Status */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tình trạng:</span>
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span className="font-medium">
                    {room.currentTenantCount || 0}/{room.capacity}
                    <span className="text-gray-500 ml-1">người thuê</span>
                  </span>
                </div>
              </div>

              {room.area && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Diện tích:</span>
                  <span className="font-medium">{room.area} m²</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => onViewDetails(room)}
                className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
              >
                <Eye size={16} />
                Chi tiết
              </button>
              
              <button
                onClick={() => onEdit(room)}
                className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
              >
                <Edit size={16} />
                Sửa
              </button>

              {/* ✅ SỬA: Toggle button với icon và text dynamic */}
              <button
                onClick={() => onToggleAvailability(room)}
                className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  room.isAvailable
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
                title={room.isAvailable ? "Vô hiệu hóa phòng" : "Kích hoạt phòng"}
                disabled={room.currentTenant} // ✅ THÊM: Disable nếu có tenant
              >
                {room.isAvailable ? (
                  <>
                    <ToggleLeft size={16} />
                    <span className="text-sm">Ẩn</span>
                  </>
                ) : (
                  <>
                    <ToggleRight size={16} />
                    <span className="text-sm">Hiện</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onDelete(room)}
                className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                title="Xóa phòng"
                disabled={room.currentTenant} // ✅ THÊM: Disable nếu có tenant
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* ✅ THÊM: Warning message nếu có tenant */}
            {room.currentTenant && (
              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                ⚠️ Không thể ẩn/xóa phòng đang có người thuê
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;