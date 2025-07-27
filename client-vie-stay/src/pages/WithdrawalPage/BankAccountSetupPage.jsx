import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Building, 
  User, 
  Hash, 
  MapPin, 
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';

const BankAccountSetupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [existingAccount, setExistingAccount] = useState(null);
  const [formData, setFormData] = useState({
    bankName: '',
    bankCode: '',
    accountNumber: '',
    accountHolderName: '',
    branch: ''
  });
  const [errors, setErrors] = useState({});

  // Popular Vietnamese banks
  const vietnameseBanks = [
    { code: 'VCB', name: 'Vietcombank' },
    { code: 'TCB', name: 'Techcombank' },
    { code: 'VTB', name: 'Vietinbank' },
    { code: 'BIDV', name: 'BIDV' },
    { code: 'ACB', name: 'ACB' },
    { code: 'SHB', name: 'SHB' },
    { code: 'VPB', name: 'VPBank' },
    { code: 'CTG', name: 'VietinBank' },
    { code: 'TPB', name: 'TPBank' },
    { code: 'STB', name: 'Sacombank' },
    { code: 'EIB', name: 'Eximbank' },
    { code: 'MSB', name: 'MSB' },
    { code: 'HDB', name: 'HDBank' },
    { code: 'OCB', name: 'OCB' },
    { code: 'MB', name: 'MBBank' },
    { code: 'VIB', name: 'VIB' },
    { code: 'LPB', name: 'LienVietPostBank' },
    { code: 'KLB', name: 'Kienlongbank' },
    { code: 'VAB', name: 'VietABank' },
    { code: 'NAB', name: 'NamABank' }
  ];

  useEffect(() => {
    checkExistingBankAccount();
  }, []);

  const checkExistingBankAccount = async () => {
    try {
      const response = await axiosInstance.get('/api/withdrawals/check-eligibility');
      if (response.data.data.bankAccount) {
        setExistingAccount(response.data.data.bankAccount);
        setFormData({
          bankName: response.data.data.bankAccount.bankName || '',
          bankCode: response.data.data.bankAccount.bankCode || '',
          accountNumber: response.data.data.bankAccount.accountNumber || '',
          accountHolderName: response.data.data.bankAccount.accountHolderName || '',
          branch: response.data.data.bankAccount.branch || ''
        });
      }
    } catch (error) {
      console.error('Error checking existing bank account:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBankSelect = (bank) => {
    setFormData(prev => ({
      ...prev,
      bankName: bank.name,
      bankCode: bank.code
    }));
    
    if (errors.bankName) {
      setErrors(prev => ({ ...prev, bankName: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Vui lòng chọn ngân hàng';
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Số tài khoản là bắt buộc';
    } else if (!/^[0-9]{6,20}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Số tài khoản phải có 6-20 chữ số';
    }

    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Tên chủ tài khoản là bắt buộc';
    } else if (formData.accountHolderName.length < 2) {
      newErrors.accountHolderName = 'Tên chủ tài khoản quá ngắn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/api/withdrawals/bank-account', formData);
      
      // Show success message and redirect
      alert('Thông tin tài khoản ngân hàng đã được lưu thành công! Vui lòng đợi xác minh từ quản trị viên.');
      navigate('/transaction-history');
    } catch (error) {
      console.error('Error saving bank account:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {existingAccount ? 'Cập nhật thông tin ngân hàng' : 'Thêm thông tin ngân hàng'}
            </h1>
            <p className="text-gray-600">
              Vui lòng cung cấp thông tin tài khoản ngân hàng để có thể rút tiền
            </p>
          </div>
        </div>

        {/* Existing Account Status */}
        {existingAccount && (
          <div className={`mb-6 p-4 rounded-lg border ${
            existingAccount.isBankAccountVerified 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center">
              {existingAccount.isBankAccountVerified ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              )}
              <div>
                <p className={`font-medium ${
                  existingAccount.isBankAccountVerified ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {existingAccount.isBankAccountVerified 
                    ? 'Tài khoản ngân hàng đã được xác minh' 
                    : 'Tài khoản ngân hàng đang chờ xác minh'}
                </p>
                <p className={`text-sm ${
                  existingAccount.isBankAccountVerified ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {existingAccount.isBankAccountVerified 
                    ? 'Bạn có thể thực hiện rút tiền' 
                    : 'Quản trị viên sẽ xác minh trong 1-2 ngày làm việc'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bank Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-1" />
                  Ngân hàng *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                  {vietnameseBanks.slice(0, 12).map((bank) => (
                    <button
                      key={bank.code}
                      type="button"
                      onClick={() => handleBankSelect(bank)}
                      className={`p-3 text-sm border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                        formData.bankName === bank.name
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{bank.name}</div>
                      <div className="text-xs text-gray-500">{bank.code}</div>
                    </button>
                  ))}
                </div>
                
                {/* Custom bank input */}
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  placeholder="Hoặc nhập tên ngân hàng khác..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {errors.bankName && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
                )}
              </div>

              {/* Bank Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash className="w-4 h-4 inline mr-1" />
                  Mã ngân hàng (tùy chọn)
                </label>
                <input
                  type="text"
                  name="bankCode"
                  value={formData.bankCode}
                  onChange={handleInputChange}
                  placeholder="VD: VCB, TCB, VTB..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  maxLength="10"
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  Số tài khoản *
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Nhập số tài khoản ngân hàng"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  maxLength="20"
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
                )}
              </div>

              {/* Account Holder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Tên chủ tài khoản *
                </label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ tên chủ tài khoản (theo CMND/CCCD)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  maxLength="100"
                />
                {errors.accountHolderName && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountHolderName}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Tên phải khớp với tên trên thẻ CMND/CCCD của bạn
                </p>
              </div>

              {/* Branch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Chi nhánh (tùy chọn)
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  placeholder="VD: Chi nhánh Hải Châu, Chi nhánh Thanh Khê..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  maxLength="100"
                />
              </div>

              {/* Important Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Lưu ý quan trọng:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Thông tin tài khoản phải chính xác và khớp với giấy tờ tùy thân</li>
                  <li>• Tài khoản ngân hàng phải thuộc về chính chủ tài khoản</li>
                  <li>• Quản trị viên sẽ xác minh thông tin trong 1-2 ngày làm việc</li>
                  <li>• Bạn chỉ có thể rút tiền sau khi tài khoản được xác minh</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Đang lưu...
                    </div>
                  ) : (
                    existingAccount ? 'Cập nhật thông tin' : 'Lưu thông tin'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-medium text-gray-800 mb-3">Cần hỗ trợ?</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Không tìm thấy ngân hàng của bạn? Hãy nhập tên đầy đủ vào ô "Ngân hàng"</p>
            <p>• Không chắc chắn về thông tin? Liên hệ ngân hàng để xác nhận</p>
            <p>• Gặp vấn đề khi lưu? Liên hệ hỗ trợ: support@yourapp.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankAccountSetupPage;