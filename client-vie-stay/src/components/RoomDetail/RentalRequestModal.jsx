import React, { useState } from 'react';
import { X, Home, Loader2, Calendar, MessageCircle, Users } from 'lucide-react';
import { useRentalRequestStore } from '../../store/owner/rentalRequestStore';
import { toast } from 'react-hot-toast';

const RentalRequestModal = ({ isOpen, onClose, room }) => {
  const [requestForm, setRequestForm] = useState({
    moveInDate: '',
    message: '',
    guestCount: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createRentalRequest } = useRentalRequestStore();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!room?._id) {
        throw new Error('Room information is missing');
      }

      if (!requestForm.moveInDate) {
        throw new Error('Please select a move-in date');
      }

      if (requestForm.guestCount > room.capacity) {
        throw new Error(`Số người vượt quá sức chứa phòng (${room.capacity} người)`);
      }

      // Get landlord ID từ room data
      const landlordId = room.user?._id || 
                        room.userId || 
                        room.accommodation?.ownerId || 
                        room.accommodation?.owner?._id;

      if (!landlordId) {
        console.warn('⚠️ Landlord ID not found in room data:', room);
      }

      // Prepare clean data - with guest count
      const requestData = {
        roomId: room._id,
        accommodationId: room.accommodation?._id || room.accommodationId || null,
        landlordId: landlordId || null,
        message: requestForm.message.trim() || `Tôi muốn thuê phòng ${room.name || 'này'} cho ${requestForm.guestCount} người.`,
        proposedStartDate: requestForm.moveInDate,
        guestCount: parseInt(requestForm.guestCount)
      };

      console.log("📤 Sending rental request:", requestData);

      // Call API
      const response = await createRentalRequest(requestData);
      
      if (response && (response.success || response.data)) {
        toast.success('Gửi yêu cầu thuê thành công! Chủ trọ sẽ liên hệ với bạn sớm.');
        onClose();
        // Reset form
        setRequestForm({
          moveInDate: '',
          message: '',
          guestCount: 1
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error("❌ Failed to submit rental request:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message ||
                          'Có lỗi xảy ra khi gửi yêu cầu thuê. Vui lòng thử lại.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate guest count options based on room capacity
  const generateGuestOptions = () => {
    const maxGuests = room?.capacity || 4;
    const options = [];
    for (let i = 1; i <= maxGuests; i++) {
      options.push(
        <option key={i} value={i}>
          {i} người
        </option>
      );
    }
    return options;
  };

  return (
    <div className="fixed inset-0 bg-opacity backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Home size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Gửi yêu cầu thuê phòng</h3>
              <p className="text-blue-100 text-sm">Chọn ngày, số người và để lại lời nhắn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Room Info Card */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Home className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">{room?.name || 'Phòng trọ'}</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-gray-600">Giá: <span className="font-medium text-green-600">{room?.baseRent?.toLocaleString('vi-VN') || 'Liên hệ'} VNĐ/tháng</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-600">Sức chứa: <span className="font-medium">{room?.capacity || 1} người</span></span>
                  </div>
                  {room?.size && (
                    <div className="flex items-center gap-2 col-span-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span className="text-gray-600">Diện tích: <span className="font-medium">{room.size} m²</span></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Date Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="text-blue-500" size={20} />
                <h4 className="font-semibold text-gray-900">Ngày chuyển vào</h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn ngày muốn chuyển vào *
                </label>
                <input
                  type="date"
                  value={requestForm.moveInDate}
                  onChange={(e) => setRequestForm({...requestForm, moveInDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min={new Date().toISOString().split('T')[0]}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Chọn ngày bạn muốn bắt đầu thuê phòng
                </p>
              </div>
            </div>

            {/* Guest Count Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="text-blue-500" size={20} />
                <h4 className="font-semibold text-gray-900">Số người ở</h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn số người sẽ ở *
                </label>
                <select
                  value={requestForm.guestCount}
                  onChange={(e) => setRequestForm({...requestForm, guestCount: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={isSubmitting}
                >
                  {generateGuestOptions()}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Tối đa {room?.capacity || 1} người cho phòng này
                </p>
              </div>
            </div>

            {/* Message Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="text-blue-500" size={20} />
                <h4 className="font-semibold text-gray-900">Lời nhắn cho chủ trọ</h4>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Để lại lời nhắn (tùy chọn)
                </label>
                <textarea
                  rows={4}
                  value={requestForm.message}
                  onChange={(e) => setRequestForm({...requestForm, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tôi muốn thuê phòng này. Mong chủ trọ liên hệ với tôi để thảo luận chi tiết..."
                  disabled={isSubmitting}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">Chia sẻ thêm thông tin về bản thân hoặc yêu cầu đặc biệt</p>
                  <span className="text-xs text-gray-400">{requestForm.message.length}/500</span>
                </div>
              </div>
            </div>

            {/* Updated Info Display */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Thông tin yêu cầu</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Số người thuê:</span>
                  <span className="font-medium">{requestForm.guestCount} người</span>
                </div>
                <div className="flex justify-between">
                  <span>Giá thuê:</span>
                  <span className="font-medium text-green-600">
                    {room?.baseRent?.toLocaleString('vi-VN') || 'Theo giá phòng'} VNĐ/tháng
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Thời gian thuê:</span>
                  <span className="font-medium">Dài hạn</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={!requestForm.moveInDate || isSubmitting}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all ${
                requestForm.moveInDate && !isSubmitting
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Home size={16} />
                  Gửi yêu cầu thuê
                </>
              )}
            </button>
          </div>

          {/* Updated Note */}
          {requestForm.guestCount > 1 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-700">
              <span className="font-medium">Lưu ý: vì số người thuê của bạn là {requestForm.guestCount}, nên sau khi được chấp nhận yêu cầu thuê, bạn phải gửi thông tin của người thuê chung phòng của bạn tại .... </span> 
            </p>
          </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RentalRequestModal;