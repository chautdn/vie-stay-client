import React, { useState } from 'react';
import { FiX, FiXCircle } from 'react-icons/fi';

const RejectRequestModal = ({ isOpen, onClose, onConfirm, request, isLoading }) => {
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  const rejectReasons = [
    'Phòng đã được thuê',
    'Không phù hợp với yêu cầu',
    'Giá đề xuất không phù hợp',
    'Thời gian thuê không phù hợp',
    'Lý do khác'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalMessage = selectedReason === 'Lý do khác' 
      ? responseMessage 
      : `${selectedReason}. ${responseMessage}`.trim();
    
    onConfirm(finalMessage);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-opacity backdrop-blur-xs flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Từ chối yêu cầu thuê nhà
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Tenant Info */}
          <div className="mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Người thuê:</strong> {request?.tenantId?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Phòng:</strong> {request?.roomId?.name || 'N/A'}
              </p>
            </div>
          </div>

          {/* Reject Reason */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do từ chối
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Chọn lý do từ chối</option>
              {rejectReasons.map((reason, index) => (
                <option key={index} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedReason === 'Lý do khác' ? 'Lý do cụ thể' : 'Tin nhắn bổ sung (tùy chọn)'}
            </label>
            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={selectedReason === 'Lý do khác' 
                ? "Vui lòng nhập lý do cụ thể..." 
                : "Thêm thông tin bổ sung cho người thuê..."
              }
              required={selectedReason === 'Lý do khác'}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <FiXCircle className="w-4 h-4 mr-2" />
              )}
              Từ chối yêu cầu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectRequestModal;