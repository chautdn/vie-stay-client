import React, { useState } from 'react';
import axiosInstance from '../../utils/AxiosInstance';
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

const EditPostModal = ({ post, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [formData, setFormData] = useState({
    title: post.title || '',
    description: post.description || '',
    propertyType: post.propertyType || 'single_room',
    area: post.area || '',
    capacity: post.capacity || 1,
    hasPrivateBathroom: post.hasPrivateBathroom || false,
    furnishingLevel: post.furnishingLevel || 'unfurnished',
    rent: post.rent || '',
    deposit: post.deposit || '',
    electricityCost: post.electricityCost || '',
    waterCost: post.waterCost || '',
    internetCost: post.internetCost || '',
    street: post.address?.street || '',
    ward: post.address?.ward || '',
    district: post.address?.district || 'Quận Hải Châu',
    amenities: post.amenities || [],
    contactName: post.contactName || '',
    contactPhone: post.contactPhone || '',
    contactEmail: post.contactEmail || '',
    allowNegotiation: post.allowNegotiation !== false,
    preferredTenantGender: post.preferredTenantGender || 'any',
    availableFrom: post.availableFrom ? new Date(post.availableFrom).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
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
    setSelectedImages(prev => [...prev, ...files].slice(0, 10));
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Add new images
      selectedImages.forEach(image => {
        submitData.append('images', image);
      });

      const response = await axiosInstance.put(`/api/posts/${post._id}`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Tin đăng đã được cập nhật thành công!');
      onSuccess?.();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Có lỗi xảy ra khi cập nhật tin đăng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-w-4xl w-full max-h-screen overflow-y-auto bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Chỉnh sửa tin đăng</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tiêu đề *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                  required
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mô tả *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 border rounded-lg"
                  required
                  maxLength={2000}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Loại phòng *</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    required
                  >
                    {PROPERTY_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Diện tích (m²)</label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Chi tiết phòng</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Sức chứa *</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nội thất</label>
                  <select
                    name="furnishingLevel"
                    value={formData.furnishingLevel}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
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
                    className="mr-2"
                  />
                  <label className="text-sm font-medium">Phòng tắm riêng</label>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Giá cả</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Giá thuê/tháng *</label>
                  <input
                    type="number"
                    name="rent"
                    value={formData.rent}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tiền cọc</label>
                  <input
                    type="number"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tiền điện/kWh</label>
                  <input
                    type="number"
                    name="electricityCost"
                    value={formData.electricityCost}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tiền nước/m³</label>
                  <input
                    type="number"
                    name="waterCost"
                    value={formData.waterCost}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Địa chỉ</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Quận/Huyện *</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    required
                  >
                    {DISTRICTS.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phường/Xã *</label>
                  <input
                    type="text"
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Địa chỉ cụ thể *</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tiện ích</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {AMENITIES.map(amenity => (
                  <div
                    key={amenity.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.amenities.includes(amenity.value)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                    onClick={() => handleAmenityToggle(amenity.value)}
                  >
                    <amenity.icon size={20} className="mb-1" />
                    <div className="text-sm">{amenity.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin liên hệ</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên liên hệ *</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                    pattern="^(\+84|0)[0-9]{9,10}$"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email liên hệ</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Current Images */}
            {post.images && post.images.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hình ảnh hiện tại</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Current ${index}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thêm hình ảnh mới</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload-edit"
                />
                <label
                  htmlFor="image-upload-edit"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Camera size={48} className="text-gray-400 mb-2" />
                  <span className="text-gray-600">Chọn hình ảnh mới</span>
                </label>
              </div>

              {selectedImages.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New preview ${index}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cài đặt khác</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Giới tính ưu tiên</label>
                  <select
                    name="preferredTenantGender"
                    value={formData.preferredTenantGender}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="any">Không yêu cầu</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Có thể cho thuê từ</label>
                  <input
                    type="date"
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="allowNegotiation"
                  checked={formData.allowNegotiation}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Có thể thương lượng giá</label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {isLoading ? 'Đang cập nhật...' : 'Cập nhật tin đăng'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;