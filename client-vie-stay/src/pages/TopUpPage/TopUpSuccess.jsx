// pages/TopUpPage/TopUpSuccess.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/authStore";
import axiosInstance from "../../utils/AxiosInstance";

const TopUpSuccess = () => {
  const navigate = useNavigate();
  const { user, updateWalletBalance } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentResult, setPaymentResult] = useState(null);
  
  // 🔥 Prevent duplicate API calls
  const hasProcessed = useRef(false);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const processPayment = async () => {
      const orderCode = searchParams.get('orderCode');
      
      // 🔥 Prevent duplicate processing
      if (hasProcessed.current || isProcessingRef.current || !orderCode) {
        if (!orderCode) {
          toast.error("Không tìm thấy mã giao dịch");
          setIsProcessing(false);
          setTimeout(() => navigate("/"), 2000);
        }
        return;
      }

      // Mark as processing
      isProcessingRef.current = true;
      hasProcessed.current = true;

      try {
        console.log("🔄 Processing payment for orderCode:", orderCode);

        // Call manual processing endpoint
        const response = await axiosInstance.post("/api/payment/process-payment", {
          orderCode: orderCode
        });

        console.log("✅ Payment processing response:", response.data);

        // Update user balance using the new method
        if (response.data.wallet?.balance !== undefined) {
          updateWalletBalance(response.data.wallet.balance);
        }

        setPaymentResult(response.data);
        toast.success(
          `Nạp tiền thành công! Số dư mới: ${response.data.wallet.balance.toLocaleString('vi-VN')}₫`
        );
        setIsProcessing(false);
        
        // Redirect after 3 seconds
        setTimeout(() => navigate("/"), 3000);
        
      } catch (error) {
        console.error("❌ Error processing payment:", error);
        
        if (error.response?.status === 400 && error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else if (error.response?.status === 404) {
          toast.error("Không tìm thấy giao dịch");
        } else if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Có lỗi xảy ra khi xử lý giao dịch");
        }
        
        setIsProcessing(false);
        setTimeout(() => navigate("/"), 2000);
      } finally {
        isProcessingRef.current = false;
      }
    };

    // Small delay to ensure component is fully mounted
    const timer = setTimeout(processPayment, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []); // 🔥 Empty dependency array to run only once

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 mb-2">Đang xử lý giao dịch...</p>
            <p className="text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg text-green-600 font-medium mb-2">Nạp tiền thành công!</p>
            {paymentResult && (
              <div className="text-sm text-gray-600 mb-4 space-y-1">
                <p>Số tiền: <span className="font-medium text-green-600">{paymentResult.transaction.amount.toLocaleString('vi-VN')}₫</span></p>
                <p>Số dư mới: <span className="font-medium text-blue-600">{paymentResult.wallet.balance.toLocaleString('vi-VN')}₫</span></p>
              </div>
            )}
            <p className="text-sm text-gray-500">Đang chuyển hướng về trang chủ...</p>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-1 mt-4">
              <div className="bg-green-600 h-1 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopUpSuccess;