import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotification } from '../../components/common/NotificationSystem';
import PostCreationPlanModal from '../../components/modals/PostCreationPlanModal';
import { 
  Camera, 
  Home, 
  Users, 
  Wifi, 
  Car, 
  Shield,
  X
} from 'lucide-react';

// Property Types
const PROPERTY_TYPES = [
  { value: 'single_room', label: 'Phòng đơn' },
  { value: 'shared_room', label: 'Phòng chia sẻ' },
  { value: 'apartment', label: 'Căn hộ' },
  { value: 'house', label: 'Nhà' },
  { value: 'studio', label: 'Studio' },
  { value: 'dormitory', label: 'Ký túc xá' }
];

// Districts in Da Nang
const DISTRICTS = [
  'Quận Hải Châu',
  'Quận Thanh Khê',
  'Quận Sơn Trà',
  'Quận Ngũ Hành Sơn',
  'Quận Liên Chiểu',
  'Quận Cẩm Lệ',
  'Huyện Hòa Vang'
];

// Amenities
const AMENITIES = [
  { value: 'wifi', label: 'WiFi', icon: Wifi },
  { value: 'air_conditioning', label: 'Điều hòa', icon: Home },
  { value: 'parking', label: 'Chỗ đậu xe', icon: Car },
  { value: 'elevator', label: 'Thang máy', icon: Home },
  { value: 'security', label: 'Bảo vệ', icon: Shield },
  { value: 'laundry', label: 'Giặt ủi', icon: Home },
  { value: 'kitchen_access', label: 'Bếp chung', icon: Home },
  { value: 'balcony', label: 'Ban công', icon: Home },
  { value: 'gym', label: 'Phòng gym', icon: Home },
  { value: 'pool', label: 'Hồ bơi', icon: Home },
  { value: 'garden', label: 'Vườn', icon: Home },
  { value: 'pets_allowed', label: 'Cho phép thú cưng', icon: Home }
];

const CreatePostPage = () => {
  const { user, updateWalletBalance } = useAuthStore();
  const { success, error, warning, info } = useNotification();
  const [selectedImages, setSelectedImages] = useState([]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'single_room',
    area: '',
    capacity: 1,
    hasPrivateBathroom: false,
    furnishingLevel: 'unfurnished',
    rent: '',
    deposit: '',
    electricityCost: '',
    waterCost: '',
    internetCost: '',
    street: '',
    ward: '',
    district: 'Quận Hải Châu',
    amenities: [],
    contactName: user?.name || '',
    contactPhone: user?.phoneNumber || '',
    contactEmail: user?.email || '',
    allowNegotiation: true,
    preferredTenantGender: 'any',
    availableFrom: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Check file size (5MB limit per file)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      warning('Một số hình ảnh quá lớn (>5MB) và đã bị bỏ qua');
      const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
      setSelectedImages(prev => [...prev, ...validFiles].slice(0, 10));
    } else {
      setSelectedImages(prev => [...prev, ...files].slice(0, 10));
    }

    if (selectedImages.length + files.length > 10) {
      info('Chỉ có thể tải lên tối đa 10 hình ảnh');
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const requiredFields = [
      { field: 'title', label: 'Tiêu đề' },
      { field: 'description', label: 'Mô tả' },
      { field: 'rent', label: 'Giá thuê' },
      { field: 'street', label: 'Địa chỉ cụ thể' },
      { field: 'ward', label: 'Phường/Xã' },
      { field: 'contactName', label: 'Tên liên hệ' },
      { field: 'contactPhone', label: 'Số điện thoại' }
    ];
    
    for (let { field, label } of requiredFields) {
      if (!formData[field] || String(formData[field]).trim() === '') {
        error(`Vui lòng điền đầy đủ thông tin bắt buộc: ${label}`);
        return false;
      }
    }

    if (formData.rent <= 0) {
      error('Giá thuê phải lớn hơn 0');
      return false;
    }

    if (formData.capacity <= 0) {
      error('Sức chứa phải lớn hơn 0');
      return false;
    }

    // Validate phone number format
    const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
    if (!phoneRegex.test(formData.contactPhone)) {
      error('Số điện thoại không đúng định dạng (VD: 0901234567)');
      return false;
    }

    // Validate email if provided
    if (formData.contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contactEmail)) {
        error('Email không đúng định dạng');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Show info about plan selection
    info('Vui lòng chọn gói tin đăng để hoàn tất việc đăng tin', {
      title: 'Chọn gói tin đăng',
      autoClose: false,
      action: {
        label: 'Tìm hiểu thêm',
        onClick: () => info('Gói VIP sẽ giúp tin đăng của bạn hiển thị ưu tiên và có nhiều lượt xem hơn!')
      }
    });

    // Prepare post data with images
    const postDataWithImages = {
      ...formData,
      images: selectedImages
    };

    // Show plan selection modal
    setShowPlanModal(true);
  };

  const handlePlanSelection = (result) => {
    setShowPlanModal(false);
    
    if (result.success) {
      // Update wallet balance if there was a cost
      if (result.newBalance !== undefined) {
        updateWalletBalance(result.newBalance);
      }
      
      // Show success notification
      success(result.message, {
        title: 'Thành công!',
        duration: 3000,
        action: {
          label: 'Xem tin đăng',
          onClick: () => console.log('Navigate to posts')
        }
      });
      
      // Navigate after a short delay
      setTimeout(() => {
        console.log('Navigate to posts page');
      }, 2000);
    } else {
      // Show error notification
      error(result.message, {
        title: 'Có lỗi xảy ra',
        duration: 7000,
        action: {
          label: 'Thử lại',
          onClick: () => setShowPlanModal(true)
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng tin cho thuê</h1>
        <p className="text-gray-600">Điền thông tin chi tiết để tạo tin đăng hấp dẫn</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📝 Thông tin cơ bản</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Tiêu đề tin đăng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Ví dụ: Cho thuê phòng trọ giá rẻ gần ĐH Bách Khoa"
                required
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.title.length}/200 ký tự</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Mô tả chi tiết về phòng trọ, vị trí, tiện ích xung quanh..."
                required
                maxLength={2000}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/2000 ký tự</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Loại phòng <span className="text-red-500">*</span>
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  required
                >
                  {PROPERTY_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Diện tích (m²)</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="20"
                  min="1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">🏠 Chi tiết phòng</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Sức chứa <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Nội thất</label>
              <select
                name="furnishingLevel"
                value={formData.furnishingLevel}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="unfurnished">Không nội thất</option>
                <option value="semi_furnished">Nội thất cơ bản</option>
                <option value="fully_furnished">Đầy đủ nội thất</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                name="hasPrivateBathroom"
                checked={formData.hasPrivateBathroom}
                onChange={handleInputChange}
                className="mr-3 w-4 h-4 text-orange-600 focus:ring-orange-500 rounded"
              />
              <label className="text-sm font-medium text-gray-700">Phòng tắm riêng</label>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">💰 Giá cả</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Giá thuê/tháng <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="rent"
                  value={formData.rent}
                  onChange={handleInputChange}
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="2000000"
                  min="0"
                  required
                />
                <span className="absolute right-3 top-3 text-gray-500">₫</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Tiền cọc</label>
              <div className="relative">
                <input
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleInputChange}
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="2000000"
                  min="0"
                />
                <span className="absolute right-3 top-3 text-gray-500">₫</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Tiền điện/kWh</label>
              <div className="relative">
                <input
                  type="number"
                  name="electricityCost"
                  value={formData.electricityCost}
                  onChange={handleInputChange}
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="3500"
                  min="0"
                />
                <span className="absolute right-3 top-3 text-gray-500">₫</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Tiền nước/m³</label>
              <div className="relative">
                <input
                  type="number"
                  name="waterCost"
                  value={formData.waterCost}
                  onChange={handleInputChange}
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="25000"
                  min="0"
                />
                <span className="absolute right-3 top-3 text-gray-500">₫</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📍 Địa chỉ</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Quận/Huyện <span className="text-red-500">*</span>
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                required
              >
                {DISTRICTS.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Phường/Xã <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Phường Hải Châu 1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Địa chỉ cụ thể <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="123 Lê Duẩn"
                required
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">🌟 Tiện ích</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {AMENITIES.map(amenity => (
              <div
                key={amenity.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md transform hover:scale-105 ${
                  formData.amenities.includes(amenity.value)
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-orange-300 bg-white'
                }`}
                onClick={() => handleAmenityToggle(amenity.value)}
              >
                <amenity.icon size={24} className="mb-2" />
                <div className="text-sm font-medium">{amenity.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📞 Thông tin liên hệ</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Tên liên hệ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                pattern="^(\+84|0)[0-9]{9,10}$"
                placeholder="0901234567"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Email liên hệ</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="email@example.com"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📷 Hình ảnh</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-orange-400 transition-colors bg-white">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center cursor-pointer"
            >
              <Camera size={48} className="text-gray-400 mb-3" />
              <span className="text-gray-600 font-medium">Chọn hình ảnh (tối đa 10 ảnh)</span>
              <span className="text-sm text-gray-500 mt-2">Định dạng: JPG, PNG. Tối đa 5MB/ảnh</span>
            </label>
          </div>

          {selectedImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-3">Đã chọn {selectedImages.length}/10 ảnh:</p>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Additional Settings */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">⚙️ Cài đặt khác</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Giới tính ưu tiên</label>
              <select
                name="preferredTenantGender"
                value={formData.preferredTenantGender}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="any">Không yêu cầu</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Có thể cho thuê từ</label>
              <input
                type="date"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="allowNegotiation"
              checked={formData.allowNegotiation}
              onChange={handleInputChange}
              className="mr-3 w-4 h-4 text-orange-600 focus:ring-orange-500 rounded"
            />
            <label className="text-sm font-medium text-gray-700">Có thể thương lượng giá</label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => console.log('Navigate to posts')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 font-semibold shadow-lg"
          >
            🚀 Tiếp tục đến chọn gói
          </button>
        </div>
      </form>

      {/* Plan Selection Modal */}
      <PostCreationPlanModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onPlanSelected={handlePlanSelection}
        postData={{
          ...formData,
          images: selectedImages
        }}
      />
    </div>
  );
};

export default CreatePostPage;