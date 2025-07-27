import React, { useState, useEffect } from 'react';
import { 
  ArrowDownCircle, 
  Calendar, 
  User,
  CreditCard,
  Check,
  X,
  Clock,
  RefreshCw,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Building,
  Hash
} from 'lucide-react';
import axiosInstance from '../../utils/AxiosInstance';

const AdminWithdrawalManagement = () => {
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingWithdrawals();
  }, [currentPage]);

  const fetchPendingWithdrawals = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });

      const response = await axiosInstance.get(`/api/withdrawals/pending?${params}`);
      setPendingWithdrawals(response.data.data.withdrawals || []);
      setTotalPages(response.data.data.pagination.totalPages || 1);
    } catch (err) {
      setError('Không thể tải danh sách yêu cầu rút tiền');
      console.error('Error fetching pending withdrawals:', err);
      
      // Show specific error message
      if (err.response?.status === 404) {
        setError('API endpoint không tồn tại. Vui lòng kiểm tra backend.');
      } else if (err.response?.status === 401) {
        setError('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
      } else if (err.response?.status === 403) {
        setError('Bạn không có quyền admin để xem trang này.');
      } else {
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount) => {
    return `${amount.toLocaleString('vi-VN')}₫`;
  };

  const handleApprove = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowApprovalModal(true);
  };

  const handleReject = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowRejectionModal(true);
  };

  const confirmApproval = async () => {
    if (!selectedWithdrawal) return;

    try {
      setProcessing(true);
      await axiosInstance.put(`/api/withdrawals/${selectedWithdrawal._id}/approve`);
      
      alert('Yêu cầu rút tiền đã được phê duyệt thành công!');
      setShowApprovalModal(false);
      setSelectedWithdrawal(null);
      fetchPendingWithdrawals(); // Refresh list
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi phê duyệt');
    } finally {
      setProcessing(false);
    }
  };

  const confirmRejection = async () => {
    if (!selectedWithdrawal || !rejectionReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      setProcessing(true);
      await axiosInstance.put(`/api/withdrawals/${selectedWithdrawal._id}/reject`, {
        reason: rejectionReason.trim()
      });
      
      alert('Yêu cầu rút tiền đã bị từ chối!');
      setShowRejectionModal(false);
      setSelectedWithdrawal(null);
      setRejectionReason('');
      fetchPendingWithdrawals(); // Refresh list
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi từ chối');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-3 text-lg text-gray-600">Đang tải yêu cầu rút tiền...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý yêu cầu rút tiền</h1>
              <p className="text-gray-600 mt-1">Xét duyệt các yêu cầu rút tiền từ người dùng</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Tổng yêu cầu đang chờ</p>
                <p className="text-xl font-bold text-orange-600">{pendingWithdrawals.length}</p>
              </div>
              <button
                onClick={fetchPendingWithdrawals}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={fetchPendingWithdrawals}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Pending Withdrawals List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {pendingWithdrawals.length === 0 && !error ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có yêu cầu rút tiền nào</h3>
              <p className="text-gray-600">Tất cả yêu cầu rút tiền đã được xử lý.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người dùng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã giao dịch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thông tin ngân hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời gian
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingWithdrawals.map((withdrawal) => (
                      <tr key={withdrawal._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{withdrawal.user?.name || 'N/A'}</p>
                              <p className="text-sm text-gray-500">{withdrawal.user?.email || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <ArrowDownCircle className="w-4 h-4 text-red-500 mr-2" />
                            <span className="font-mono text-sm text-gray-900">
                              {withdrawal.transactionId}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-semibold text-red-600">
                            -{formatAmount(withdrawal.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Building className="w-4 h-4 text-gray-400 mr-1" />
                              <span className="text-sm font-medium">{withdrawal.user?.bankAccount?.bankName || 'N/A'}</span>
                              {withdrawal.user?.bankAccount?.isBankAccountVerified ? (
                                <CheckCircle className="w-4 h-4 text-green-500 ml-1" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-yellow-500 ml-1" />
                              )}
                            </div>
                            <div className="flex items-center">
                              <Hash className="w-4 h-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-600">{withdrawal.user?.bankAccount?.accountNumber || 'N/A'}</span>
                            </div>
                            <p className="text-sm text-gray-600">{withdrawal.user?.bankAccount?.accountHolderName || 'N/A'}</p>
                            {withdrawal.user?.bankAccount?.branch && (
                              <p className="text-xs text-gray-500">{withdrawal.user.bankAccount.branch}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(withdrawal.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleApprove(withdrawal)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-white bg-green-500 hover:bg-green-600 transition-colors"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Phê duyệt
                            </button>
                            <button
                              onClick={() => handleReject(withdrawal)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Từ chối
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4 p-4">
                {pendingWithdrawals.map((withdrawal) => (
                  <div key={withdrawal._id} className="border border-gray-200 rounded-lg p-4">
                    {/* User Info */}
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{withdrawal.user?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{withdrawal.user?.email || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-red-600">
                          -{formatAmount(withdrawal.amount)}
                        </p>
                      </div>
                    </div>

                    {/* Transaction ID */}
                    <div className="flex items-center mb-2">
                      <ArrowDownCircle className="w-4 h-4 text-red-500 mr-2" />
                      <span className="font-mono text-sm text-gray-900">{withdrawal.transactionId}</span>
                    </div>

                    {/* Bank Info */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center mb-1">
                        <Building className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium">{withdrawal.user?.bankAccount?.bankName || 'N/A'}</span>
                        {withdrawal.user?.bankAccount?.isBankAccountVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-500 ml-1" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500 ml-1" />
                        )}
                      </div>
                      <div className="flex items-center mb-1">
                        <Hash className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{withdrawal.user?.bankAccount?.accountNumber || 'N/A'}</span>
                      </div>
                      <p className="text-sm text-gray-600">{withdrawal.user?.bankAccount?.accountHolderName || 'N/A'}</p>
                      {withdrawal.user?.bankAccount?.branch && (
                        <p className="text-xs text-gray-500 mt-1">{withdrawal.user.bankAccount.branch}</p>
                      )}
                    </div>

                    {/* Time */}
                    <div className="flex items-center text-xs text-gray-600 mb-3">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(withdrawal.createdAt)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(withdrawal)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-500 hover:bg-green-600 transition-colors"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Phê duyệt
                      </button>
                      <button
                        onClick={() => handleReject(withdrawal)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Trước
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sau
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Trang <span className="font-medium">{currentPage}</span> của{' '}
                          <span className="font-medium">{totalPages}</span>
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Trước
                          </button>
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Sau
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Approval Modal */}
        {showApprovalModal && selectedWithdrawal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Xác nhận phê duyệt</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Người dùng:</span>
                  <span className="font-medium">{selectedWithdrawal.user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-medium text-red-600">
                    -{formatAmount(selectedWithdrawal.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tài khoản:</span>
                  <span className="font-medium">
                    {selectedWithdrawal.user?.bankAccount?.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngân hàng:</span>
                  <span className="font-medium">
                    {selectedWithdrawal.user?.bankAccount?.bankName}
                  </span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-green-800">
                  ✓ Sau khi phê duyệt, số tiền sẽ được trừ khỏi ví người dùng và email thông báo sẽ được gửi.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedWithdrawal(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={confirmApproval}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processing ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    'Phê duyệt'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectionModal && selectedWithdrawal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Từ chối yêu cầu rút tiền</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Người dùng:</span>
                  <span className="font-medium">{selectedWithdrawal.user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-medium text-red-600">
                    -{formatAmount(selectedWithdrawal.amount)}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do từ chối *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Nhập lý do từ chối yêu cầu rút tiền..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows="4"
                  maxLength="500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {rejectionReason.length}/500 ký tự
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-red-800">
                  ⚠️ Sau khi từ chối, email thông báo sẽ được gửi đến người dùng với lý do từ chối.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectionModal(false);
                    setSelectedWithdrawal(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={confirmRejection}
                  disabled={processing || !rejectionReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processing ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    'Từ chối'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWithdrawalManagement;