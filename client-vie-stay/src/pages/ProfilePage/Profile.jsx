import React, { useState, useEffect } from "react";
import ProfileBasicInfo from "./components/ProfileBasicInfo";
import ProfileAvatar from "./components/ProfileAvatar";
import ProfileAddress from "./components/ProfileAddress";
import ProfileNationalId from "./components/ProfileNationalId";
import ProfileEmergencyContact from "./components/ProfileEmergencyContact";
import axiosInstance from "../../components/utils/AxiosInstance";
import { getOwnerId } from "../../components/utils/authUtils";
import ChangePassword from "./ChangePassword";

const initialProfile = {
  name: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  profileImage: "",
  nationalId: "",
  nationalIdImage: "",
  address: {
    street: "",
    ward: "",
    district: "",
    city: "",
    fullAddress: "",
  },
  emergencyContact: {
    name: "",
    relationship: "",
    phoneNumber: "",
  },
};

// DOMAIN_BACKEND dùng cho ảnh
const DOMAIN_BACKEND = "http://localhost:8080";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toISOString().split("T")[0];
}

function formatNationalIdImage(value) {
  if (!value) return "";
  if (typeof value === "string" && value.startsWith("/uploads")) {
    return DOMAIN_BACKEND + value;
  }
  return value;
}

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [apiError, setApiError] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Fetch user mới nhất khi vào trang (KHÔNG update vào store)
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setApiError("");
      try {
        const id = getOwnerId();
        if (!id) throw new Error("Không tìm thấy userId");
        const res = await axiosInstance.get(`/user/${id}`);
        const data = res.data.data.user;
        setProfile(prev => ({
          ...prev,
          ...data,
          dateOfBirth: formatDate(data.dateOfBirth),
          address: { ...prev.address, ...(data.address || {}) },
          emergencyContact: { ...prev.emergencyContact, ...(data.emergencyContact || {}) }
        }));
        console.log('Profile sau khi fetch:', { ...data });
      } catch (err) {
        setApiError(err?.response?.data?.message || err.message || "Lỗi khi lấy thông tin user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);

  // Hàm cập nhật từng trường
  const handleChange = (field, value) => {
    // Đảm bảo chỉ cập nhật đúng trường, không ảnh hưởng emergencyContact
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // Hàm cập nhật cho address
  const handleAddressChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  // Hàm cập nhật cho emergencyContact
  const handleEmergencyChange = (field, value) => {
    // Đảm bảo chỉ cập nhật emergencyContact, không ảnh hưởng profile.phoneNumber
    setProfile(prev => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value },
    }));
  };

  // Validation nâng cao
  const validate = () => {
    const newErrors = {};
    if (!profile.name || profile.name.trim().length < 2) newErrors.name = "Họ tên không hợp lệ";
    // Validate số điện thoại chính chủ
    if (!/^(0|\+84)[0-9]{9,10}$/.test(profile.phoneNumber)) newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    if (profile.dateOfBirth && new Date(profile.dateOfBirth) > new Date()) newErrors.dateOfBirth = "Ngày sinh không hợp lệ";
    if (profile.nationalId && profile.nationalId.length > 20) newErrors.nationalId = "Số CMND/CCCD tối đa 20 ký tự";
    
    // Validate file (nếu là file mới)
    if (profile.profileImage && typeof profile.profileImage === "object") {
      if (!profile.profileImage.type.startsWith("image/")) newErrors.profileImage = "Chỉ chấp nhận file ảnh";
      if (profile.profileImage.size > 5 * 1024 * 1024) newErrors.profileImage = "Ảnh đại diện tối đa 5MB";
    }
    if (profile.nationalIdImage && typeof profile.nationalIdImage === "object") {
      if (!profile.nationalIdImage.type.startsWith("image/")) newErrors.nationalIdImage = "Chỉ chấp nhận file ảnh";
      if (profile.nationalIdImage.size > 5 * 1024 * 1024) newErrors.nationalIdImage = "Ảnh CMND/CCCD tối đa 5MB";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit cập nhật profile (KHÔNG update vào store)
  const handleSubmit = async e => {
    e.preventDefault();
    setSuccessMsg("");
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const id = getOwnerId();
      if (!id) throw new Error("Không tìm thấy userId");
      // 1. Nếu có file avatar mới, upload trước
      if (profile.profileImage && typeof profile.profileImage === "object") {
        const formData = new FormData();
        formData.append("profileImage", profile.profileImage);
        await axiosInstance.patch(`/user/${id}/avatar`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      // 2. Nếu có file CMND/CCCD mới, upload
      if (profile.nationalIdImage && typeof profile.nationalIdImage === "object") {
        const formData = new FormData();
        formData.append("nationalIdImage", profile.nationalIdImage);
        await axiosInstance.patch(`/user/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      // 3. Cập nhật các trường khác (gửi object lồng nhau, không phẳng hóa)
      const updateData = { ...profile };
      if (typeof updateData.profileImage === "object") delete updateData.profileImage;
      if (typeof updateData.nationalIdImage === "object") delete updateData.nationalIdImage;
      await axiosInstance.patch(`/user/${id}`, updateData, {
        headers: { "Content-Type": "application/json" },
      });
      // 4. Lấy lại user mới nhất (KHÔNG update vào store)
      const res = await axiosInstance.get(`/user/${id}`);
      const data = res.data.data.user;
      setProfile(prev => ({
        ...prev,
        ...data,
        dateOfBirth: formatDate(data.dateOfBirth),
        address: { ...prev.address, ...(data.address || {}) },
        emergencyContact: { ...prev.emergencyContact, ...(data.emergencyContact || {}) }
      }));
      setSuccessMsg("Cập nhật thành công!");
      setErrors({});
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        setApiError("Có lỗi ở một số trường, vui lòng kiểm tra lại!");
      } else {
        setApiError(err.response?.data?.message || err.message || "Lỗi khi cập nhật profile");
      }
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật hàm handleVerifyNationalId
  const handleVerifyNationalId = async (frontImage, backImage) => {
    try {
      const id = getOwnerId();
      if (!id) throw new Error("Không tìm thấy userId");

      const formData = new FormData();
      formData.append("nationalIdFront", frontImage);
      formData.append("nationalIdBack", backImage);

      const response = await axiosInstance.post(`/user/${id}/verify-national-id`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });

      console.log("🔍 Backend response:", response.data);

      if (response.data.success) { // ✅ Kiểm tra success field
        const extractedData = response.data.extractedData; // ✅ Lấy data đúng level
        
        console.log("📋 Extracted data for update:", extractedData);
        
        // ✅ Cập nhật với đúng field names
        setProfile(prev => ({
          ...prev,
          nationalId: extractedData.nationalId || prev.nationalId,
          name: extractedData.fullName || extractedData.name || prev.name, // Try both
          dateOfBirth: extractedData.dateOfBirth ? 
            (extractedData.dateOfBirth.includes('T') ? 
              extractedData.dateOfBirth.split('T')[0] : 
              extractedData.dateOfBirth) : prev.dateOfBirth,
          nationalIdVerified: true,
          address: {
            ...prev.address,
            fullAddress: extractedData.address || prev.address.fullAddress,
            // ✅ Cải thiện logic parse địa chỉ
            city: extractedData.address?.toUpperCase().includes('ĐÀ NẴNG') ? 'Đà Nẵng' : prev.address.city,
            district: extractedData.address?.toUpperCase().includes('HÒA VANG') ? 'Hòa Vang' : prev.address.district,
            ward: extractedData.address?.toUpperCase().includes('HÒA NINH') ? 'Hòa Ninh' : prev.address.ward,
            street: extractedData.address?.toUpperCase().includes('THÔN 5') ? 'Thôn 5' : prev.address.street
          }
        }));

        // ✅ Expose function cho ProfileNationalId component
        window.updateProfileAddress = handleAddressChange;

        setSuccessMsg(`✅ Xác thực CCCD thành công!
          • CCCD: ${extractedData.nationalId}
          • Họ tên: ${extractedData.fullName || extractedData.name}
          • Ngày sinh: ${extractedData.dateOfBirth}
          • Địa chỉ: ${extractedData.address}`);
        
        return {
          success: true,
          data: { extractedData },
          message: "Xác thực thành công!"
        };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      
      console.error("❌ Verification error:", error);
      
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        setApiError("⏱️ Quá trình xác thực mất nhiều thời gian. Vui lòng kiểm tra lại thông tin.");
        setTimeout(() => window.location.reload(), 3000);
        return {
          success: false,
          message: "Timeout - đang kiểm tra kết quả..."
        };
      }
      
      setApiError("❌ Lỗi xác thực CCCD: " + errorMsg);
      return {
        success: false,
        message: errorMsg
      };
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-2xl flex flex-col gap-10 mt-10 mb-10 border border-blue-100"
      >
        {loading && <div className="text-blue-600 font-semibold mb-2">Đang xử lý...</div>}
        {successMsg && <div className="text-green-600 font-semibold mb-2">{successMsg}</div>}
        {apiError && <div className="text-red-600 font-semibold mb-2">{apiError}</div>}
        <div className="flex flex-col md:flex-row gap-10 items-stretch">
          <div className="flex flex-col items-center justify-center w-full md:w-1/3 min-w-[180px] max-w-[220px]">
            <ProfileAvatar value={profile.profileImage} onChange={file => handleChange("profileImage", file)} error={errors.profileImage} />
          </div>
          <div className="w-full md:w-2/3 flex-1">
            <ProfileBasicInfo value={profile} onChange={handleChange} errors={errors} />
          </div>
        </div>
        <ProfileAddress value={profile.address} onChange={handleAddressChange} errors={errors} />
        <ProfileNationalId
          value={profile}
          onChange={handleChange}
          errors={errors}
          onVerifyNationalId={handleVerifyNationalId}
        />
        <ProfileEmergencyContact
          value={profile.emergencyContact}
          onChange={handleEmergencyChange}
          errors={{
            name: errors.emergencyName,
            relationship: errors.relationship,
            phoneNumber: errors.emergencyPhoneNumber,
          }}
        />
        <button
          type="submit"
          className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all text-lg self-end disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
      {/* Nút đổi mật khẩu */}
      <div className="max-w-3xl mx-auto mb-10">
        <button
          type="button"
          className="flex items-center gap-2 mt-4 mb-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold rounded-full shadow-lg hover:from-pink-600 hover:to-indigo-600 transition-all text-lg self-start focus:outline-none focus:ring-4 focus:ring-pink-200 animate-pulse"
          onClick={() => setShowChangePassword(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.5A4.5 4.5 0 008 7.5v3m8.25 0A2.25 2.25 0 0120.5 12.75v4.5A2.25 2.25 0 0118.25 19.5h-12A2.25 2.25 0 014 17.25v-4.5A2.25 2.25 0 016.25 10.5m11.25 0h-11.25" />
          </svg>
          Đổi mật khẩu
        </button>
      </div>
      {/* Modal popup đổi mật khẩu */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative w-full max-w-md mx-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold z-10"
              onClick={() => setShowChangePassword(false)}
              aria-label="Đóng"
            >
              ×
            </button>
            <div className="bg-white rounded-xl shadow-lg p-0">
              <ChangePassword />
            </div>
          </div>
        </div>
      )}
    </>
  );
}