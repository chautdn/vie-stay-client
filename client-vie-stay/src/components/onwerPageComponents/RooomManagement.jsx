import React, { useEffect, useState } from "react";
import axios from "../../utils/AxiosInstance"; // dùng axios cấu hình sẵn

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("/api/rooms");
      setRooms(res.data.data.rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleHideRoom = async (roomId) => {
    try {
      await axios.patch(`/api/rooms/${roomId}/hide`);
      fetchRooms();
    } catch (err) {
      console.error("Hide room error:", err);
    }
  };

  const handleUnhideRoom = async (roomId) => {
    try {
      await axios.patch(`/api/rooms/${roomId}/unhide`);
      fetchRooms();
    } catch (err) {
      console.error("Unhide room error:", err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Room Management</h2>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">Loại</th>
            <th className="p-2 border">Trạng thái</th>
            <th className="p-2 border">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room._id}>
              <td className="p-2 border">{room.name}</td>
              <td className="p-2 border">{room.type}</td>
              <td className="p-2 border">
                {room.isHidden ? "Đang ẩn" : "Hiển thị"}
              </td>
              <td className="p-2 border">
                {room.isHidden ? (
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => handleUnhideRoom(room._id)}
                  >
                    Hiện phòng
                  </button>
                ) : (
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleHideRoom(room._id)}
                  >
                    Ẩn phòng
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomManagement;
