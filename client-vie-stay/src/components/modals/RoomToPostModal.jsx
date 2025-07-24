import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNotification } from '../../components/common/NotificationSystem';
import axiosInstance from '../../utils/AxiosInstance';
import { 
  X, 
  Home, 
  Users, 
  DollarSign, 
  MapPin, 
  Crown,
  Calendar,
  Star,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

// Featured Types Configuration (same as before)
const FEATURED_TYPES = {
  VIP_NOI_BAT: { 
    dailyPrice: 50000, 
    weeklyPrice: 315000, 
    monthlyPrice: 1500000, 
    priority: 1, 
    name: 'VIP Nổi Bật', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50',
    benefits: ['Hiển thị đầu tiên', 'Viền đỏ nổi bật', 'Logo VIP', 'Ưu tiên tối đa', 'Tự động duyệt ngay']
  },
  VIP_1: { 
    dailyPrice: 30000, 
    weeklyPrice: 190000, 
    monthlyPrice: 1200000, 
    priority: 2, 
    name: 'VIP 1', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-50',
    benefits: ['Hiển thị ưu tiên cao', 'Viền cam nổi bật', 'Logo VIP', 'Tăng lượt xem', 'Tự động duyệt ngay']
  },
  VIP_2: { 
    dailyPrice: 20000, 
    weeklyPrice: 133000, 
    monthlyPrice: 900000, 
    priority: 3, 
    name: 'VIP 2', 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-50',
    benefits: ['Hiển thị ưu tiên trung bình', 'Viền vàng', 'Tăng khả năng tiếp cận', 'Tự động duyệt ngay']
  },
  VIP_3: { 
    dailyPrice: 10000, 
    weeklyPrice: 63000, 
    monthlyPrice: 800000, 
    priority: 4, 
    name: 'VIP 3', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50',
    benefits: ['Hiển thị ưu tiên cơ bản', 'Viền xanh', 'Tăng cơ hội được xem', 'Tự động duyệt ngay']
  },
  THUONG: { 
    dailyPrice: 0, 
    weeklyPrice: 0, 
    monthlyPrice: 0, 
    priority: 5, 
    name: 'Thường', 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-50',
    benefits: ['Tin đăng miễn phí', 'Hiển thị theo thứ tự thông thường', 'Cần chờ duyệt thủ công']
  }
};

// Property type mapping - FIXED MAPPING (same as before)
const PROPERTY_TYPE_MAPPING = {
  'single': 'single_room',
  'double': 'shared_room',
  'twin': 'shared_room',
  'triple': 'shared_room',
  'family': 'apartment',
  'suite': 'apartment',
  'deluxe': 'single_room',
  'standard': 'single_room',
  'dormitory': 'dormitory',
  'private': 'single_room',
  'studio': 'studio'
};

// FIXED: Furnishing level mapping (same as before)
const FURNISHING_MAPPING = {
  'unfurnished': 'unfurnished',
  'semi': 'semi_furnished',
  'fully': 'fully_furnished'
};

// FIXED: Amenity mapping (same as before)
const AMENITY_MAPPING = {
  // Room amenities -> Post amenities
  'air_conditioning': 'air_conditioning',
  'heating': 'air_conditioning',
  'wifi': 'wifi',
  'tv': null,
  'refrigerator': null,
  'microwave': null,
  'coffee_maker': null,
  'desk': null,
  'chair': null,
  'wardrobe': null,
  'safe': null,
  'balcony': 'balcony',
  'window': null,
  'blackout_curtains': null,
  'iron': null,
  'hairdryer': null,
  'towels': null,
  'bed_linens': null,
  'pillow': null,
  'blanket': null,
  'hangers': null,
  'mirror': null,
  'power_outlets': null,
  'usb_ports': null,
  'reading_light': null,
  
  // Accommodation amenities -> Post amenities
  'parking': 'parking',
  'pool': 'pool',
  'gym': 'gym',
  'laundry': 'laundry',
  'elevator': 'elevator',
  'security': 'security',
  'kitchen': 'kitchen_access',
  'restaurant': null,
  'bar': null,
  'garden': 'garden',
  'terrace': 'garden',
  'sea_view': null,
  'mountain_view': null,
  'pets_allowed': 'pets_allowed',
  'smoking_allowed': null,
  'wheelchair_accessible': null
};

// FIXED: Filter and map amenities (same as before)
const mapAmenities = (roomAmenities = [], accommodationAmenities = []) => {
  const allAmenities = [...roomAmenities, ...accommodationAmenities];
  const mappedAmenities = allAmenities
    .map(amenity => AMENITY_MAPPING[amenity])
    .filter(amenity => amenity !== null && amenity !== undefined);
  
  // Remove duplicates
  return [...new Set(mappedAmenities)];
};

const RoomToPostModal = ({ 
  isOpen, 
  onClose, 
  room, 
  accommodation,
  onSuccess 
}) => {
  const { user, updateWalletBalance } = useAuthStore();
  const { success, error, warning } = useNotification();
  const [selectedPlan, setSelectedPlan] = useState('THUONG');
  const [duration, setDuration] = useState(7);
  const [autoRenew, setAutoRenew] = useState(false);
  const [autoRenewDuration, setAutoRenewDuration] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState({});

  useEffect(() => {
    if (room && accommodation && isOpen) {
      // FIXED: Generate post data with proper mapping (same as before)
      const mappedAmenities = mapAmenities(room.amenities, accommodation.amenities);
      
      const generatedData = {
        title: `${room.name || `Phòng ${room.roomNumber}`} - ${accommodation.name}`,
        description: `${room.description || ''}\n\nĐịa chỉ: ${accommodation.address?.fullAddress}\n\nTiện ích tòa nhà: ${accommodation.amenities?.join(', ') || 'Đang cập nhật'}`.trim(),
        propertyType: PROPERTY_TYPE_MAPPING[room.type] || 'single_room',
        area: room.size || '',
        capacity: room.capacity,
        hasPrivateBathroom: room.hasPrivateBathroom || false,
        furnishingLevel: FURNISHING_MAPPING[room.furnishingLevel] || 'unfurnished',
        rent: room.baseRent,
        deposit: room.deposit || 0,
        electricityCost: room.utilityRates?.electricity?.rate || '',
        waterCost: room.utilityRates?.water?.rate || '',
        internetCost: room.utilityRates?.internet?.rate || '',
        street: accommodation.address?.street || '',
        ward: accommodation.address?.ward || '',
        district: accommodation.address?.district || 'Quận Hải Châu',
        amenities: mappedAmenities,
        contactName: user?.name || '',
        contactPhone: accommodation.contactInfo?.phone || user?.phoneNumber || '',
        contactEmail: accommodation.contactInfo?.email || user?.email || '',
        allowNegotiation: true,
        preferredTenantGender: 'any',
        availableFrom: room.availableFrom ? new Date(room.availableFrom).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        roomId: room._id,
        accommodationId: accommodation._id,
        images: room.images || []
      };
      
      console.log('Generated post data:', generatedData);
      setPostData(generatedData);
    }
  }, [room, accommodation, user, isOpen]);

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
  const isVipPlan = selectedPlan !== 'THUONG';

  const handleCreatePost = async () => {
    setIsLoading(true);
    
    try {
      console.log('Creating post from room with data:', postData);
      
      // Use the new integrated endpoint
      const response = await axiosInstance.post('/api/posts/with-plan', {
        postData,
        selectedPlan,
        duration,
        autoRenew,
        autoRenewDuration
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const result = response.data;
      
      if (isVipPlan) {
        // VIP post was created and auto-approved
        success(
          `🎉 Tin đăng VIP đã được tạo và duyệt tự động! Tin của bạn đã được hiển thị ngay lập tức với ${FEATURED_TYPES[selectedPlan].name}.`, 
          {
            title: '✅ Thành công - Tự động duyệt!',
            duration: 5000
          }
        );
        
        if (result.newBalance !== undefined) {
          updateWalletBalance(result.newBalance);
        }
      } else {
        // Free post needs manual approval
        warning(
          'Tin đăng miễn phí đã được tạo thành công! Tin của bạn đang chờ được kiểm duyệt và sẽ hiển thị sau khi được phê duyệt.', 
          {
            title: '⏳ Chờ duyệt',
            duration: 4000
          }
        );
      }
      
      onSuccess?.(result.post);
      onClose();
    } catch (err) {
      console.error('Error creating post from room:', err);
      error(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tạo tin đăng');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (!isOpen || !room || !accommodation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-w-6xl w-full max-h-screen overflow-y-auto bg-white rounded-xl shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Tạo tin đăng từ phòng</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Room & Accommodation Preview (same as before) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Room Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <Home size={20} className="mr-2" />
                Thông tin phòng
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tên phòng:</span>
                  <span className="font-medium">{room.name || `Phòng ${room.roomNumber}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loại:</span>
                  <span className="font-medium">{room.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sức chứa:</span>
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    <span className="font-medium">{room.capacity} người</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá thuê:</span>
                  <div className="flex items-center text-blue-600 font-semibold">
                    <DollarSign size={14} className="mr-1" />
                    {formatPrice(room.baseRent)}/tháng
                  </div>
                </div>
                {room.size && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diện tích:</span>
                    <span className="font-medium">{room.size} m²</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Nội thất:</span>
                  <span className="font-medium">{FURNISHING_MAPPING[room.furnishingLevel] || room.furnishingLevel}</span>
                </div>
              </div>
            </div>

            {/* Accommodation Info */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                <MapPin size={20} className="mr-2" />
                Thông tin tòa nhà
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tên:</span>
                  <span className="font-medium">{accommodation.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loại:</span>
                  <span className="font-medium">{accommodation.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Địa chỉ:</span>
                  <span className="font-medium text-right max-w-48 truncate" title={accommodation.address?.fullAddress}>
                    {accommodation.address?.fullAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Liên hệ:</span>
                  <span className="font-medium">{accommodation.contactInfo?.phone}</span>
                </div>
                {accommodation.amenities && accommodation.amenities.length > 0 && (
                  <div>
                    <span className="text-gray-600">Tiện ích:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {accommodation.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          {amenity}
                        </span>
                      ))}
                      {accommodation.amenities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{accommodation.amenities.length - 3} khác
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Amenity Preview */}
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-3">Tiện ích sẽ được áp dụng</h3>
            <div className="flex flex-wrap gap-2">
              {postData.amenities && postData.amenities.length > 0 ? (
                postData.amenities.map((amenity, index) => (
                  <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                    {amenity}
                  </span>
                ))
              ) : (
                <span className="text-yellow-600 text-sm">Không có tiện ích phù hợp</span>
              )}
            </div>
            <p className="text-xs text-yellow-600 mt-2">
              * Chỉ hiển thị các tiện ích được hỗ trợ trong hệ thống tin đăng
            </p>
          </div>

          {/* Post Preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Xem trước tin đăng</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Tiêu đề:</span>
                <p className="text-gray-700 mt-1">{postData.title}</p>
              </div>
              <div>
                <span className="font-medium">Mô tả:</span>
                <p className="text-gray-700 mt-1 max-h-20 overflow-y-auto">{postData.description}</p>
              </div>
            </div>
          </div>

          {/* Plan Selection with Auto-Approval Info */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Chọn gói tin đăng</h3>
            
            {/* Auto-Approval Info Banner */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Zap className="text-blue-600" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Tính năng tự động duyệt</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <span className="text-gray-700">
                        <strong>Gói VIP:</strong> Tin đăng được duyệt và hiển thị ngay lập tức
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="text-yellow-600" size={16} />
                      <span className="text-gray-700">
                        <strong>Gói miễn phí:</strong> Cần chờ kiểm duyệt thủ công (1-24h)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {Object.entries(FEATURED_TYPES).map(([key, plan]) => (
                <div
                  key={key}
                  className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedPlan === key
                      ? 'border-orange-500 bg-orange-50 shadow-lg transform scale-105'
                      : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedPlan(key)}
                >
                  {/* Auto-approval badge for VIP plans */}
                  {key !== 'THUONG' && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <Zap size={10} className="mr-1" />
                      Auto-duyệt
                    </div>
                  )}
                  
                  <div className={`flex items-center justify-between mb-3`}>
                    <h4 className={`font-bold ${plan.color}`}>{plan.name}</h4>
                    {key !== 'THUONG' && <Crown className={`${plan.color}`} size={20} />}
                  </div>
                  
                  {key === 'THUONG' ? (
                    <div className="text-gray-600">
                      <p className="text-xl font-bold text-green-600">Miễn phí</p>
                      <p className="text-sm">Không mất phí</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-bold">{plan.dailyPrice.toLocaleString()}₫<span className="text-sm font-normal">/ngày</span></p>
                      <p className="text-sm text-gray-600">{plan.weeklyPrice.toLocaleString()}₫/tuần</p>
                      <p className="text-sm text-gray-600">{plan.monthlyPrice.toLocaleString()}₫/tháng</p>
                    </div>
                  )}

                  <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Lợi ích:</p>
                    <ul className="space-y-1">
                      {plan.benefits.slice(0, key === 'THUONG' ? 2 : 3).map((benefit, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start">
                          {key !== 'THUONG' && benefit.includes('Tự động duyệt') ? (
                            <Zap size={10} className="text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Star size={10} className="text-yellow-500 mr-1 mt-0.5 flex-shrink-0" />
                          )}
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Approval time indicator */}
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    {key !== 'THUONG' ? (
                      <div className="flex items-center text-xs text-green-600">
                        <CheckCircle size={12} className="mr-1" />
                        Hiển thị ngay lập tức
                      </div>
                    ) : (
                      <div className="flex items-center text-xs text-yellow-600">
                        <Clock size={12} className="mr-1" />
                        Chờ duyệt 1-24h
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Duration Selection for VIP plans */}
            {selectedPlan !== 'THUONG' && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
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
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
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
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cost Summary with Auto-Approval Benefits */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg mb-6 border border-orange-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-medium text-gray-800">Tổng chi phí:</span>
              <span className="text-2xl font-bold text-orange-600">
                {cost.toLocaleString()}₫
              </span>
            </div>
            
            {/* Approval status info */}
            <div className="mb-3 p-3 rounded-lg bg-white/70">
              {isVipPlan ? (
                <div className="flex items-center text-green-700">
                  <CheckCircle size={16} className="mr-2" />
                  <span className="font-medium">Tin đăng sẽ được duyệt và hiển thị ngay lập tức</span>
                </div>
              ) : (
                <div className="flex items-center text-yellow-700">
                  <Clock size={16} className="mr-2" />
                  <span className="font-medium">Tin đăng sẽ chờ kiểm duyệt thủ công (1-24 giờ)</span>
                </div>
              )}
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
                  {isVipPlan ? (
                    <>
                      <Zap size={16} className="mr-2" />
                      {`Thanh toán ${cost.toLocaleString()}₫ & Duyệt ngay`}
                    </>
                  ) : (
                    <>
                      <Clock size={16} className="mr-2" />
                      Đăng tin miễn phí (Chờ duyệt)
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomToPostModal;