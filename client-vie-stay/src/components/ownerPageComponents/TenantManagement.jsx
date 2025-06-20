import React, { useEffect, useState } from 'react';
import { useTenantStore } from '../../store/owner/tenantStore';
import { Search, User, Mail, Phone, Calendar, Star, Eye, X } from 'lucide-react';

const TenantManagement = ({ accommodationId }) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const {
    tenants,
    searchResults,
    tenantDetails,
    tenantRentalHistory,
    tenantReviews,
    isLoading,
    getMyTenants,
    searchTenantByEmail,
    getTenantDetails,
    getTenantRentalHistory,
    getTenantReviews,
    clearSearchResults
  } = useTenantStore();

  useEffect(() => {
    getMyTenants({ accommodationId });
  }, [accommodationId, getMyTenants]);

  const handleSearch = async () => {
    if (searchEmail.trim()) {
      await searchTenantByEmail(searchEmail.trim());
    }
  };

  const handleViewTenantDetails = async (tenant) => {
    setSelectedTenant(tenant);
    await getTenantDetails(tenant._id);
    await getTenantRentalHistory(tenant._id);
    await getTenantReviews(tenant._id);
    setShowDetails(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const TenantCard = ({ tenant, showRoom = true }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{tenant.name || tenant.email}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Mail size={14} />
              {tenant.email}
            </p>
            {tenant.phone && (
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Phone size={14} />
                {tenant.phone}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => handleViewTenantDetails(tenant)}
          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm flex items-center gap-1"
        >
          <Eye size={14} />
          Chi tiết
        </button>
      </div>

      {showRoom && tenant.currentRoom && (
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <p className="text-sm font-medium text-gray-700">
            Phòng hiện tại: {tenant.currentRoom.roomNumber}
          </p>
          <p className="text-xs text-gray-600">
            Bắt đầu: {formatDate(tenant.currentRoom.startDate)}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            <Calendar size={14} className="inline mr-1" />
            Tham gia: {formatDate(tenant.createdAt)}
          </span>
          {tenant.rating && (
            <span className="text-yellow-600">
              <Star size={14} className="inline mr-1" />
              {tenant.rating}/5
            </span>
          )}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          tenant.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {tenant.status === 'active' ? 'Đang thuê' : 'Không hoạt động'}
        </span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Tìm kiếm người thuê</h3>
        <div className="flex gap-3">
          <input
            type="email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Nhập email người thuê..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Search size={20} />
            Tìm kiếm
          </button>
          {searchResults.length > 0 && (
            <button
              onClick={clearSearchResults}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Xóa kết quả
            </button>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Kết quả tìm kiếm ({searchResults.length})
            </h4>
            <div className="space-y-3">
              {searchResults.map((tenant) => (
                <TenantCard key={tenant._id} tenant={tenant} showRoom={false} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Current Tenants */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          Người thuê hiện tại ({tenants.length})
        </h3>
        
        {tenants.length === 0 ? (
          <div className="text-center py-8">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Chưa có người thuê nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tenants.map((tenant) => (
              <TenantCard key={tenant._id} tenant={tenant} />
            ))}
          </div>
        )}
      </div>

      {/* Tenant Details Modal */}
      {showDetails && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Chi tiết người thuê</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Thông tin cơ bản</h3>
                  <div className="space-y-2">
                    <p><strong>Tên:</strong> {tenantDetails?.name || 'Chưa cập nhật'}</p>
                    <p><strong>Email:</strong> {tenantDetails?.email}</p>
                    <p><strong>Số điện thoại:</strong> {tenantDetails?.phone || 'Chưa cập nhật'}</p>
                    <p><strong>Ngày sinh:</strong> {tenantDetails?.dateOfBirth ? formatDate(tenantDetails.dateOfBirth) : 'Chưa cập nhật'}</p>
                    <p><strong>Tham gia:</strong> {formatDate(tenantDetails?.createdAt)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Thống kê</h3>
                  <div className="space-y-2">
                    <p><strong>Số lần thuê:</strong> {tenantRentalHistory.length}</p>
                    <p><strong>Đánh giá trung bình:</strong> {tenantDetails?.rating || 'Chưa có'}/5</p>
                    <p><strong>Trạng thái:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        tenantDetails?.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tenantDetails?.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Rental History */}
              <div>
                <h3 className="font-semibold mb-3">Lịch sử thuê nhà</h3>
                {tenantRentalHistory.length === 0 ? (
                  <p className="text-gray-500">Chưa có lịch sử thuê nhà</p>
                ) : (
                  <div className="space-y-3">
                    {tenantRentalHistory.map((rental, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p><strong>Phòng:</strong> {rental.roomNumber}</p>
                            <p><strong>Thời gian:</strong> {formatDate(rental.startDate)} - {rental.endDate ? formatDate(rental.endDate) : 'Hiện tại'}</p>
                            <p><strong>Giá thuê:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.price)}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            rental.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {rental.status === 'active' ? 'Đang thuê' : 'Đã kết thúc'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviews */}
              <div>
                <h3 className="font-semibold mb-3">Đánh giá từ chủ nhà</h3>
                {tenantReviews.length === 0 ? (
                  <p className="text-gray-500">Chưa có đánh giá nào</p>
                ) : (
                  <div className="space-y-3">
                    {tenantReviews.map((review, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Star size={16} className="text-yellow-500" />
                            <span className="font-medium">{review.rating}/5</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagement;