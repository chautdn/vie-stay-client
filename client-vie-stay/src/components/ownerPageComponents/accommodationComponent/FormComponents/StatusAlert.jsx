// src/components/ownerComponent/FormComponents/StatusAlert.jsx

import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const StatusAlert = ({ type, message }) => {
  if (!message) return null;

  const isSuccess = type === 'success';
  const config = {
    bgColor: isSuccess ? 'bg-green-50' : 'bg-red-50',
    borderColor: isSuccess ? 'border-green-200' : 'border-red-200',
    iconColor: isSuccess ? 'text-green-500' : 'text-red-500',
    titleColor: isSuccess ? 'text-green-800' : 'text-red-800',
    textColor: isSuccess ? 'text-green-700' : 'text-red-700',
    Icon: isSuccess ? CheckCircle : AlertCircle,
    title: isSuccess ? 'Thành công!' : 'Lỗi',
  };

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-xl p-4 mb-6`}>
      <div className="flex items-start">
        <config.Icon className={`${config.iconColor} h-5 w-5 mt-0.5 mr-3 flex-shrink-0`} />
        <div>
          <h3 className={`${config.titleColor} font-medium`}>{config.title}</h3>
          <p className={`${config.textColor} text-sm mt-1`}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusAlert;