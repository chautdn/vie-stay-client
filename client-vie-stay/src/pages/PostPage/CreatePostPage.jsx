import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Users, 
  Square, 
  Wifi, 
  Car, 
  Shield, 
  Zap,
  Bath,
  Wind,
  Dumbbell,
  Trees,
  Dog,

  WashingMachine,
  ChefHat,
  Camera,
  X,
  Check,
  Info
} from 'lucide-react';
import axiosInstance from '../utils/AxiosInstance';
import { useAuthStore } from '../../store/authStore';

// Amenity icons mapping
const amenityIcons = {
  wifi: Wifi,
  air_conditioning: Wind,
  parking: Car,

  security: Shield,
  laundry: WashingMachine,
  kitchen_access: ChefHat,
  balcony: Home,
  gym: Dumbbell,
  pool: Square,
  garden: Trees,
  pets_allowed: Dog
};

const amenityLabels = {
  wifi: 'WiFi',
  air_conditioning: 'Điều hòa',
  parking: 'Chỗ đậu xe',
  elevator: 'Thang máy',
  security: 'An ninh 24/7',
  laundry: 'Máy giặt',
  kitchen_access: 'Phòng bếp',
  balcony: 'Ban công',
  gym: 'Phòng gym',
  pool: 'Hồ bơi',
  garden: 'Sân vườn',
  pets_allowed: 'Cho phép thú cưng'
};

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  
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
    district: '',
    amenities: [],
    contactName: user?.name || '',
    contactPhone: user?.phoneNumber || '',
    contactEmail: user?.email || '',
    allowNegotiation: true,
    preferredTenantGender: 'any',
    availableFrom: new Date().toISOString().split('T')[0]
  });

  const districts = [
    "Quận Hải Châu",
    "Quận Thanh Khê",
    "Quận Sơn Trà",
    "Quận Ngũ Hành Sơn",
    "Quận Liên Chiểu",
    "Quận Cẩm Lệ",
    "Huyện Hòa Vang"
  ];

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      alert('Chỉ được upload tối đa 10 ảnh');
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (step) => {
    switch(step) {
      case 1:
        return formData.title && formData.description && formData.propertyType;
      case 2:
        return formData.rent && formData.street && formData.ward && formData.district;
      case 3:
        return formData.contactName && formData.contactPhone;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Add images
      images.forEach(image => {
        submitData.append('images', image);
      });

      const response = await axiosInstance.post('/api/posts', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.post) {
        // Navigate to plan selection with the created post ID
        navigate(`/owner/choose-plan/${response.data.post._id}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi tạo tin đăng');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Thông tin cơ bản</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Tiêu đề tin đăng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="VD: Cho thuê phòng trọ giá rẻ quận Thanh Khê"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Mô tả chi tiết về phòng trọ, vị trí, tiện ích xung quanh..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Loại hình cho thuê <span className="text-red-500">*</span>
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="single_room">Phòng trọ</option>
                  <option value="shared_room">Ở ghép</option>
                  <option value="apartment">Căn hộ</option>
                  <option value="house">Nhà nguyên căn</option>
                  <option value="studio">Studio</option>
                  <option value="dormitory">Ký túc xá</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Diện tích (m²)
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Sức chứa (người)
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tình trạng nội thất
                </label>
                <select
                  name="furnishingLevel"
                  value={formData.furnishingLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="unfurnished">Không nội thất</option>
                  <option value="semi_furnished">Nội thất cơ bản</option>
                  <option value="fully_furnished">Đầy đủ nội thất</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="hasPrivateBathroom"
                checked={formData.hasPrivateBathroom}
                onChange={handleInputChange}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
              />
              <label className="text-sm">Phòng tắm riêng</label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Giá cả & Địa chỉ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Giá thuê (VNĐ/tháng) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="rent"
                  value={formData.rent}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="2000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tiền cọc (VNĐ)
                </label>
                <input
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="2000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tiền điện (VNĐ/kWh)
                </label>
                <input
                  type="number"
                  name="electricityCost"
                  value={formData.electricityCost}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="3500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tiền nước (VNĐ/m³)
                </label>
                <input
                  type="number"
                  name="waterCost"
                  value={formData.waterCost}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="20000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tiền internet (VNĐ/tháng)
                </label>
                <input
                  type="number"
                  name="internetCost"
                  value={formData.internetCost}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="100000"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Địa chỉ</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Số nhà, tên đường <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="123 Nguyễn Văn Linh"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phường/Xã <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Phường Hòa Minh"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quận/Huyện <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Tiện ích</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(amenityLabels).map(([key, label]) => {
                  const Icon = amenityIcons[key];
                  const isSelected = formData.amenities.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleAmenityToggle(key)}
                      className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                        isSelected 
                          ? 'bg-orange-50 border-orange-500 text-orange-700' 
                          : 'hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Thông tin liên hệ & Hình ảnh</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tên liên hệ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Giới tính ưu tiên
                </label>
                <select
                  name="preferredTenantGender"
                  value={formData.preferredTenantGender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="any">Tất cả</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ngày có thể chuyển vào
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="allowNegotiation"
                  checked={formData.allowNegotiation}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <label className="text-sm">Cho phép thương lượng giá</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Hình ảnh (Tối đa 10 ảnh)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Camera size={48} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click để chọn ảnh</span>
                  <span className="text-xs text-gray-500 mt-1">
                    JPG, PNG, tối đa 5MB mỗi ảnh
                  </span>
                </label>
              </div>

              {previewImages.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                  {previewImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Xem lại thông tin</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">{formData.title}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Loại hình:</span>
                  <span className="ml-2 font-medium">
                    {formData.propertyType === 'single_room' ? 'Phòng trọ' : 
                     formData.propertyType === 'shared_room' ? 'Ở ghép' :
                     formData.propertyType === 'apartment' ? 'Căn hộ' :
                     formData.propertyType === 'house' ? 'Nhà nguyên căn' :
                     formData.propertyType === 'studio' ? 'Studio' : 'Ký túc xá'}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-600">Giá thuê:</span>
                  <span className="ml-2 font-medium text-orange-600">
                    {parseInt(formData.rent).toLocaleString('vi-VN')} đ/tháng
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-600">Diện tích:</span>
                  <span className="ml-2 font-medium">{formData.area || 'Không xác định'} m²</span>
                </div>
                
                <div>
                  <span className="text-gray-600">Địa chỉ:</span>
                  <span className="ml-2 font-medium">
                    {formData.street}, {formData.ward}, {formData.district}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-gray-600 text-sm">Mô tả:</span>
                <p className="mt-1 text-sm">{formData.description}</p>
              </div>

              {formData.amenities.length > 0 && (
                <div>
                  <span className="text-gray-600 text-sm">Tiện ích:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.amenities.map(amenity => (
                      <span key={amenity} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                        {amenityLabels[amenity]}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Info size={16} />
                  <span>Sau khi tạo tin, bạn sẽ được chuyển đến trang chọn gói tin</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep >= step
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {currentStep > step ? <Check size={20} /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-24 md:w-32 h-1 transition-colors ${
                      currentStep > step ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Thông tin cơ bản</span>
            <span>Giá & Địa chỉ</span>
            <span>Liên hệ & Ảnh</span>
            <span>Xác nhận</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                onClick={handlePreviousStep}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Quay lại
              </button>
            )}
            
            <div className="ml-auto flex gap-3">
              <button
                onClick={() => navigate('/owner')}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              
              {currentStep < 4 ? (
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Tiếp tục
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang tạo...' : 'Tạo tin đăng'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;