import React from 'react';
import { AlertTriangle, Calendar, Eye, EyeOff } from 'lucide-react';

const RentalRequestPriorityInfo = ({ 
  request, 
  formatDate, 
  getPriorityColor, 
  getPriorityText 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className={`p-4 rounded-lg border ${getPriorityColor(request.priority)}`}>
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={16} />
          <span className="font-medium">Mức độ ưu tiên</span>
        </div>
        <p className="text-lg font-bold">{getPriorityText(request.priority)}</p>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <Calendar size={16} className="text-gray-600" />
          <span className="font-medium text-gray-700">Ngày gửi</span>
        </div>
        <p className="text-sm text-gray-600">{formatDate(request.createdAt)}</p>
      </div>

      {request.viewedByLandlord ? (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <Eye size={16} className="text-green-600" />
            <span className="font-medium text-green-700">Đã xem</span>
          </div>
          <p className="text-sm text-green-600">
            {request.viewedAt ? formatDate(request.viewedAt) : 'Đã xem'}
          </p>
        </div>
      ) : (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <EyeOff size={16} className="text-blue-600" />
            <span className="font-medium text-blue-700">Chưa xem</span>
          </div>
          <p className="text-sm text-blue-600">Yêu cầu mới</p>
        </div>
      )}
    </div>
  );
};

export default RentalRequestPriorityInfo;