import React from 'react';
import { FiX, FiUser, FiMapPin, FiCalendar, FiUsers, FiMessageSquare } from 'react-icons/fi';
import { GiTakeMyMoney } from "react-icons/gi";
import { formatDate, getStatusColor, getStatusText } from '../../../utils/statusUtils';

const RentalRequestDetails = ({ isOpen, onClose, request, onAccept, onReject }) => {
  if (!isOpen || !request) return null;

  const getStatusBadge = (status) => {
    const { color, bg } = getStatusColor(status);
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bg} ${color}`}>
        {getStatusText(status)}
      </span>
    );
  };

  const isActionable = request.status === 'pending';

 const formattedAddress = React.useMemo(() => {
    const { fullAddress, ward, district, city } = request.accommodationId?.address || {};
    if (fullAddress) return fullAddress;

    const addressParts = [];
    if (ward) addressParts.push(ward);
    if (district) addressParts.push(district);
    if (city) addressParts.push(city);

    return addressParts.length > 0 ? addressParts.join(', ') : 'Địa chỉ đang cập nhật';
  }, [request.roomId?.address]);

  return (
    <div 
      className="fixed inset-0 bg-opacity backdrop-blur-xs flex items-center justify-center z-50"
      onClick={onClose} 
    >
      <div 
        className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Chi tiết yêu cầu thuê nhà
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Status */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Trạng thái yêu cầu
              </h4>
              {getStatusBadge(request.status)}
            </div>
            <div className="text-sm text-gray-500">
              <p className="mb-1">Ngày gửi: {formatDate(request.createdAt)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tenant Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                <FiUser className="w-5 h-5 mr-2" />
                Thông tin người thuê
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Họ tên</p>
                  <p className="font-medium">{request.tenantId?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{request.tenantId?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-medium">{request.tenantId?.phone || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số người tối đa</p>
                  <div className="flex items-center">
                    <FiUsers className="w-4 h-4 mr-2" />
                    <p className="font-medium">{request.roomId?.capacity || 1} người</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                <FiMapPin className="w-5 h-5 mr-2" />
                Thông tin phòng
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Tên phòng</p>
                  <p className="font-medium">{request.roomId?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Chỗ ở</p>
                  <p className="font-medium">{request.accommodationId?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Địa chỉ</p>
                  <p className="font-medium">{formattedAddress|| 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Giá phòng</p>
                  <div className="flex items-center">
                    <GiTakeMyMoney className="w-4 h-4 mr-2" />
                    <p className="font-medium">
                      {request.roomId?.baseRent?.toLocaleString('vi-VN') || 'N/A'} VND/tháng
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Terms */}
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h4 className="flex items-center text-lg font-medium text-gray-900 mb-4">
              <FiCalendar className="w-5 h-5 mr-2" />
              Điều kiện thuê đề xuất
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Ngày bắt đầu</p>
                <p className="font-medium">{formatDate(request.proposedStartDate)}</p>
              </div>

              {request.guestCount && (
                <div>
                  <p className="text-sm text-gray-600">Số người ở: </p>
                  <p className="font-medium">
                    {request.guestCount} Người
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          {request.message && (
            <div className="mt-6">
              <h4 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                <FiMessageSquare className="w-5 h-5 mr-2" />
                Tin nhắn từ người thuê
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{request.message}</p>
              </div>
            </div>
          )}

          {/* Special Requests */}
          {request.specialRequests && (
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Yêu cầu đặc biệt
              </h4>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-700">{request.specialRequests}</p>
              </div>
            </div>
          )}

          {/* Response Message */}
          {request.responseMessage && (
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Phản hồi của bạn
              </h4>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-700">{request.responseMessage}</p>
                {request.respondedAt && (
                  <p className="text-sm text-gray-500 mt-2">
                    Phản hồi lúc: {formatDate(request.respondedAt)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <p>Yêu cầu được gửi: {formatDate(request.createdAt)}</p>
              </div>
              {request.respondedAt && (
                <div>
                  <p>Đã phản hồi: {formatDate(request.respondedAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {isActionable && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => onReject(request._id)}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                >
                  Từ chối
                </button>
                <button
                  onClick={() => onAccept(request._id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  Chấp nhận
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RentalRequestDetails;