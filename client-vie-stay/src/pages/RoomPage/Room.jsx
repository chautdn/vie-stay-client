import React, { useEffect, useState } from "react";
import { formatCurrencyVND } from "../../utils/FormatPricePrint";
//import { RatingConsider } from "../../utils/RatingConsider";
import { Link, useLocation } from "react-router-dom";
import { Camera } from "lucide-react";

const Room = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightId, setHighlightId] = useState(null);
  const [scrollTargetId, setScrollTargetId] = useState(null);

  const roomsPerPage = 5;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const returnPageFromUrl = parseInt(queryParams.get("returnPage")) || 1;

  // ✅ Lấy lại trang và scroll ID khi quay về từ RoomDetail
  useEffect(() => {
  const stored = sessionStorage.getItem("scrollToRoom");
  if (stored) {
    const { scrollToId, returnPage } = JSON.parse(stored);
    setCurrentPage(returnPage || 1);
    setScrollTargetId(scrollToId);
    sessionStorage.removeItem("scrollToRoom");
  }
}, []);

  // 📥 Load danh sách phòng
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const res = await fetch("http://localhost:8080/room");
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error("Lỗi server: " + errorText);
        }
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error("Lỗi tải phòng:", err);
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, []);

  // ✅ Scroll tới phòng đã chọn sau khi danh sách render xong
  useEffect(() => {
  if (!scrollTargetId || loading) return; // Đợi dữ liệu tải xong

  const el = document.getElementById(`room-${scrollTargetId}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" }); // Cuộn đến phòng
    setHighlightId(scrollTargetId); // Đánh dấu phòng được chọn
    setTimeout(() => setHighlightId(null), 2000); // Xóa highlight sau 2 giây
    setScrollTargetId(null); // Reset scrollTargetId
  } else {
    // Nếu phần tử chưa tồn tại, thử lại sau 100ms
    setTimeout(() => {
      const retryEl = document.getElementById(`room-${scrollTargetId}`);
      if (retryEl) {
        retryEl.scrollIntoView({ behavior: "smooth", block: "start" });
        setHighlightId(scrollTargetId);
        setTimeout(() => setHighlightId(null), 2000);
        setScrollTargetId(null);
      }
    }, 100);
  }
}, [scrollTargetId, loading]); // Thêm `loading` vào dependency

  const totalPages = Math.ceil(rooms.length / roomsPerPage);
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Danh sách phòng</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <div className="space-y-6">
            {currentRooms.map((room) => {
              const roomId = room._id?.$oid || room._id?.toString?.() || room._id;

              return (
                <Link
                  id={`room-${roomId}`}
                  to={`/detail/${roomId}?returnPage=${currentPage}`}
                  state={{ room }}
                  key={roomId}
                  className={`border rounded-lg overflow-hidden shadow transition block bg-white
                    ${highlightId === roomId ? "ring-2 ring-orange-400" : "hover:shadow-lg"}`}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-[45%] h-60">
                      <img
                        src={room.images?.[0]}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs flex items-center gap-1 px-2 py-1 rounded">
                        <Camera size={14} /> {room.images?.length || 0}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 md:w-[55%] gap-[1px] bg-gray-100 h-60">
                      {room.images?.slice(1, 4).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`img-${i}`}
                          className="object-cover w-full h-full"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-red-600 font-bold uppercase text-base leading-snug">
                      {room.name}
                    </h3>
                    <div className="flex items-center text-green-600 font-semibold text-sm my-1">
                      {formatCurrencyVND(room.baseRent || 0)} / tháng
                      <span className="text-gray-600 ml-2">
                        • {room.size} m² • Quận 7, Hồ Chí Minh
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {room.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                          alt="avatar"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-semibold">{room.owner || "Người đăng"}</span>
                        <span className="text-gray-400">• Hôm nay</span>
                      </div>
                      <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">
                        {room.phone || "0903628959"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Nút phân trang */}
          <div className="flex justify-center items-center flex-wrap gap-2 mt-10 bg-orange-50 p-4 rounded-md">
            <button
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded border hover:bg-gray-100 disabled:opacity-50"
            >
              « Trang trước
            </button>

            {renderPageNumbers()}

            <button
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded border hover:bg-gray-100 disabled:opacity-50"
            >
              Trang sau »
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Room;
