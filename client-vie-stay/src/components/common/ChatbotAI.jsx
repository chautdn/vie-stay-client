import React, { useState, useRef } from "react";
import { Send, Smile, User, Loader, X } from "lucide-react";

const DISTRICTS = [
  "Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Liên Chiểu", "Cẩm Lệ", "Hòa Vang"
];

const extractDistrict = (text) => {
  return DISTRICTS.find(d => text.toLowerCase().includes(d.toLowerCase()));
};

// Hàm lấy tên khu vực (quận)
const getRoomDistrict = (room) => {
  return room.accommodationId?.address?.district || room.district || "Đang cập nhật";
};

// Thêm hàm lấy địa chỉ phòng
const getRoomAddress = (room) => {
  if (room.fullAddress) return room.fullAddress;
  if (room.accommodationId?.address?.fullAddress) return room.accommodationId.address.fullAddress;
  if (room.accommodationId?.address) {
    const { street, ward, district, city } = room.accommodationId.address;
    return [street, ward, district, city].filter(Boolean).join(", ");
  }
  return "Địa chỉ đang cập nhật";
};

const ChatbotAI = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Xin chào! Tôi có thể giúp gì cho bạn về phòng trọ, giá cả, khu vực, dịch vụ tại Đà Nẵng?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

 const API_KEY_CHATBOT = process.env.REACT_APP_OPENAI_API_KEY;


  // Lấy phòng trọ mới nhất
  const fetchLatestRoomsInfo = async () => {
    try {
      const res = await fetch("http://localhost:8080/rooms");
      const data = await res.json();
      if (data?.data?.rooms && Array.isArray(data.data.rooms)) {
        const info = data.data.rooms.slice(0, 5).map((room, idx) => {
          const gia = room.baseRent ? `${room.baseRent.toLocaleString()}đ/tháng` : "Giá liên hệ";
          const diachi = getRoomAddress(room);
          const khuVuc = getRoomDistrict(room);
          const dichvu = room.amenities && room.amenities.length > 0 ? room.amenities.join(", ") : "Không có thông tin";
          return `${idx + 1}. ${room.name || "Phòng trọ"} - Giá: ${gia} - Địa chỉ: ${diachi} - Khu vực: ${khuVuc} - Dịch vụ: ${dichvu}`;
        }).join("\n");
        return info;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // Lấy phòng trọ theo khu vực
  const fetchRoomsByDistrict = async (district) => {
    try {
      const res = await fetch(`http://localhost:8080/rooms/search?district=${encodeURIComponent(district)}`);
      const data = await res.json();
      console.log("DATA ROOMS BY DISTRICT:", data); // Thêm dòng này

      if (data?.data?.rooms && Array.isArray(data.data.rooms)) {
        const info = data.data.rooms.slice(0, 5).map((room, idx) => {
          const gia = room.baseRent ? `${room.baseRent.toLocaleString()}đ/tháng` : "Giá liên hệ";
          const diachi = getRoomAddress(room);
          const khuVuc = getRoomDistrict(room);
          const dichvu = room.amenities && room.amenities.length > 0 ? room.amenities.join(", ") : "Không có thông tin";
          return `${idx + 1}. ${room.name || "Phòng trọ"} - Giá: ${gia} - Địa chỉ: ${diachi} - Khu vực: ${khuVuc} - Dịch vụ: ${dichvu}`;
        }).join("\n");
        return info;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    // 1. Kiểm tra district trong câu hỏi
    const district = extractDistrict(input);
    let roomsInfo = null;
    if (district) {
      roomsInfo = await fetchRoomsByDistrict(district);
    } else {
      roomsInfo = await fetchLatestRoomsInfo();
    }

    // 2. Ghép dữ liệu vào system message
    let systemMsg;
    if (roomsInfo) {
      systemMsg = {
        role: "system",
        content: `Bạn là trợ lý cho website VietStay. Dưới đây là một số phòng trọ ${district ? `ở khu vực ${district}` : "mới nhất"} trên web (bao gồm giá, khu vực, dịch vụ):\n${roomsInfo}\nNếu khách hỏi về phòng trọ, giá cả, khu vực, dịch vụ, hãy ưu tiên trả lời dựa trên thông tin này. Nếu không đủ thông tin, hãy hướng dẫn khách sử dụng chức năng tìm kiếm trên website.`,
      };
    } else {
      systemMsg = {
        role: "system",
        content: `Bạn là trợ lý cho website VietStay, chuyên về cho thuê phòng trọ tại Đà Nẵng. Nếu khách hỏi về phòng trọ, giá cả, khu vực, dịch vụ, hãy trả lời dựa trên kiến thức tổng quát và hướng dẫn khách sử dụng chức năng tìm kiếm trên website.`,
      };
    }

    // 3. Ghép messages
    const newMessages = [
      systemMsg,
      ...messages.filter(m => m.role !== "system"),
      { role: "user", content: input }
    ];

    // 4. Gửi lên OpenAI
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY_CHATBOT}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: newMessages,
        }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Xin lỗi, tôi không hiểu.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Đã xảy ra lỗi!" }]);
    }
    setLoading(false);
    setInput("");
  };

  React.useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  // Hiệu ứng mở/đóng
  const chatboxClass = open
    ? "fixed bottom-24 right-6 z-50 w-80 max-w-full bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 animate-fade-in"
    : "hidden";

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all border-4 border-white"
        style={{ fontSize: 32 }}
        aria-label="Chatbot AI"
      >
        <Smile size={32} />
      </button>
      {/* Chatbox */}
      <div className={chatboxClass} style={{ height: 480 }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-tr from-blue-600 to-blue-400 rounded-t-2xl shadow-sm">
          <div className="flex items-center gap-2">
            <Smile size={24} className="text-white bg-blue-500 rounded-full p-1" />
            <span className="text-white font-bold text-lg">VieStay Chatbot</span>
          </div>
          <button onClick={() => setOpen(false)} className="text-white text-2xl hover:bg-blue-700 rounded-full w-8 h-8 flex items-center justify-center transition">
            <X size={24} />
          </button>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gradient-to-b from-blue-50 to-white" style={{ fontSize: 15 }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-end gap-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {msg.role === "user" ? (
                    <User className="w-8 h-8 text-blue-400 bg-blue-100 rounded-full p-1 border border-blue-200" />
                  ) : (
                    <Smile className="w-8 h-8 text-white bg-blue-500 rounded-full p-1 border border-blue-300" />
                  )}
                </div>
                {/* Bubble */}
                <div className={`px-4 py-2 rounded-2xl shadow-md ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-900 border border-blue-100"} whitespace-pre-line break-words`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Input */}
        <div className="p-3 border-t bg-white flex gap-2 items-center">
          <input
            type="text"
            className="flex-1 border-2 border-blue-200 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 transition text-gray-800 bg-blue-50 placeholder-gray-400"
            placeholder={loading ? "Đang gửi..." : "Nhập tin nhắn..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
            disabled={loading}
            autoFocus={open}
          />
          <button
            onClick={handleSend}
            className={`bg-gradient-to-tr from-blue-600 to-blue-400 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition flex items-center gap-1 disabled:opacity-60 ${loading ? "cursor-not-allowed" : ""}`}
            disabled={loading || !input.trim()}
            aria-label="Gửi"
          >
            {loading ? <Loader className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {/* Hiệu ứng fade-in */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.25s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </>
  );
};

export default ChatbotAI; 