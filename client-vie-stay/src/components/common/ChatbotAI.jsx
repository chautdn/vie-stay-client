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
    { role: "assistant", content: "Xin chào! Tôi có thể giúp gì cho bạn về phòng trọ, giá cả, khu vực, dịch vụ tại Đà Nẵng? Bạn có thể hỏi 'xem chi tiết phòng số X' để xem thông tin chi tiết." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_KEY_CHATBOT = import.meta.env.VITE_OPENAI_API_KEY;

  // ✅ SỬA: Cải thiện function lấy phòng trọ mới nhất
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
          const shortTitle = post.title && post.title.length > 50 ? post.title.substring(0, 50) + "..." : (post.title || "Phòng trọ");
          
          return { 
            id: post._id, 
            title: post.title || "Phòng trọ",
            text: `${idx + 1}. ${shortTitle} - Giá: ${gia} - Địa chỉ: ${diachi} - Khu vực: ${khuVuc}`,
            detailText: `🏠 **${post.title || "Phòng trọ"}**\n💰 Giá: ${gia}\n📍 Địa chỉ: ${diachi}\n🏘️ Khu vực: ${khuVuc}\n🛠️ Tiện nghi: ${dichvu}`
          };
        });
        return info;
      }
      return null;
    } catch (e) {
      console.error("Error fetching latest rooms:", e);
      return null;
    }
  };

  // ✅ SỬA: Cải thiện function lấy phòng trọ theo khu vực
  const fetchRoomsByDistrict = async (district) => {
    try {
      const res = await fetch(`http://localhost:8080/api/posts/search?district=${encodeURIComponent(district)}&isAvailable=true`);
      const data = await res.json();
      console.log("DATA ROOMS BY DISTRICT:", data);
      
      // ✅ SỬA: Handle different response formats from search endpoint
      let posts = [];
      if (data?.data?.posts && Array.isArray(data.data.posts)) {
        posts = data.data.posts;
      } else if (data?.posts && Array.isArray(data.posts)) {
        posts = data.posts;
      }
      
      if (posts.length > 0) {
        const info = posts.slice(0, 5).map((post, idx) => {
          const gia = post.rent ? `${post.rent.toLocaleString()}đ/tháng` : "Giá liên hệ";
          const diachi = getRoomAddress(post);
          const khuVuc = getRoomDistrict(post);
          const dichvu = post.amenities && post.amenities.length > 0 ? post.amenities.join(", ") : "Không có thông tin";
          const shortTitle = post.title && post.title.length > 50 ? post.title.substring(0, 50) + "..." : (post.title || "Phòng trọ");
          
          return { 
            id: post._id, 
            title: post.title || "Phòng trọ",
            text: `${idx + 1}. ${shortTitle} - Giá: ${gia} - Địa chỉ: ${diachi} - Khu vực: ${khuVuc}`,
            detailText: `🏠 **${post.title || "Phòng trọ"}**\n💰 Giá: ${gia}\n📍 Địa chỉ: ${diachi}\n🏘️ Khu vực: ${khuVuc}\n🛠️ Tiện nghi: ${dichvu}`
          };
        });
        return info;
      }
      return null;
    } catch (e) {
      console.error("Error fetching rooms by district:", e);
      return null;
    }
  };

  // ✅ THÊM: Function tạo HTML với link có thể click
  const createRoomListWithLinks = (roomsInfo) => {
    return roomsInfo.map(room => {
      return `
        <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
          <div style="margin-bottom: 8px;">${room.text}</div>
          <a href="http://localhost:3000/tin-dang/${room.id}" 
             target="_blank" 
             style="display: inline-block; background-color: #3b82f6; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 13px;">
            📋 Xem chi tiết
          </a>
        </div>
      `;
    }).join('');
  };

  // ✅ THÊM: Function tạo link chi tiết cho một phòng cụ thể
  const createSingleRoomDetail = (room) => {
    return `
      <div style="padding: 15px; border: 1px solid #3b82f6; border-radius: 10px; background-color: #eff6ff;">
        <h4 style="margin: 0 0 10px 0; color: #1e40af;">🏠 ${room.title}</h4>
        <div style="margin-bottom: 10px; white-space: pre-line;">${room.detailText}</div>
        <a href="http://localhost:3000/tin-dang/${room.id}" 
           target="_blank" 
           style="display: inline-block; background-color: #10b981; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          🔗 Xem trang chi tiết đầy đủ
        </a>
      </div>
    `;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    // ✅ SỬA: Cải thiện logic xử lý input
    const district = extractDistrict(input);
    const isDetailRequest = /chi tiết|xem thêm|thông tin chi tiết|detail/i.test(input);
    const isRoomNumberRequest = /phòng số|số \d+|phòng \d+/i.test(input);
    
    let roomsInfo = null;
    let responseHtml = null;

    // Fetch data based on district or get latest
    if (district) {
      roomsInfo = await fetchRoomsByDistrict(district);
    } else {
      roomsInfo = await fetchLatestRoomsInfo();
    }

    // ✅ SỬA: Xử lý các loại request khác nhau
    if (roomsInfo && roomsInfo.length > 0) {
      if (isDetailRequest || isRoomNumberRequest) {
        // Tìm số thứ tự phòng từ input
        const roomNumberMatch = input.match(/(\d+)/);
        if (roomNumberMatch) {
          const roomIndex = parseInt(roomNumberMatch[0]) - 1;
          if (roomsInfo[roomIndex]) {
            // Hiển thị chi tiết một phòng cụ thể
            responseHtml = `
              <div style="margin-bottom: 10px;">Đây là thông tin chi tiết phòng số ${roomNumberMatch[0]}:</div>
              ${createSingleRoomDetail(roomsInfo[roomIndex])}
            `;
          } else {
            responseHtml = `
              <div style="color: #dc2626; padding: 10px; background-color: #fef2f2; border-radius: 6px;">
                ❌ Không tìm thấy phòng số ${roomNumberMatch[0]}. Hiện tại chỉ có ${roomsInfo.length} phòng trong danh sách.
              </div>
              <div style="margin-top: 10px;">Danh sách phòng hiện có:</div>
              ${createRoomListWithLinks(roomsInfo)}
            `;
          }
        } else {
          // Hiển thị chi tiết tất cả phòng
          responseHtml = `
            <div style="margin-bottom: 10px;">📋 Danh sách chi tiết ${district ? `phòng trọ ở ${district}` : 'phòng trọ mới nhất'}:</div>
            ${createRoomListWithLinks(roomsInfo)}
            <div style="margin-top: 10px; font-style: italic; color: #6b7280;">
              💡 Tip: Bạn có thể nói "xem chi tiết phòng số 1" để xem thông tin cụ thể.
            </div>
          `;
        }
      } else {
        // Request thông thường - chỉ hiển thị danh sách
        responseHtml = `
          <div style="margin-bottom: 10px;">📋 Tìm thấy ${roomsInfo.length} ${district ? `phòng trọ ở ${district}` : 'phòng trọ mới nhất'}:</div>
          ${createRoomListWithLinks(roomsInfo)}
          <div style="margin-top: 10px; font-style: italic; color: #6b7280;">
            💡 Bạn có thể nói "xem chi tiết" hoặc "chi tiết phòng số X" để xem thêm thông tin.
          </div>
        `;
      }
    }

    // ✅ SỬA: Xử lý response
    let reply;
    if (responseHtml) {
      reply = responseHtml;
      setMessages((prev) => [...prev, { role: "assistant", content: reply, isHtml: true }]);
    } else {
      // Gửi lên OpenAI nếu không có data hoặc request phức tạp
      try {
        const systemMsg = {
          role: "system",
          content: `Bạn là trợ lý cho website VietStay, chuyên về cho thuê phòng trọ tại Đà Nẵng. 
                   ${roomsInfo ? `Hiện tại có ${roomsInfo.length} phòng trọ ${district ? `ở ${district}` : 'mới nhất'}.` : 'Hiện tại không có dữ liệu phòng trọ.'}
                   Hãy trả lời thân thiện và hướng dẫn khách hàng. Nếu khách hỏi về chi tiết phòng, hãy gợi ý họ nói "xem chi tiết" hoặc "chi tiết phòng số X".`,
        };

        const newMessages = [
          systemMsg,
          ...messages.filter(m => m.role !== "system"),
          { role: "user", content: input }
        ];

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
        reply = data.choices?.[0]?.message?.content || "Xin lỗi, tôi không hiểu. Bạn có thể hỏi về phòng trọ, giá cả, hoặc khu vực cụ thể.";
      } catch (err) {
        console.error("OpenAI Error:", err);
        reply = "Đã xảy ra lỗi! Vui lòng thử lại hoặc liên hệ hỗ trợ.";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: reply, isHtml: false }]);
    }

    setLoading(false);
    setInput("");
  };

  React.useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

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
                    className={`px-4 py-2 rounded-2xl shadow-md ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-900 border border-blue-100"} break-words`}
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                    style={{ lineHeight: '1.5' }}
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
            placeholder={loading ? "Đang gửi..." : "VD: 'phòng ở Hải Châu', 'chi tiết phòng số 1'..."}
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
        
        /* ✅ THÊM: Styling cho links trong chatbot */
        .chatbot-message a {
          color: #3b82f6 !important;
          text-decoration: none !important;
        }
        .chatbot-message a:hover {
          background-color: #2563eb !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  );
};

export default ChatbotAI;