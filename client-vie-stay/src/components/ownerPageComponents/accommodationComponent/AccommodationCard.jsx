"use client"

import { Eye, Edit, ToggleLeft, ToggleRight, MapPin, Home, Users } from "lucide-react"

function AccommodationCard({ acc, onView, onEdit, onToggleActive, onManageRooms }) { // ✅ THÊM: onManageRooms prop
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

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return "📶";
      case "parking":
        return "🚗";
      case "security":
        return "🛡️";
      case "laundry":
        return "🧺";
      case "air_conditioning":
        return "❄️";
      case "elevator":
        return "🛗";
      default:
        return "⭐";
    }
  };

  const occupancyRate = acc.totalRooms > 0 
    ? Math.round(((acc.totalRooms - (acc.availableRooms || 0)) / acc.totalRooms) * 100) 
    : 0;

  const occupiedRooms = (acc.totalRooms || 0) - (acc.availableRooms || 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={acc.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'}
          alt={acc.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400';
          }}
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(acc.approvalStatus)}`}>
            {getStatusText(acc.approvalStatus)}
          </span>
        </div>

        {/* Active/Inactive Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            acc.isActive 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-gray-100 text-gray-800 border border-gray-200'
          }`}>
            {acc.isActive ? 'Hiển thị' : 'Đã ẩn'}
          </span>
        </div>

        {/* Type Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            {getTypeLabel(acc.type)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {acc.name}
        </h3>

        {/* Address */}
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm line-clamp-1">
            {acc.address?.street}, {acc.address?.ward}, {acc.address?.district}
          </span>
        </div>

        {/* ✅ THÊM: Room Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-medium">Tổng phòng</p>
                <p className="text-lg font-bold text-blue-900">{acc.totalRooms || 0}</p>
              </div>
              <Home className="h-5 w-5 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 font-medium">Đã thuê</p>
                <p className="text-lg font-bold text-green-900">{occupiedRooms}</p>
              </div>
              <Users className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Tỷ lệ lấp đầy</span>
            <span className="text-sm font-semibold text-blue-600">{occupancyRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Amenities */}
        {acc.amenities && acc.amenities.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Tiện nghi:</p>
            <div className="flex flex-wrap gap-1">
              {acc.amenities.slice(0, 4).map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
                >
                  <span className="mr-1">{getAmenityIcon(amenity)}</span>
                  {amenity}
                </span>
              ))}
              {acc.amenities.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                  +{acc.amenities.length - 4} khác
                </span>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {acc.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {acc.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(acc)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4 mr-1" />
              Xem
            </button>
            <button
              onClick={() => onManageRooms && onManageRooms(acc._id)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              title="Quản lý phòng"
            >
              <Home className="h-4 w-4 mr-1" />
              Phòng
            </button>

            {/* Edit Button */}
            <button
              onClick={() => onEdit(acc)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4 mr-1" />
              Sửa
            </button>
          </div>

          {/* Toggle Active Button */}
          <button
            onClick={() => onToggleActive(acc)}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              acc.isActive
                ? "text-orange-600 bg-orange-50 hover:bg-orange-100"
                : "text-green-600 bg-green-50 hover:bg-green-100"
            }`}
            title={acc.isActive ? "Ẩn khỏi danh sách" : "Hiển thị trong danh sách"}
          >
            {acc.isActive ? (
              <>
                <ToggleRight className="h-4 w-4 mr-1" />
                Ẩn
              </>
            ) : (
              <>
                <ToggleLeft className="h-4 w-4 mr-1" />
                Hiện
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccommodationCard