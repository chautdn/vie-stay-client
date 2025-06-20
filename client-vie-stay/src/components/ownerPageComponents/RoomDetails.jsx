import React, { useState, useEffect } from 'react';
import { useTenantStore } from '../../store/owner/tenantStore';
import { 
  X, 
  Home, 
  Users, 
  DollarSign, 
  Calendar, 
  User,
  Mail,
  Phone,
  Wifi,
  Car,
  Snowflake,
  Tv,
  Shield,
  Edit,
  UserX,
  CheckCircle
} from 'lucide-react';

const RoomDetails = ({ room, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState('info');
  
  const {
    tenantsByRoom,
    getMyTenantsByRoomId,
    isLoading: tenantsLoading
  } = useTenantStore();

  useEffect(() => {
    if (room?._id) {
      // Load tenants for this specific room
      getMyTenantsByRoomId(room._id).catch(error => {
        console.error('Failed to load tenants:', error);
      });
    }
  }, [room?._id, getMyTenantsByRoomId]);

  if (!room) return null;

  // Get tenants for this room from store
  const roomTenants = tenantsByRoom[room._id] || [];

  const getStatusColor = () => {
    switch (room.status) {
      case 'available':
        return 'border-green-200 text-green-800 bg-green-50';
      case 'occupied':
        return 'border-blue-200 text-blue-800 bg-blue-50';
      case 'maintenance':
        return 'border-yellow-200 text-yellow-800 bg-yellow-50';
      case 'unavailable':
        return 'border-red-200 text-red-800 bg-red-50';
      default:
        return 'border-gray-200 text-gray-800 bg-gray-50';
    }
  };

  const getStatusText = () => {
    switch (room.status) {
      case 'available':
        return 'Sẵn sàng';
      case 'occupied':
        return 'Đã thuê';
      case 'maintenance':
        return 'Bảo trì';
      case 'unavailable':
        return 'Không khả dụng';
      default:
        return room.status;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const amenityIcons = {
    'Wi-Fi': Wifi,
    'Điều hòa': Snowflake,
    'TV': Tv,
    'Bãi đỗ xe': Car,
    'An ninh 24/7': Shield,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Home size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {room.name || `Phòng ${room.roomNumber}`}
              </h2>
              <p className="text-sm text-gray-500">
                {room.type && room.type.charAt(0).toUpperCase() + room.type.slice(1)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </div>
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <nav className="flex space-x-8">
            {[{
              id: 'info', label: 'Thông tin phòng', icon: Home },
              { id: 'tenants', label: `Người thuê (${roomTenants.length})`, icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Tenants Tab */}
          {activeTab === 'tenants' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Người đang thuê ({roomTenants.length})
                </h3>
                {tenantsLoading && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                )}
              </div>

              {roomTenants.length === 0 ? (
                <div className="text-center py-12">
                  <UserX size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Phòng trống
                  </h3>
                  <p className="text-gray-500">
                    Phòng này hiện tại chưa có ai thuê
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {roomTenants.map((tenant, index) => (
                    <div key={tenant._id || tenant.agreementId || index} className="border rounded-lg p-6 bg-white shadow-sm">
                      
                      {/* Tenant Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            {tenant.profileImage ? (
                              <img 
                                src={tenant.profileImage} 
                                alt={tenant.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <User size={24} className="text-blue-600" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {tenant.name || 'Tên không xác định'}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                tenant.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {tenant.status === 'active' ? 'Đang thuê' : tenant.status}
                              </span>
                              {tenant.remainingDays && tenant.remainingDays <= 30 && tenant.remainingDays > 0 && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                  Sắp hết hạn ({tenant.remainingDays} ngày)
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-600">
                              {tenant.email && (
                                <div className="flex items-center gap-2">
                                  <Mail size={14} />
                                  <span>{tenant.email}</span>
                                </div>
                              )}
                              {tenant.phoneNumber && (
                                <div className="flex items-center gap-2">
                                  <Phone size={14} />
                                  <span>{tenant.phoneNumber}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contract Information */}
                      {(tenant.moveInDate || tenant.contractEndDate) && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-gray-900 mb-3">Thông tin hợp đồng</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            {tenant.moveInDate && (
                              <div>
                                <span className="text-gray-500 block">Ngày bắt đầu:</span>
                                <p className="font-medium">{formatDate(tenant.moveInDate)}</p>
                              </div>
                            )}
                            {tenant.contractEndDate && (
                              <div>
                                <span className="text-gray-500 block">Ngày kết thúc:</span>
                                <p className="font-medium">{formatDate(tenant.contractEndDate)}</p>
                              </div>
                            )}
                            {tenant.contractDuration && (
                              <div>
                                <span className="text-gray-500 block">Thời hạn:</span>
                                <p className="font-medium">{tenant.contractDuration} tháng</p>
                              </div>
                            )}
                            {tenant.remainingDays && (
                              <div>
                                <span className="text-gray-500 block">Còn lại:</span>
                                <p className="font-medium text-blue-600">{tenant.remainingDays} ngày</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Financial Information */}
                      {(tenant.monthlyRent || tenant.deposit || tenant.totalMonthlyCost) && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-gray-900 mb-3">Thông tin tài chính</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            {tenant.monthlyRent && (
                              <div>
                                <span className="text-gray-500 block">Giá thuê/tháng:</span>
                                <p className="font-semibold text-blue-600 text-lg">
                                  {formatPrice(tenant.monthlyRent)}
                                </p>
                              </div>
                            )}
                            {tenant.deposit && (
                              <div>
                                <span className="text-gray-500 block">Tiền cọc:</span>
                                <p className="font-semibold">{formatPrice(tenant.deposit)}</p>
                              </div>
                            )}
                            {tenant.totalMonthlyCost && (
                              <div>
                                <span className="text-gray-500 block">Tổng chi phí/tháng:</span>
                                <p className="font-semibold text-green-600">
                                  {formatPrice(tenant.totalMonthlyCost)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Additional Fees */}
                      {tenant.additionalFees && tenant.additionalFees.length > 0 && (
                        <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-gray-900 mb-3">Phí bổ sung</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {tenant.additionalFees.map((fee, feeIndex) => (
                              <div key={feeIndex} className="flex justify-between items-center">
                                <div>
                                  <span className="font-medium">{fee.name}</span>
                                  {fee.description && (
                                    <p className="text-xs text-gray-500">{fee.description}</p>
                                  )}
                                </div>
                                <span className="font-semibold text-yellow-700">
                                  {formatPrice(fee.amount)}/{fee.type === 'monthly' ? 'tháng' : 'lần'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Utility Rates */}
                      {tenant.utilityRates && Object.keys(tenant.utilityRates).length > 0 && (
                        <div className="bg-green-50 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-gray-900 mb-3">Phí tiện ích</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            {Object.entries(tenant.utilityRates).map(([utility, data]) => (
                              <div key={utility} className="text-center">
                                <span className="block text-gray-500 capitalize">{utility}:</span>
                                <span className="font-medium">
                                  {data.rate ? formatPrice(data.rate) : 'Bao gồm'}
                                </span>
                                {data.unit && (
                                  <span className="text-xs text-gray-400">/{data.unit}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {tenant.notes && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-gray-900 mb-2">Ghi chú</h5>
                          <p className="text-sm text-gray-700">{tenant.notes}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                        <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          Xem chi tiết
                        </button>
                        <button className="px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          Gia hạn hợp đồng
                        </button>
                        <button className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          Kết thúc hợp đồng
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Room Images */}
              {room.images && room.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh phòng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {room.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Room ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Room Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Số phòng:</span>
                      <span className="font-medium">{room.roomNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Loại phòng:</span>
                      <span className="font-medium">{room.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Diện tích:</span>
                      <span className="font-medium">{room.area || 'N/A'} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Giá thuê:</span>
                      <span className="font-medium text-green-600">{formatPrice(room.baseRent)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tiện nghi</h3>
                  {room.amenities && room.amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Chưa có thông tin tiện nghi</p>
                  )}
                </div>
              </div>

              {/* Description */}
              {room.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mô tả</h3>
                  <p className="text-gray-700">{room.description}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;