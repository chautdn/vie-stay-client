import React from 'react';

const AcceptRentalModal = ({ 
  isOpen,
  onClose,
  responseMessage,
  setResponseMessage,
  acceptData,
  setAcceptData,
  onAccept,
  request
}) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4 text-green-600">
          Chấp nhận yêu cầu thuê
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                value={acceptData.startDate}
                onChange={(e) => setAcceptData({...acceptData, startDate: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày kết thúc
              </label>
              <input
                type="date"
                value={acceptData.endDate}
                onChange={(e) => setAcceptData({...acceptData, endDate: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá thuê/tháng
              </label>
              <input
                type="number"
                placeholder={request.roomId?.baseRent}
                value={acceptData.monthlyRent}
                onChange={(e) => setAcceptData({...acceptData, monthlyRent: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiền cọc
              </label>
              <input
                type="number"
                placeholder={request.roomId?.deposit || request.roomId?.baseRent}
                value={acceptData.deposit}
                onChange={(e) => setAcceptData({...acceptData, deposit: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tin nhắn phản hồi
            </label>
            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder="Chúc mừng! Yêu cầu của bạn đã được chấp nhận..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú thêm
            </label>
            <textarea
              value={acceptData.notes}
              onChange={(e) => setAcceptData({...acceptData, notes: e.target.value})}
              placeholder="Các điều khoản hoặc ghi chú thêm..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows={2}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={onAccept}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Chấp nhập    
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptRentalModal;