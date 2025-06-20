import React from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Users, 
  Home, 
  Clock, 
  Shield,
  Wifi,
  Car,
  Star,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit
} from 'lucide-react';

const AccommodationDetailModal = ({ accommodation, isOpen, onClose, onEdit }) => {
  if (!isOpen || !accommodation) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Đã duyệt";
      case "pending":
        return "Chờ duyệt";
      case "rejected":
        return "Từ chối";
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type) => {
    const typeMap = {
      duplex: "Duplex",
      house: "Nhà riêng",
      apartment_building: "Chung cư",
      hotel: "Khách sạn",
      motel: "Nhà nghỉ",
      hostel: "Hostel",
      guesthouse: "Nhà trọ",
      resort: "Resort",
      villa: "Villa",
      homestay: "Homestay",
    };
    return typeMap[type] || type;
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "parking":
        return <Car className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const occupancyRate = accommodation.totalRooms > 0 
    ? ((accommodation.totalRooms - (accommodation.availableRooms || 0)) / accommodation.totalRooms) * 100 
    : 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price || 0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">{accommodation.name}</h2>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(accommodation.approvalStatus)}`}>
                {getStatusIcon(accommodation.approvalStatus)}
                <span className="ml-1">{getStatusText(accommodation.approvalStatus)}</span>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {getTypeLabel(accommodation.type)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit && onEdit(accommodation)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Images & Basic Info */}
              <div className="space-y-6">
                {/* Images */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Hình ảnh</h3>
                  {accommodation.images && accommodation.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {accommodation.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`${accommodation.name} - ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400';
                            }}
                          />
                          {index === 3 && accommodation.images.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white font-semibold">+{accommodation.images.length - 4} ảnh</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Home className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <span className="text-gray-500">Chưa có hình ảnh</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {accommodation.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả</h3>
                    <p className="text-gray-600 leading-relaxed">{accommodation.description}</p>
                  </div>
                )}

                {/* Room Statistics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Thống kê phòng</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Home className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Tổng phòng</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{accommodation.totalRooms || 0}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">Đã thuê</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {(accommodation.totalRooms || 0) - (accommodation.availableRooms || 0)}
                      </p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium text-yellow-900">Tỷ lệ lấp đầy</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-600">{occupancyRate.toFixed(0)}%</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Home className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-purple-900">Còn trống</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{accommodation.availableRooms || 0}</p>
                    </div>
                  </div>

                  {/* Occupancy Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Tỷ lệ lấp đầy</span>
                      <span className="text-sm font-semibold text-blue-600">{occupancyRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${occupancyRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Địa chỉ</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{accommodation.address?.street}</p>
                        <p className="text-gray-600">
                          {accommodation.address?.ward}, {accommodation.address?.district}
                        </p>
                        <p className="text-gray-600">{accommodation.address?.city}</p>
                        {accommodation.address?.fullAddress && (
                          <p className="text-sm text-gray-500 mt-1">{accommodation.address.fullAddress}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin liên hệ</h3>
                  <div className="space-y-3">
                    {accommodation.contactInfo?.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-900">{accommodation.contactInfo.phone}</span>
                      </div>
                    )}
                    {accommodation.contactInfo?.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-900">{accommodation.contactInfo.email}</span>
                      </div>
                    )}
                    {accommodation.contactInfo?.website && (
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-gray-600" />
                        <a 
                          href={accommodation.contactInfo.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {accommodation.contactInfo.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                {accommodation.amenities && accommodation.amenities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tiện nghi</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {accommodation.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg"
                        >
                          {getAmenityIcon(amenity)}
                          <span className="capitalize text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Policies */}
                {accommodation.policies && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Chính sách</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      {accommodation.policies.checkInTime && (
                        <div className="flex items-center space-x-3">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-900">
                            Check-in: {accommodation.policies.checkInTime}
                          </span>
                        </div>
                      )}
                      {accommodation.policies.checkOutTime && (
                        <div className="flex items-center space-x-3">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-900">
                            Check-out: {accommodation.policies.checkOutTime}
                          </span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${accommodation.policies.smokingAllowed ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span>Hút thuốc: {accommodation.policies.smokingAllowed ? 'Cho phép' : 'Không cho phép'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${accommodation.policies.petsAllowed ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span>Thú cưng: {accommodation.policies.petsAllowed ? 'Cho phép' : 'Không cho phép'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${accommodation.policies.partiesAllowed ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span>Tiệc tùng: {accommodation.policies.partiesAllowed ? 'Cho phép' : 'Không cho phép'}</span>
                        </div>
                      </div>

                      {accommodation.policies.quietHours && (accommodation.policies.quietHours.start || accommodation.policies.quietHours.end) && (
                        <div className="flex items-center space-x-3">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-900">
                            Giờ yên tĩnh: {accommodation.policies.quietHours.start} - {accommodation.policies.quietHours.end}
                          </span>
                        </div>
                      )}

                      {accommodation.policies.additionalRules && accommodation.policies.additionalRules.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-2">Quy định khác:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {accommodation.policies.additionalRules.map((rule, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-gray-400">•</span>
                                <span>{rule}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin hệ thống</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Tạo lúc: {new Date(accommodation.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                    {accommodation.updatedAt && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Cập nhật lúc: {new Date(accommodation.updatedAt).toLocaleString('vi-VN')}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Trạng thái: {accommodation.isActive ? 'Đang hoạt động' : 'Đã ẩn'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetailModal;