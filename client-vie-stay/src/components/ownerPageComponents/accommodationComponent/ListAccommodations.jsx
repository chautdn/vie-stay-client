"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, RefreshCw, Building2, SlidersHorizontal, X, AlertCircle } from "lucide-react"
import AccommodationCard from "./AccommodationCard"
import AccommodationDetailModal from "./AccommodationDetailModal"
import Pagination from "./Pagination"
import { ACCOMMODATION_ROUTES, apiClient } from "../../../store/owner/accommodationRoutes"

function ListAccommodations() {
  const [accommodations, setAccommodations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Modal states
  const [selectedAccommodation, setSelectedAccommodation] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Pagination
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 9

  // Filters
  const [filters, setFilters] = useState({
    keyword: "",
    type: "",
    district: "",
    approvalStatus: "",
    isActive: "",
    amenities: "",
  })

  const navigate = useNavigate()

  // Sử dụng endpoint /me thay vì query với ownerId
  const fetchAccommodations = async () => {
    setLoading(true)
    setError("")

    try {
     
      
      const response = await apiClient.get('/api/accommodations/me')
      

      
      let accommodationsData = []
      
      if (response.data) {
       
        if (Array.isArray(response.data)) {
          accommodationsData = response.data
        }
       
        else if (response.data && typeof response.data === 'object') {
          
          accommodationsData = response.data.accommodations || 
                               response.data.results || 
                               response.data.items || 
                               response.data.data ||
                               []
        }
      }
      
     
     
      if (!Array.isArray(accommodationsData)) {
        console.warn("⚠️ accommodationsData is not array:", accommodationsData)
        accommodationsData = []
      }

      
      let filteredData = accommodationsData

      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase()
        filteredData = filteredData.filter(acc => 
          acc.name?.toLowerCase().includes(keyword) ||
          acc.address?.toLowerCase().includes(keyword) ||
          acc.description?.toLowerCase().includes(keyword)
        )
      }

      if (filters.type) {
        filteredData = filteredData.filter(acc => acc.type === filters.type)
      }

      if (filters.district) {
        filteredData = filteredData.filter(acc => acc.district === filters.district)
      }

      if (filters.approvalStatus) {
        filteredData = filteredData.filter(acc => acc.approvalStatus === filters.approvalStatus)
      }

      if (filters.isActive !== "") {
        const isActive = filters.isActive === "true"
        filteredData = filteredData.filter(acc => acc.isActive === isActive)
      }

      if (filters.amenities) {
        const amenitiesKeywords = filters.amenities.toLowerCase().split(',').map(s => s.trim())
        filteredData = filteredData.filter(acc => 
          amenitiesKeywords.some(keyword => 
            acc.amenities?.some(amenity => 
              amenity.toLowerCase().includes(keyword)
            )
          )
        )
      }

     

      // Apply pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedData = filteredData.slice(startIndex, endIndex)

     

      setAccommodations(paginatedData)
      setTotal(filteredData.length)
      
    } catch (err) {
    

      if (err.displayMessage) {
        setError(err.displayMessage)
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.message?.includes('401') || err.message?.includes('not logged in')) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
      } else {
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu")
      }

      setAccommodations([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccommodations()
  }, [page])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (page === 1) {
        fetchAccommodations()
      } else {
        setPage(1) // This will trigger fetchAccommodations via the page useEffect
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [filters])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      keyword: "",
      type: "",
      district: "",
      approvalStatus: "",
      isActive: "",
      amenities: "",
    })
  }

  // ✅ THÊM: Handle manage rooms
  const handleManageRooms = (accommodationId) => {
    console.log("Navigate to manage rooms for accommodation:", accommodationId)
    navigate(`/owner/rooms/${accommodationId}`)
  }

  // Handle view function để mở modal
  const handleView = (accommodation) => {
    console.log("View accommodation:", accommodation)
    setSelectedAccommodation(accommodation)
    setShowDetailModal(true)
  }

  // Handle close modal
  const handleCloseModal = () => {
    setShowDetailModal(false)
    setSelectedAccommodation(null)
  }

  // Handle edit từ card
  const handleEdit = (accommodation) => {
    navigate(`/owner/edit/${accommodation._id}`)
  }

  // Handle edit từ modal
  const handleEditFromModal = (accommodation) => {
    setShowDetailModal(false)
    navigate(`/owner/edit/${accommodation._id}`)
  }

  const handleToggleActive = async (accommodation) => {
    const newStatus = !accommodation.isActive
    const action = newStatus ? "hiện" : "ẩn"

    if (window.confirm(`Bạn có chắc chắn muốn ${action} "${accommodation.name}"?`)) {
      try {
        setLoading(true)
        const updateData = { isActive: newStatus }
        await apiClient.put(`/api/accommodations/${accommodation._id}`, updateData)

        setAccommodations((prev) =>
          prev.map((acc) => (acc._id === accommodation._id ? { ...acc, isActive: newStatus } : acc)),
        )

        alert(`${action.charAt(0).toUpperCase() + action.slice(1)} nhà trọ thành công!`)

        await fetchAccommodations()
      } catch (err) {
        console.error("Toggle active error:", err)
        alert(`Lỗi khi ${action}: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }
  }

  // Accommodation types from your backend model
  const accommodationTypes = [
    { value: "duplex", label: "Duplex" },
    { value: "house", label: "Nhà riêng" },
    { value: "apartment_building", label: "Chung cư" },
    { value: "hotel", label: "Khách sạn" },
    { value: "motel", label: "Nhà nghỉ" },
    { value: "hostel", label: "Hostel" },
    { value: "guesthouse", label: "Nhà trọ" },
    { value: "resort", label: "Resort" },
    { value: "villa", label: "Villa" },
    { value: "homestay", label: "Homestay" },
  ]

  // Districts from your backend model
  const districts = [
    "Quận Hải Châu",
    "Quận Thanh Khê",
    "Quận Sơn Trà",
    "Quận Ngũ Hành Sơn",
    "Quận Liên Chiểu",
    "Quận Cẩm Lệ",
    "Huyện Hòa Vang",
    "Huyện Hoàng Sa",
  ]

  const activeFiltersCount = Object.values(filters).filter((value) => value !== "").length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý nhà trọ</h1>
            <p className="mt-2 text-gray-600">
              Danh sách tất cả tài sản cho thuê của bạn
              {total > 0 && <span className="font-semibold text-blue-600"> ({total} nhà trọ)</span>}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 border rounded-xl font-medium transition-colors ${
                showFilters || activeFiltersCount > 0
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Bộ lọc
              {activeFiltersCount > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate("/owner/create")}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tạo nhà trọ mới
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Bộ lọc tìm kiếm</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchAccommodations}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Làm mới
              </button>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X className="mr-1 h-4 w-4" />
                Xóa bộ lọc
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm theo tên..."
                value={filters.keyword}
                onChange={(e) => handleFilterChange("keyword", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Type */}
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Tất cả loại hình</option>
              {accommodationTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* District */}
            <select
              value={filters.district}
              onChange={(e) => handleFilterChange("district", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Tất cả quận</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>

            {/* Approval Status */}
            <select
              value={filters.approvalStatus}
              onChange={(e) => handleFilterChange("approvalStatus", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>

            {/* Active Status */}
            <select
              value={filters.isActive}
              onChange={(e) => handleFilterChange("isActive", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Tất cả</option>
              <option value="true">Đang hiển thị</option>
              <option value="false">Đã ẩn</option>
            </select>

            {/* Amenities */}
            <input
              type="text"
              placeholder="Tiện nghi (wifi,parking...)"
              value={filters.amenities}
              onChange={(e) => handleFilterChange("amenities", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-red-800 font-medium">Lỗi kết nối</h3>
              <p className="text-red-700 text-sm mt-1 whitespace-pre-line">{error}</p>
              <div className="mt-3">
                <button
                  onClick={fetchAccommodations}
                  className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-lg transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <span className="text-gray-600">Đang tải danh sách nhà trọ...</span>
          </div>
        </div>
      )}

      {/* Accommodations Grid */}
      {!loading && (
        <>
          {accommodations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {accommodations.map((acc) => (
                <AccommodationCard
                  key={acc._id}
                  acc={acc}
                  onView={handleView}
                  onEdit={handleEdit}
                  onToggleActive={handleToggleActive}
                  onManageRooms={handleManageRooms} // ✅ THÊM: Pass handleManageRooms
                />
              ))}
            </div>
          ) : (
            !error && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <Building2 className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {Object.values(filters).some((v) => v !== "") ? "Không tìm thấy nhà trọ" : "Chưa có nhà trọ nào"}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {Object.values(filters).some((v) => v !== "")
                    ? "Không tìm thấy nhà trọ phù hợp với bộ lọc. Hãy thử điều chỉnh tiêu chí tìm kiếm."
                    : "Bắt đầu bằng cách tạo nhà trọ đầu tiên của bạn để quản lý tài sản cho thuê."}
                </p>
                <button
                  onClick={() => navigate("/owner/create")}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Tạo nhà trọ mới
                </button>
              </div>
            )
          )}

          {/* Pagination */}
          {total > limit && (
            <div className="mt-8">
              <Pagination total={total} page={page} limit={limit} onPageChange={setPage} />
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      <AccommodationDetailModal
        accommodation={selectedAccommodation}
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        onEdit={handleEditFromModal}
      />
    </div>
  )
}

export default ListAccommodations
