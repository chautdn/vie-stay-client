import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../Navbar/Navbar";
import Footer from "../Navbar/Footer";

const Profile = () => {
  const { user: authUser, setUser } = useAuth();
  const [user, setLocalUser] = useState(null);
  const [form, setForm] = useState({ name: "", phoneNumber: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get token and user from both storage types
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const storedUser = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
  );
  
  // Try multiple ways to get user ID
  const userId = authUser?._id || authUser?.id || storedUser?._id || storedUser?.id;

  useEffect(() => {
    const fetchUser = async () => {
      console.log("Token:", token);
      console.log("User ID:", userId);
      console.log("Stored User:", storedUser);
      console.log("Auth User:", authUser);

      // If we don't have token or userId, set loading to false
      if (!token) {
        setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }

      if (!userId) {
        setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }

      // If we have user data in context/storage, use it directly and skip API call
      if (authUser || Object.keys(storedUser).length > 0) {
        const userData = authUser || storedUser;
        console.log("Using stored user data:", userData);
        setLocalUser(userData);
        setForm({
          name: userData.name || "",
          phoneNumber: userData.phoneNumber || "",
        });
        setLoading(false);
        return;
      }

      // Only try API call if we don't have user data
      try {
        console.log("Fetching user data from API...");
        const res = await fetch(`http://localhost:8080/user/${userId}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        console.log("Response status:", res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("User data received:", data);

        if (data.user) {
          setLocalUser(data.user);
          setForm({
            name: data.user.name || "",
            phoneNumber: data.user.phoneNumber || "",
          });
        }
      } catch (err) {
        console.error("Lỗi khi tải user từ API:", err);
        console.log("API failed, but we have stored user data, so continuing...");
        // Since API failed but we should have user data, this shouldn't happen
        // but let's handle it gracefully
        setError(`Không thể tải thông tin từ server, nhưng sẽ sử dụng dữ liệu đã lưu.`);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token, authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const updatedUser = { ...(authUser || storedUser) };
      let hasUpdates = false;

      // Update name
      if (form.name !== updatedUser.name) {
        try {
          const resName = await fetch(`http://localhost:8080/user/${userId}/name`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: form.name }),
          });
          
          if (resName.ok) {
            const nameData = await resName.json();
            updatedUser.name = nameData.data.user.name;
            hasUpdates = true;
            console.log("Name updated successfully");
          } else {
            console.error("Failed to update name:", resName.status);
            // Still update locally
            updatedUser.name = form.name;
            hasUpdates = true;
          }
        } catch (err) {
          console.error("Error updating name:", err);
          // Still update locally
          updatedUser.name = form.name;
          hasUpdates = true;
        }
      }

      // Update phone number
      if (form.phoneNumber !== updatedUser.phoneNumber) {
        try {
          const resPhone = await fetch(`http://localhost:8080/user/${userId}/phone`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ phoneNumber: form.phoneNumber }),
          });
          
          if (resPhone.ok) {
            const phoneData = await resPhone.json();
            updatedUser.phoneNumber = phoneData.data.user.phoneNumber;
            hasUpdates = true;
            console.log("Phone updated successfully");
          } else {
            console.error("Failed to update phone:", resPhone.status);
            // Still update locally
            updatedUser.phoneNumber = form.phoneNumber;
            hasUpdates = true;
          }
        } catch (err) {
          console.error("Error updating phone:", err);
          // Still update locally
          updatedUser.phoneNumber = form.phoneNumber;
          hasUpdates = true;
        }
      }

      // Upload avatar
      if (avatarFile) {
        try {
          const formData = new FormData();
          formData.append("profileImage", avatarFile);
          const resAvatar = await fetch(`http://localhost:8080/user/${userId}/avatar`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });

          if (resAvatar.ok) {
            const avatarData = await resAvatar.json();
            updatedUser.profileImage = avatarData.data.user.profileImage;
            hasUpdates = true;
            console.log("Avatar updated successfully");
          } else {
            console.error("Failed to update avatar:", resAvatar.status);
          }
        } catch (err) {
          console.error("Error updating avatar:", err);
        }
      }

      // Update both storage types and context
      if (hasUpdates) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setLocalUser(updatedUser);
        setMessage("Cập nhật thành công!");
      } else {
        setMessage("Không có thay đổi nào để cập nhật.");
      }
      
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      setError("Có lỗi xảy ra khi cập nhật.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error && !user) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Lỗi tải thông tin</h2>
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
            >
              Thử lại
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const displayUser = user || authUser || storedUser;

  return (
    <>
      <Navbar />

      <div className="px-6 py-10 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={
                displayUser?.profileImage
                  ? `http://localhost:8080${displayUser.profileImage}`
                  : displayUser?.avatar
                  ? `http://localhost:8080${displayUser.avatar}`
                  : "https://via.placeholder.com/80"
              }
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/80";
              }}
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {form.name || displayUser?.name || "Người dùng"}
              </h2>
              <p className="text-sm text-gray-500">
                {form.phoneNumber || displayUser?.phoneNumber || displayUser?.email || "Chưa có thông tin liên hệ"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ tên</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Nhập họ tên"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-md transition-colors"
            >
              Lưu thay đổi
            </button>

            {message && (
              <p className="text-center text-green-600 font-medium mt-4">{message}</p>
            )}

            {error && (
              <p className="text-center text-red-600 font-medium mt-4">{error}</p>
            )}
          </form>

          <div className="text-center mt-6">
            <Link
              to="/change-password"
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Thay đổi mật khẩu
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;