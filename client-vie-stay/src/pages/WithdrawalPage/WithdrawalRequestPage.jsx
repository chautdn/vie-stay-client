import React, { useState, useEffect } from "react";
import {
  ArrowDownCircle,
  CreditCard,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  DollarSign,
  Clock,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/AxiosInstance";

const WithdrawalRequestPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const MIN_WITHDRAWAL = 50000; // 50,000 VND
  const MAX_WITHDRAWAL = 10000000; // 10,000,000 VND

  useEffect(() => {
    checkEligibility();
  }, []);

  const checkEligibility = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        "/api/withdrawals/check-eligibility"
      );
      console.log("Full eligibility response:", response.data); // 🔍 Add this debug log
      setEligibilityData(response.data.data);
    } catch (error) {
      console.error("Error checking eligibility:", error);
      alert("Có lỗi xảy ra khi kiểm tra thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setWithdrawalAmount(value);

    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const validateAmount = () => {
    const amount = parseInt(withdrawalAmount);
    const newErrors = {};

    if (!withdrawalAmount) {
      newErrors.amount = "Vui lòng nhập số tiền rút";
    } else if (amount < MIN_WITHDRAWAL) {
      newErrors.amount = `Số tiền rút tối thiểu là ${MIN_WITHDRAWAL.toLocaleString("vi-VN")}₫`;
    } else if (amount > MAX_WITHDRAWAL) {
      newErrors.amount = `Số tiền rút tối đa là ${MAX_WITHDRAWAL.toLocaleString("vi-VN")}₫`;
    } else if (amount > eligibilityData?.walletBalance) {
      newErrors.amount = "Số tiền rút vượt quá số dư ví";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateAmount()) {
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmWithdrawal = async () => {
    try {
      setLoading(true);
      const amount = parseInt(withdrawalAmount);

      await axiosInstance.post("/api/withdrawals/request", { amount });

      alert(
        "Yêu cầu rút tiền đã được gửi thành công! Vui lòng kiểm tra email để xem thông tin chi tiết."
      );
      navigate("/withdrawal/history");
    } catch (error) {
      console.error("Error creating withdrawal request:", error);

      if (error.response?.data?.code === "BANK_ACCOUNT_REQUIRED") {
        alert("Bạn cần thêm thông tin ngân hàng trước khi rút tiền");
        navigate("/bank-account-setup");
      } else if (error.response?.data?.code === "BANK_ACCOUNT_NOT_VERIFIED") {
        alert(
          "Tài khoản ngân hàng của bạn chưa được xác minh. Vui lòng đợi xác minh từ quản trị viên."
        );
      } else if (error.response?.data?.code === "INSUFFICIENT_BALANCE") {
        alert("Số dư ví không đủ để thực hiện giao dịch");
      } else {
        alert(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi tạo yêu cầu rút tiền"
        );
      }
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  if (loading && !eligibilityData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra thông tin...</p>
        </div>
      </div>
    );
  }

  // Redirect to bank account setup if no bank account
  if (eligibilityData && !eligibilityData.hasBankAccountData) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <CreditCard className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Cần thêm thông tin ngân hàng
            </h2>
            <p className="text-gray-600 mb-6">
              Để có thể rút tiền, bạn cần cung cấp thông tin tài khoản ngân hàng
            </p>
            <button
              onClick={() => navigate("/bank-account-setup")}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Thêm thông tin ngân hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              Rút tiền từ ví
            </h1>
            <p className="text-gray-600">
              Rút tiền về tài khoản ngân hàng của bạn
            </p>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-white p-6 mb-6">
          <div className="text-center">
            <p className="text-orange-100 mb-2">Số dư ví hiện tại</p>
            <p className="text-3xl font-bold">
              {eligibilityData?.walletBalance?.toLocaleString("vi-VN")}₫
            </p>
          </div>
        </div>

        {/* Bank Account Status */}
        {eligibilityData?.bankAccount && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              eligibilityData.isVerified
                ? "bg-green-50 border-green-200"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <div className="flex items-start">
              {eligibilityData.isVerified ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3
                      className={`font-medium ${
                        eligibilityData.isVerified
                          ? "text-green-800"
                          : "text-yellow-800"
                      }`}
                    >
                      {eligibilityData.bankAccount.bankName}
                    </h3>
                    <p
                      className={`text-sm ${
                        eligibilityData.isVerified
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {eligibilityData.bankAccount.accountNumber} -{" "}
                      {eligibilityData.bankAccount.accountHolderName}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/bank-account-setup")}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Chỉnh sửa
                  </button>
                </div>

                <p
                  className={`text-sm ${
                    eligibilityData.isVerified
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {eligibilityData.isVerified
                    ? "✓ Tài khoản đã được xác minh - Có thể rút tiền"
                    : "⏳ Đang chờ xác minh - Chưa thể rút tiền"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Withdrawal Form */}
        {eligibilityData?.canWithdraw ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Số tiền rút *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={
                        withdrawalAmount
                          ? parseInt(withdrawalAmount).toLocaleString("vi-VN")
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setWithdrawalAmount(value);
                        if (errors.amount) {
                          setErrors((prev) => ({ ...prev, amount: "" }));
                        }
                      }}
                      placeholder="Nhập số tiền muốn rút"
                      className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-medium"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₫
                    </span>
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}

                  {/* Quick Amount Buttons */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[100000, 500000, 1000000, 2000000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setWithdrawalAmount(amount.toString())}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={amount > eligibilityData.walletBalance}
                      >
                        {amount.toLocaleString("vi-VN")}₫
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setWithdrawalAmount(
                          eligibilityData.walletBalance.toString()
                        )
                      }
                      className="px-3 py-1 text-sm border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                      Tất cả
                    </button>
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    Số tiền tối thiểu: {MIN_WITHDRAWAL.toLocaleString("vi-VN")}₫
                    | Số tiền tối đa: {MAX_WITHDRAWAL.toLocaleString("vi-VN")}₫
                  </div>
                </div>

                {/* Withdrawal Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">
                        Thời gian xử lý
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>
                          • Yêu cầu sẽ được xét duyệt trong 1-2 ngày làm việc
                        </li>
                        <li>
                          • Sau khi được phê duyệt, tiền sẽ được chuyển trong 7
                          ngày làm việc
                        </li>
                        <li>
                          • Bạn sẽ nhận email thông báo về trạng thái xử lý
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        Bảo mật và lưu ý
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>
                          • Tiền chỉ được chuyển về tài khoản ngân hàng đã xác
                          minh
                        </li>
                        <li>
                          • Không thể hủy yêu cầu sau khi đã được phê duyệt
                        </li>
                        <li>
                          • Liên hệ hỗ trợ nếu có thắc mắc: support@yourapp.com
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/transaction-history")}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowDownCircle className="w-5 h-5 inline mr-2" />
                    Tạo yêu cầu rút tiền
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          // Cannot withdraw message
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Chưa thể rút tiền
            </h2>
            <p className="text-gray-600 mb-6">
              {!eligibilityData?.isVerified
                ? "Tài khoản ngân hàng chưa được xác minh. Vui lòng đợi xác minh từ quản trị viên."
                : "Bạn chưa đủ điều kiện để rút tiền."}
            </p>
            <button
              onClick={() => navigate("/transaction-history")}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Quay lại lịch sử giao dịch
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Xác nhận yêu cầu rút tiền
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Số tiền rút:</span>
                <span className="font-medium text-orange-600">
                  {parseInt(withdrawalAmount).toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tài khoản nhận:</span>
                <span className="font-medium">
                  {eligibilityData?.bankAccount?.accountNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngân hàng:</span>
                <span className="font-medium">
                  {eligibilityData?.bankAccount?.bankName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Chủ tài khoản:</span>
                <span className="font-medium">
                  {eligibilityData?.bankAccount?.accountHolderName}
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-yellow-800">
                ⚠️ Sau khi xác nhận, yêu cầu sẽ được gửi để xét duyệt và không
                thể hủy bỏ.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmWithdrawal}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  "Xác nhận rút tiền"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalRequestPage;
