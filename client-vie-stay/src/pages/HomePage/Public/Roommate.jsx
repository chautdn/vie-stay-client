import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { BsBookmarkStarFill } from "react-icons/bs";
import { Home, Camera } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";

const RoommateList = () => {
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [sortBy, setSortBy] = useState("default");

  const handleToggleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSort = (type) => {
    setSortBy(type);
    const sorted = [...roommates];
    switch (type) {
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "price":
        sorted.sort((a, b) => a.baseRent - b.baseRent);
        break;
      case "area":
        sorted.sort((a, b) => a.size - b.size);
        break;
      default:
        sorted.sort((a, b) => b.viewCount - a.viewCount);
    }
    setRoommates(sorted);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/roommates")
      .then((res) => {
        setRoommates(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching roommates:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Đang tải danh sách ở ghép...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8">
        <p>{error}</p>
      </div>
    );
  }

  if (roommates.length === 0) {
    return (
      <div className="text-center py-20">
        <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Không có phòng ở ghép nào.</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 my-3">
        <h4 className="text-xl font-semibold">Danh sách ở ghép nổi bật</h4>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">
            Cập nhật: {new Date().toLocaleString("vi-VN")}
          </span>
          <Link
            to="/roommates/post"
            className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600 transition text-sm font-medium"
          >
            Đăng tin
          </Link>
        </div>
      </div>

      {roommates.map((room) => {
        const images = room.images || [];
        const displayImages = [0, 1, 2, 3].map((i) => images[i] || images[0]);
        const isSaved = savedIds.includes(room._id);

        return (
          <Link to={`/roommates/${room._id}`} key={room._id} className="block w-full">
            <div className="w-full relative flex flex-col md:flex-row gap-5 border-t-2 border-orange-400 p-4 cursor-pointer bg-white rounded shadow hover:shadow-md transition">
              {/* Images */}
              <div className="w-full md:w-2/5 grid grid-cols-2 gap-[2px] items-center relative">
                {displayImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`room-${idx}`}
                    className="w-full h-[140px] object-cover"
                    onError={(e) =>
                      (e.target.src = "https://cdn-icons-png.flaticon.com/512/2748/2748558.png")
                    }
                    loading="lazy"
                  />
                ))}
                <span
                  className="absolute right-1 bottom-1 z-10 cursor-pointer p-1 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50"
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggleSave(room._id);
                  }}
                  title={isSaved ? "Xóa khỏi danh sách đã lưu" : "Lưu tin này"}
                >
                  {isSaved ? (
                    <IoIosHeart size={24} color="red" />
                  ) : (
                    <IoIosHeartEmpty size={24} color="white" />
                  )}
                </span>
                <span className="absolute left-1 bottom-1 text-xs bg-black bg-opacity-60 text-white px-2 py-1 rounded">
                  <Camera size={14} className="inline-block mr-1" />
                  {images.length || 1} ảnh
                </span>
              </div>

              {/* Info */}
              <div className="w-full md:w-3/5">
                <div className="flex items-center justify-between">
                  <div className="flex text-yellow-400 text-sm">
                    {[...Array(4)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <BsBookmarkStarFill size={24} color="orange" />
                </div>

                <h3 className="text-red-600 font-medium mt-2 text-base md:text-lg">
                  {room.name || "Phòng ở ghép"}
                </h3>

                <div className="my-2 flex items-center flex-wrap gap-3 text-sm text-gray-600">
                  <span className="font-bold text-green-600">
                    {room.baseRent?.toLocaleString()} ₫
                  </span>
                  <span>{room.size || 20}m²</span>
                  <span className="truncate max-w-[200px]">
                    {room.address?.fullAddress || "Địa chỉ đang cập nhật..."}
                  </span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                  {room.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <img
                      src={
                        room.contactInfo?.avatar ||
                        "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      }
                      alt="avatar"
                      className="w-7 h-7 rounded-full object-cover"
                      onError={(e) =>
                        (e.target.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png")
                      }
                      loading="lazy"
                    />
                    <span>{room.contactInfo?.name || "Chủ trọ"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`tel:${room.contactInfo?.phone}`, "_self");
                      }}
                      disabled={!room.contactInfo?.phone}
                    >
                      {room.contactInfo?.phone ? `Gọi ${room.contactInfo.phone}` : "Chưa có SĐT"}
                    </Button>
                    <Button
                      variant="outline"
                      className="text-xs border px-3 py-1 rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`https://zalo.me/${room.contactInfo?.phone}`, "_blank");
                      }}
                      disabled={!room.contactInfo?.phone}
                    >
                      Nhắn Zalo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default RoommateList;
