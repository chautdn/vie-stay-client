// pages/TopUpCancel.js
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const TopUpCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const orderCode = searchParams.get('orderCode');
    
    if (orderCode) {
      toast.error("Giao dịch đã bị hủy.");
    } else {
      toast.error("Giao dịch không thành công.");
    }
    
    setTimeout(() => navigate("/home"), 2000);
  }, [navigate, searchParams]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-lg text-red-600 font-medium">Giao dịch không thành công</p>
        <p className="text-sm text-gray-500 mt-2">Đang chuyển hướng về trang chủ...</p>
      </div>
    </div>
  );
};

export default TopUpCancel;