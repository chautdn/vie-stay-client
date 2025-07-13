import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const formatCurrency = (value) =>
  value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const RoommateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const instanceRef = useRef();

  const [sliderRef] = useKeenSlider({
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
    created(s) {
      instanceRef.current = s;
    },
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8080/roommates/${id}`)
      .then((res) => setRoom(res.data.data))
      .catch(() => setRoom(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-20">
        <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4">Đang tải thông tin...</p>
      </div>
    );

  if (!room)
    return (
      <div className="text-center py-20 text-red-600">
        <p>Không tìm thấy phòng ở ghép.</p>
        <button onClick={() => navigate("/roommates")} className="text-blue-500 underline mt-2">
          Quay lại danh sách
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg space-y-10">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline text-sm">← Quay lại danh sách</button>

      <div>
        <h1 className="text-3xl font-extrabold text-orange-600">{room.name}</h1>
        <p className="text-gray-600 text-sm">{room.description}</p>
      </div>

      {room.images?.length > 0 ? (
        <>
          <div className="relative bg-black rounded-xl overflow-hidden cursor-pointer" onClick={() => setShowFullscreen(true)}>
            <div ref={sliderRef} className="keen-slider h-[420px]">
              {room.images.map((img, i) => (
                <div key={i} className="keen-slider__slide flex justify-center items-center">
                  <img
                    src={img}
                    alt={`Ảnh ${i + 1}`}
                    className="h-full object-contain"
                    onError={(e) => (e.target.src = "/fallback.jpg")}
                  />
                </div>
              ))}
            </div>
            <button onClick={(e) => { e.stopPropagation(); instanceRef.current?.prev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full">
              ❮
            </button>
            <button onClick={(e) => { e.stopPropagation(); instanceRef.current?.next(); }} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full">
              ❯
            </button>
          </div>

          <div className="flex mt-2 gap-2 justify-center flex-wrap">
            {room.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                onClick={() => instanceRef.current?.moveToIdx(i)}
                className={`w-20 h-16 object-cover rounded-md cursor-pointer transition hover:scale-105 ${i === currentSlide ? "ring-2 ring-orange-500" : "opacity-80"}`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="h-[420px] bg-gray-200 rounded-xl flex justify-center items-center text-gray-500">Chưa có hình ảnh</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-800">
        <div className="space-y-2">
          <p><strong>Số phòng:</strong> {room.roomNumber}</p>
          <p><strong>Loại phòng:</strong> {room.type === "shared" ? "Ở ghép" : "Ký túc xá"}</p>
          <p><strong>Diện tích:</strong> {room.size || "-"} m²</p>
          <p><strong>Sức chứa:</strong> {room.capacity} người</p>
          <p><strong>Tối đa:</strong> {room.maxRoommates} bạn ở ghép</p>
          <p><strong>Có sẵn từ:</strong> {room.availableFrom ? new Date(room.availableFrom).toLocaleDateString("vi-VN") : "-"}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-orange-100 p-4 rounded shadow-sm">
            <p><strong>Giá thuê:</strong> <span className="text-orange-600 font-bold">{formatCurrency(room.baseRent)}</span></p>
            {room.deposit && <p>Đặt cọc: {formatCurrency(room.deposit)}</p>}
          </div>

          {room.amenities?.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Tiện nghi:</p>
              <ul className="list-disc list-inside grid grid-cols-2 gap-x-4">
                {room.amenities.map((item, idx) => (
                  <li key={idx}>{item.replace(/_/g, " ")}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Địa chỉ */}
      {room.address && (
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="font-semibold mb-2">📍 Địa chỉ</h3>
          <p><strong>Địa chỉ đầy đủ:</strong> {room.address.fullAddress}</p>
          <p><strong>Phường/Xã:</strong> {room.address.ward}</p>
          <p><strong>Quận/Huyện:</strong> {room.address.district}</p>
          <p><strong>Thành phố:</strong> {room.address.city}</p>
        </div>
      )}

      {/* Thông tin liên hệ */}
      {room.contactInfo && (
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-semibold mb-2">📞 Liên hệ</h3>
          <p><strong>Điện thoại:</strong> {room.contactInfo.phone}</p>
          {room.contactInfo.email && <p><strong>Email:</strong> {room.contactInfo.email}</p>}
          {room.contactInfo.website && (
            <p><strong>Website:</strong> <a href={room.contactInfo.website} className="text-blue-600 underline" target="_blank" rel="noreferrer">{room.contactInfo.website}</a></p>
          )}
        </div>
      )}

      <div className="text-center">
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg">
          Liên hệ thuê phòng
        </button>
      </div>
    </div>
  );
};

export default RoommateDetail;