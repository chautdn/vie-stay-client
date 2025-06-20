import React from 'react';
import { Calendar, Users } from 'lucide-react';

const RentalDetailsInfo = ({ request, formatPrice, calculateStayDuration }) => {
  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar size={20} />
        Chi tiết yêu cầu thuê
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <span className="text-sm font-medium text-gray-700">Số người ở:</span>
          <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
            <Users size={16} />
            {request.guestCount} người
          </p>
        </div>
        
        <div>
          <span className="text-sm font-medium text-gray-700">Ngày bắt đầu:</span>
          <p className="font-semibold text-gray-900">
            {new Date(request.proposedStartDate).toLocaleDateString('vi-VN')}
          </p>
        </div>
        
        <div>
          <span className="text-sm font-medium text-gray-700">Ngày kết thúc:</span>
          <p className="font-semibold text-gray-900">
            {request.proposedEndDate 
              ? new Date(request.proposedEndDate).toLocaleDateString('vi-VN')
              : 'Không xác định'}
          </p>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-700">Thời gian thuê:</span>
          <p className="font-semibold text-gray-900">
            {calculateStayDuration()}
          </p>
        </div>
      </div>

      {request.proposedRent && (
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700">Giá thuê đề xuất:</span>
          <p className="text-xl font-bold text-green-600">
            {formatPrice(request.proposedRent)}/tháng
          </p>
        </div>
      )}
    </div>
  );
};

export default RentalDetailsInfo;