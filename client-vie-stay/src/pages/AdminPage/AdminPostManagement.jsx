import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/AxiosInstance';
import { 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Trash2, 
  User, 
  Calendar, 
  MapPin, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Building,
  Crown,
  Zap, // NEW: For auto-approval indicator
  TrendingUp // NEW: For efficiency indicator
} from 'lucide-react';

const AdminPostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all'); // NEW: Approval type filter
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);

  // Enhanced statistics with auto-approval metrics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    rejected: 0,
    featured: 0,
    autoApproved: 0, // NEW
    manualApproved: 0, // NEW
    totalRevenue: 0, // NEW
    autoApprovedRevenue: 0 // NEW
  });

  // Pagination info
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    fetchPosts();
  }, [currentPage, statusFilter, featuredFilter, approvalFilter, searchTerm, sortBy]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: postsPerPage,
        sortBy: 'createdAt',
        order: sortBy === 'newest' ? 'desc' : 'asc'
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (featuredFilter !== 'all') {
        params.append('featuredType', featuredFilter);
      }

      // NEW: Add approval type filter
      if (approvalFilter !== 'all') {
        params.append('approvalType', approvalFilter);
      }

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      console.log('Fetching posts with params:', params.toString());

      const response = await axiosInstance.get(`/admin/posts?${params.toString()}`);
      
      console.log('Response:', response.data);

      // Handle the response structure
      if (response.data.status === 'success') {
        const { posts: postsData, statistics, pagination: paginationData } = response.data.data;
        
        setPosts(postsData || []);
        setStats(statistics || {
          total: 0,
          active: 0,
          pending: 0,
          rejected: 0,
          featured: 0,
          autoApproved: 0,
          manualApproved: 0,
          totalRevenue: 0,
          autoApprovedRevenue: 0
        });
        setPagination(paginationData || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasNext: false,
          hasPrev: false
        });
      } else {
        // Fallback for different response structure
        setPosts([]);
        setStats({
          total: 0,
          active: 0,
          pending: 0,
          rejected: 0,
          featured: 0,
          autoApproved: 0,
          manualApproved: 0,
          totalRevenue: 0,
          autoApprovedRevenue: 0
        });
      }

    } catch (error) {
      console.error('Error fetching posts:', error);
      // Set empty state on error
      setPosts([]);
      setStats({
        total: 0,
        active: 0,
        pending: 0,
        rejected: 0,
        featured: 0,
        autoApproved: 0,
        manualApproved: 0,
        totalRevenue: 0,
        autoApprovedRevenue: 0
      });
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false
      });
    } finally {
      setLoading(false);
    }
  };

  // Existing handler methods remain the same
  const handleDeactivatePost = async (postId) => {
    if (!window.confirm('Bạn có chắc chắn muốn vô hiệu hóa tin đăng này?')) return;

    try {
      const response = await axiosInstance.patch(`/admin/posts/${postId}/deactivate`, {
        reason: 'Admin deactivation'
      });
      
      if (response.data.status === 'success') {
        fetchPosts();
        alert('Tin đăng đã được vô hiệu hóa thành công');
      }
    } catch (error) {
      console.error('Error deactivating post:', error);
      alert('Có lỗi xảy ra khi vô hiệu hóa tin đăng');
    }
  };

  const handleActivatePost = async (postId) => {
    try {
      const response = await axiosInstance.patch(`/admin/posts/${postId}/activate`);
      
      if (response.data.status === 'success') {
        fetchPosts();
        alert('Tin đăng đã được kích hoạt thành công');
      }
    } catch (error) {
      console.error('Error activating post:', error);
      alert('Có lỗi xảy ra khi kích hoạt tin đăng');
    }
  };

  const handleApprovePost = async (postId) => {
    try {
      const response = await axiosInstance.patch(`/admin/posts/${postId}/approve`);
      
      if (response.data.status === 'success') {
        fetchPosts();
        alert('Tin đăng đã được phê duyệt');
      }
    } catch (error) {
      console.error('Error approving post:', error);
      alert('Có lỗi xảy ra khi phê duyệt tin đăng');
    }
  };

  const handleRejectPost = async (postId) => {
    const reason = window.prompt('Lý do từ chối tin đăng:');
    if (!reason || reason.trim() === '') return;

    try {
      const response = await axiosInstance.patch(`/admin/posts/${postId}/reject`, { 
        reason: reason.trim() 
      });
      
      if (response.data.status === 'success') {
        fetchPosts();
        alert('Tin đăng đã bị từ chối');
      }
    } catch (error) {
      console.error('Error rejecting post:', error);
      alert('Có lỗi xảy ra khi từ chối tin đăng');
    }
  };

  // Enhanced status badge with auto-approval indicator
  const getStatusBadge = (post) => {
    const { status, isAvailable, adminDeactivated, isAutoApproved, approvalType } = post;
    
    if (adminDeactivated) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Admin vô hiệu hóa</span>;
    }
    
    if (!isAvailable) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Đã ẩn</span>;
    }

    switch (status) {
      case 'approved':
        if (isAutoApproved || approvalType === 'automatic') {
          return (
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center">
              <Zap size={10} className="mr-1" />
              Tự động duyệt
            </span>
          );
        }
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Duyệt thủ công</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Chờ duyệt</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Bị từ chối</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Bản nháp</span>;
    }
  };

  const getFeaturedBadge = (featuredType, isPaid) => {
    if (featuredType === 'THUONG') {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Thường</span>;
    }
    
    const colors = {
      VIP_NOI_BAT: 'bg-red-100 text-red-600',
      VIP_1: 'bg-orange-100 text-orange-600',
      VIP_2: 'bg-yellow-100 text-yellow-600',
      VIP_3: 'bg-blue-100 text-blue-600'
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colors[featuredType]} flex items-center`}>
        <Crown size={10} className="mr-1" />
        {featuredType.replace('_', ' ')}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleFeaturedFilterChange = (e) => {
    setFeaturedFilter(e.target.value);
    setCurrentPage(1);
  };

  // NEW: Handle approval type filter
  const handleApprovalFilterChange = (e) => {
    setApprovalFilter(e.target.value);
    setCurrentPage(1);
  };

  // Calculate auto-approval efficiency
  const autoApprovalRate = (stats.autoApproved + stats.manualApproved) > 0 ? 
    Math.round((stats.autoApproved / (stats.autoApproved + stats.manualApproved)) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Đang tải tin đăng...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tin đăng</h1>
          <p className="text-gray-600">Tìm kiếm và quản lý tất cả tin đăng trên hệ thống với tự động duyệt VIP</p>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Tổng tin đăng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Đang hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Chờ duyệt</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending || 0}</p>
            </div>
          </div>
        </div>

        {/* NEW: Auto-approved posts */}
        <div className="bg-white p-4 rounded-lg border border-green-200 bg-green-50">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-green-600">Tự động duyệt</p>
              <p className="text-2xl font-bold text-green-900">{stats.autoApproved || 0}</p>
            </div>
          </div>
        </div>

        {/* NEW: Manual approved posts */}
        <div className="bg-white p-4 rounded-lg border border-blue-200 bg-blue-50">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-blue-600">Duyệt thủ công</p>
              <p className="text-2xl font-bold text-blue-900">{stats.manualApproved || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Crown className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">VIP</p>
              <p className="text-2xl font-bold text-gray-900">{stats.featured || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Auto-Approval Efficiency Panel */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
            <div>
              <h3 className="font-semibold text-green-800">Hiệu quả tự động duyệt</h3>
              <p className="text-sm text-green-600">
                {autoApprovalRate}% tin đăng được duyệt tự động
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-600">Doanh thu tự động</p>
            <p className="text-lg font-bold text-green-800">
              {formatPrice(stats.autoApprovedRevenue || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề, mô tả, người liên hệ, địa chỉ..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Bị từ chối</option>
            </select>
          </div>

          {/* NEW: Approval Type Filter */}
          <div>
            <select
              value={approvalFilter}
              onChange={handleApprovalFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả loại duyệt</option>
              <option value="auto_approved">Tự động duyệt</option>
              <option value="manual_approved">Duyệt thủ công</option>
            </select>
          </div>

          {/* Featured Filter */}
          <div>
            <select
              value={featuredFilter}
              onChange={handleFeaturedFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả loại tin</option>
              <option value="featured">Tin VIP</option>
              <option value="regular">Tin thường</option>
            </select>
          </div>
        </div>

        {/* Sort Options */}
        <div className="mt-4 flex items-center space-x-4">
          <span className="text-sm text-gray-500">Sắp xếp theo:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Kết quả tìm kiếm ({pagination.totalItems || 0} tin đăng)
          </h3>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy tin đăng</h3>
            <p className="text-gray-500">Thử thay đổi bộ lọc tìm kiếm hoặc kiểm tra lại điều kiện lọc</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {posts.map((post) => (
              <div key={post._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  {/* Post Image */}
                  {post.images && post.images.length > 0 && (
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  )}

                  {/* Post Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.description?.slice(0, 150)}...
                        </p>

                        {/* Enhanced Badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {getStatusBadge(post)}
                          {getFeaturedBadge(post.featuredType, post.isPaid)}
                          
                          {/* NEW: Revenue indicator for VIP posts */}
                          {post.featuredCost > 0 && (
                            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                              {formatPrice(post.featuredCost)}
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <DollarSign size={14} className="mr-1" />
                            <span>{formatPrice(post.rent)}/tháng</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            <span>{post.address?.district || 'N/A'}</span>
                          </div>
                          <div className="flex items-center">
                            <User size={14} className="mr-1" />
                            <span>{post.contactName || post.userId?.name || 'N/A'}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>

                        {/* Enhanced Views and Contact Count */}
                        <div className="mt-2 text-xs text-gray-400 flex items-center space-x-4">
                          <span>{post.viewCount || 0} lượt xem</span>
                          <span>{post.contactCount || 0} lượt liên hệ</span>
                          
                          {/* NEW: Approval info */}
                          {post.approvalDate && (
                            <span className="flex items-center">
                              {post.isAutoApproved ? (
                                <Zap size={10} className="mr-1 text-green-500" />
                              ) : (
                                <CheckCircle size={10} className="mr-1 text-blue-500" />
                              )}
                              Duyệt: {new Date(post.approvalDate).toLocaleDateString('vi-VN')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2 ml-4">
                        {/* View Post */}
                        <button
                          onClick={() => window.open(`/detail/${post._id}`, '_blank')}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center"
                        >
                          <Eye size={14} className="mr-1" />
                          Xem
                        </button>

                        {/* Approve/Reject for pending posts */}
                        {post.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprovePost(post._id)}
                              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center"
                            >
                              <CheckCircle size={14} className="mr-1" />
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleRejectPost(post._id)}
                              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center"
                            >
                              <XCircle size={14} className="mr-1" />
                              Từ chối
                            </button>
                          </>
                        )}

                        {/* Activate/Deactivate */}
                        {post.isAvailable && !post.adminDeactivated ? (
                          <button
                            onClick={() => handleDeactivatePost(post._id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center"
                          >
                            <EyeOff size={14} className="mr-1" />
                            Vô hiệu hóa
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivatePost(post._id)}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center"
                          >
                            <Eye size={14} className="mr-1" />
                            Kích hoạt
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Trang {pagination.currentPage} / {pagination.totalPages} - 
                Tổng {pagination.totalItems} tin đăng
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <span className="px-3 py-1 text-sm border border-gray-300 rounded bg-blue-50 text-blue-700">
                  {pagination.currentPage}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPostManagement;