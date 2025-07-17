import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
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
  Star
} from 'lucide-react';
import PlanSelectionModal from '../../components/modals/PlanSelectionModal';
import ExtendPostModal from '../../components/modals/ExtendPostModal';
import EditPostModal from '../../components/modals/EditPostModal';

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

const PostManagementPage = () => {
  const navigate = useNavigate();
  const { user, updateWalletBalance } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const response = await axiosInstance.get('/api/posts/user/my-posts');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
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
      
      alert(`Tự động gia hạn đã được ${autoRenew ? 'bật' : 'tắt'}`);
    } catch (error) {
      console.error('Error toggling auto renewal:', error);
      alert('Có lỗi xảy ra khi cập nhật cài đặt tự động gia hạn');
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
      
      alert(`Tin đăng đã được ${isAvailable ? 'kích hoạt' : 'vô hiệu hóa'}`);
    } catch (error) {
      console.error('Error toggling post availability:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái tin đăng');
    }
  };

  const deletePost = async (postId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin đăng này?')) return;

    try {
      await axiosInstance.delete(`/api/posts/${postId}`);
      setPosts(prev => prev.filter(post => post._id !== postId));
      alert('Tin đăng đã được xóa thành công');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Có lỗi xảy ra khi xóa tin đăng');
    }
  };

  const handleUpgradeSuccess = (response) => {
    updateWalletBalance(response.newBalance);
    setShowPlanModal(false);
    setSelectedPost(null);
    fetchUserPosts();
  };

  const handleExtendSuccess = (response) => {
    updateWalletBalance(response.newBalance);
    setShowExtendModal(false);
    setSelectedPost(null);
    fetchUserPosts();
  };

  const handleEditSuccess = () => {
    setEditingPost(null);
    fetchUserPosts();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý tin đăng</h1>
        <button
          onClick={() => navigate('/create-post')}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Đăng tin mới
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Bạn chưa có tin đăng nào</p>
          <button
            onClick={() => navigate('/create-post')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Đăng tin đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post._id} className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{post.description?.slice(0, 150)}...</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {getStatusBadge(post.status)}
                    {getPlanBadge(post.featuredType, post.isPaid, post.featuredEndDate)}
                    
                    {!post.isAvailable && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Đã ẩn
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Giá: {post.rent?.toLocaleString()}₫/tháng</p>
                    <p>Địa chỉ: {post.address?.street}, {post.address?.ward}, {post.address?.district}</p>
                    <p>Lượt xem: {post.viewCount || 0} | Lượt liên hệ: {post.contactCount || 0}</p>
                    
                    {post.featuredEndDate && (
                      <p>Hết hạn: {new Date(post.featuredEndDate).toLocaleDateString('vi-VN')}</p>
                    )}
                    
                    {post.autoRenew && (
                      <p className="text-green-600">
                        <RefreshCw size={12} className="inline mr-1" />
                        Tự động gia hạn mỗi {post.autoRenewDuration || 7} ngày
                      </p>
                    )}
                  </div>
                </div>

                {post.images && post.images.length > 0 && (
                  <img
                    src={post.images[0]}
                    alt="Post preview"
                    className="w-24 h-24 object-cover rounded-lg ml-4"
                  />
                )}
              </div>

              <div className="flex flex-wrap gap-2">
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

      {/* Edit Post Modal */}
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

export default PostManagementPage;