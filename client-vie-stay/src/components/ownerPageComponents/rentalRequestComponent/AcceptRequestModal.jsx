import React, { useState, useEffect } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';

const AcceptRequestModal = ({ isOpen, onClose, onConfirm, request, isLoading }) => {
  const [formData, setFormData] = useState({
    responseMessage: '',
    startDate: '',
    notes: ''
  });

  // Initialize form data when request changes
  useEffect(() => {
    if (request) {
      setFormData({
        responseMessage: '',
        startDate: request.proposedStartDate ? 
          new Date(request.proposedStartDate).toISOString().split('T')[0] : '',
        notes: ''
      });
    }
  }, [request]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data để gửi lên backend
    const acceptData = {
      responseMessage: formData.responseMessage,
      startDate: formData.startDate,
      notes: formData.notes,
      // Giá thuê và tiền cọc sử dụng giá gốc từ room
      monthlyRent: request.roomId?.baseRent,
      deposit: request.roomId?.baseRent // Default deposit = monthly rent
    };

    onConfirm(acceptData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity backdrop-blur-xs flex items-center justify-center z-50 p-4"
    onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-green-600">
            Chấp nhận yêu cầu thuê nhà
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Tenant Info */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Thông tin người thuê
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Tên:</span>
                  <span className="ml-2 text-gray-900">{request?.tenantId?.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{request?.tenantId?.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Phòng:</span>
                  <span className="ml-2 text-gray-900">{request?.roomId?.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Số người:</span>
                  <span className="ml-2 text-gray-900">{request?.guestCount || 1} người</span>
                </div>
              </div>
            </div>
          </div>

          {/* Original Message */}
          {request?.message && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-2">
                Lời nhắn từ người thuê
              </h4>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-700 italic">"{request.message}"</p>
              </div>
            </div>
          )}

          {/* Contract Details */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Chi tiết hợp đồng
            </h4>
            
            {/* Start Date - Editable */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày bắt đầu *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
                disabled={isLoading}
              />
            </div>

            {/* Rent and Deposit - Read Only */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá thuê/tháng (VNĐ)
                </label>
                <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  {request?.roomId?.baseRent?.toLocaleString('vi-VN') || '0'} VNĐ
                </div>
                <p className="text-xs text-gray-500 mt-1">Giá thuê cố định theo phòng</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiền cọc (VNĐ)
                </label>
                <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  {request?.roomId?.baseRent?.toLocaleString('vi-VN') || '0'} VNĐ
                </div>
                <p className="text-xs text-gray-500 mt-1">Tiền cọc bằng 1 tháng tiền thuê</p>
              </div>
            </div>
          </div>

          {/* Response Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tin nhắn phản hồi *
            </label>
            <textarea
              value={formData.responseMessage}
              onChange={(e) => handleInputChange('responseMessage', e.target.value)}
              placeholder="Chúc mừng! Yêu cầu thuê phòng của bạn đã được chấp nhận. Tôi sẽ liên hệ với bạn để thảo luận chi tiết về hợp đồng và thủ tục chuyển vào..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              rows={3}
              required
              disabled={isLoading}
            />
          </div>

          {/* Additional Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú thêm
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Các điều khoản đặc biệt, quy định nội bộ, hoặc ghi chú thêm..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              rows={2}
              disabled={isLoading}
            />
          </div>

          {/* Summary */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">Tóm tắt hợp đồng</h4>
            <div className="text-sm text-green-700 space-y-1">
              <div>• Giá thuê: <span className="font-medium">{request?.roomId?.baseRent?.toLocaleString('vi-VN') || '0'} VNĐ/tháng</span></div>
              <div>• Tiền cọc: <span className="font-medium">{request?.roomId?.baseRent?.toLocaleString('vi-VN') || '0'} VNĐ</span></div>
              <div>• Ngày bắt đầu: <span className="font-medium">{formData.startDate || 'Chưa xác định'}</span></div>
              <div>• Số người: <span className="font-medium">{request?.guestCount || 1} người</span></div>
            </div>
          </div>

          {/* Info Note */}
          <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700">
              <span className="font-medium">Lưu ý:</span> Giá thuê và tiền cọc được cố định theo thông tin phòng. Bạn có thể thảo luận thêm với người thuê qua tin nhắn hoặc liên hệ trực tiếp.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.responseMessage.trim() || !formData.startDate}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <FiCheck className="w-4 h-4" />
              )}
              Chấp nhận yêu cầu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcceptRequestModal;