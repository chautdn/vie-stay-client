import React from 'react';
import { Heart, Share2, AlertTriangle, PhoneCallIcon } from "lucide-react";

const UserInfoPost = ({ 
  post, 
  isFavorited, 
  setIsFavorited, 
  setIsReport
}) => {
  // Lấy thông tin chủ từ post.userId
  const user = post?.userId;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mr-4">
          {user?.name?.charAt(0) || "U"}
        </div>
        <div>
          <div className="font-semibold text-lg">{user?.name || "Chủ trọ"}</div>
          <div className="text-gray-600">• Đang hoạt động</div>
          <div className="text-sm text-gray-500">
            Tham gia từ: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : "Đang cập nhật"}
          </div>
        </div>
      </div>

      {/* Phone Button */}
      <button
        className="w-full bg-blue-600 hover:bg-blue-800 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 mb-4"
        onClick={() => {
          if (user?.phoneNumber) window.location.href = `tel:${user.phoneNumber}`;
        }}
      >
        <PhoneCallIcon size={18} />
        Số điện thoại: {user?.phoneNumber || "Chưa cập nhật"}
      </button>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pt-4 border-t">
        <button 
          onClick={() => setIsFavorited(!isFavorited)}
          className="flex items-center text-gray-600 hover:text-red-600"
        >
          <Heart className={`h-5 w-5 mr-1 ${isFavorited ? 'fill-current text-red-600' : ''}`} />
          Lưu tin
        </button>
        <button className="flex items-center text-gray-600 hover:text-blue-600">
          <Share2 className="h-5 w-5 mr-1" />
          Chia sẻ
        </button>
        <button 
          onClick={() => setIsReport(true)}
          className="flex items-center text-gray-600 hover:text-red-600"
        >
          <AlertTriangle className="h-5 w-5 mr-1" />
          <span>Report</span>
        </button>
      </div>
    </div>
  );
};

export default UserInfoPost;