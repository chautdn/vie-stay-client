import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';

const RoomForm = ({ room, onSubmit, onCancel, accommodationId }) => {
  const [formData, setFormData] = useState({
    roomNumber: '', 
    name: '',
    description: '',
    type: 'single',
    size: '',
    capacity: 1,
    baseRent: '',
    deposit: '',
    amenities: [],
    hasPrivateBathroom: false, 
    furnishingLevel: 'unfurnished', 
    utilityRates: {
      electricity: {
        type: 'per_kwh',
        rate: ''
      },
      water: {
        type: 'per_cubic_meter', 
        rate: ''
      },
      internet: {
        type: 'fixed',
        rate: ''
      },
      sanitation: {
        type: 'fixed',
        rate: ''
      }
    },
    additionalFees: [], 
    images: [], 
    isAvailable: true, 
    availableFrom: '' 
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [amenityInput, setAmenityInput] = useState('');

 
  const roomTypes = [
    { value: 'single', label: 'Phòng đơn' },
    { value: 'double', label: 'Phòng đôi' },
    { value: 'twin', label: 'Phòng twin' },
    { value: 'triple', label: 'Phòng ba' },
    { value: 'family', label: 'Phòng gia đình' },
    { value: 'suite', label: 'Suite' },
    { value: 'deluxe', label: 'Deluxe' },
    { value: 'standard', label: 'Standard' },
    { value: 'studio', label: 'Studio' },
    { value: 'private', label: 'Phòng riêng' }
  ];


  const furnishingLevels = [
    { value: 'unfurnished', label: 'Không nội thất' },
    { value: 'semi', label: 'Nội thất cơ bản' },
    { value: 'fully', label: 'Nội thất đầy đủ' }
  ];

 
  const validAmenities = [
    'air_conditioning', 'heating', 'wifi', 'tv', 'refrigerator', 
    'microwave', 'coffee_maker', 'desk', 'chair', 'wardrobe', 
    'safe', 'balcony', 'window', 'blackout_curtains', 'iron', 
    'hairdryer', 'towels', 'bed_linens', 'pillow', 'blanket', 
    'hangers', 'mirror', 'power_outlets', 'usb_ports', 'reading_light'
  ];

  const amenityLabels = {
    'air_conditioning': 'Điều hòa',
    'heating': 'Sưởi',
    'wifi': 'WiFi',
    'tv': 'TV',
    'refrigerator': 'Tủ lạnh',
    'microwave': 'Lò vi sóng',
    'coffee_maker': 'Máy pha cà phê',
    'desk': 'Bàn làm việc',
    'chair': 'Ghế',
    'wardrobe': 'Tủ quần áo',
    'safe': 'Két sắt',
    'balcony': 'Ban công',
    'window': 'Cửa sổ',
    'blackout_curtains': 'Rèm che sáng',
    'iron': 'Bàn ủi',
    'hairdryer': 'Máy sấy tóc',
    'towels': 'Khăn tắm',
    'bed_linens': 'Ga giường',
    'pillow': 'Gối',
    'blanket': 'Chăn',
    'hangers': 'Móc treo',
    'mirror': 'Gương',
    'power_outlets': 'Ổ cắm điện',
    'usb_ports': 'Cổng USB',
    'reading_light': 'Đèn đọc sách'
  };

  useEffect(() => {
    if (room) {
      setFormData({
        roomNumber: room.roomNumber || '',
        name: room.name || '',
        description: room.description || '',
        type: room.type || 'single',
        size: room.size || '',
        capacity: room.capacity || 1,
        baseRent: room.baseRent || '',
        deposit: room.deposit || '',
        amenities: room.amenities || [],
        hasPrivateBathroom: room.hasPrivateBathroom || false,
        furnishingLevel: room.furnishingLevel || 'unfurnished',
        utilityRates: {
          electricity: {
            type: room.utilityRates?.electricity?.type || 'per_kwh',
            rate: room.utilityRates?.electricity?.rate || ''
          },
          water: {
            type: room.utilityRates?.water?.type || 'per_cubic_meter',
            rate: room.utilityRates?.water?.rate || ''
          },
          internet: {
            type: room.utilityRates?.internet?.type || 'fixed',
            rate: room.utilityRates?.internet?.rate || ''
          },
          sanitation: {
            type: room.utilityRates?.sanitation?.type || 'fixed',
            rate: room.utilityRates?.sanitation?.rate || ''
          }
        },
        additionalFees: room.additionalFees || [],
        images: room.images || [],
        isAvailable: room.isAvailable !== undefined ? room.isAvailable : true,
        availableFrom: room.availableFrom || ''
      });
    }
  }, [room]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      if (subChild) {
        // Handle nested objects like utilityRates.electricity.rate
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subChild]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setSelectedImages(prev => [...prev, ...imageUrls]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // ✅ SỬA: addAmenity với validation
  const addAmenity = () => {
    if (amenityInput.trim() && 
        validAmenities.includes(amenityInput.trim()) && 
        !formData.amenities.includes(amenityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const removeAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ✅ SỬA: Prepare data theo format backend expect
    const submitData = {
      ...formData,
      accommodationId // ✅ THÊM: accommodationId cho backend
    };
    
    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {room ? 'Sửa phòng' : 'Thêm phòng mới'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ✅ THÊM: Room Number field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số phòng *
              </label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="VD: 101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên phòng *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="VD: Phòng A101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại phòng *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {roomTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* ✅ THÊM: Furnishing Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mức độ nội thất *
              </label>
              <select
                name="furnishingLevel"
                value={formData.furnishingLevel}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {furnishingLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diện tích (m²)
              </label>
              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: 25"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sức chứa (người) *
              </label>
              <select
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} người</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá thuê cơ bản (VNĐ/tháng) *
              </label>
              <input
                type="number"
                name="baseRent"
                value={formData.baseRent}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="VD: 3000000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiền cọc (VNĐ)
              </label>
              <input
                type="number"
                name="deposit"
                value={formData.deposit}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: 6000000"
              />
            </div>
          </div>

          {/* ✅ THÊM: Private Bathroom Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="hasPrivateBathroom"
              checked={formData.hasPrivateBathroom}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Có toilet riêng
            </label>
          </div>

          {/* ✅ SỬA: Utility Rates với nested structure */}
          <div>
            <h3 className="text-lg font-medium mb-4">Phí dịch vụ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điện (VNĐ/kWh)
                </label>
                <input
                  type="number"
                  name="utilityRates.electricity.rate"
                  value={formData.utilityRates.electricity.rate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="VD: 3500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nước (VNĐ/m³)
                </label>
                <input
                  type="number"
                  name="utilityRates.water.rate"
                  value={formData.utilityRates.water.rate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="VD: 25000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Internet (VNĐ/tháng)
                </label>
                <input
                  type="number"
                  name="utilityRates.internet.rate"
                  value={formData.utilityRates.internet.rate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="VD: 200000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vệ sinh (VNĐ/tháng)
                </label>
                <input
                  type="number"
                  name="utilityRates.sanitation.rate"
                  value={formData.utilityRates.sanitation.rate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="VD: 50000"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Mô tả chi tiết về phòng..."
            />
          </div>

          {/* ✅ SỬA: Amenities với dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiện nghi
            </label>
            <div className="flex gap-2 mb-3">
              <select
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn tiện nghi...</option>
                {validAmenities
                  .filter(amenity => !formData.amenities.includes(amenity))
                  .map(amenity => (
                    <option key={amenity} value={amenity}>
                      {amenityLabels[amenity]}
                    </option>
                  ))
                }
              </select>
              <button
                type="button"
                onClick={addAmenity}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={!amenityInput}
              >
                Thêm
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {amenityLabels[amenity] || amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="hover:text-blue-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh phòng
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload size={48} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click để chọn ảnh hoặc kéo thả vào đây
                </span>
              </label>
            </div>

            {selectedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Preview ${index}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {room ? 'Cập nhật' : 'Tạo phòng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;