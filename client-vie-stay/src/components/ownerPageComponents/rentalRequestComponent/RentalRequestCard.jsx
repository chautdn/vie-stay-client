import React from 'react';
import { Eye, Calendar, User } from 'lucide-react';
import { formatDate } from '../../../utils/statusUtils';

const RentalRequestCard = ({ 
  request, 
  onViewDetails, 
  onAccept, 
  onReject, 
  onDelete,
  accommodationName,
  roomInfo,
  index
}) => {
  // ✅ SỬA: Cập nhật logic kiểm tra data
  const getStatusBadge = (status, request) => {
    const statusConfig = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Chờ xử lý' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Đã từ chối' },
      withdrawn: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Đã rút lại' },
      accepted: { 
        bg: 'bg-emerald-100', 
        text: 'text-emerald-800', 
        label: 'Đã chấp nhận'
      }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    // ✅ SỬA: Logic kiểm tra trạng thái chi tiết
    let subStatus = '';
    let isCompleted = false;
    
    if (status === 'accepted') {
      // ✅ Kiểm tra payment completion
      if (request.paymentCompletedAt || request.finalConfirmedAt || 
          (request.agreementConfirmationId && 
           request.agreementConfirmationId.paymentStatus === 'completed')) {
        subStatus = '💰 Đã thanh toán';
        isCompleted = true;
        config.label = 'Hoàn thành';
        config.bg = 'bg-green-100';
        config.text = 'text-green-800';
      } 
      // ✅ Có confirmation nhưng chưa thanh toán
      else if (request.agreementConfirmationId) {
        const confirmation = request.agreementConfirmationId;
        
        if (confirmation.status === 'confirmed' && 
           (confirmation.paymentStatus === 'pending' || !confirmation.paymentStatus)) {
          subStatus = '⏳ Chờ thanh toán';
        } else if (confirmation.status === 'pending') {
          subStatus = '📧 Chờ xác nhận';
        } else {
          subStatus = '⏳ Đang xử lý';
        }
      } 
      // ✅ Chưa có confirmation
      else {
        subStatus = '📧 Đang gửi email';
      }
    }
    
    return (
      <div className="flex flex-col gap-1">
        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
          {config.label}
        </span>
        
        {/* ✅ SỬA: Sub-status cho accepted requests */}
        {status === 'accepted' && subStatus && (
          <span className={`text-xs ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
            {subStatus}
          </span>
        )}
      </div>
    );
  };

  const isActionable = request.status === 'pending';

  return (
    <div className="bg-white hover:bg-gray-50 transition-colors">
      <div className="px-6 py-4">
        <div className="grid grid-cols-12 gap-4 items-center text-sm">
          {/* STT */}
          <div className="col-span-1">
            <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center font-medium">
              {index + 1}
            </div>
          </div>

          {/* Người thuê */}
          <div className="col-span-2">
            <div>
              <p className="font-medium text-gray-900 truncate">
                {request.tenantId?.name || 'N/A'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {request.tenantId?.email || 'N/A'}
              </p>
            </div>
          </div>

          {/* Tòa nhà */}
          <div className="col-span-2">
            <p className="text-gray-900 truncate">
              {accommodationName}
            </p>
          </div>

          {/* Phòng */}
          <div className="col-span-1">
            <p className="text-gray-900 truncate">
              {request.roomId?.name || roomInfo?.name || 'N/A'}
            </p>
          </div>

          {/* Thời gian */}
          <div className="col-span-2">
            <div className="text-xs text-gray-600">
              <div>Từ: {formatDate(request.proposedStartDate)}</div>
              <div>Số người: {request.guestCount || 1}</div>
            </div>
          </div>

          {/* Giá phòng */}
          <div className="col-span-1">
            <div className="text-sm font-medium text-green-600">
              {request.roomId?.baseRent?.toLocaleString('vi-VN') || 'N/A'}đ
            </div>
          </div>

          {/* Trạng thái - ✅ SỬA: Gọi function với request object */}
          <div className="col-span-1">
            {getStatusBadge(request.status, request)}
          </div>

          {/* Actions */}
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onViewDetails(request._id)}
                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                title="Xem chi tiết"
              >
                <Eye className="w-4 h-4" />
              </button>

              {isActionable && (
                <>
                  <button
                    onClick={() => onReject(request._id)}
                    className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                  >
                    Từ chối
                  </button>
                  <button
                    onClick={() => onAccept(request._id)}
                    className="px-2 py-1 text-xs text-white bg-green-600 hover:bg-green-700 rounded"
                  >
                    Chấp nhận
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Message Preview */}
        {request.message && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="bg-gray-50 rounded p-3">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Lời nhắn:</span> {request.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalRequestCard;