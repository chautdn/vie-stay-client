import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWithdrawalStore } from '../../store/withdrawalStore';
import { useAuthStore } from '../../store/authStore';
import useErrorStore from '../../store/errorStore';

const WithdrawalRequestPage = () => {
  const navigate = useNavigate();
  const { confirmationId } = useParams();
  const { user } = useAuthStore();
  const { createWithdrawalRequest, isLoading } = useWithdrawalStore();
  const { error, clearError } = useErrorStore();

  const [formData, setFormData] = useState({
    amount: '',
    requestType: 'deposit_refund',
    reason: '',
    vnpayInfo: {
      bankCode: 'VCB',
      accountNumber: '',
      accountName: ''
    }
  });

  const [message, setMessage] = useState('');

  // Bank codes cho VNPay
  const bankCodes = [
    { code: 'VCB', name: 'Vietcombank' },
    { code: 'TCB', name: 'Techcombank' },
    { code: 'VTB', name: 'Vietinbank' },
    { code: 'ACB', name: 'ACB' },
    { code: 'MB', name: 'MB Bank' },
    { code: 'TPB', name: 'TPBank' },
    { code: 'STB', name: 'Sacombank' },
    { code: 'VPB', name: 'VPBank' },
    { code: 'SHB', name: 'SHB' }
  ];

  useEffect(() => {
    // Clear error khi component mount
    clearError();
  }, [clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('vnpayInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        vnpayInfo: {
          ...prev.vnpayInfo,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    clearError();

    // Validation
    if (!formData.amount || formData.amount <= 0) {
      setMessage({ type: 'error', text: 'Vui lòng nhập số tiền hợp lệ' });
      return;
    }

    if (!formData.reason.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập lý do rút tiền' });
      return;
    }

    if (!formData.vnpayInfo.accountNumber.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập số tài khoản' });
      return;
    }

    if (!formData.vnpayInfo.accountName.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập tên chủ tài khoản' });
      return;
    }

    try {
      await createWithdrawalRequest(confirmationId, formData);
      
      setMessage({ 
        type: 'success', 
        text: 'Tạo yêu cầu rút tiền thành công! Chủ trọ sẽ xem xét yêu cầu của bạn.' 
      });
      
      // Reset form
      setFormData({
        amount: '',
        requestType: 'deposit_refund',
        reason: '',
        vnpayInfo: {
          bankCode: 'VCB',
          accountNumber: '',
          accountName: ''
        }
      });

      // Redirect sau 3 giây
      setTimeout(() => {
        navigate('/withdrawal/history');
      }, 3000);

    } catch (error) {
      console.error('Error creating withdrawal request:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Yêu cầu rút tiền cọc
            </h1>
            <p className="text-gray-600">
              Điền thông tin để tạo yêu cầu rút tiền cọc qua VNPay
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền rút (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Nhập số tiền muốn rút"
                required
                min="1"
              />
            </div>

            {/* Request Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại yêu cầu
              </label>
              <select
                name="requestType"
                value={formData.requestType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="deposit_refund">Hoàn trả tiền cọc</option>
                <option value="early_termination">Chấm dứt hợp đồng sớm</option>
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do rút tiền <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Vui lòng mô tả lý do bạn muốn rút tiền cọc..."
                required
              />
            </div>

            {/* VNPay Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Thông tin tài khoản VNPay
              </h3>
              
              {/* Bank Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngân hàng <span className="text-red-500">*</span>
                </label>
                <select
                  name="vnpayInfo.bankCode"
                  value={formData.vnpayInfo.bankCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {bankCodes.map(bank => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name} ({bank.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="vnpayInfo.accountNumber"
                  value={formData.vnpayInfo.accountNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nhập số tài khoản"
                  required
                />
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên chủ tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="vnpayInfo.accountName"
                  value={formData.vnpayInfo.accountName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nhập tên chủ tài khoản"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Quay lại
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-md text-white font-medium transition-colors ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {isLoading ? 'Đang xử lý...' : 'Tạo yêu cầu rút tiền'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalRequestPage;