import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/AxiosInstance';
import { useAuthStore } from '../../store/authStore';
import { 
  Receipt, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  CreditCard,
  Wallet,
  Star,
  Users,
  Home,
  RefreshCw,
  X
} from 'lucide-react';

const TenantBillsPage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bills, setBills] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [isRepresentative, setIsRepresentative] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  
  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Bill details modal state
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [detailBill, setDetailBill] = useState(null);

  // Fetch tenant bills and room info
  const fetchTenantData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch bills for tenant
      const billsResponse = await axiosInstance.get('/api/bills/tenant/my-bills');
      
      // Fetch wallet balance
      const walletResponse = await axiosInstance.get('/api/wallet/balance');
      
      if (billsResponse.data.success) {
        setBills(billsResponse.data.data);
        
        // Get room info from the first bill (assuming tenant is in one room)
        if (billsResponse.data.data.length > 0) {
          const firstBill = billsResponse.data.data[0];
          setRoomInfo(firstBill.roomId);
          
          // Check if current user is the representative for this bill
          // Handle both string and object representations of representative ID
          const representativeId = typeof firstBill.representativeId === 'object' 
            ? firstBill.representativeId._id || firstBill.representativeId
            : firstBill.representativeId;
          
          const userId = user._id || user.id;
          const isRep = representativeId.toString() === userId.toString();
          
          console.log('Representative check:', {
            representativeId,
            userId,
            isRepresentative: isRep,
            bill: firstBill
          });
          
          setIsRepresentative(isRep);
        }
      }
      
      if (walletResponse.data.success) {
        setWalletBalance(walletResponse.data.data.balance);
      }

    } catch (error) {
      console.error('Error fetching tenant data:', error);
      setError('Không thể tải dữ liệu hóa đơn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Pay bill with wallet
  const payBillWithWallet = async () => {
    if (!selectedBill) return;
    
    setPaymentLoading(true);
    
    try {
      const response = await axiosInstance.post(`/api/bill-payments/bill/${selectedBill._id}/wallet`, {
        amount: selectedBill.remainingBalance || selectedBill.totalAmount
      });

      if (response.data.success) {
        setShowPaymentModal(false);
        setSelectedBill(null);
        fetchTenantData(); // Refresh data
        alert('Thanh toán thành công!');
      } else {
        alert(response.data.message || 'Thanh toán thất bại');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.response?.data?.message || 'Lỗi khi thanh toán');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Mark bill as viewed
  const markBillAsViewed = async (billId) => {
    try {
      await axiosInstance.post(`/api/bills/${billId}/view`);
      fetchTenantData(); // Refresh to update status
    } catch (error) {
      console.error('Error marking bill as viewed:', error);
    }
  };

  useEffect(() => {
    fetchTenantData();
  }, []);

  // Utility functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    const colors = {
      'draft': 'border-gray-200 text-gray-800 bg-gray-50',
      'sent': 'border-blue-200 text-blue-800 bg-blue-50',
      'viewed': 'border-yellow-200 text-yellow-800 bg-yellow-50',
      'paid': 'border-green-200 text-green-800 bg-green-50',
      'overdue': 'border-red-200 text-red-800 bg-red-50'
    };
    return colors[status] || 'border-gray-200 text-gray-800 bg-gray-50';
  };

  const getBillStatusText = (status) => {
    const statusText = {
      'draft': 'Bản nháp',
      'sent': 'Đã gửi',
      'viewed': 'Đã xem',
      'paid': 'Đã thanh toán',
      'overdue': 'Quá hạn'
    };
    return statusText[status] || status;
  };

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status !== 'paid';
  };

  // Helper function to check if user can pay a specific bill
  const canPayBill = (bill) => {
    const representativeId = typeof bill.representativeId === 'object' 
      ? bill.representativeId._id || bill.representativeId
      : bill.representativeId;
    
    const userId = user._id || user.id;
    return representativeId.toString() === userId.toString();
  };

  // Payment Confirmation Modal
  const PaymentModal = () => {
    if (!showPaymentModal || !selectedBill) return null;

    const remainingAmount = selectedBill.remainingBalance || selectedBill.totalAmount;
    const canPay = walletBalance >= remainingAmount;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Xác nhận thanh toán</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt size={32} className="text-blue-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Thanh toán hóa đơn {selectedBill.billNumber}
              </h4>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Số tiền cần thanh toán:</span>
                  <span className="font-bold text-lg text-gray-900">
                    {formatPrice(remainingAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số dư ví hiện tại:</span>
                  <span className={`font-medium ${canPay ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPrice(walletBalance)}
                  </span>
                </div>
              </div>

              {!canPay && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="text-red-500 mr-2" size={20} />
                    <span className="text-red-700">
                      Số dư ví không đủ để thanh toán hóa đơn này
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={payBillWithWallet}
                disabled={!canPay || paymentLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {paymentLoading ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Wallet size={16} />
                )}
                {paymentLoading ? 'Đang xử lý...' : 'Thanh toán'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Bill Details Modal
  const BillDetailsModal = () => {
    if (!showBillDetails || !detailBill) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Chi tiết hóa đơn</h3>
              <button
                onClick={() => setShowBillDetails(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-600">Mã hóa đơn</label>
                <span className="font-medium">{detailBill.billNumber}</span>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Trạng thái</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(detailBill.status)}`}>
                  {getBillStatusText(detailBill.status)}
                </span>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Kỳ hóa đơn</label>
                <span className="font-medium">
                  {formatDate(detailBill.billingPeriod.from)} - {formatDate(detailBill.billingPeriod.to)}
                </span>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Hạn thanh toán</label>
                <span className="font-medium">{formatDate(detailBill.dueDate)}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Chi tiết các khoản phí</h4>
              <div className="space-y-3">
                {detailBill.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )}
                    </div>
                    <span className="font-bold">{formatPrice(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium">{formatPrice(detailBill.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Thuế:</span>
                <span className="font-medium">{formatPrice(detailBill.tax || 0)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                <span>Tổng cộng:</span>
                <span>{formatPrice(detailBill.totalAmount)}</span>
              </div>
              {detailBill.paidAmount > 0 && (
                <div className="flex justify-between items-center text-green-600 mt-2">
                  <span>Đã thanh toán:</span>
                  <span className="font-bold">{formatPrice(detailBill.paidAmount)}</span>
                </div>
              )}
            </div>

            {detailBill.notes && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Ghi chú</h5>
                <p className="text-blue-800">{detailBill.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600">Đang tải hóa đơn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hóa đơn của tôi</h1>
              <p className="text-gray-600 mt-2">
                Quản lý và thanh toán các hóa đơn được gửi đến phòng của bạn
              </p>
            </div>
            <button
              onClick={fetchTenantData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Làm mới
            </button>
          </div>

          {/* Room Info & Wallet Balance */}
          {roomInfo && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Phòng hiện tại</p>
                    <p className="text-lg font-bold text-gray-900">
                      {roomInfo.name || `Phòng ${roomInfo.roomNumber}`}
                    </p>
                  </div>
                  <Home className="text-blue-600" size={24} />
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Vai trò</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-gray-900">
                        {isRepresentative ? 'Người đại diện' : 'Thành viên'}
                      </p>
                      {isRepresentative && <Star className="text-yellow-500" size={16} />}
                    </div>
                  </div>
                  <Users className="text-green-600" size={24} />
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Số dư ví</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatPrice(walletBalance)}
                    </p>
                  </div>
                  <Wallet className="text-green-600" size={24} />
                </div>
              </div>
            </div>
          )}

          {isRepresentative && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex items-center">
                <Star className="text-blue-600 mr-2" size={20} />
                <span className="text-blue-800">
                  Bạn là người đại diện của phòng và có thể thanh toán hóa đơn cho toàn bộ phòng
                </span>
              </div>
            </div>
          )}

          {/* Debug Information (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 border rounded-lg p-4 mt-4">
              <h4 className="font-semibold mb-2">Debug Info:</h4>
              <div className="text-sm space-y-1">
                <p>User ID: {user._id || user.id}</p>
                <p>Is Representative (global): {isRepresentative ? 'Yes' : 'No'}</p>
                {bills.length > 0 && (
                  <>
                    <p>First Bill Representative ID: {
                      typeof bills[0].representativeId === 'object' 
                        ? bills[0].representativeId._id || bills[0].representativeId
                        : bills[0].representativeId
                    }</p>
                    <p>Can pay first bill: {canPayBill(bills[0]) ? 'Yes' : 'No'}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Bills List */}
        <div className="space-y-4">
          {bills.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có hóa đơn nào</h3>
              <p className="text-gray-500">Hóa đơn từ chủ trọ sẽ được hiển thị ở đây</p>
            </div>
          ) : (
            bills.map((bill) => {
              const overdue = isOverdue(bill.dueDate, bill.status);
              const remainingAmount = bill.remainingBalance || bill.totalAmount;
              
              return (
                <div key={bill._id} className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        bill.status === 'paid' ? 'bg-green-100' : 
                        overdue ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <Receipt size={24} className={
                          bill.status === 'paid' ? 'text-green-600' : 
                          overdue ? 'text-red-600' : 'text-blue-600'
                        } />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {bill.billNumber}
                          </h3>
                          
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                            {getBillStatusText(bill.status)}
                          </span>

                          {overdue && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              Quá hạn
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>Kỳ: {formatDate(bill.billingPeriod.from)} - {formatDate(bill.billingPeriod.to)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign size={14} />
                            <span>Tổng tiền: {formatPrice(bill.totalAmount)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span className={overdue ? 'text-red-600 font-medium' : ''}>
                              Hạn thanh toán: {formatDate(bill.dueDate)}
                            </span>
                          </div>
                          {bill.paidAmount > 0 && (
                            <div className="flex items-center gap-2">
                              <CheckCircle size={14} />
                              <span className="text-green-600">
                                Đã thanh toán: {formatPrice(bill.paidAmount)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(remainingAmount)}
                      </p>
                      {bill.paidAmount > 0 && (
                        <p className="text-sm text-gray-500">
                          Còn lại từ {formatPrice(bill.totalAmount)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setDetailBill(bill);
                        setShowBillDetails(true);
                        markBillAsViewed(bill._id);
                      }}
                      className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Eye size={16} />
                      Xem chi tiết
                    </button>

                    {bill.status !== 'paid' && canPayBill(bill) && (
                      <button
                        onClick={() => {
                          console.log('Payment button clicked for bill:', bill._id);
                          console.log('Can pay bill:', canPayBill(bill));
                          setSelectedBill(bill);
                          setShowPaymentModal(true);
                        }}
                        className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <CreditCard size={16} />
                        Thanh toán
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modals */}
      <PaymentModal />
      <BillDetailsModal />
    </div>
  );
};

export default TenantBillsPage;