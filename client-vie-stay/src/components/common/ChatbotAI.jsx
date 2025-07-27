import React, { useState, useRef } from "react";
import { Send, Smile, User, Loader, X } from "lucide-react";

const DISTRICTS = [
  "Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Liên Chiểu", "Cẩm Lệ", "Hòa Vang"
];

const extractDistrict = (text) => {
  return DISTRICTS.find(d => text.toLowerCase().includes(d.toLowerCase()));
};

// Hàm lấy tên khu vực (quận)
const getRoomDistrict = (post) => {
  return post.address?.district || "Đang cập nhật";
};

// Hàm lấy địa chỉ phòng
const getRoomAddress = (post) => {
  if (post.address?.fullAddress) return post.address.fullAddress;
  if (post.address) {
    const { street, ward, district, city } = post.address;
    // Chỉ lấy các thành phần hợp lệ, bỏ qua những giá trị không phải tên (như số '2000000')
    const validComponents = [street, ward, district, city].filter(
      component => component && !/^\d+$/.test(component)
    );
    return validComponents.length > 0 ? validComponents.join(", ") : "Địa chỉ đang cập nhật";
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

  const API_KEY_CHATBOT = import.meta.env.VITE_OPENAI_API_KEY;

  // Lấy phòng trọ mới nhất
  const fetchLatestRoomsInfo = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/posts");
      const data = await res.json();
      console.log("DATA ROOMS:", data);
      if (data?.posts && Array.isArray(data.posts)) {
        const info = data.posts.slice(0, 5).map((post, idx) => {
          const gia = post.rent ? `${post.rent.toLocaleString()}đ/tháng` : "Giá liên hệ";
          const diachi = getRoomAddress(post);
          const khuVuc = getRoomDistrict(post);
          const dichvu = post.amenities && post.amenities.length > 0 ? post.amenities.join(", ") : "Không có thông tin";
          return { id: post._id, text: `${idx + 1}. ${post.title || "Phòng trọ"} - Giá: ${gia} - Địa chỉ: ${diachi} - Khu vực: ${khuVuc} - Dịch vụ: ${dichvu}` };
        });
        return info;
      }
      return null;
    } catch (e) {
      console.error("Error fetching latest rooms:", e);
      return null;
    }
  };

  // Lấy phòng trọ theo khu vực
  const fetchRoomsByDistrict = async (district) => {
    try {
      const res = await fetch(`http://localhost:8080/api/posts/search?district=${encodeURIComponent(district)}&isAvailable=true`);
      const data = await res.json();
      console.log("DATA ROOMS BY DISTRICT:", data);
      if (data?.posts && Array.isArray(data.posts)) {
        const info = data.posts.slice(0, 5).map((post, idx) => {
          const gia = post.rent ? `${post.rent.toLocaleString()}đ/tháng` : "Giá liên hệ";
          const diachi = getRoomAddress(post);
          const khuVuc = getRoomDistrict(post);
          const dichvu = post.amenities && post.amenities.length > 0 ? post.amenities.join(", ") : "Không có thông tin";
          return { id: post._id, text: `${idx + 1}. ${post.title || "Phòng trọ"} - Giá: ${gia} - Địa chỉ: ${diachi} - Khu vực: ${khuVuc} - Dịch vụ: ${dichvu}` };
        });
        return info;
      }
      return null;
    } catch (e) {
      console.error("Error fetching rooms by district:", e);
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    // 1. Kiểm tra district và yêu cầu chi tiết
    const district = extractDistrict(input);
    const isDetailRequest = /chi tiết|xem thêm|thông tin chi tiết/i.test(input);
    let roomsInfo = null;
    let roomDetails = null;

    if (district) {
      roomsInfo = await fetchRoomsByDistrict(district);
    } else {
      roomsInfo = await fetchLatestRoomsInfo();
    }

    // 2. Xử lý yêu cầu chi tiết phòng
    if (isDetailRequest && roomsInfo) {
      const roomNumberMatch = input.match(/\d+/); // Tìm số thứ tự phòng (nếu có)
      if (roomNumberMatch) {
        const roomIndex = parseInt(roomNumberMatch[0]) - 1;
        if (roomsInfo[roomIndex]) {
          roomDetails = `Chi tiết phòng: <a href="http://localhost:3000/tin-dang/${roomsInfo[roomIndex].id}" target="_blank" class="text-blue-600 underline">Xem chi tiết</a>`;
        } else {
          roomDetails = "Không tìm thấy phòng với số thứ tự này. Vui lòng chọn số từ danh sách.";
        }
      } else {
        roomDetails = roomsInfo
          .map(room => `${room.text}<br>Chi tiết: <a href="http://localhost:3000/tin-dang/${room.id}" target="_blank" class="text-blue-600 underline">Xem chi tiết</a>`)
          .join("<br><br>");
      }
    }

    // 3. Ghép dữ liệu vào system message
    let systemMsg;
    if (roomsInfo) {
      const roomsText = roomsInfo.map(room => room.text).join("\n");
      systemMsg = {
        role: "system",
        content: `Bạn là trợ lý cho website VietStay. Dưới đây là một số phòng trọ ${district ? `ở khu vực ${district}` : "mới nhất"} trên web (bao gồm giá, khu vực, dịch vụ):\n${roomsText}\nNếu khách hỏi về chi tiết phòng, cung cấp đường dẫn http://localhost:3000/tin-dang/[id] với [id] là _id của phòng, định dạng dưới dạng liên kết có thể nhấp (e.g., <a href="http://localhost:3000/tin-dang/[id]" target="_blank">Xem chi tiết</a>). Nếu không đủ thông tin, hãy hướng dẫn khách sử dụng chức năng tìm kiếm trên website.`,
      };
    } else {
      systemMsg = {
        role: "system",
        content: `Bạn là trợ lý cho website VietStay, chuyên về cho thuê phòng trọ tại Đà Nẵng. Nếu khách hỏi về phòng trọ, giá cả, khu vực, dịch vụ, hãy trả lời dựa trên kiến thức tổng quát và hướng dẫn khách sử dụng chức năng tìm kiếm trên website. Nếu khách hỏi chi tiết phòng, gợi ý họ xem trên website.`,
      };
    }

    // 4. Ghép messages
    const newMessages = [
      systemMsg,
      ...messages.filter(m => m.role !== "system"),
      { role: "user", content: input }
    ];

    // 5. Gửi lên OpenAI hoặc trả lời chi tiết trực tiếp
    let reply;
    if (isDetailRequest && roomDetails) {
      reply = roomDetails;
    } else {
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
        reply = data.choices?.[0]?.message?.content || "Xin lỗi, tôi không hiểu.";
      } catch (err) {
        reply = "Đã xảy ra lỗi!";
      }
    }

    setMessages((prev) => [...prev, { role: "assistant", content: reply, isHtml: isDetailRequest && roomDetails }]);
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
                {msg.isHtml ? (
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-md ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-900 border border-blue-100"} whitespace-pre-line break-words`}
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                  />
                ) : (
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-md ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-900 border border-blue-100"} whitespace-pre-line break-words`}
                  >
                    {msg.content}
                  </div>
                )}
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