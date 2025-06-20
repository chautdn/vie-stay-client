// src/components/ownerComponent/FormComponents/StatusAlert.jsx

import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react'; // 1. Import thêm icon "Info"

const StatusAlert = ({ type, title: customTitle, message }) => {
  // Component nhận thêm prop `title` và đổi tên thành `customTitle` để tránh trùng lặp
  if (!message) return null;

  let config;

  // 2. Dùng switch...case để dễ dàng mở rộng nhiều loại thông báo
  switch (type) {
    case 'success':
      config = {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        iconColor: 'text-green-500',
        titleColor: 'text-green-800',
        textColor: 'text-green-700',
        Icon: CheckCircle,
        title: 'Thành công!',
      };
      break;

    case 'warning': // 3. Thêm trường hợp "warning" mới
      config = {
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        iconColor: 'text-amber-500',
        titleColor: 'text-amber-800',
        textColor: 'text-amber-700',
        Icon: Info, // Dùng icon mới
        title: 'Lưu ý',
      };
      break;
    
    default: // Mặc định là 'error'
      config = {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-500',
        titleColor: 'text-red-800',
        textColor: 'text-red-700',
        Icon: AlertCircle,
        title: 'Lỗi',
      };
      break;
  }
  
  const { Icon, bgColor, borderColor, iconColor, titleColor, textColor, title } = config;

  return (
    <div className={`${bgColor} border ${borderColor} rounded-xl p-4 mb-6`}>
      <div className="flex items-start">
        <Icon className={`${iconColor} h-5 w-5 mt-0.5 mr-3 flex-shrink-0`} />
        <div>
          {/* 4. Sử dụng tiêu đề tùy chỉnh nếu được truyền vào, nếu không thì dùng tiêu đề mặc định */}
          <h3 className={`${titleColor} font-medium`}>{customTitle || title}</h3>
          <p className={`${textColor} text-sm mt-1`}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusAlert;