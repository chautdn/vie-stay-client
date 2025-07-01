import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { formatCurrencyVND } from "../../../utils/FormatPricePrint";
import { RatingConsider } from "../../../utils/RatingConsider";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";
import { useRoomStore } from "../../../store/owner/roomStore";
import {roomService} from "../../../services/roomService";

const RoomDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const returnPage = parseInt(queryParams.get("returnPage")) || 1;

  const { room: roomFromState } = location.state || {};
  const [room, setRoom] = useState(roomFromState || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ✅ SỬA: Sử dụng roomService thay vì fetch trực tiếp
  useEffect(() => {
    if (!room && id) {
      const fetchRoomDetail = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await roomService.getRoomById(id);

          let roomData = null;

          // ✅ SỬA: Xử lý response structure từ backend
          if (response?.status === "success" && response?.data?.room) {
            roomData = response.data.room;
          } else if (response?.data?.room) {
            roomData = response.data.room;
          } else if (response?.room) {
            roomData = response.room;
          } else if (response?._id) {
            roomData = response;
          }

          if (roomData) {
            setRoom(roomData);
          } else {
            throw new Error("Không tìm thấy thông tin phòng");
          }
        } catch (err) {
          console.error("❌ Lỗi fetch room detail:", err);
          setError(err.message || "Lỗi khi tải thông tin phòng");
        } finally {
          setIsLoading(false);
        }
      };

      fetchRoomDetail();
    }
  }, [room, id]);

  // ✅ SỬA: Xử lý amenities mapping
  const formatAmenity = (amenity) => {
    const amenityMapping = {
      air_conditioning: "Điều hòa",
      wifi: "Wifi miễn phí",
      washing_machine: "Máy giặt",
      elevator: "Thang máy",
      balcony: "Ban công",
      fully_furnished: "Nội thất đầy đủ",
      pet_friendly: "Cho phép nuôi thú cưng",
      cooking_allowed: "Cho phép nấu ăn",
      utilities_included: "Bao điện nước",
      security: "An toàn",
      parking: "Chỗ để xe",
      security_camera: "Camera an ninh",
      tv: "TV",
      refrigerator: "Tủ lạnh",
      microwave: "Lò vi sóng",
      desk: "Bàn làm việc",
      wardrobe: "Tủ quần áo",
      window: "Cửa sổ",
    };

    return amenityMapping[amenity] || amenity.replace(/_/g, " ");
  };

  // ✅ SỬA: Format room type
  const formatRoomType = (type) => {
    const typeMapping = {
      single: "Phòng đơn",
      double: "Phòng đôi",
      shared: "Phòng chia sẻ",
      studio: "Phòng studio",
      apartment: "Căn hộ mini",
      dormitory: "Ký túc xá",
    };

    return typeMapping[type] || type;
  };

  // ✅ SỬA: Loading state
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  // ✅ SỬA: Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Quay lại
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // ✅ SỬA: No room state
  if (!room) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto p-6 text-center">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy phòng
          </h2>
          <p className="text-gray-600 mb-4">
            Phòng bạn tìm kiếm không tồn tại hoặc đã bị xóa
          </p>
          <button
            onClick={() => navigate("/search")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Tìm phòng khác
          </button>
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
    navigate(-1); // ✅ SỬA: Sử dụng navigate(-1) thay vì hardcode path
  };

  // ✅ SỬA: Safe image handling
  const roomImages =
    room.images && room.images.length > 0
      ? room.images
      : [
          "https://t3.ftcdn.net/jpg/02/15/15/46/360_F_215154625_hJg9QkfWH9Cu6LCTUc8TiuV6jQSI0C5X.jpg",
        ];

  // ✅ SỬA: Format address từ accommodation
  const formatAddress = () => {
    if (room.fullAddress) {
      return room.fullAddress;
    }

    if (room.accommodation?.address) {
      const addr = room.accommodation.address;
      const parts = [];
      if (addr.ward) parts.push(addr.ward);
      if (addr.district) parts.push(addr.district);
      if (addr.city) parts.push(addr.city);
      return parts.join(", ") || "Địa chỉ đang cập nhật";
    }

    return "Địa chỉ đang cập nhật";
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
            ← Quay về
          </button>
        </div>

        {/* Tiêu đề và địa chỉ */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-extrabold text-orange-600">
            {room.name || "Phòng trọ"}
          </h1>
          <p className="text-gray-600 text-sm">
            {room.description || "Mô tả đang được cập nhật"}
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            📍 {formatAddress()}
          </p>
        </div>

        {/* Slider ảnh */}
        <div
          className="relative rounded-xl overflow-hidden bg-black cursor-pointer shadow-md"
          onClick={() => setShowFullscreen(true)}
        >
          <div ref={sliderRef} className="keen-slider h-[420px]">
            {roomImages.map((img, i) => (
              <div
                key={i}
                className="keen-slider__slide flex justify-center items-center"
              >
                <img
                  src={img}
                  alt={`Ảnh phòng ${i + 1}`}
                  className="h-full object-contain"
                  onError={(e) => {
                    e.target.src =
                      "https://t3.ftcdn.net/jpg/02/15/15/46/360_F_215154625_hJg9QkfWH9Cu6LCTUc8TiuV6jQSI0C5X.jpg";
                  }}
                />
              </div>
            ))}
          </div>

          {roomImages.length > 1 && (
            <>
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
            </>
          )}
        </div>

        {/* Ảnh thumbnail */}
        {roomImages.length > 1 && (
          <div className="flex mt-3 gap-2 justify-center flex-wrap">
            {roomImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                className={`w-20 h-16 object-cover rounded-md cursor-pointer transition hover:scale-105 ${
                  i === currentSlide ? "ring-2 ring-orange-500" : "opacity-80"
                }`}
                onClick={() => instanceRef.current?.moveToIdx(i)}
                onError={(e) => {
                  e.target.src =
                    "https://t3.ftcdn.net/jpg/02/15/15/46/360_F_215154625_hJg9QkfWH9Cu6LCTUc8TiuV6jQSI0C5X.jpg";
                }}
              />
            ))}
          </div>
        )}

        {/* Modal toàn màn hình */}
        {showFullscreen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center"
            onClick={() => setShowFullscreen(false)}
          >
            <div className="keen-slider w-full max-w-6xl h-[85vh]" ref={sliderRef}>
              {roomImages.map((img, i) => (
                <div key={i} className="keen-slider__slide flex justify-center items-center">
                  <img src={img} alt={`Ảnh ${i}`} className="max-h-full object-contain" />
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
          <div className="space-y-3">
            <p><strong>Loại phòng:</strong> {formatRoomType(room.type)}</p>
            <p><strong>Diện tích:</strong> {room.size || 0} m²</p>
            <p><strong>Sức chứa:</strong> {room.capacity || 1} người</p>
            <p><strong>Phòng tắm riêng:</strong> {room.hasPrivateBathroom ? "Có" : "Không"}</p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span className={`inline-block px-2 py-0.5 rounded-full text-white text-xs ${
                room.isAvailable ? "bg-green-500" : "bg-red-500"
              }`}>
                {room.isAvailable ? "Còn trống" : "Đã thuê"}
              </span>
            </p>
            {room.availableFrom && (
              <p><strong>Có sẵn từ:</strong> {new Date(room.availableFrom).toLocaleDateString("vi-VN")}</p>
            )}

            {/* ✅ THÊM: Thông tin chủ nhà */}
            {room.user && (
              <div className="pt-2 border-t">
                <p><strong>Chủ nhà:</strong> {room.user.name}</p>
                {room.user.phone && (
                  <p><strong>Điện thoại:</strong> {room.user.phone}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-orange-100 border border-orange-300 p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-1">Giá thuê</h3>
              <p className="text-2xl text-orange-600 font-extrabold">
                {formatCurrencyVND(room.baseRent || 0)} / tháng
              </p>
              {room.deposit > 0 && (
                <p className="text-sm text-gray-700">
                  Đặt cọc: {formatCurrencyVND(room.deposit)}
                </p>
              )}
            </div>

            {/* ✅ SỬA: Tiện nghi với mapping */}
            {room.amenities && room.amenities.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-gray-800">Tiện nghi</h3>
                <ul className="list-disc list-inside grid grid-cols-1 gap-1 text-sm">
                  {room.amenities.map((item, idx) => (
                    <li key={idx}>{formatAmenity(item)}</li>
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
            <ul className="text-sm text-gray-700 space-y-1">
              {Object.entries(room.utilityRates).map(([key, value]) =>
                value && value.rate ? (
                  <li key={key}>
                    <strong>
                      {key === "water"
                        ? "Nước"
                        : key === "electricity"
                        ? "Điện"
                        : key === "internet"
                        ? "Internet"
                        : key}
                      :
                    </strong>{" "}
                    {value.type === "fixed"
                      ? `${formatCurrencyVND(value.rate)} / tháng`
                      : `${formatCurrencyVND(value.rate)} mỗi đơn vị`}
                  </li>
                ) : null
              )}
            </ul>
          </div>
        )}

        {/* Phí phụ thu */}
        {room.additionalFees?.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">💰 Phí phụ thu</h3>
            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
              {room.additionalFees.map((fee, idx) => (
                <li key={idx}>
                  <strong>{fee.name}:</strong> {formatCurrencyVND(fee.amount)} /{" "}
                  {fee.type === "monthly" ? "tháng" : "lần"}
                  {fee.description && ` - ${fee.description}`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Đánh giá và thống kê */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t text-sm text-gray-600 gap-2">
          <div>{RatingConsider(room.averageRating || 0)}</div>
          <div className="flex gap-4 text-xs">
            <span>👁️ {room.viewCount || 0} lượt xem</span>
            <span>❤️ {room.favoriteCount || 0} thích</span>
            <span>📝 {room.totalRatings || 0} đánh giá</span>
          </div>
        </div>

        {/* ✅ THÊM: Contact buttons */}
        {room.user?.phone && (
          <div className="flex gap-3 justify-center pt-4">
            <button
              onClick={() => window.open(`tel:${room.user.phone}`)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              📞 Gọi điện: {room.user.phone}
            </button>
            <button
              onClick={() => {
                // TODO: Implement Zalo integration
                console.log("Zalo chat with:", room.user.phone);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              💬 Nhắn tin Zalo
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default RoomDetail;