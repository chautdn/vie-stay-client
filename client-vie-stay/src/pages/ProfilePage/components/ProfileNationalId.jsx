import React, { useState } from "react";

export default function ProfileNationalId({ 
  value, 
  onChange, 
  errors, 
  onVerifyNationalId 
}) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = async () => {
    if (!frontImage || !backImage) {
      alert("Vui lòng upload cả mặt trước và mặt sau của CCCD/CMND");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const result = await onVerifyNationalId(frontImage, backImage);
      setVerificationResult(result);
      
      // Sử dụng đúng field names
      if (result.success && result.data) {
        const extractedData = result.data.extractedData;
        
        console.log("📋 Extracted data:", extractedData);
        
        // Sửa field mapping
        onChange("nationalId", extractedData.nationalId || "");
        onChange("name", extractedData.fullName || extractedData.name || ""); // Try both
        
        // Format date properly
        if (extractedData.dateOfBirth) {
          const formattedDate = extractedData.dateOfBirth.includes('T') 
            ? extractedData.dateOfBirth.split('T')[0] 
            : extractedData.dateOfBirth;
          onChange("dateOfBirth", formattedDate);
        }
        
        // Cập nhật địa chỉ đúng cách
        if (extractedData.address) {
          // Gọi parent component để update address
          if (window.updateProfileAddress) {
            window.updateProfileAddress("fullAddress", extractedData.address);
          }
        }
      }
      
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult({
        success: false,
        message: error.message || "Lỗi khi xác thực CCCD"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Xác thực CCCD/CMND
        </h3>
        <p className="text-sm text-gray-600">
          Upload cả mặt trước và mặt sau để tự động xác thực thông tin
        </p>
      </div>

      {/* Upload ảnh mặt trước */}
      <div className="space-y-3">
        <label className="font-medium text-gray-700 flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          Mặt trước CCCD/CMND
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setFrontImage(e.target.files[0])}
          className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {frontImage && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(frontImage)}
              alt="CCCD mặt trước"
              className="w-64 h-40 object-cover border-2 border-blue-200 rounded-lg shadow"
            />
          </div>
        )}
      </div>

      {/* Upload ảnh mặt sau */}
      <div className="space-y-3">
        <label className="font-medium text-gray-700 flex items-center gap-2">
          <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
          Mặt sau CCCD/CMND
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setBackImage(e.target.files[0])}
          className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
        {backImage && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(backImage)}
              alt="CCCD mặt sau"
              className="w-64 h-40 object-cover border-2 border-purple-200 rounded-lg shadow"
            />
          </div>
        )}
      </div>

      {/* Nút xác thực */}
      <button
        type="button"
        onClick={handleVerify}
        disabled={isVerifying || !frontImage || !backImage}
        className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isVerifying ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Đang xác thực...
          </div>
        ) : (
          "🔍 Xác thực CCCD/CMND"
        )}
      </button>

      {/* Kết quả xác thực */}
      {verificationResult && (
        <div className={`p-4 rounded-lg border ${
          verificationResult.success 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {verificationResult.success ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-semibold">
              {verificationResult.success ? "Xác thực thành công!" : "Xác thực thất bại"}
            </span>
          </div>
          <p className="text-sm">{verificationResult.message}</p>
          
          {/* Hiển thị thông tin đã trích xuất */}
          {verificationResult.success && verificationResult.data?.extractedData && (
            <div className="mt-3 space-y-1 text-sm">
              <p><strong>Số CCCD:</strong> {verificationResult.data.extractedData.nationalId}</p>
              <p><strong>Họ tên:</strong> {verificationResult.data.extractedData.name}</p>
              <p><strong>Ngày sinh:</strong> {verificationResult.data.extractedData.dateOfBirth}</p>
              {verificationResult.data.extractedData.address && (
                <p><strong>Địa chỉ:</strong> {verificationResult.data.extractedData.address}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Hiển thị thông tin hiện tại */}
      {value.nationalId && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Thông tin hiện tại:</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Số CCCD:</strong> {value.nationalId}</p>
            {value.nationalIdVerified && (
              <div className="flex items-center gap-1 text-green-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Đã xác thực</span>
              </div>
            )}
          </div>
        </div>
      )}

      {errors.nationalId && (
        <div className="text-red-500 text-sm">{errors.nationalId}</div>
      )}
    </div>
  );
}
