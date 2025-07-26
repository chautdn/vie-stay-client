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
  CheckCircle,
  FileText,
  Eye,
  Download
} from 'lucide-react';
import { useRoomAgreements } from '../../hooks/useAgreements';

const RoomDetails = ({ room, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [roomInfo, setRoomInfo] = useState(null);
  
  const {
    tenantsByRoom,
    getMyTenantsByRoomId,
    isLoading: tenantsLoading
  } = useTenantStore();

  // Thêm hook để fetch agreements
  const { 
    agreements, 
    isLoading: agreementsLoading, 
    error: agreementsError,
    downloadAgreement 
  } = useRoomAgreements(room?._id);

  useEffect(() => {
    if (room?._id) {
      // Load tenants for this specific room
      getMyTenantsByRoomId(room._id)
        .then(result => {
          if (result.roomInfo) {
            setRoomInfo(result.roomInfo);
          }
        })
        .catch(error => {
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

  // Helper function to handle download
  const handleDownloadAgreement = async (agreement) => {
    try {
      await downloadAgreement(agreement._id, agreement.fileName);
    } catch (error) {
      alert('Không thể tải hợp đồng: ' + error.message);
    }
  };

  // Helper function to view agreement (open in new tab)
  const handleViewAgreement = async (agreement) => {
    try {
      const response = await fetch(`/api/tenancy-agreements/${agreement._id}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      alert('Không thể xem hợp đồng: ' + error.message);
    }
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
                Sức chứa: {roomInfo?.currentTenantCount || roomTenants.length}/{roomInfo?.capacity || room.capacity} người
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
              { 
                id: 'tenants', 
                label: `Người thuê (${roomTenants.length}/${roomInfo?.capacity || room.capacity})`, 
                icon: Users 
              },
              { 
                id: 'agreements', 
                label: `Hợp đồng (${agreements.length})`, 
                icon: FileText 
              }
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
                  Người đang thuê ({roomTenants.length}/{roomInfo?.capacity || room.capacity})
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
                    <div key={tenant._id || index} className="border rounded-lg p-6 bg-white shadow-sm">
                      
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
                              
                              {/* Tenant Type Badge */}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                tenant.isPrimaryTenant
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {tenant.isPrimaryTenant ? 'Người thuê chính' : 'Người ở chung'}
                              </span>
                              
                              {/* Role Badge */}
                              {tenant.role && tenant.role.length > 0 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                                  {tenant.role.join(', ')}
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
                              {tenant.joinedAt && (
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} />
                                  <span>Tham gia: {formatDate(tenant.joinedAt)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex border-b border-gray-200 mb-4">

                      {/* National ID Image */}
                      {tenant.nationalIdFrontImage && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-gray-900 mb-3">CCCD (Mặt trước)</h5>
                          <img 
                            src={tenant.nationalIdFrontImage} 
                            alt="CCCD"
                            className="max-w-xs h-32 object-cover rounded border"
                            onClick={() => window.open(tenant.nationalIdBackImage, '_blank')}
                          />
                        </div>
                      )}
                      {tenant.nationalIdBackImage && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-gray-900 mb-3">CCCD (Mặt sau)</h5>
                          <img 
                            src={tenant.nationalIdBackImage} 
                            alt="CCCD"
                            className="max-w-xs h-32 object-cover rounded border"
                            onClick={() => window.open(tenant.nationalIdBackImage, '_blank')}
                          />
                        </div>
                      )}
                      {tenant.nationalIdVerified && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-gray-900 mb-3">Xác thực CCCD</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${tenant.nationalIdVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {tenant.nationalIdVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                          </span>
                        </div>
                      )}
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                        <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          Xem chi tiết
                        </button>
                        {tenant.isCoTenant && (
                          <button className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            Xóa khỏi phòng
                          </button>
                        )}
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

          {/* Agreements Tab */}
          {activeTab === 'agreements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Hợp đồng thuê phòng ({agreements.length})
                </h3>
                {agreementsLoading && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                )}
              </div>

              {agreementsError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {agreementsError}
                </div>
              )}

              {agreements.length === 0 ? (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chưa có hợp đồng
                  </h3>
                  <p className="text-gray-500">
                    Phòng này chưa có hợp đồng thuê nào
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {agreements.map((agreement, index) => (
                    <div key={agreement._id} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                      
                      {/* Agreement Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <FileText size={24} className="text-red-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {agreement.title}
                              </h4>
                              
                              {/* Status Badge */}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                agreement.status === 'active'
                                  ? 'bg-green-100 text-green-800' 
                                  : agreement.status === 'expired'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {agreement.status === 'active' ? 'Đang hiệu lực' : 
                                 agreement.status === 'expired' ? 'Hết hạn' : 'Chờ xử lý'}
                              </span>
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <User size={14} />
                                <span>Người thuê: {agreement.tenant.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                <span>Từ ngày: {new Date(agreement.startDate).toLocaleDateString("vi-VN")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                <span>Đến ngày: {new Date(agreement.endDate).toLocaleDateString("vi-VN")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign size={14} />
                                <span>Tiền thuê: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(agreement.monthlyRent)}/tháng</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* PDF File Display */}
                      {agreement.canDownload && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-gray-900 mb-3">File hợp đồng đã ký</h5>
                          <div className="flex items-center justify-between bg-white border rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <FileText size={20} className="text-red-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {agreement.fileName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {agreement.fileSize} • Đã ký ngày {new Date(agreement.signedAt).toLocaleDateString("vi-VN")}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => handleViewAgreement(agreement)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Xem hợp đồng"
                              >
                                <Eye size={18} />
                              </button>
                              <button 
                                onClick={() => handleDownloadAgreement(agreement)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Tải xuống"
                              >
                                <Download size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                        <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          Xem chi tiết
                        </button>
                        {agreement.status === 'active' && (
                          <button className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            Chấm dứt hợp đồng
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
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