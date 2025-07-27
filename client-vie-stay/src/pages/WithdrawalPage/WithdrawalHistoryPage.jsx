import React, { useState, useEffect } from 'react';
import { 
  ArrowDownCircle, 
  Calendar, 
  Filter,
  Search,
  Eye,
  RefreshCw,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard
} from 'lucide-react';

const WithdrawalHistoryPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, success, failed
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [eligibilityData, setEligibilityData] = useState(null);

  // Mock navigation function for demo
  const navigate = (path) => {
    console.log('Navigate to:', path);
    alert(`Would navigate to: ${path}`);
  };

  // Mock axios instance
  const axiosInstance = {
    get: async (url) => {
      console.log('GET request to:', url);
      // Mock data - replace with actual API calls
      return {
        data: {
          data: {
            withdrawals: [
              {
                _id: '1',
                transactionId: 'WD1738399543123',
                amount: 500000,
                status: 'pending',
                createdAt: new Date().toISOString(),
                message: 'Withdrawal request to Vietcombank - 1234567890'
              },
              {
                _id: '2',
                transactionId: 'WD1738399543124',
                amount: 1000000,
                status: 'success',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                message: 'Withdrawal request to Techcombank - 0987654321'
              },
              {
                _id: '3',
                transactionId: 'WD1738399543125',
                amount: 750000,
                status: 'failed',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                message: 'Withdrawal request to BIDV - 1122334455',
                rejectionReason: 'Invalid bank account information'
              }
            ],
            pagination: {
              totalPages: 1
            },
            walletBalance: 2500000,
            bankAccount: {
              bankName: 'Vietcombank',
              accountNumber: '1234567890',
              accountHolderName: 'Nguyen Van A',
              isBankAccountVerified: true
            },
            isVerified: true,
            hasBankAccountData: true
          }
        }
      };
    }
  };

  useEffect(() => {
    fetchWithdrawals();
    checkEligibility();
  }, [currentPage, filter]);

  const checkEligibility = async () => {
    try {
      const response = await axiosInstance.get('/api/withdrawals/check-eligibility');
      setEligibilityData(response.data.data);
    } catch (err) {
      console.error('Error checking eligibility:', err);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
      
      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await axiosInstance.get(`/api/withdrawals/history?${params}`);
      setWithdrawals(response.data.data.withdrawals || []);
      setTotalPages(response.data.data.pagination.totalPages || 1);
    } catch (err) {
      setError('Không thể tải lịch sử rút tiền');
      console.error('Error fetching withdrawals:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success':
        return 'Thành công';
      case 'failed':
        return 'Thất bại';
      case 'pending':
        return 'Đang xử lý';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
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
    return `-${amount.toLocaleString('vi-VN')}₫`;
  };

  const handleCreateWithdrawal = () => {
    if (!eligibilityData?.hasBankAccountData) {
      navigate('/bank-account-setup');
    } else {
      navigate('/withdrawal/request');
    }
  };

  if (loading && withdrawals.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-3 text-lg text-gray-600">Đang tải lịch sử rút tiền...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Lịch sử rút tiền</h1>
              <p className="text-gray-600 mt-1">Quản lý các yêu cầu rút tiền của bạn</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Số dư ví hiện tại</p>
                <p className="text-xl font-bold text-orange-600">
                  {(eligibilityData?.walletBalance || 0).toLocaleString('vi-VN')}₫
                </p>
              </div>
              <button
                onClick={handleCreateWithdrawal}
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Rút tiền
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Filter buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4 inline mr-1" />
                Tất cả
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'pending'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-4 h-4 inline mr-1" />
                Đang xử lý
              </button>
              <button
                onClick={() => setFilter('success')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Thành công
              </button>
              <button
                onClick={() => setFilter('failed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'failed'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <XCircle className="w-4 h-4 inline mr-1" />
                Thất bại
              </button>
            </div>
          </div>
        </div>

        {/* Bank Account Status */}
        {eligibilityData?.bankAccount && (
          <div className={`mb-6 p-4 rounded-lg border ${
            eligibilityData.isVerified 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className={`w-5 h-5 mr-2 ${
                  eligibilityData.isVerified ? 'text-green-600' : 'text-yellow-600'
                }`} />
                <div>
                  <p className={`font-medium ${
                    eligibilityData.isVerified ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {eligibilityData.bankAccount.bankName} - {eligibilityData.bankAccount.accountNumber}
                  </p>
                  <p className={`text-sm ${
                    eligibilityData.isVerified ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {eligibilityData.isVerified 
                      ? 'Tài khoản đã được xác minh' 
                      : 'Đang chờ xác minh từ quản trị viên'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/bank-account-setup')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Withdrawal List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {withdrawals.length === 0 ? (
            <div className="text-center py-12">
              <ArrowDownCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có yêu cầu rút tiền nào</h3>
              <p className="text-gray-600 mb-4">Bạn chưa tạo yêu cầu rút tiền nào trong hệ thống.</p>
              <button
                onClick={handleCreateWithdrawal}
                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tạo yêu cầu rút tiền
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã giao dịch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời gian
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ghi chú
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {withdrawals.map((withdrawal) => (
                      <tr key={withdrawal._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <ArrowDownCircle className="w-4 h-4 text-red-500 mr-2" />
                            <span className="font-mono text-sm text-gray-900">
                              {withdrawal.transactionId}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-red-600">
                            {formatAmount(withdrawal.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(withdrawal.status)}
                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(withdrawal.status)}`}>
                              {getStatusText(withdrawal.status)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(withdrawal.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-900 text-sm">
                            {withdrawal.rejectionReason || withdrawal.message || 'Yêu cầu rút tiền'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden">
                {withdrawals.map((withdrawal) => (
                  <div key={withdrawal._id} className="border-b border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <ArrowDownCircle className="w-4 h-4 text-red-500 mr-2" />
                        <div>
                          <p className="font-mono text-sm text-gray-900">{withdrawal.transactionId}</p>
                          <div className="flex items-center mt-1">
                            {getStatusIcon(withdrawal.status)}
                            <span className={`ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(withdrawal.status)}`}>
                              {getStatusText(withdrawal.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="font-semibold text-red-600">
                        {formatAmount(withdrawal.amount)}
                      </span>
                    </div>
                    <p className="text-gray-900 text-sm mb-2">
                      {withdrawal.rejectionReason || withdrawal.message || 'Yêu cầu rút tiền'}
                    </p>
                    <div className="flex items-center text-xs text-gray-600">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(withdrawal.createdAt)}
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

        {/* Quick Info */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-medium text-gray-800 mb-3">Thông tin về rút tiền</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• <strong>Thời gian xử lý:</strong> 1-2 ngày làm việc để xét duyệt, 7 ngày làm việc để chuyển tiền</p>
            <p>• <strong>Số tiền tối thiểu:</strong> 50,000₫ | <strong>Số tiền tối đa:</strong> 10,000,000₫</p>
            <p>• <strong>Phí rút tiền:</strong> Miễn phí (phí ngân hàng có thể áp dụng)</p>
            <p>• <strong>Hỗ trợ:</strong> Liên hệ support@yourapp.com nếu cần hỗ trợ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalHistoryPage;