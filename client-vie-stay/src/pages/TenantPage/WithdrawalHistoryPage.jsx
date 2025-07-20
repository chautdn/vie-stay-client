import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, X } from 'lucide-react';
import { useWithdrawalStore } from '../../store/withdrawalStore';
import useErrorStore from '../../store/errorStore';

const WithdrawalHistoryPage = () => {
  const navigate = useNavigate();
  const { 
    withdrawalRequests, 
    getTenantWithdrawals, 
    cancelWithdrawal, 
    isLoading 
  } = useWithdrawalStore();
  const { error, clearError } = useErrorStore();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    clearError();
    getTenantWithdrawals();
  }, [getTenantWithdrawals, clearError]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'approved': return 'Đã phê duyệt';
      case 'processing': return 'Đang xử lý';
      case 'completed': return 'Hoàn thành';
      case 'rejected': return 'Bị từ chối';
      case 'failed': return 'Thất bại';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleCancel = async (requestId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy yêu cầu rút tiền này?')) {
      return;
    }

    try {
      await cancelWithdrawal(requestId);
    } catch (error) {
      console.error('Error cancelling withdrawal:', error);
    }
  };

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải lịch sử withdrawal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Quay lại
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900">
            Lịch sử yêu cầu rút tiền
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi các yêu cầu rút tiền cọc của bạn
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {/* Content */}
        {withdrawalRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">💰</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Chưa có yêu cầu rút tiền nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa tạo yêu cầu rút tiền cọc nào. Hãy tạo yêu cầu khi cần thiết.
            </p>
            <button
              onClick={() => navigate('/withdrawal/request')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Tạo yêu cầu rút tiền
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {withdrawalRequests.map(request => (
              <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {request.roomId?.name || 'Phòng'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Mã yêu cầu: {request._id.substring(0, 8)}...
                    </p>
                    <p className="text-sm text-gray-600">
                      Tạo lúc: {formatDate(request.createdAt)}
                    </p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                    {getStatusText(request.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Số tiền yêu cầu</p>
                    <p className="font-medium text-lg">{formatCurrency(request.amount)}</p>
                  </div>
                  
                  {request.landlordResponse?.deductionAmount > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Số tiền trừ</p>
                      <p className="font-medium text-red-600">
                        -{formatCurrency(request.landlordResponse.deductionAmount)}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-600">Số tiền thực nhận</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(request.amount - (request.landlordResponse?.deductionAmount || 0))}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">Lý do</p>
                  <p className="text-sm">{request.reason}</p>
                </div>

                {request.landlordResponse?.responseNote && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Phản hồi từ chủ trọ</p>
                    <p className="text-sm">{request.landlordResponse.responseNote}</p>
                    {request.landlordResponse.deductionReason && (
                      <p className="text-sm text-red-600 mt-1">
                        Lý do trừ tiền: {request.landlordResponse.deductionReason}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {request.vnpayInfo?.bankCode} - {request.vnpayInfo?.accountNumber}
                  </div>
                  
                  <div className="flex space-x-2">
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(request._id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Hủy yêu cầu
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleViewDetail(request)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
                    >
                      <Eye size={16} className="mr-1" />
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Chi tiết yêu cầu rút tiền
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Trạng thái: 
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${getStatusColor(selectedRequest.status)}`}>
                        {getStatusText(selectedRequest.status)}
                      </span>
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Số tiền: {formatCurrency(selectedRequest.amount)}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Loại yêu cầu: {selectedRequest.requestType}</p>
                  </div>

                  <div>
                    <p className="font-medium">Lý do:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {selectedRequest.reason}
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Thông tin VNPay:</p>
                    <ul className="ml-4 text-sm text-gray-600">
                      <li>Ngân hàng: {selectedRequest.vnpayInfo?.bankCode}</li>
                      <li>Số tài khoản: {selectedRequest.vnpayInfo?.accountNumber}</li>
                      <li>Tên chủ tài khoản: {selectedRequest.vnpayInfo?.accountName}</li>
                    </ul>
                  </div>

                  {selectedRequest.paymentProcessing?.vnpayTxnRef && (
                    <div>
                      <p className="font-medium">Thông tin giao dịch VNPay:</p>
                      <ul className="ml-4 text-sm text-gray-600">
                        <li>Mã giao dịch: {selectedRequest.paymentProcessing.vnpayTxnRef}</li>
                        {selectedRequest.paymentProcessing.vnpayTransactionNo && (
                          <li>Số giao dịch: {selectedRequest.paymentProcessing.vnpayTransactionNo}</li>
                        )}
                        {selectedRequest.paymentProcessing.processedAt && (
                          <li>Thời gian xử lý: {formatDate(selectedRequest.paymentProcessing.processedAt)}</li>
                        )}
                        {selectedRequest.paymentProcessing.completedAt && (
                          <li>Hoàn thành lúc: {formatDate(selectedRequest.paymentProcessing.completedAt)}</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div>
                    <p className="font-medium">Thời gian tạo: {formatDate(selectedRequest.createdAt)}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalHistoryPage;