import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import axiosInstance from '../../utils/AxiosInstance';
import { Crown, Check, X } from 'lucide-react';

// Featured Types Configuration
const FEATURED_TYPES = {
  VIP_NOI_BAT: { 
    dailyPrice: 50000, 
    weeklyPrice: 315000, 
    monthlyPrice: 1500000, 
    priority: 1, 
    name: 'VIP Nổi Bật', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50',
    benefits: ['Hiển thị đầu tiên', 'Viền đỏ nổi bật', 'Logo VIP', 'Ưu tiên tối đa']
  },
  VIP_1: { 
    dailyPrice: 30000, 
    weeklyPrice: 190000, 
    monthlyPrice: 1200000, 
    priority: 2, 
    name: 'VIP 1', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-50',
    benefits: ['Hiển thị ưu tiên cao', 'Viền cam nổi bật', 'Logo VIP', 'Tăng lượt xem']
  },
  VIP_2: { 
    dailyPrice: 20000, 
    weeklyPrice: 133000, 
    monthlyPrice: 900000, 
    priority: 3, 
    name: 'VIP 2', 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-50',
    benefits: ['Hiển thị ưu tiên trung bình', 'Viền vàng', 'Tăng khả năng tiếp cận']
  },
  VIP_3: { 
    dailyPrice: 10000, 
    weeklyPrice: 63000, 
    monthlyPrice: 800000, 
    priority: 4, 
    name: 'VIP 3', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50',
    benefits: ['Hiển thị ưu tiên cơ bản', 'Viền xanh', 'Tăng cơ hội được xem']
  },
  THUONG: { 
    dailyPrice: 0, 
    weeklyPrice: 0, 
    monthlyPrice: 0, 
    priority: 5, 
    name: 'Thường', 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-50',
    benefits: ['Tin đăng miễn phí', 'Hiển thị theo thứ tự thông thường']
  }
};

const PostCreationPlanModal = ({ 
  isOpen, 
  onClose, 
  onPlanSelected, 
  postData,
  isCreating = false 
}) => {
  const { user } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState('THUONG');
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

  const handleCreatePost = async () => {
    setIsLoading(true);
    
    try {
      // First create the post
      const createData = new FormData();
      
      // Add all form fields from postData
      Object.keys(postData).forEach(key => {
        if (key === 'amenities') {
          createData.append(key, JSON.stringify(postData[key]));
        } else if (key === 'images') {
          // Handle images separately
          return;
        } else {
          createData.append(key, postData[key]);
        }
      });

      // Add images if they exist
      if (postData.images && postData.images.length > 0) {
        postData.images.forEach(image => {
          createData.append('images', image);
        });
      }

      console.log('Creating post with plan:', selectedPlan);
      const response = await axiosInstance.post('/api/posts', createData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const createdPost = response.data.post;
      
      // If not a free plan, upgrade the post
      if (selectedPlan !== 'THUONG') {
        if (!canAfford) {
          throw new Error('Insufficient wallet balance for selected plan');
        }

        const upgradeResponse = await axiosInstance.post(`/api/posts/${createdPost._id}/upgrade`, {
          featuredType: selectedPlan,
          duration,
          autoRenew,
          autoRenewDuration
        });

        onPlanSelected({
          success: true,
          message: `Tin đăng đã được tạo và nâng cấp lên ${FEATURED_TYPES[selectedPlan].name} thành công!`,
          postId: createdPost._id,
          cost,
          newBalance: upgradeResponse.data.newBalance
        });
      } else {
        onPlanSelected({
          success: true,
          message: 'Tin đăng đã được tạo thành công! Đang chờ duyệt.',
          postId: createdPost._id,
          cost: 0
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      onPlanSelected({
        success: false,
        message: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo tin đăng'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-w-5xl w-full max-h-screen overflow-y-auto bg-white rounded-xl shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Chọn gói tin đăng</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Lưu ý quan trọng</h3>
            <p className="text-blue-700 text-sm">
              Bạn cần chọn gói tin đăng để hoàn tất việc đăng tin. Tin thường sẽ hiển thị theo thứ tự bình thường, 
              trong khi các gói VIP sẽ được ưu tiên hiển thị và có nhiều tính năng nổi bật hơn.
            </p>
          </div>

          {/* Plan Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Object.entries(FEATURED_TYPES).map(([key, plan]) => (
              <div
                key={key}
                className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                  selectedPlan === key
                    ? 'border-orange-500 bg-orange-50 shadow-lg'
                    : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedPlan(key)}
              >
                {/* Selection indicator */}
                {selectedPlan === key && (
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-1">
                    <Check size={16} />
                  </div>
                )}

                <div className={`flex items-center justify-between mb-3`}>
                  <h3 className={`font-bold text-lg ${plan.color}`}>{plan.name}</h3>
                  {key !== 'THUONG' && <Crown className={`${plan.color}`} size={24} />}
                </div>
                
                {/* Pricing */}
                <div className="mb-4">
                  {key === 'THUONG' ? (
                    <div className="text-gray-600">
                      <p className="text-2xl font-bold text-green-600">Miễn phí</p>
                      <p className="text-sm">Không mất phí</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Giá từ:</p>
                      <p className="text-2xl font-bold">{plan.dailyPrice.toLocaleString()}₫<span className="text-sm font-normal">/ngày</span></p>
                      <p className="text-sm text-gray-600">{plan.weeklyPrice.toLocaleString()}₫/tuần</p>
                      <p className="text-sm text-gray-600">{plan.monthlyPrice.toLocaleString()}₫/tháng</p>
                    </div>
                  )}
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Lợi ích:</p>
                  <ul className="space-y-1">
                    {plan.benefits.map((benefit, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start">
                        <span className="text-green-500 mr-1 flex-shrink-0">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  Độ ưu tiên: #{plan.priority}
                </div>
              </div>
            ))}
          </div>

          {/* Duration Selection for VIP plans */}
          {selectedPlan !== 'THUONG' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium mb-3">Thời gian đăng (ngày)</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {[7, 14, 30, 60, 90].map(days => (
                  <button
                    key={days}
                    onClick={() => setDuration(days)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      duration === days
                        ? 'border-orange-500 bg-orange-500 text-white'
                        : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    {days} ngày
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min="1"
                  max="365"
                  className="w-20 p-2 border rounded-lg text-center"
                />
                <span className="text-sm text-gray-600">ngày (tùy chỉnh)</span>
              </div>
            </div>
          )}

          {/* Auto Renewal for VIP plans */}
          {selectedPlan !== 'THUONG' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  checked={autoRenew}
                  onChange={(e) => setAutoRenew(e.target.checked)}
                  className="mr-2 w-4 h-4 text-orange-600"
                />
                <label className="font-medium text-gray-700">Tự động gia hạn</label>
              </div>
              
              {autoRenew && (
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Gia hạn mỗi:</label>
                  <select
                    value={autoRenewDuration}
                    onChange={(e) => setAutoRenewDuration(Number(e.target.value))}
                    className="p-2 border rounded-lg bg-white"
                  >
                    <option value={7}>7 ngày</option>
                    <option value={14}>14 ngày</option>
                    <option value={30}>30 ngày</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Tin đăng sẽ tự động gia hạn khi hết hạn nếu ví có đủ số dư
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Cost Summary */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg mb-6 border border-orange-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-medium text-gray-800">Tổng chi phí:</span>
              <span className="text-2xl font-bold text-orange-600">
                {cost.toLocaleString()}₫
              </span>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Số dư hiện tại:</span>
              <span className="font-medium">{(user?.wallet?.balance || 0).toLocaleString()}₫</span>
            </div>

            {cost > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Số dư sau khi thanh toán:</span>
                <span className={`font-medium ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                  {canAfford 
                    ? ((user?.wallet?.balance || 0) - cost).toLocaleString()
                    : 'Không đủ'
                  }₫
                </span>
              </div>
            )}
            
            {!canAfford && cost > 0 && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">
                  ⚠️ Số dư không đủ. Cần thêm {(cost - (user?.wallet?.balance || 0)).toLocaleString()}₫
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleCreatePost}
              disabled={isLoading || (!canAfford && cost > 0)}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang tạo tin...
                </>
              ) : (
                <>
                  {selectedPlan === 'THUONG' ? 'Đăng tin miễn phí' : `Thanh toán ${cost.toLocaleString()}₫`}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreationPlanModal;