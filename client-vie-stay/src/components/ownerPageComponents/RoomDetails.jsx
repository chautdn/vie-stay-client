import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/AxiosInstance'; 
import { 
  X, 
  Home, 
  Users, 
  DollarSign, 
  Calendar, 
  User,
  Mail,
  Phone,
  Edit,
  UserX,
  CheckCircle,
  Plus,
  Send,
  Clock,
  AlertCircle,
  Receipt,
  TrendingUp,
  Activity,
  Star,
  UserCheck,
  Trash2,
  RefreshCw,
  CreditCard,
  Banknote,
  Eye
} from 'lucide-react';

import BillingModals from '../billing/BillingModals';

const RoomDetails = ({ room, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for room data
  const [roomData, setRoomData] = useState({
    tenants: [],
    bills: [],
    payments: [],
    tenantHistory: [],
    representative: null,
    analytics: {
      totalRevenue: 0,
      pendingPayments: 0,
      occupancyRate: 0
    }
  });

  // Bill creation state
  const [showCreateBill, setShowCreateBill] = useState(false);
  const [billType, setBillType] = useState('monthly');
  const [billForm, setBillForm] = useState({
    billingPeriod: { from: '', to: '' },
    items: [],
    notes: '',
    dueDate: ''
  });

  // Bill editing state
  const [showEditBill, setShowEditBill] = useState(false);
  const [editingBill, setEditingBill] = useState(null);

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const [activityLog, setActivityLog] = useState([]);
  const [historyTab, setHistoryTab] = useState('activity'); // 'activity', 'payments', 'tenants'

  // Fetch room data using axios
  const fetchRoomData = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.group(`🚀 Fetching data for room: ${room._id}`);

      // Helper function to safely fetch data using axios
      const safeFetch = async (url, description) => {
        try {
          const response = await axiosInstance.get(url);
          console.log(`✅ ${description}:`, response.data.success ? 'Success' : 'No data');
          return response.data;
        } catch (error) {
          const status = error.response?.status;
          const message = error.response?.data?.message || error.message;
          
          // Handle expected 404s gracefully without scary error logs
          if (status === 404) {
            if (description === 'Representative') {
              console.log(`ℹ️ ${description}: No representative set (normal)`);
              return { success: true, data: null };
            }
            if (description === 'Bills' || description === 'Payments') {
              console.log(`ℹ️ ${description}: No data found (normal)`);
              return { success: true, data: [] };
            }
            if (description === 'Tenants') {
              console.log(`ℹ️ ${description}: Room is empty (normal)`);
              return { success: true, data: [] };
            }
          }
          
          // Log real errors only
          console.error(`❌ ${description}: ${status} - ${message}`);
          
          return { 
            success: false, 
            data: [], 
            error: `${status ? `HTTP ${status}` : 'Network Error'}: ${message}`
          };
        }
      };

      // Fetch all data concurrently
      const [tenantsData, repData, billsData, paymentsData, tenantHistoryData] = await Promise.all([
        safeFetch(`/api/room-occupancy/room/${room._id}/tenants`, 'Tenants'),
        safeFetch(`/api/room-occupancy/room/${room._id}/representative`, 'Representative'),
        safeFetch(`/api/bills/room/${room._id}`, 'Bills'),
        safeFetch(`/api/bill-payments/landlord/history?roomId=${room._id}`, 'Payments'),
        safeFetch(`/api/room-occupancy/tenant/history?roomId=${room._id}`, 'Tenant History')
      ]);

      // Process results
      const tenants = tenantsData.success ? tenantsData.data : [];
      const representative = repData.success ? repData.data : null;
      const bills = billsData.success ? billsData.data : [];
      const payments = paymentsData.success ? paymentsData.data : [];
      const tenantHistory = tenantHistoryData.success ? tenantHistoryData.data : [];

      setRoomData({
        tenants,
        representative,
        bills,
        payments,
        tenantHistory,
        analytics: calculateAnalytics(bills, payments)
      });

      generateActivityLog(tenants, bills, payments);

      // Show warnings only for actual errors (not normal 404s)
      const realErrors = [
        { name: 'Tenants', data: tenantsData },
        { name: 'Representative', data: repData },
        { name: 'Bills', data: billsData },
        { name: 'Payments', data: paymentsData },
        { name: 'Tenant History', data: tenantHistoryData }
      ].filter(req => !req.data.success && req.data.error && !req.data.error.includes('HTTP 404'));

      if (realErrors.length > 0) {
        const failedNames = realErrors.map(req => req.name).join(', ');
        const errors = realErrors.map(req => req.data.error).filter(Boolean);
        setError(`Một số dữ liệu không tải được: ${failedNames}. ${errors.length > 0 ? 'Lỗi: ' + errors.join(', ') : 'Vui lòng kiểm tra kết nối API.'}`);
      }

      console.groupEnd();

    } catch (error) {
      console.error('💥 Error fetching room data:', error);
      setError(`Lỗi khi tải dữ liệu: ${error.message}`);
      console.groupEnd();
    }
    
    setLoading(false);
  };

  const calculateAnalytics = (bills, payments) => {
    const totalRevenue = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const pendingPayments = bills
      .filter(b => b.status !== 'paid')
      .reduce((sum, b) => sum + (b.remainingBalance || 0), 0);
    
    const occupancyRate = (roomData.tenants.length / (room.capacity || 1)) * 100;

    return { totalRevenue, pendingPayments, occupancyRate };
  };

  const generateActivityLog = (tenants, bills, payments) => {
    const activities = [];
    
    bills.forEach(bill => {
      activities.push({
        id: `bill-${bill._id}`,
        type: 'bill_created',
        date: bill.createdAt,
        description: `Hóa đơn ${bill.billNumber} được tạo`,
        amount: bill.totalAmount,
        icon: Receipt
      });
    });

    payments.forEach(payment => {
      activities.push({
        id: `payment-${payment._id}`,
        type: 'payment_received',
        date: payment.paidAt || payment.createdAt,
        description: `Nhận thanh toán ${payment.paymentMethod}`,
        amount: payment.amount,
        icon: DollarSign
      });
    });

    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    setActivityLog(activities.slice(0, 10));
  };

  // Confirmation Modal Component
  const ConfirmationModal = () => {
    if (!showConfirmModal || !confirmAction) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-70 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Xác nhận thanh toán</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle size={24} className="text-yellow-600" />
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Xác nhận đánh dấu đã thanh toán
              </h4>
              <p className="text-gray-600">
                Bạn có chắc chắn muốn đánh dấu hóa đơn <strong>{selectedBill?.billNumber}</strong> là đã thanh toán đầy đủ?
              </p>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Số tiền:</strong> {formatPrice(selectedBill?.remainingBalance || selectedBill?.totalAmount)}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  confirmAction();
                  setShowConfirmModal(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // API functions using axios
  const createCustomBill = async () => {
    try {
      console.log('📄 Creating custom bill...');
      const response = await axiosInstance.post(`/api/bills/room/${room._id}/custom`, billForm);

      if (response.data.success) {
        setShowCreateBill(false);
        setBillForm({ billingPeriod: { from: '', to: '' }, items: [], notes: '', dueDate: '' });
        fetchRoomData();
        alert('Hóa đơn tùy chỉnh đã được tạo');
      } else {
        alert(response.data.message || 'Không thể tạo hóa đơn');
      }
    } catch (error) {
      console.error('❌ Error creating custom bill:', error);
      alert(error.response?.data?.message || 'Lỗi khi tạo hóa đơn tùy chỉnh');
    }
  };

  const updateBill = async () => {
    if (!editingBill) return;

    try {
      console.log('📝 Updating bill...');
      const response = await axiosInstance.put(`/api/bills/${editingBill._id}`, billForm);

      if (response.data.success) {
        setShowEditBill(false);
        setEditingBill(null);
        setBillForm({ billingPeriod: { from: '', to: '' }, items: [], notes: '', dueDate: '' });
        fetchRoomData();
        alert('Hóa đơn đã được cập nhật');
      } else {
        alert(response.data.message || 'Không thể cập nhật hóa đơn');
      }
    } catch (error) {
      console.error('❌ Error updating bill:', error);
      alert(error.response?.data?.message || 'Lỗi khi cập nhật hóa đơn');
    }
  };

  const deleteBill = async (billId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) return;

    try {
      console.log('🗑️ Deleting bill...');
      const response = await axiosInstance.delete(`/api/bills/${billId}`);

      if (response.data.success) {
        fetchRoomData();
        alert('Hóa đơn đã được xóa');
      } else {
        alert(response.data.message || 'Không thể xóa hóa đơn');
      }
    } catch (error) {
      console.error('❌ Error deleting bill:', error);
      alert(error.response?.data?.message || 'Lỗi khi xóa hóa đơn');
    }
  };

  const startEditBill = (bill) => {
    setEditingBill(bill);
    setBillForm({
      billingPeriod: {
        from: bill.billingPeriod.from.split('T')[0], // Convert to YYYY-MM-DD format
        to: bill.billingPeriod.to.split('T')[0]
      },
      items: bill.items || [],
      notes: bill.notes || '',
      dueDate: bill.dueDate ? bill.dueDate.split('T')[0] : ''
    });
    setShowEditBill(true);
  };

  // Mark bill as fully paid
  const markBillAsPaid = async () => {
    if (!selectedBill) return;

    try {
      console.log('✅ Marking bill as paid...');
      
      // Record full payment
      const paymentData = {
        amount: selectedBill.remainingBalance || selectedBill.totalAmount,
        paymentMethod: 'cash',
        notes: 'Đánh dấu thanh toán đầy đủ bởi chủ trọ',
        referenceNumber: `MANUAL_${Date.now()}`
      };

      const response = await axiosInstance.post(`/api/bill-payments/bill/${selectedBill._id}/cash`, paymentData);

      if (response.data.success) {
        setSelectedBill(null);
        fetchRoomData();
        alert('Hóa đơn đã được đánh dấu là đã thanh toán');
      } else {
        alert(response.data.message || 'Không thể đánh dấu hóa đơn đã thanh toán');
      }
    } catch (error) {
      console.error('❌ Error marking bill as paid:', error);
      alert(error.response?.data?.message || 'Lỗi khi đánh dấu hóa đơn đã thanh toán');
    }
  };

  const removeTenant = async (tenantId) => {
    if (!confirm('Bạn có chắc muốn xóa người thuê này khỏi phòng?')) return;

    try {
      console.log('👤 Removing tenant...');
      const response = await axiosInstance.delete(`/api/room-occupancy/room/${room._id}/tenants/${tenantId}`, {
        data: { terminationReason: 'Removed by landlord' }
      });

      if (response.data.success) {
        fetchRoomData();
        alert('Đã xóa người thuê khỏi phòng');
      } else {
        alert(response.data.message || 'Không thể xóa người thuê');
      }
    } catch (error) {
      console.error('❌ Error removing tenant:', error);
      alert(error.response?.data?.message || 'Lỗi khi xóa người thuê');
    }
  };

  const setRepresentative = async (tenantId) => {
    try {
      console.log('⭐ Setting representative...');
      const response = await axiosInstance.put(`/api/room-occupancy/room/${room._id}/representative/${tenantId}`);

      if (response.data.success) {
        fetchRoomData();
        alert('Đã đặt làm người đại diện');
      } else {
        alert(response.data.message || 'Không thể đặt người đại diện');
      }
    } catch (error) {
      console.error('❌ Error setting representative:', error);
      alert(error.response?.data?.message || 'Lỗi khi đặt người đại diện');
    }
  };

  const sendBill = async (billId) => {
    try {
      console.log('📮 Sending bill...');
      const response = await axiosInstance.post(`/api/bills/${billId}/send`);

      if (response.data.success) {
        fetchRoomData();
        alert('Hóa đơn đã được gửi');
      } else {
        alert(response.data.message || 'Không thể gửi hóa đơn');
      }
    } catch (error) {
      console.error('❌ Error sending bill:', error);
      alert(error.response?.data?.message || 'Lỗi khi gửi hóa đơn');
    }
  };

  useEffect(() => {
    if (room?._id) {
      fetchRoomData();
    }
  }, [room?._id]);

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
      'available': 'border-green-200 text-green-800 bg-green-50',
      'occupied': 'border-blue-200 text-blue-800 bg-blue-50',
      'maintenance': 'border-yellow-200 text-yellow-800 bg-yellow-50',
      'unavailable': 'border-red-200 text-red-800 bg-red-50',
      'draft': 'border-gray-200 text-gray-800 bg-gray-50',
      'sent': 'border-blue-200 text-blue-800 bg-blue-50',
      'viewed': 'border-yellow-200 text-yellow-800 bg-yellow-50',
      'paid': 'border-green-200 text-green-800 bg-green-50',
      'overdue': 'border-red-200 text-red-800 bg-red-50',
      'completed': 'border-green-200 text-green-800 bg-green-50',
      'pending': 'border-yellow-200 text-yellow-800 bg-yellow-50'
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

  const getPaymentMethodText = (method) => {
    const methodText = {
      'cash': 'Tiền mặt',
      'bank_transfer': 'Chuyển khoản',
      'wallet': 'Ví điện tử',
      'online': 'Thanh toán online'
    };
    return methodText[method] || method;
  };

  const getTenantStatusText = (status) => {
    const statusText = {
      'active': 'Đang ở',
      'moved_out': 'Đã chuyển đi',
      'terminated': 'Chấm dứt hợp đồng'
    };
    return statusText[status] || status;
  };

  if (!room) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Home size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {room.name || `Phòng ${room.roomNumber}`}
              </h2>
              <p className="text-sm text-gray-500">
                Sức chứa: {roomData.tenants.length}/{room.capacity} người
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(room.status)}`}>
              {room.status === 'available' ? 'Sẵn sàng' : 
               room.status === 'occupied' ? 'Đã thuê' : 
               room.status === 'maintenance' ? 'Bảo trì' : 'Không khả dụng'}
            </div>
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatPrice(roomData.analytics.totalRevenue)}
                  </p>
                </div>
                <TrendingUp className="text-green-600" size={32} />
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Chờ thanh toán</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {formatPrice(roomData.analytics.pendingPayments)}
                  </p>
                </div>
                <Clock className="text-yellow-600" size={32} />
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Tỉ lệ lấp đầy</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {roomData.analytics.occupancyRate.toFixed(1)}%
                  </p>
                </div>
                <Users className="text-blue-600" size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'info', label: 'Thông tin phòng', icon: Home },
              { id: 'tenants', label: `Người thuê (${roomData.tenants.length})`, icon: Users },
              { id: 'billing', label: `Thanh toán (${roomData.bills.length})`, icon: DollarSign },
              { id: 'history', label: 'Lịch sử', icon: Activity },
              { id: 'reports', label: 'Báo cáo', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {loading && (
            <div className="text-center py-12">
              <RefreshCw className="animate-spin mx-auto mb-4" size={48} />
              <p>Đang tải dữ liệu...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg mb-4">
              <div className="px-4 py-3">
                <div className="flex items-center">
                  <AlertCircle className="text-red-500 mr-2" size={20} />
                  <h4 className="text-red-800 font-medium">Lỗi tải dữ liệu</h4>
                </div>
                <p className="text-red-700 mt-1">{error}</p>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={fetchRoomData}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Thử lại
                  </button>
                  <button
                    onClick={() => setError('')}
                    className="px-3 py-1 border border-red-300 text-red-700 text-sm rounded hover:bg-red-50 transition-colors"
                  >
                    Ẩn lỗi
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {room.images && room.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh phòng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {room.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Room ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Số phòng:</span>
                      <span className="font-medium">{room.roomNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Loại phòng:</span>
                      <span className="font-medium">{room.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Diện tích:</span>
                      <span className="font-medium">{room.area || 'N/A'} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Giá thuê:</span>
                      <span className="font-medium text-green-600">{formatPrice(room.baseRent)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tiện nghi</h3>
                  {room.amenities && room.amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Chưa có thông tin tiện nghi</p>
                  )}
                </div>
              </div>

              {room.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mô tả</h3>
                  <p className="text-gray-700">{room.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Tenants Tab */}
          {activeTab === 'tenants' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Người đang thuê ({roomData.tenants.length}/{room.capacity})
                </h3>
                {roomData.representative && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    <Star size={14} />
                    Đại diện: {roomData.representative.tenantId?.name}
                  </div>
                )}
              </div>

              {roomData.tenants.length === 0 ? (
                <div className="text-center py-12">
                  <UserX size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Phòng trống</h3>
                  <p className="text-gray-500">Phòng này hiện tại chưa có ai thuê</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {roomData.tenants.map((tenant, index) => (
                    <div key={tenant._id || index} className="border rounded-lg p-6 bg-white shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            {tenant.tenantId?.profileImage ? (
                              <img 
                                src={tenant.tenantId.profileImage} 
                                alt={tenant.tenantId.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <User size={24} className="text-blue-600" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {tenant.tenantId?.name || 'Tên không xác định'}
                              </h4>
                              
                              {tenant.isRepresentative && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1">
                                  <Star size={12} />
                                  Người đại diện
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-600">
                              {tenant.tenantId?.email && (
                                <div className="flex items-center gap-2">
                                  <Mail size={14} />
                                  <span>{tenant.tenantId.email}</span>
                                </div>
                              )}
                              {tenant.tenantId?.phoneNumber && (
                                <div className="flex items-center gap-2">
                                  <Phone size={14} />
                                  <span>{tenant.tenantId.phoneNumber}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                <span>Dọn vào: {formatDate(tenant.moveInDate)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                        {!tenant.isRepresentative && (
                          <button 
                            onClick={() => setRepresentative(tenant.tenantId._id)}
                            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <UserCheck size={16} />
                            Đặt làm đại diện
                          </button>
                        )}
                        <button 
                          onClick={() => removeTenant(tenant.tenantId._id)}
                          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Xóa khỏi phòng
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quản lý hóa đơn ({roomData.bills.length})
                </h3>
                <button
                  onClick={() => setShowCreateBill(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Tạo hóa đơn
                </button>
              </div>

              <div className="space-y-4">
                {roomData.bills.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có hóa đơn</h3>
                    <p className="text-gray-500">Tạo hóa đơn đầu tiên cho phòng này</p>
                  </div>
                ) : (
                  roomData.bills.map((bill, index) => (
                    <div key={bill._id} className="border rounded-lg p-6 bg-white shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Receipt size={24} className="text-green-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {bill.billNumber}
                              </h4>
                              
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                                {getBillStatusText(bill.status)}
                              </span>
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
                                <span>Hạn thanh toán: {formatDate(bill.dueDate)}</span>
                              </div>
                              {bill.paidAmount > 0 && (
                                <div className="flex items-center gap-2">
                                  <CheckCircle size={14} />
                                  <span>Đã thanh toán: {formatPrice(bill.paidAmount)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-gray-900 mb-3">Chi tiết hóa đơn</h5>
                        <div className="space-y-2">
                          {bill.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{item.name}</span>
                              <span>{formatPrice(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                        {bill.status === 'draft' && (
                          <>
                            <button 
                              onClick={() => startEditBill(bill)}
                              className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Edit size={16} />
                              Chỉnh sửa
                            </button>
                            <button 
                              onClick={() => deleteBill(bill._id)}
                              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Trash2 size={16} />
                              Xóa
                            </button>
                            <button 
                              onClick={() => sendBill(bill._id)}
                              className="px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Send size={16} />
                              Gửi hóa đơn
                            </button>
                          </>
                        )}
                        {bill.status !== 'paid' && bill.status !== 'draft' && (
                          <button 
                            onClick={() => {
                              setSelectedBill(bill);
                              setConfirmAction(() => markBillAsPaid);
                              setShowConfirmModal(true);
                            }}
                            className="px-4 py-2 text-sm text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <CheckCircle size={16} />
                            Đánh dấu đã thanh toán
                          </button>
                        )}
                        <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                          <Eye size={16} />
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Thanh toán gần đây</h4>
                <div className="space-y-3">
                  {roomData.payments.slice(0, 5).map((payment, index) => (
                    <div key={payment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          payment.paymentMethod === 'cash' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {payment.paymentMethod === 'cash' ? 
                            <Banknote size={16} className="text-green-600" /> :
                            <CreditCard size={16} className="text-blue-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{formatPrice(payment.amount)}</p>
                          <p className="text-sm text-gray-500">
                            {payment.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'} • {formatDate(payment.paidAt || payment.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Lịch sử</h3>
              </div>

              {/* History Sub-tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {[
                    { id: 'activity', label: 'Hoạt động chung', icon: Activity },
                    { id: 'payments', label: 'Lịch sử thanh toán', icon: DollarSign },
                    { id: 'tenants', label: 'Lịch sử người ở', icon: Users }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setHistoryTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                        historyTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon size={14} />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Activity History */}
              {historyTab === 'activity' && (
                <div className="space-y-4">
                  {activityLog.length === 0 ? (
                    <div className="text-center py-12">
                      <Activity size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có hoạt động</h3>
                      <p className="text-gray-500">Hoạt động sẽ được hiển thị ở đây</p>
                    </div>
                  ) : (
                    activityLog.map((activity, index) => (
                      <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <activity.icon size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
                          {activity.amount && (
                            <p className="text-sm font-medium text-green-600">
                              {formatPrice(activity.amount)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Payment History */}
              {historyTab === 'payments' && (
                <div className="space-y-4">
                  {roomData.payments.length === 0 ? (
                    <div className="text-center py-12">
                      <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thanh toán</h3>
                      <p className="text-gray-500">Lịch sử thanh toán sẽ được hiển thị ở đây</p>
                    </div>
                  ) : (
                    roomData.payments.map((payment, index) => (
                      <div key={payment._id} className="border rounded-lg p-6 bg-white shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              payment.paymentMethod === 'cash' ? 'bg-green-100' : 
                              payment.paymentMethod === 'bank_transfer' ? 'bg-blue-100' : 'bg-purple-100'
                            }`}>
                              {payment.paymentMethod === 'cash' ? 
                                <Banknote size={24} className="text-green-600" /> :
                                payment.paymentMethod === 'bank_transfer' ? 
                                <CreditCard size={24} className="text-blue-600" /> :
                                <DollarSign size={24} className="text-purple-600" />
                              }
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {formatPrice(payment.amount)}
                                </h4>
                                
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                  {payment.status === 'completed' ? 'Hoàn thành' : 
                                   payment.status === 'pending' ? 'Đang xử lý' : 
                                   payment.status === 'failed' ? 'Thất bại' : 'Đã hoàn tiền'}
                                </span>
                              </div>
                              
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <CreditCard size={14} />
                                  <span>Phương thức: {getPaymentMethodText(payment.paymentMethod)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} />
                                  <span>Ngày thanh toán: {formatDate(payment.paidAt || payment.createdAt)}</span>
                                </div>
                                {payment.referenceNumber && (
                                  <div className="flex items-center gap-2">
                                    <Receipt size={14} />
                                    <span>Mã tham chiếu: {payment.referenceNumber}</span>
                                  </div>
                                )}
                                {payment.notes && (
                                  <div className="flex items-start gap-2 mt-2">
                                    <span className="text-xs text-gray-500">Ghi chú:</span>
                                    <span className="text-xs text-gray-600">{payment.notes}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tenant History */}
              {historyTab === 'tenants' && (
                <div className="space-y-4">
                  {roomData.tenantHistory && roomData.tenantHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <Users size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử người ở</h3>
                      <p className="text-gray-500">Lịch sử người thuê sẽ được hiển thị ở đây</p>
                    </div>
                  ) : (
                    <>
                      {/* Current Tenants */}
                      {roomData.tenants.length > 0 && (
                        <div>
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Users size={16} className="text-green-600" />
                            Người đang ở ({roomData.tenants.length})
                          </h4>
                          <div className="space-y-3">
                            {roomData.tenants.map((tenant) => (
                              <div key={tenant._id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                      {tenant.tenantId?.profileImage ? (
                                        <img 
                                          src={tenant.tenantId.profileImage} 
                                          alt={tenant.tenantId.name}
                                          className="w-10 h-10 rounded-full object-cover"
                                        />
                                      ) : (
                                        <User size={20} className="text-green-600" />
                                      )}
                                    </div>
                                    
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h5 className="font-semibold text-gray-900">
                                          {tenant.tenantId?.name || 'Tên không xác định'}
                                        </h5>
                                        {tenant.isRepresentative && (
                                          <Star size={14} className="text-yellow-500" />
                                        )}
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>Dọn vào: {formatDate(tenant.moveInDate)}</span>
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                          {getTenantStatusText(tenant.status)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Past Tenants */}
                      {roomData.tenantHistory && roomData.tenantHistory.length > 0 && (
                        <div>
                          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Clock size={16} className="text-gray-600" />
                            Người đã ở trước đây ({roomData.tenantHistory.length})
                          </h4>
                          <div className="space-y-3">
                            {roomData.tenantHistory.map((tenant, index) => (
                              <div key={tenant._id || index} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                      {tenant.tenantId?.profileImage ? (
                                        <img 
                                          src={tenant.tenantId.profileImage} 
                                          alt={tenant.tenantId.name}
                                          className="w-10 h-10 rounded-full object-cover"
                                        />
                                      ) : (
                                        <User size={20} className="text-gray-600" />
                                      )}
                                    </div>
                                    
                                    <div>
                                      <h5 className="font-semibold text-gray-900">
                                        {tenant.tenantId?.name || 'Tên không xác định'}
                                      </h5>
                                      <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>Ở từ: {formatDate(tenant.moveInDate)}</span>
                                        {tenant.moveOutDate && (
                                          <span>đến: {formatDate(tenant.moveOutDate)}</span>
                                        )}
                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                          {getTenantStatusText(tenant.status)}
                                        </span>
                                      </div>
                                      {tenant.terminationReason && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          Lý do: {tenant.terminationReason}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="text-right text-sm text-gray-500">
                                    {tenant.moveOutDate && tenant.moveInDate && (
                                      <span>
                                        Thời gian ở: {Math.ceil((new Date(tenant.moveOutDate) - new Date(tenant.moveInDate)) / (1000 * 60 * 60 * 24))} ngày
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Báo cáo doanh thu</h3>
              
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Biểu đồ doanh thu</h4>
                <p className="text-gray-500">Tính năng biểu đồ sẽ được cập nhật</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tổng hóa đơn</p>
                      <p className="text-2xl font-bold text-gray-900">{roomData.bills.length}</p>
                    </div>
                    <Receipt size={24} className="text-gray-400" />
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Đã thanh toán</p>
                      <p className="text-2xl font-bold text-green-600">
                        {roomData.bills.filter(b => b.status === 'paid').length}
                      </p>
                    </div>
                    <CheckCircle size={24} className="text-green-400" />
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Chưa thanh toán</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {roomData.bills.filter(b => b.status !== 'paid').length}
                      </p>
                    </div>
                    <Clock size={24} className="text-yellow-400" />
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Quá hạn</p>
                      <p className="text-2xl font-bold text-red-600">
                        {roomData.bills.filter(b => b.status === 'overdue').length}
                      </p>
                    </div>
                    <AlertCircle size={24} className="text-red-400" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <BillingModals
          showCreateBill={showCreateBill}
          setShowCreateBill={setShowCreateBill}
          showEditBill={showEditBill}
          setShowEditBill={setShowEditBill}
          editingBill={editingBill}
          billForm={billForm}
          setBillForm={setBillForm}
          createCustomBill={createCustomBill}
          updateBill={updateBill}
          formatPrice={formatPrice}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal />
      </div>
    </div>
  );
};

export default RoomDetails;