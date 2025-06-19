"use client"

import { MapPin, Users, Eye, Edit, Star, Wifi, Car, Shield, Clock, EyeOff } from "lucide-react"

function AccommodationCard({ acc, onView, onEdit, onToggleActive }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

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
    }
    return typeMap[type] || type
  }

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Đã duyệt"
      case "pending":
        return "Chờ duyệt"
      case "rejected":
        return "Từ chối"
      default:
        return status
    }
  }

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="h-3 w-3" />
      case "parking":
        return <Car className="h-3 w-3" />
      case "security":
        return <Shield className="h-3 w-3" />
      default:
        return null
    }
  }

  const occupancyRate = acc.totalRooms > 0 ? ((acc.totalRooms - (acc.availableRooms || 0)) / acc.totalRooms) * 100 : 0

  return (
    <div
      className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 ${!acc.isActive ? "opacity-60" : ""}`}
    >
      {/* Image Section */}
      <div className="relative h-52 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        {acc.images && acc.images.length > 0 ? (
          <img
            src={acc.images[0] || "/placeholder.svg"}
            alt={acc.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="h-8 w-8 text-blue-500" />
              </div>
              <span className="text-gray-500 text-sm">Chưa có ảnh</span>
            </div>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status & Type Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${getStatusColor(acc.approvalStatus)}`}
          >
            {getStatusText(acc.approvalStatus)}
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-gray-700 border border-white/50 backdrop-blur-sm">
            {getTypeLabel(acc.type)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onView && onView(acc)
              }}
              className="p-2.5 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit && onEdit(acc)
              }}
              className="p-2.5 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4 text-white" />
            </button>
            {/* <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleActive && onToggleActive(acc)
              }}
              className={`p-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
                acc.isActive ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"
              }`}
              title={acc.isActive ? "Ẩn nhà trọ" : "Hiện nhà trọ"}
            >
              {acc.isActive ? <EyeOff className="h-4 w-4 text-white" /> : <Eye className="h-4 w-4 text-white" />}
            </button> */}
          </div>
        </div>

        {/* Featured Badge */}
        {acc.isFeatured && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
              <Star className="h-3 w-3 mr-1" />
              Nổi bật
            </div>
          </div>
        )}

        {/* Inactive Overlay */}
        {!acc.isActive && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <div className="bg-white/90 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-gray-700">Đã ẩn</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title & Rating */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 flex-1 mr-2">{acc.name}</h3>
          {acc.averageRating > 0 && (
            <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-semibold text-yellow-700">{acc.averageRating.toFixed(1)}</span>
              <span className="text-yellow-600 text-sm">({acc.totalReviews})</span>
            </div>
          )}
        </div>

        {/* Description */}
        {acc.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{acc.description}</p>
        )}

        {/* Address */}
        <div className="flex items-start space-x-2 mb-4">
          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-600 line-clamp-2">
            {acc.address?.fullAddress || `${acc.address?.street}, ${acc.address?.ward}, ${acc.address?.district}`}
          </span>
        </div>

        {/* Room Stats */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">
                {acc.totalRooms - (acc.availableRooms || 0)}/{acc.totalRooms} phòng đã thuê
              </span>
            </div>
            <span className="text-sm font-semibold text-blue-600">{occupancyRate.toFixed(0)}%</span>
          </div>

          {/* Progress Bar */}
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
            <div className="flex flex-wrap gap-2">
              {acc.amenities.slice(0, 4).map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs"
                >
                  {getAmenityIcon(amenity)}
                  <span className="capitalize">{amenity}</span>
                </div>
              ))}
              {acc.amenities.length > 4 && (
                <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                  +{acc.amenities.length - 4} khác
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Cập nhật {new Date(acc.updatedAt || acc.createdAt).toLocaleDateString("vi-VN")}</span>
          </div>

          {!acc.isActive && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">Đã ẩn</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccommodationCard
