import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotification } from '../../components/common/NotificationSystem';
import axiosInstance from '../../utils/AxiosInstance';
import { 
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  RefreshCw,
  Crown,
  Calendar,
  Star,
  Building,
  Home,
  Users,
  DollarSign,
  MapPin,
  Clock,
  TrendingUp,
  AlertCircle,
  X,
  Camera
} from 'lucide-react';
import PlanSelectionModal from '../../components/modals/PlanSelectionModal';
import ExtendPostModal from '../../components/modals/ExtendPostModal';

// Featured Types Configuration
const FEATURED_TYPES = {
  VIP_NOI_BAT: { 
    name: 'VIP Nổi Bật', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50' 
  },
  VIP_1: { 
    name: 'VIP 1', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-50'
  },
  VIP_2: { 
    name: 'VIP 2', 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-50'
  },
  VIP_3: { 
    name: 'VIP 3', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50'
  },
  THUONG: { 
    name: 'Thường', 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-50'
  }
};

// Property Types for Edit Modal
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
  { value: 'wifi', label: 'WiFi' },
  { value: 'air_conditioning', label: 'Điều hòa' },
  { value: 'parking', label: 'Chỗ đậu xe' },
  { value: 'elevator', label: 'Thang máy' },
  { value: 'security', label: 'Bảo vệ' },
  { value: 'laundry', label: 'Giặt ủi' },
  { value: 'kitchen_access', label: 'Bếp chung' },
  { value: 'balcony', label: 'Ban công' },
  { value: 'gym', label: 'Phòng gym' },
  { value: 'pool', label: 'Hồ bơi' },
  { value: 'garden', label: 'Vườn' },
  { value: 'pets_allowed', label: 'Cho phép thú cưng' }
];

// ✅ ADDED: EditPostModal Component
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Chỉnh sửa tin đăng</h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
          
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

const OwnerPostManagement = () => {
  const navigate = useNavigate();
  const { user, updateWalletBalance } = useAuthStore();
  const { success, error, warning } = useNotification();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null); // ✅ ADDED
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/api/posts/user/my-posts');
      setPosts(response.data.posts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      error('Không thể tải danh sách tin đăng');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutoRenewal = async (postId, autoRenew, autoRenewDuration = 7) => {
    try {
      await axiosInstance.patch(`/api/posts/${postId}/auto-renewal`, {
        autoRenew,
        autoRenewDuration
      });
      
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, autoRenew, autoRenewDuration }
          : post
      ));
      
      success(`Tự động gia hạn đã được ${autoRenew ? 'bật' : 'tắt'}`);
    } catch (err) {
      console.error('Error toggling auto renewal:', err);
      error('Có lỗi xảy ra khi cập nhật cài đặt tự động gia hạn');
    }
  };

  const togglePostAvailability = async (postId, isAvailable) => {
    try {
      await axiosInstance.put(`/api/posts/${postId}`, { isAvailable });
      
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, isAvailable }
          : post
      ));
      
      success(`Tin đăng đã được ${isAvailable ? 'kích hoạt' : 'ẩn'}`);
    } catch (err) {
      console.error('Error toggling post availability:', err);
      error('Có lỗi xảy ra khi cập nhật trạng thái tin đăng');
    }
  };

  const deletePost = async (postId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin đăng này?')) return;

    try {
      await axiosInstance.delete(`/api/posts/${postId}`);
      setPosts(prev => prev.filter(post => post._id !== postId));
      success('Tin đăng đã được xóa thành công');
    } catch (err) {
      console.error('Error deleting post:', err);
      error('Có lỗi xảy ra khi xóa tin đăng');
    }
  };

  const handleUpgradeSuccess = (response) => {
    updateWalletBalance(response.newBalance);
    setShowPlanModal(false);
    setSelectedPost(null);
    fetchUserPosts();
    success('Nâng cấp gói tin đăng thành công!');
  };

  const handleExtendSuccess = (response) => {
    updateWalletBalance(response.newBalance);
    setShowExtendModal(false);
    setSelectedPost(null);
    fetchUserPosts();
    success('Gia hạn tin đăng thành công!');
  };

  // ✅ ADDED: Edit success handler
  const handleEditSuccess = () => {
    setEditingPost(null);
    fetchUserPosts();
    success('Cập nhật tin đăng thành công!');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { label: 'Bản nháp', color: 'bg-gray-100 text-gray-800' },
      pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Bị từ chối', color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPlanBadge = (featuredType, isPaid, featuredEndDate) => {
    const plan = FEATURED_TYPES[featuredType];
    const isActive = isPaid && featuredEndDate && new Date(featuredEndDate) > new Date();
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${plan?.bgColor} ${plan?.color}`}>
        {plan?.name} {isActive && '(Đang hoạt động)'}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'active') return post.status === 'approved' && post.isAvailable;
    if (filter === 'expired') return post.featuredEndDate && new Date(post.featuredEndDate) < new Date();
    if (filter === 'pending') return post.status === 'pending';
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600">Đang tải tin đăng...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý tin đăng</h1>
          <p className="text-gray-600 mt-1">Quản lý tất cả tin đăng cho thuê của bạn</p>
        </div>
        <button
          onClick={() => navigate('/create-post')}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center shadow-md"
        >
          <Plus size={20} className="mr-2" />
          Đăng tin mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Tổng tin đăng</p>
              <p className="text-2xl font-semibold text-gray-900">{posts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Đang hoạt động</p>
              <p className="text-2xl font-semibold text-gray-900">
                {posts.filter(p => p.status === 'approved' && p.isAvailable).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Chờ duyệt</p>
              <p className="text-2xl font-semibold text-gray-900">
                {posts.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <Crown className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">VIP</p>
              <p className="text-2xl font-semibold text-gray-900">
                {posts.filter(p => p.featuredType !== 'THUONG' && p.isPaid).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'active', label: 'Đang hoạt động' },
            { key: 'pending', label: 'Chờ duyệt' },
            { key: 'expired', label: 'Hết hạn' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Home size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'Chưa có tin đăng nào' : 'Không có tin đăng nào phù hợp'}
          </h3>
          <p className="text-gray-500 mb-4">
            {filter === 'all' 
              ? 'Bắt đầu đăng tin để cho thuê phòng của bạn'
              : 'Thử thay đổi bộ lọc để xem các tin đăng khác'
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => navigate('/create-post')}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Đăng tin đầu tiên
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <div key={post._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    {/* Post Image */}
                    {post.images && post.images.length > 0 && (
                      <img
                        src={post.images[0]}
                        alt={post.title}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.description?.slice(0, 150)}...</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {getStatusBadge(post.status)}
                        {getPlanBadge(post.featuredType, post.isPaid, post.featuredEndDate)}
                        
                        {!post.isAvailable && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Đã ẩn
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <DollarSign size={14} className="mr-1" />
                          <span>{formatPrice(post.rent)}/tháng</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin size={14} className="mr-1" />
                          <span>{post.address?.district}</span>
                        </div>
                        <div className="flex items-center">
                          <Users size={14} className="mr-1" />
                          <span>{post.capacity} người</span>
                        </div>
                        <div className="flex items-center">
                          <Eye size={14} className="mr-1" />
                          <span>{post.viewCount || 0} lượt xem</span>
                        </div>
                      </div>

                      {post.featuredEndDate && (
                        <div className="mt-2 text-sm text-gray-500">
                          <Calendar size={14} className="inline mr-1" />
                          Hết hạn: {new Date(post.featuredEndDate).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                      
                      {post.autoRenew && (
                        <div className="mt-1 text-sm text-green-600">
                          <RefreshCw size={12} className="inline mr-1" />
                          Tự động gia hạn mỗi {post.autoRenewDuration || 7} ngày
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                {/* View Post */}
                <button
                  onClick={() => window.open(`/detail/${post._id}`, '_blank')}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center text-sm"
                >
                  <Eye size={14} className="mr-1" />
                  Xem
                </button>

                {/* Edit Post */}
                <button
                  onClick={() => setEditingPost(post)}
                  className="px-3 py-1 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center text-sm"
                >
                  <Edit size={14} className="mr-1" />
                  Sửa
                </button>

                {/* Upgrade/Change Plan */}
                <button
                  onClick={() => {
                    setSelectedPost(post);
                    setShowPlanModal(true);
                  }}
                  className="px-3 py-1 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 flex items-center text-sm"
                >
                  <Crown size={14} className="mr-1" />
                  {post.featuredType === 'THUONG' ? 'Nâng cấp' : 'Đổi gói'}
                </button>

                {/* Extend (only for VIP posts) */}
                {post.featuredType !== 'THUONG' && (
                  <button
                    onClick={() => {
                      setSelectedPost(post);
                      setShowExtendModal(true);
                    }}
                    className="px-3 py-1 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 flex items-center text-sm"
                  >
                    <Calendar size={14} className="mr-1" />
                    Gia hạn
                  </button>
                )}

                {/* Auto Renewal Toggle (only for VIP posts) */}
                {post.featuredType !== 'THUONG' && (
                  <button
                    onClick={() => toggleAutoRenewal(post._id, !post.autoRenew)}
                    className={`px-3 py-1 border rounded-lg flex items-center text-sm ${
                      post.autoRenew
                        ? 'border-green-300 text-green-600 bg-green-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <RefreshCw size={14} className="mr-1" />
                    {post.autoRenew ? 'Tắt tự động gia hạn' : 'Bật tự động gia hạn'}
                  </button>
                )}

                {/* Toggle Availability */}
                <button
                  onClick={() => togglePostAvailability(post._id, !post.isAvailable)}
                  className={`px-3 py-1 border rounded-lg flex items-center text-sm ${
                    post.isAvailable
                      ? 'border-red-300 text-red-600 hover:bg-red-50'
                      : 'border-green-300 text-green-600 hover:bg-green-50'
                  }`}
                >
                  {post.isAvailable ? <EyeOff size={14} className="mr-1" /> : <Eye size={14} className="mr-1" />}
                  {post.isAvailable ? 'Ẩn tin' : 'Hiện tin'}
                </button>

                {/* Delete Post */}
                <button
                  onClick={() => deletePost(post._id)}
                  className="px-3 py-1 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center text-sm"
                >
                  <Trash2 size={14} className="mr-1" />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plan Selection Modal */}
      {showPlanModal && selectedPost && (
        <PlanSelectionModal
          postId={selectedPost._id}
          currentPlan={selectedPost.featuredType}
          onSuccess={handleUpgradeSuccess}
          onCancel={() => {
            setShowPlanModal(false);
            setSelectedPost(null);
          }}
        />
      )}

      {/* Extend Modal */}
      {showExtendModal && selectedPost && (
        <ExtendPostModal
          postId={selectedPost._id}
          currentEndDate={selectedPost.featuredEndDate}
          currentPlan={selectedPost.featuredType}
          onSuccess={handleExtendSuccess}
          onCancel={() => {
            setShowExtendModal(false);
            setSelectedPost(null);
          }}
        />
      )}

      {/* ✅ ADDED: Edit Post Modal */}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingPost(null)}
        />
      )}
    </div>
  );
};

export default OwnerPostManagement;