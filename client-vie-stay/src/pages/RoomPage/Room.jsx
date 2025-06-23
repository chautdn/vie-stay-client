import React, { useEffect, useState } from "react";
import { Camera, Search, Filter, MapPin, Users, Home, DollarSign, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Add this import
import Navbar from "../Navbar/Navbar"; 
import Footer from "../Navbar/Footer"; 

const Room = () => {
  const navigate = useNavigate(); // Add this hook
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightId, setHighlightId] = useState(null);
  const [scrollTargetId, setScrollTargetId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    minRent: "",
    maxRent: "",
    capacity: "",
    hasPrivateBathroom: "",
    furnishingLevel: "",
    district: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  const roomsPerPage = 5;

  // Vietnamese text normalization for search
  const normalizeVietnamese = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/[^\w\s]/g, "") // Remove special characters except word chars and spaces
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim();
  };

  // Create search variations for better matching
  const createSearchVariations = (text) => {
    if (!text) return [];
    const normalized = normalizeVietnamese(text);
    const variations = [
      text.toLowerCase().trim(),
      normalized,
      // Split into words for partial matching
      ...normalized.split(' ').filter(word => word.length > 1)
    ];
    return [...new Set(variations)]; // Remove duplicates
  };

  // Enhanced search function
  const searchInText = (searchTerm, targetText) => {
    if (!searchTerm || !targetText) return false;
    
    const searchVariations = createSearchVariations(searchTerm);
    const normalizedTarget = normalizeVietnamese(targetText);
    
    return searchVariations.some(variation => 
      normalizedTarget.includes(variation) || 
      targetText.toLowerCase().includes(variation)
    );
  };

  // District options for Vietnam
  const districtOptions = ["Quận Hải Châu", "Quận Thanh Khê", "Quận Sơn Trà", "Quận Ngũ Hành Sơn", "Quận Liên Chiểu", "Quận Cẩm Lệ",
    "Huyện Hòa Vang", "Huyện Hoàng Sa"
  ];

  // Fixed navigation function
  const handleNavigation = (roomId, room) => {
    console.log(`Navigating to room detail: ${roomId}`);
    
    // Store current state for return navigation
    sessionStorage.setItem("scrollToRoom", JSON.stringify({
      scrollToId: roomId,
      returnPage: currentPage
    }));
    
    // Navigate to room detail with room data
    navigate(`/room/${roomId}`, { 
      state: { 
        room: room,
        returnPage: currentPage 
      } 
    });
  };

  // Format Vietnamese currency
  const formatCurrencyVND = (amount) => {
    if (!amount && amount !== 0) return "Giá liên hệ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Navbar callback functions
  const handleLocationSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  // Get stored scroll position
  useEffect(() => {
    const stored = sessionStorage.getItem("scrollToRoom");
    if (stored) {
      const { scrollToId, returnPage } = JSON.parse(stored);
      setCurrentPage(returnPage || 1);
      setScrollTargetId(scrollToId);
      sessionStorage.removeItem("scrollToRoom");
    }
  }, []);

  // Load rooms from API
  useEffect(() => {
    fetchAvailableRooms();
  }, []);

  const fetchAvailableRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try different endpoints
      const endpoints = [
        "http://localhost:8080/api/rooms/available",
        "http://localhost:8080/rooms/available", 
        "http://localhost:8080/room",
        "http://localhost:8080/api/rooms/search?isAvailable=true"
      ];

      let data = null;

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (response.ok) {
            const responseText = await response.text();
            try {
              data = JSON.parse(responseText);
              break;
            } catch (parseError) {
              continue;
            }
          }
        } catch (err) {
          continue;
        }
      }

      if (!data) {
        throw new Error("Không thể kết nối với server. Vui lòng kiểm tra lại kết nối.");
      }

      // Handle different response structures
      let roomsArray = [];
      if (Array.isArray(data)) {
        roomsArray = data;
      } else if (data.status === "success" && data.data && Array.isArray(data.data.rooms)) {
        roomsArray = data.data.rooms;
      } else if (data.data && Array.isArray(data.data)) {
        roomsArray = data.data;
      } else if (data.rooms && Array.isArray(data.rooms)) {
        roomsArray = data.rooms;
      } else {
        const foundArray = Object.values(data).find(value => Array.isArray(value));
        if (foundArray) {
          roomsArray = foundArray;
        } else {
          throw new Error("Định dạng dữ liệu không hợp lệ");
        }
      }

      setRooms(roomsArray);
      
    } catch (err) {
      console.error("❌ Lỗi tải phòng:", err);
      setError(err.message);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to target room
  useEffect(() => {
    if (!scrollTargetId || loading) return;

    const el = document.getElementById(`room-${scrollTargetId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setHighlightId(scrollTargetId);
      setTimeout(() => setHighlightId(null), 2000);
      setScrollTargetId(null);
    }
  }, [scrollTargetId, loading]);

  // Enhanced filter function with Vietnamese search
  const getFilteredRooms = () => {
    let filtered = [...rooms];

    // Enhanced search filter with Vietnamese normalization
    if (searchTerm) {
      filtered = filtered.filter(room => {
        const searchFields = [
          room.name,
          room.description,
          room.accommodationId?.name,
          room.accommodationId?.address?.fullAddress,
          room.accommodationId?.address?.street,
          room.accommodationId?.address?.ward,
          room.accommodationId?.address?.district,
          room.type
        ];

        return searchFields.some(field => searchInText(searchTerm, field));
      });
    }

    // District filter
    if (filters.district) {
      filtered = filtered.filter(room => 
        room.accommodationId?.address?.district === filters.district
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(room => room.type === filters.type);
    }

    // Price range filter
    if (filters.minRent) {
      filtered = filtered.filter(room => room.baseRent >= parseInt(filters.minRent));
    }
    if (filters.maxRent) {
      filtered = filtered.filter(room => room.baseRent <= parseInt(filters.maxRent));
    }

    // Capacity filter
    if (filters.capacity) {
      filtered = filtered.filter(room => room.capacity >= parseInt(filters.capacity));
    }

    // Private bathroom filter
    if (filters.hasPrivateBathroom !== "") {
      filtered = filtered.filter(room => 
        room.hasPrivateBathroom === (filters.hasPrivateBathroom === "true")
      );
    }

    // Furnishing level filter
    if (filters.furnishingLevel) {
      filtered = filtered.filter(room => room.furnishingLevel === filters.furnishingLevel);
    }

    return filtered;
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      minRent: "",
      maxRent: "",
      capacity: "",
      hasPrivateBathroom: "",
      furnishingLevel: "",
      district: ""
    });
    setSearchTerm("");
  };

  const filteredRooms = getFilteredRooms();
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const handlePageClick = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPageNumbers = () => {
    const buttons = [];
    const visiblePages = 4;
    let startPage = Math.max(currentPage - 1, 1);
    let endPage = Math.min(startPage + visiblePages - 1, totalPages);

    if (endPage - startPage < visiblePages - 1) {
      startPage = Math.max(endPage - visiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`px-3 py-1.5 rounded ${
            i === currentPage
              ? "bg-orange-500 text-white font-semibold"
              : "bg-white hover:bg-gray-100 border"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      buttons.push(<span key="dots" className="text-gray-400 px-2">...</span>);
    }

    if (endPage < totalPages) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          className="px-3 py-1.5 rounded bg-white hover:bg-gray-100 border"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onLocationSearch={handleLocationSearch} onFilterToggle={handleFilterToggle} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Đang tải danh sách phòng...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && rooms.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onLocationSearch={handleLocationSearch} onFilterToggle={handleFilterToggle} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi kết nối</h2>
            <p className="text-red-500 mb-4 text-sm">{error}</p>
            <button 
              onClick={fetchAvailableRooms} 
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar onLocationSearch={handleLocationSearch} onFilterToggle={handleFilterToggle} />

      {/* Main Content */}
      <div className="flex-grow">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Danh sách phòng trọ</h1>
            <p className="text-gray-600">Tìm kiếm phòng trọ phù hợp với bạn</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phòng trọ (hỗ trợ tiếng Việt có dấu)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <Filter className="h-4 w-4" />
                Bộ lọc
                {Object.values(filters).filter(v => v !== "").length > 0 && (
                  <span className="bg-orange-500 text-white rounded-full px-2 py-1 text-xs">
                    {Object.values(filters).filter(v => v !== "").length}
                  </span>
                )}
              </button>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
                  {/* District Filter */}
                  <select 
                    value={filters.district} 
                    onChange={(e) => setFilters({...filters, district: e.target.value})}
                    className="p-2 border border-gray-200 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  >
                    <option value="">Tất cả quận/huyện</option>
                    {districtOptions.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>

                  {/* Room Type */}
                  <select 
                    value={filters.type} 
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="p-2 border border-gray-200 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  >
                    <option value="">Tất cả loại phòng</option>
                    <option value="single">Phòng đơn</option>
                    <option value="double">Phòng đôi</option>
                    <option value="twin">Phòng twin</option>
                    <option value="family">Phòng gia đình</option>
                    <option value="studio">Studio</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="standard">Standard</option>
                  </select>

                  {/* Min Rent */}
                  <input 
                    type="number" 
                    placeholder="Giá tối thiểu" 
                    value={filters.minRent}
                    onChange={(e) => setFilters({...filters, minRent: e.target.value})}
                    className="p-2 border border-gray-200 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />

                  {/* Max Rent */}
                  <input 
                    type="number" 
                    placeholder="Giá tối đa" 
                    value={filters.maxRent}
                    onChange={(e) => setFilters({...filters, maxRent: e.target.value})}
                    className="p-2 border border-gray-200 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />

                  {/* Capacity */}
                  <input 
                    type="number" 
                    placeholder="Số người tối thiểu" 
                    value={filters.capacity}
                    onChange={(e) => setFilters({...filters, capacity: e.target.value})}
                    className="p-2 border border-gray-200 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />

                  {/* Private Bathroom */}
                  <select 
                    value={filters.hasPrivateBathroom} 
                    onChange={(e) => setFilters({...filters, hasPrivateBathroom: e.target.value})}
                    className="p-2 border border-gray-200 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  >
                    <option value="">Tất cả</option>
                    <option value="true">WC riêng</option>
                    <option value="false">WC chung</option>
                  </select>

                  {/* Furnishing Level */}
                  <select 
                    value={filters.furnishingLevel} 
                    onChange={(e) => setFilters({...filters, furnishingLevel: e.target.value})}
                    className="p-2 border border-gray-200 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  >
                    <option value="">Tình trạng nội thất</option>
                    <option value="fully">Đầy đủ nội thất</option>
                    <option value="semi">Nội thất cơ bản</option>
                    <option value="unfurnished">Không nội thất</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold text-orange-600">{filteredRooms.length}</span> phòng trọ
              {searchTerm && (
                <span className="text-sm text-gray-500 ml-2">
                  cho từ khóa "{searchTerm}"
                </span>
              )}
            </p>
          </div>

          {/* Rooms List */}
          {currentRooms.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🏠</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Không tìm thấy phòng trọ</h3>
              <p className="text-gray-500 mb-6">
                {filteredRooms.length === 0 
                  ? "Hiện tại chưa có phòng trọ nào. Vui lòng quay lại sau."
                  : "Thử điều chỉnh bộ lọc để tìm thêm phòng trọ."
                }
              </p>
              <button 
                onClick={clearFilters}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {currentRooms.map((room) => {
                const roomId = room._id?.$oid || room._id?.toString?.() || room._id;

                return (
                  <div
                    id={`room-${roomId}`}
                    key={roomId}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log(`🔍 Room card clicked:`, { roomId, room });
                      handleNavigation(roomId, room);
                    }}
                    className={`border rounded-lg overflow-hidden shadow transition cursor-pointer bg-white
                      ${highlightId === roomId ? "ring-2 ring-orange-400" : "hover:shadow-lg"}`}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Main Image */}
                      <div className="relative md:w-[45%] h-60">
                        {room.images && room.images.length > 0 ? (
                          <img
                            src={room.images[0]}
                            alt={room.name || "Hình ảnh phòng"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x240?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Home className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs flex items-center gap-1 px-2 py-1 rounded">
                          <Camera size={14} /> {room.images?.length || 0}
                        </div>
                        
                        {/* Available Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            room.isAvailable !== false ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          }`}>
                            {room.isAvailable !== false ? 'Còn trống' : 'Đã cho thuê'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Additional Images */}
                      <div className="grid grid-cols-3 md:w-[55%] gap-[1px] bg-gray-100 h-60">
                        {room.images?.slice(1, 4).map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt={`Hình ${i + 2}`}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/200x120?text=No+Image';
                            }}
                          />
                        )) || (
                          <>
                            <div className="bg-gray-200 flex items-center justify-center">
                              <Home className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="bg-gray-200 flex items-center justify-center">
                              <Home className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="bg-gray-200 flex items-center justify-center">
                              <Home className="h-8 w-8 text-gray-400" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Room Name */}
                      <h3 className="text-red-600 font-bold uppercase text-base leading-snug mb-1">
                        {room.name || "Phòng trọ"}
                      </h3>
                      
                      {/* Price and Location */}
                      <div className="flex items-center text-green-600 font-semibold text-sm my-1">
                        {formatCurrencyVND(room.baseRent || 0)} / tháng
                        <span className="text-gray-600 ml-2">
                          • {room.size || "N/A"} m² 
                          {room.accommodationId?.address?.district ? 
                            ` • ${room.accommodationId.address.district}` : 
                            " • Hồ Chí Minh"
                          }
                        </span>
                      </div>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {room.description || "Phòng trọ thoáng mát, tiện nghi đầy đủ, gần các tiện ích công cộng."}
                      </p>

                      {/* Room Features */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {room.type && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs capitalize">
                            {room.type}
                          </span>
                        )}
                        {room.capacity && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                            {room.capacity} người
                          </span>
                        )}
                        {room.hasPrivateBathroom && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            WC riêng
                          </span>
                        )}
                        {room.furnishingLevel && room.furnishingLevel !== 'unfurnished' && (
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                            {room.furnishingLevel === 'fully' ? 'Đầy đủ nội thất' : 'Nội thất cơ bản'}
                          </span>
                        )}
                      </div>
                      
                      {/* Owner Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <img
                            src={room.accommodationId?.ownerId?.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                            alt="avatar"
                            className="w-6 h-6 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
                            }}
                          />
                          <span className="font-semibold">
                            {room.accommodationId?.ownerId?.name || room.owner || "Chủ trọ"}
                          </span>
                          <span className="text-gray-400">• Hôm nay</span>
                        </div>
                        <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">
                          {room.accommodationId?.contactInfo?.phone || room.phone || "Liên hệ"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center flex-wrap gap-2 mt-10 bg-orange-50 p-4 rounded-md">
              <button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                « Trang trước
              </button>

              {renderPageNumbers()}

              <button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trang sau »
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Room;