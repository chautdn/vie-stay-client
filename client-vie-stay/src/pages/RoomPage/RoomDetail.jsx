import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { formatCurrencyVND } from "../../utils/FormatPricePrint";
import { RatingConsider } from "../../utils/RatingConsider";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const RoomDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const returnPage = parseInt(queryParams.get("returnPage")) || 1;

  const { room: roomFromState } = location.state || {};
  const [room, setRoom] = useState(roomFromState || null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  // Cuộn lên đầu khi vào trang
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Nếu reload → fetch lại room từ id
  useEffect(() => {
    if (!room && id) {
      fetch(`http://localhost:8080/room/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Lỗi tải phòng từ server");
          return res.json();
        })
        .then((data) => setRoom(data))
        .catch((err) => {
          console.error("❌ Lỗi fetch:", err.message);
        });
    }
  }, [room, id]);

  if (!room) {
    return (
      <p className="text-center text-gray-500 font-medium py-10">
        Đang tải thông tin phòng...
      </p>
    );
  }

  const roomId = room._id?.$oid || room._id?.toString?.() || room._id;

 const handleBack = () => {
  // Ghi lại roomId vào sessionStorage để Room.jsx có thể đọc
  sessionStorage.setItem("scrollToRoom", JSON.stringify({
    scrollToId: roomId,
    returnPage
  }));

  navigate(`/room?returnPage=${returnPage}`);
};

  return (
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
        <h1 className="text-3xl font-extrabold text-orange-600">{room.name}</h1>
        <p className="text-gray-600 text-sm">{room.description}</p>
      </div>

      {/* Slider ảnh */}
      <div
        className="relative rounded-xl overflow-hidden bg-black cursor-pointer shadow-md"
        onClick={() => setShowFullscreen(true)}
      >
        <div ref={sliderRef} className="keen-slider h-[420px]">
          {room.images?.map((img, i) => (
            <div key={i} className="keen-slider__slide flex justify-center items-center">
              <img src={img} alt={`Ảnh ${i}`} className="h-full object-contain" />
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
      <div className="flex mt-3 gap-2 justify-center">
        {room.images?.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`thumb-${i}`}
            className={`w-20 h-16 object-cover rounded-md cursor-pointer transition hover:scale-105 ${
              i === currentSlide ? "ring-2 ring-orange-500" : "opacity-80"
            }`}
            onClick={() => instanceRef.current?.moveToIdx(i)}
          />
        ))}
      </div>

      {/* Modal toàn màn hình */}
      {showFullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center"
          onClick={() => setShowFullscreen(false)}
        >
          <div className="keen-slider w-full max-w-6xl h-[85vh]" ref={sliderRef}>
            {room.images?.map((img, i) => (
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
        <div className="space-y-2">
          <p><strong>Loại phòng:</strong> {room.type}</p>
          <p><strong>Diện tích:</strong> {room.size} m²</p>
          <p><strong>Sức chứa:</strong> {room.capacity} người</p>
          <p><strong>Trang bị:</strong> {
            room.furnishingLevel === "fully"
              ? "Đầy đủ nội thất"
              : room.furnishingLevel === "semi"
              ? "Nội thất cơ bản"
              : "Không có nội thất"
          }</p>
          <p><strong>Phòng tắm riêng:</strong> {room.hasPrivateBathroom ? "Có" : "Không"}</p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <span className={`inline-block px-2 py-0.5 rounded-full text-white text-xs ${
              room.isAvailable ? "bg-green-500" : "bg-red-500"
            }`}>
              {room.isAvailable ? "Còn trống" : "Đã thuê"}
            </span>
          </p>
          <p><strong>Có sẵn từ:</strong> {new Date(room.availableFrom).toLocaleDateString("vi-VN")}</p>
        </div>

        {/* Giá & tiện nghi */}
        <div className="space-y-4">
          <div className="bg-orange-100 border border-orange-300 p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-1">Giá thuê</h3>
            <p className="text-2xl text-orange-600 font-extrabold">
              {formatCurrencyVND(room.baseRent)} / tháng
            </p>
            <p className="text-sm text-gray-700">
              Đặt cọc: {formatCurrencyVND(room.deposit)}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-gray-800">Tiện nghi</h3>
            <ul className="list-disc list-inside grid grid-cols-2 gap-x-4 text-sm">
              {room.amenities?.map((item, idx) => (
                <li key={idx}>{item.replace(/_/g, " ")}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Phí dịch vụ */}
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="font-semibold text-gray-800 mb-2">📋 Phí dịch vụ</h3>
        <ul className="text-sm text-gray-700">
          {Object.entries(room.utilityRates || {}).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong>{" "}
              {value.type === "fixed"
                ? `${formatCurrencyVND(value.rate)} / tháng`
                : `${formatCurrencyVND(value.rate)} mỗi đơn vị`}
            </li>
          ))}
        </ul>
      </div>

      {/* Phí phụ thu */}
      {room.additionalFees?.length > 0 && (
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

      {/* Đánh giá */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t text-sm text-gray-600 gap-2">
        <div>{RatingConsider(room.averageRating)}</div>
        <div>
          👁️ {room.viewCount} lượt xem | ❤️ {room.favoriteCount} thích | 📝 {room.totalRatings} đánh giá
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
