import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import axiosInstance from '../../utils/AxiosInstance';

// Featured Types Configuration
const FEATURED_TYPES = {
  VIP_NOI_BAT: { 
    dailyPrice: 50000, 
    weeklyPrice: 315000, 
    monthlyPrice: 1500000, 
    priority: 1, 
    name: 'VIP Nổi Bật', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50' 
  },
  VIP_1: { 
    dailyPrice: 30000, 
    weeklyPrice: 190000, 
    monthlyPrice: 1200000, 
    priority: 2, 
    name: 'VIP 1', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-50' 
  },
  VIP_2: { 
    dailyPrice: 20000, 
    weeklyPrice: 133000, 
    monthlyPrice: 900000, 
    priority: 3, 
    name: 'VIP 2', 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-50' 
  },
  VIP_3: { 
    dailyPrice: 10000, 
    weeklyPrice: 63000, 
    monthlyPrice: 800000, 
    priority: 4, 
    name: 'VIP 3', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50' 
  },
  THUONG: { 
    dailyPrice: 0, 
    weeklyPrice: 0, 
    monthlyPrice: 0, 
    priority: 5, 
    name: 'Thường', 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-50' 
  }
};

const ExtendPostModal = ({ postId, currentEndDate, currentPlan, onSuccess, onCancel }) => {
  const { user } = useAuthStore();
  const [additionalDays, setAdditionalDays] = useState(7);
  const [isLoading, setIsLoading] = useState(false);

  const calculateCost = (plan, days) => {
    const pricing = FEATURED_TYPES[plan];
    if (!pricing || plan === 'THUONG') return 0;
    
    if (days >= 30) {
      return Math.ceil(days / 30) * pricing.monthlyPrice;
    } else if (days >= 7) {
      return Math.ceil(days / 7) * pricing.weeklyPrice;
    } else {
      return days * pricing.dailyPrice;
    }
  };

  const cost = calculateCost(currentPlan, additionalDays);
  const canAfford = user?.wallet?.balance >= cost;

  const handleExtend = async () => {
    if (!canAfford) {
      alert('Số dư không đủ. Vui lòng nạp thêm tiền vào ví.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/api/posts/${postId}/extend`, {
        additionalDays
      });

      alert('Gia hạn tin đăng thành công!');
      onSuccess?.(response.data);
    } catch (error) {
      console.error('Error extending post:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi gia hạn tin đăng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Gia hạn tin đăng</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600">Gói hiện tại: 
              <span className={`ml-1 font-medium ${FEATURED_TYPES[currentPlan]?.color}`}>
                {FEATURED_TYPES[currentPlan]?.name}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Hết hạn: {new Date(currentEndDate).toLocaleDateString('vi-VN')}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Số ngày gia hạn</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[7, 14, 30].map(days => (
                <button
                  key={days}
                  onClick={() => setAdditionalDays(days)}
                  className={`p-2 border rounded-lg text-sm ${
                    additionalDays === days
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-300 hover:border-orange-300'
                  }`}
                >
                  {days} ngày
                </button>
              ))}
            </div>
            
            <input
              type="number"
              value={additionalDays}
              onChange={(e) => setAdditionalDays(Number(e.target.value))}
              min="1"
              max="365"
              className="w-full p-2 border rounded-lg"
              placeholder="Nhập số ngày"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Chi phí gia hạn:</span>
              <span className="text-lg font-bold text-orange-600">
                {cost.toLocaleString()}₫
              </span>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>Số dư hiện tại:</span>
              <span>{(user?.wallet?.balance || 0).toLocaleString()}₫</span>
            </div>
            
            {!canAfford && cost > 0 && (
              <p className="text-red-600 text-sm mt-2">
                Số dư không đủ. Cần thêm {(cost - (user?.wallet?.balance || 0)).toLocaleString()}₫
              </p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleExtend}
              disabled={isLoading || !canAfford}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {isLoading ? 'Đang xử lý...' : 'Gia hạn'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtendPostModal;