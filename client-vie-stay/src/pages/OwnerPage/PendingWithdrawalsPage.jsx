import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWithdrawalStore } from '../../store/withdrawalStore';
import useErrorStore from '../../store/errorStore';

const PendingWithdrawalsPage = () => {
  const navigate = useNavigate();
  const { 
    pendingWithdrawals, 
    getPendingWithdrawals, 
    approveWithdrawal, 
    rejectWithdrawal,
    isLoading 
  } = useWithdrawalStore();
  const { error, clearError } = useErrorStore();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [approvalData, setApprovalData] = useState({
    deductionAmount: 0,
    deductionReason: '',
    responseNote: ''
  });
  const [rejectionData, setRejectionData] = useState({
    responseNote: ''
  });

  useEffect(() => {
    clearError();
    getPendingWithdrawals();
  }, [getPendingWithdrawals, clearError]);

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

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setApprovalData({
      deductionAmount: 0,
      deductionReason: '',
      responseNote: ''
    });
    setShowApprovalModal(true);
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setRejectionData({
      responseNote: ''
    });
    setShowRejectionModal(true);
  };

  const handleSubmitApproval = async () => {
    if (approvalData.deductionAmount > selectedRequest.amount) {
      alert('Số tiền trừ không thể lớn hơn số tiền yêu cầu');
      return;
    }

    try {
      await approveWithdrawal(selectedRequest._id, approvalData);
      setShowApprovalModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error approving withdrawal:', error);
    }
  };

  const handleSubmitRejection = async () => {
    if (!rejectionData.responseNote.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      await rejectWithdrawal(selectedRequest._id, rejectionData);
      setShowRejectionModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải yêu cầu withdrawal...</p>
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
            Yêu cầu rút tiền chờ xử lý
          </h1>
          <p className="text-gray-600">
            Xem xét và phê duyệt các yêu cầu rút tiền cọc từ người thuê
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {/* Content */}
        {pendingWithdrawals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Không có yêu cầu rút tiền nào chờ xử lý
            </h3>
            <p className="text-gray-600">
              Hiện tại không có yêu cầu rút tiền cọc nào cần bạn xem xét.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingWithdrawals.map(request => (
              <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {request.roomId?.name || 'Phòng'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Người thuê: {request.tenantId?.name} ({request.tenantId?.email})
                    </p>
                    <p className="text-sm text-gray-600">
                      SĐT: {request.tenantId?.phoneNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Tạo lúc: {formatDate(request.createdAt)}
                    </p>
                  </div>
                  
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    CHỜ XỬ LÝ
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Số tiền yêu cầu</p>
                    <p className="font-medium text-lg">{formatCurrency(request.amount)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Loại yêu cầu</p>
                    <p className="font-medium">
                      {request.requestType === 'deposit_refund' ? 'Hoàn trả tiền cọc' : 'Chấm dứt hợp đồng sớm'}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">Lý do</p>
                  <p className="text-sm bg-gray-50 p-2 rounded">{request.reason}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">Thông tin tài khoản VNPay</p>
                  <div className="text-sm bg-blue-50 p-2 rounded">
                    <p>Ngân hàng: {request.vnpayInfo?.bankCode}</p>
                    <p>Số tài khoản: {request.vnpayInfo?.accountNumber}</p>
                    <p>Tên chủ tài khoản: {request.vnpayInfo?.accountName}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Mã yêu cầu: {request._id.substring(0, 8)}...
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReject(request)}
                      disabled={isLoading}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 transition-colors flex items-center"
                    >
                      <XCircle size={16} className="mr-1" />
                      Từ chối
                    </button>
                    
                    <button
                      onClick={() => handleApprove(request)}
                      disabled={isLoading}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 transition-colors flex items-center"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Phê duyệt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Approval Modal */}
        {showApprovalModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Phê duyệt yêu cầu rút tiền
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Số tiền yêu cầu</p>
                    <p className="font-medium">{formatCurrency(selectedRequest.amount)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số tiền trừ (VND)
                    </label>
                    <input
                      type="number"
                      value={approvalData.deductionAmount}
                      onChange={(e) => setApprovalData(prev => ({
                        ...prev,
                        deductionAmount: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      min="0"
                      max={selectedRequest.amount}
                    />
                  </div>

                  {approvalData.deductionAmount > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lý do trừ tiền
                      </label>
                      <textarea
                        value={approvalData.deductionReason}
                        onChange={(e) => setApprovalData(prev => ({
                          ...prev,
                          deductionReason: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        rows="3"
                        placeholder="Nhập lý do trừ tiền..."
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú phản hồi
                    </label>
                    <textarea
                      value={approvalData.responseNote}
                      onChange={(e) => setApprovalData(prev => ({
                        ...prev,
                        responseNote: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows="3"
                      placeholder="Nhập ghi chú cho người thuê..."
                    />
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Số tiền thực trả</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(selectedRequest.amount - approvalData.deductionAmount)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  
                  <button
                    onClick={handleSubmitApproval}
                    className="flex-1 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    Phê duyệt
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectionModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Từ chối yêu cầu rút tiền
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Người thuê</p>
                    <p className="font-medium">{selectedRequest.tenantId?.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Số tiền yêu cầu</p>
                    <p className="font-medium">{formatCurrency(selectedRequest.amount)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lý do từ chối <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={rejectionData.responseNote}
                      onChange={(e) => setRejectionData(prev => ({
                        ...prev,
                        responseNote: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows="4"
                      placeholder="Nhập lý do từ chối yêu cầu..."
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => setShowRejectionModal(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  
                  <button
                    onClick={handleSubmitRejection}
                    disabled={!rejectionData.responseNote.trim()}
                    className="flex-1 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400 transition-colors"
                  >
                    Từ chối
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

export default PendingWithdrawalsPage;