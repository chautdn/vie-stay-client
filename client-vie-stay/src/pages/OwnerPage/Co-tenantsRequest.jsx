import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Phone, 
  User,
  Home,
  AlertCircle,
  Filter
} from 'lucide-react';
import { useCoTenantRequestStore } from '../../store/owner/co-tenantRequestStore';

const CoTenantsRequest = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const {
    requests,
    isLoading,
    getRequestsByLandlord,
    approveRequest,
    rejectRequest
  } = useCoTenantRequestStore();

  useEffect(() => {
    getRequestsByLandlord();
  }, [getRequestsByLandlord]);

  // Filter requests by status
  const filteredRequests = requests.filter(request => {
    if (selectedStatus === 'all') return true;
    return request.status === selectedStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={14} />;
      case 'approved':
        return <CheckCircle size={14} />;
      case 'rejected':
        return <XCircle size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ duyệt';
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Đã từ chối';
      default:
        return 'Không xác định';
    }
  };

  const handleApprove = async (requestId) => {
    if (window.confirm('Bạn có chắc chắn muốn phê duyệt yêu cầu này?')) {
      try {
        await approveRequest(requestId);
        alert('Đã phê duyệt yêu cầu thành công!');
      } catch (error) {
        console.error('Error approving request:', error);
      }
    }
  };

  const handleReject = async (requestId) => {
    if (window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu này?')) {
      try {
        await rejectRequest(requestId);
        alert('Đã từ chối yêu cầu thành công!');
      } catch (error) {
        console.error('Error rejecting request:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý yêu cầu bạn chung phòng
          </h1>
          <p className="text-gray-600 mt-1">
            Xem và quản lý các yêu cầu thêm bạn chung phòng từ người thuê
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</span>
          </div>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Tất cả', count: requests.length },
              { value: 'pending', label: 'Chờ duyệt', count: requests.filter(r => r.status === 'pending').length },
              { value: 'approved', label: 'Đã duyệt', count: requests.filter(r => r.status === 'approved').length },
              { value: 'rejected', label: 'Đã từ chối', count: requests.filter(r => r.status === 'rejected').length }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === filter.value
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedStatus === 'all' ? 'Chưa có yêu cầu nào' : `Không có yêu cầu ${getStatusText(selectedStatus).toLowerCase()}`}
          </h3>
          <p className="text-gray-500">
            Các yêu cầu thêm bạn chung phòng sẽ hiển thị ở đây
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRequests.map((request) => (
            <div
              key={request._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                {/* Request Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {request.name}
                    </h3>
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {getStatusText(request.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Phone */}
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} className="text-gray-500" />
                      <span className="text-gray-600">SĐT:</span>
                      <span className="font-medium">{request.phoneNumber}</span>
                    </div>

                    {/* Room */}
                    <div className="flex items-center gap-2 text-sm">
                      <Home size={16} className="text-gray-500" />
                      <span className="text-gray-600">Phòng:</span>
                      <span className="font-medium">
                        {request.roomId?.name || `Phòng ${request.roomId?.roomNumber}`}
                      </span>
                    </div>

                    {/* Primary Tenant */}
                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-gray-500" />
                      <span className="text-gray-600">Người thuê chính:</span>
                      <span className="font-medium">{request.primaryTenantId?.name}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-gray-600">Ngày gửi:</span>
                      <span className="font-medium">{formatDate(request.createdAt)}</span>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Sức chứa:</span>
                        <span className="font-medium ml-1">
                          {request.roomId?.currentTenant?.length || 0}/{request.roomId?.capacity} người
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Loại phòng:</span>
                        <span className="font-medium ml-1">{request.roomId?.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Giá thuê:</span>
                        <span className="font-medium ml-1">
                          {request.roomId?.baseRent?.toLocaleString('vi-VN')}đ/tháng
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Trạng thái phòng:</span>
                        <span className={`ml-1 font-medium ${
                          request.roomId?.isAvailable ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {request.roomId?.isAvailable ? 'Còn chỗ' : 'Hết chỗ'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  {/* View CCCD */}
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowImageModal(true);
                    }}
                    className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Eye size={16} />
                    Xem CCCD
                  </button>

                  {/* Action Buttons */}
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request._id)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-medium transition-colors"
                      >
                        <CheckCircle size={16} />
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
                      >
                        <XCircle size={16} />
                        Từ chối
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  CCCD của {selectedRequest.name}
                </h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <img
                src={selectedRequest.imageCCCD}
                alt={`CCCD của ${selectedRequest.name}`}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoTenantsRequest;