import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Navbar/Footer";

const RoomDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const returnPage = parseInt(queryParams.get("returnPage")) || 1;

  console.log(`🔍 RoomDetail component loaded:`, { 
    id, 
    locationState: location.state,
    pathname: location.pathname 
  });

  const { room: roomFromState } = location.state || {};
  const [room, setRoom] = useState(roomFromState || null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [loading, setLoading] = useState(!roomFromState);
  const [error, setError] = useState(null);

  console.log(`🔍 RoomDetail state:`, { 
    hasRoomFromState: !!roomFromState,
    roomId: id,
    loading,
    error 
  });

  const [sliderRef, instanceRef] = useKeenSlider({
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  // Format Vietnamese currency
  const formatCurrencyVND = (amount) => {
    if (!amount && amount !== 0) return "Giá liên hệ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Rating display function
  const RatingConsider = (rating) => {
    if (!rating) return "Chưa có đánh giá";
    const stars = "⭐".repeat(Math.floor(rating));
    return `${stars} ${rating.toFixed(1)}/5`;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!room && id) {
      console.log("Fetching room data for ID:", id);
      setLoading(true);
      setError(null);

      // Try multiple endpoints
      const endpoints = [
        `http://localhost:8080/rooms/${id}`,
        `http://localhost:8080/api/rooms/${id}`,
        `http://localhost:8080/room/${id}`,
      ];

      const fetchRoom = async () => {
        for (const endpoint of endpoints) {
          try {
            console.log("Trying endpoint:", endpoint);
            const response = await fetch(endpoint, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            });

            if (response.ok) {
              const data = await response.json();
              console.log("Room data received:", data);

              // Handle different response structures
              let roomData = null;
              if (data.room) {
                roomData = data.room;
              } else if (data.data && data.data.room) {
                roomData = data.data.room;
              } else if (data.data) {
                roomData = data.data;
              } else {
                roomData = data;
              }

              if (roomData) {
                setRoom(roomData);
                setLoading(false);
                return;
              }
            }
          } catch (err) {
            console.error(`Error fetching from ${endpoint}:`, err);
            continue;
          }
        }

        // If all endpoints fail
        setError("Không thể tải thông tin phòng. Vui lòng thử lại sau.");
        setLoading(false);
      };

      fetchRoom();
    }
  }, [room, id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Đang tải thông tin phòng...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi tải dữ liệu</h2>
            <p className="text-red-500 mb-4 text-sm">{error}</p>
            <button 
              onClick={() => navigate('/rooms')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Quay về danh sách phòng
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!room) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy phòng</h2>
            <p className="text-gray-500 mb-4">Phòng bạn đang tìm có thể đã được gỡ bỏ hoặc không tồn tại.</p>
            <button 
              onClick={() => navigate('/rooms')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Quay về danh sách phòng
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const roomId = room._id?.$oid || room._id?.toString?.() || room._id;

  const handleBack = () => {
    sessionStorage.setItem(
      "scrollToRoom",
      JSON.stringify({ scrollToId: roomId, returnPage })
    );
    // Navigate back to /rooms route (matching your App.jsx)
    navigate(`/rooms?returnPage=${returnPage}`);
  };

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg space-y-10">
        {/* Nút quay về */}
        <div className="text-left">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
          >
            ← Quay về danh sách phòng
          </button>
        </div>

        {/* Tiêu đề */}
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-3xl font-extrabold text-orange-600">{room.name || "Chi tiết phòng"}</h1>
          <p className="text-gray-600 text-sm">{room.description || "Mô tả phòng trọ"}</p>
        </div>

        {/* Slider ảnh */}
        {room.images && room.images.length > 0 ? (
          <>
            <div
              className="relative rounded-xl overflow-hidden bg-black cursor-pointer shadow-md"
              onClick={() => setShowFullscreen(true)}
            >
              <div ref={sliderRef} className="keen-slider h-[420px]">
                {room.images.map((img, i) => (
                  <div key={i} className="keen-slider__slide flex justify-center items-center">
                    <img 
                      src={img} 
                      alt={`Ảnh ${i + 1}`} 
                      className="h-full object-contain"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x420?text=Không+thể+tải+ảnh';
                      }}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  instanceRef.current?.prev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full hover:bg-opacity-75"
              >
                ❮
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  instanceRef.current?.next();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full hover:bg-opacity-75"
              >
                ❯
              </button>
            </div>

            {/* Ảnh thumbnail */}
            <div className="flex mt-3 gap-2 justify-center flex-wrap">
              {room.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  className={`w-20 h-16 object-cover rounded-md cursor-pointer transition hover:scale-105 ${
                    i === currentSlide ? "ring-2 ring-orange-500" : "opacity-80"
                  }`}
                  onClick={() => instanceRef.current?.moveToIdx(i)}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80x64?text=No+Image';
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="w-full h-[420px] bg-gray-200 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl text-gray-400 mb-4">🏠</div>
              <p className="text-gray-500">Chưa có hình ảnh</p>
            </div>
          </div>
        )}

        {/* Modal toàn màn hình */}
        {showFullscreen && room.images && room.images.length > 0 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center"
            onClick={() => setShowFullscreen(false)}
          >
            <div className="keen-slider w-full max-w-6xl h-[85vh]" ref={sliderRef}>
              {room.images.map((img, i) => (
                <div key={i} className="keen-slider__slide flex justify-center items-center">
                  <img 
                    src={img} 
                    alt={`Ảnh ${i + 1}`} 
                    className="max-h-full object-contain"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x600?text=Không+thể+tải+ảnh';
                    }}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-5 right-6 text-white text-3xl bg-orange-600 hover:bg-orange-700 px-4 py-1 rounded-full"
            >
              ✕
            </button>
          </div>
        )}

        {/* Thông tin chi tiết */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-800">
          <div className="space-y-2">
            <p><strong>Loại phòng:</strong> {room.type || "Không xác định"}</p>
            <p><strong>Diện tích:</strong> {room.size || "N/A"} m²</p>
            <p><strong>Sức chứa:</strong> {room.capacity || "N/A"} người</p>
            <p><strong>Trang bị:</strong> {
              room.furnishingLevel === "fully"
                ? "Đầy đủ nội thất"
                : room.furnishingLevel === "semi"
                ? "Nội thất cơ bản"
                : room.furnishingLevel === "unfurnished"
                ? "Không có nội thất"
                : "Không xác định"
            }</p>
            <p><strong>Phòng tắm riêng:</strong> {room.hasPrivateBathroom ? "Có" : "Không"}</p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span className={`inline-block px-2 py-0.5 rounded-full text-white text-xs ${
                room.isAvailable !== false ? "bg-green-500" : "bg-red-500"
              }`}>
                {room.isAvailable !== false ? "Còn trống" : "Đã thuê"}
              </span>
            </p>
            {room.availableFrom && (
              <p><strong>Có sẵn từ:</strong> {new Date(room.availableFrom).toLocaleDateString("vi-VN")}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-orange-100 border border-orange-300 p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-1">Giá thuê</h3>
              <p className="text-2xl text-orange-600 font-extrabold">
                {formatCurrencyVND(room.baseRent)} / tháng
              </p>
              {room.deposit && (
                <p className="text-sm text-gray-700">
                  Đặt cọc: {formatCurrencyVND(room.deposit)}
                </p>
              )}
            </div>

            {room.amenities && room.amenities.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-gray-800">Tiện nghi</h3>
                <ul className="list-disc list-inside grid grid-cols-2 gap-x-4 text-sm">
                  {room.amenities.map((item, idx) => (
                    <li key={idx}>{item.replace(/_/g, " ")}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Phí dịch vụ */}
        {room.utilityRates && Object.keys(room.utilityRates).length > 0 && (
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">📋 Phí dịch vụ</h3>
            <ul className="text-sm text-gray-700">
              {Object.entries(room.utilityRates).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong>{" "}
                  {value.type === "fixed"
                    ? `${formatCurrencyVND(value.rate)} / tháng`
                    : `${formatCurrencyVND(value.rate)} mỗi đơn vị`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Phí phụ thu */}
        {room.additionalFees && room.additionalFees.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">💰 Phí phụ thu</h3>
            <ul className="text-sm text-gray-700 list-disc list-inside">
              {room.additionalFees.map((fee, idx) => (
                <li key={idx}>
                  {fee.description}: {formatCurrencyVND(fee.amount)} / {fee.type}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Địa chỉ */}
        {room.accommodationId?.address && (
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">📍 Địa chỉ</h3>
            <p className="text-sm text-gray-700">
              {room.accommodationId.address.fullAddress || 
               `${room.accommodationId.address.street || ''}, ${room.accommodationId.address.ward || ''}, ${room.accommodationId.address.district || ''}`}
            </p>
          </div>
        )}

        {/* Thông tin chủ trọ */}
        {room.accommodationId?.ownerId && (
          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">👤 Thông tin chủ trọ</h3>
            <div className="flex items-center gap-3">
              <img
                src={room.accommodationId.ownerId.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                alt="avatar chủ trọ"
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
                }}
              />
              <div>
                <p className="font-semibold">{room.accommodationId.ownerId.name || "Chủ trọ"}</p>
                <p className="text-sm text-gray-600">
                  {room.accommodationId.contactInfo?.phone || "Liên hệ để biết thêm thông tin"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Đánh giá */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t text-sm text-gray-600 gap-2">
          <div>{RatingConsider(room.averageRating)}</div>
          <div>
            👁️ {room.viewCount || 0} lượt xem | ❤️ {room.favoriteCount || 0} thích | 📝 {room.totalRatings || 0} đánh giá
          </div>
        </div>

        {/* Nút liên hệ */}
        <div className="text-center">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
            Liên hệ thuê phòng
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RoomDetail;