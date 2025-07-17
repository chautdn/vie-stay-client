import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import axiosInstance from '../../utils/AxiosInstance';
import { Crown } from 'lucide-react';

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

const PlanSelectionModal = ({ postId, currentPlan = 'THUONG', onSuccess, onCancel }) => {
  const { user } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [duration, setDuration] = useState(7);
  const [autoRenew, setAutoRenew] = useState(false);
  const [autoRenewDuration, setAutoRenewDuration] = useState(7);
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

  const cost = calculateCost(selectedPlan, duration);
  const canAfford = user?.wallet?.balance >= cost;

  const handleUpgrade = async () => {
    if (!canAfford && cost > 0) {
      alert('Số dư không đủ. Vui lòng nạp thêm tiền vào ví.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/api/posts/${postId}/upgrade`, {
        featuredType: selectedPlan,
        duration,
        autoRenew,
        autoRenewDuration
      });

      alert('Nâng cấp tin đăng thành công!');
      onSuccess?.(response.data);
    } catch (error) {
      console.error('Error upgrading post:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi nâng cấp tin đăng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-w-4xl w-full max-h-screen overflow-y-auto bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Chọn gói tin đăng</h2>
          
          {/* Plan Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Object.entries(FEATURED_TYPES).map(([key, plan]) => (
              <div
                key={key}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPlan === key
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                onClick={() => setSelectedPlan(key)}
              >
                <div className={`flex items-center justify-between mb-2`}>
                  <h3 className={`font-bold ${plan.color}`}>{plan.name}</h3>
                  {key !== 'THUONG' && <Crown className={`${plan.color}`} size={20} />}
                </div>
                
                {key === 'THUONG' ? (
                  <div className="text-gray-600">
                    <p className="text-lg font-bold">Miễn phí</p>
                    <p className="text-sm">Tin thường, không có ưu tiên</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600">Giá:</p>
                    <p className="text-lg font-bold">{plan.dailyPrice.toLocaleString()}₫/ngày</p>
                    <p className="text-sm">{plan.weeklyPrice.toLocaleString()}₫/tuần</p>
                    <p className="text-sm">{plan.monthlyPrice.toLocaleString()}₫/tháng</p>
                  </div>
                )}
                
                <div className="mt-2 text-xs text-gray-500">
                  Độ ưu tiên: {plan.priority}
                </div>
              </div>
            ))}
          </div>

          {/* Duration Selection */}
          {selectedPlan !== 'THUONG' && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Thời gian đăng (ngày)</label>
              <div className="flex space-x-4 mb-3">
                {[7, 14, 30, 60, 90].map(days => (
                  <button
                    key={days}
                    onClick={() => setDuration(days)}
                    className={`px-4 py-2 border rounded-lg ${
                      duration === days
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    {days} ngày
                  </button>
                ))}
              </div>
              
              <div className="mt-2">
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min="1"
                  max="365"
                  className="w-32 p-2 border rounded-lg"
                />
                <span className="ml-2 text-sm text-gray-600">ngày (tùy chỉnh)</span>
              </div>
            </div>
          )}

          {/* Auto Renewal */}
          {selectedPlan !== 'THUONG' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={autoRenew}
                  onChange={(e) => setAutoRenew(e.target.checked)}
                  className="mr-2"
                />
                <label className="font-medium">Tự động gia hạn</label>
              </div>
              
              {autoRenew && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Gia hạn mỗi</label>
                  <select
                    value={autoRenewDuration}
                    onChange={(e) => setAutoRenewDuration(Number(e.target.value))}
                    className="p-2 border rounded-lg"
                  >
                    <option value={7}>7 ngày</option>
                    <option value={14}>14 ngày</option>
                    <option value={30}>30 ngày</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Cost Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Tổng chi phí:</span>
              <span className="text-xl font-bold text-orange-600">
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

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleUpgrade}
              disabled={isLoading || (!canAfford && cost > 0)}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {isLoading ? 'Đang xử lý...' : 'Nâng cấp'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionModal;