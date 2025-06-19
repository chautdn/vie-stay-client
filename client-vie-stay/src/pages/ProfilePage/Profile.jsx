import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", phoneNumber: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");
  const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId = storedUser?._id || storedUser?.id;

  // Load user info
  useEffect(() => {
    const fetchUser = async () => {
      if (!token || !userId) return;
      try {
        const res = await fetch(`http://localhost:8080/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data.user);
        setForm({
          name: data.user.name || "",
          phoneNumber: data.user.phoneNumber || "",
        });
      } catch (err) {
        console.error("Lỗi khi tải user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update name
      await fetch(`http://localhost:8080/user/${userId}/name`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: form.name }),
      });

      // Update phone number
      await fetch(`http://localhost:8080/user/${userId}/phone`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phoneNumber: form.phoneNumber }),
      });

      // Upload avatar
      if (avatarFile) {
        const formData = new FormData();
        formData.append("profileImage", avatarFile);
        await fetch(`http://localhost:8080/user/${userId}/avatar`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      setMessage("Cập nhật thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      setMessage("Có lỗi xảy ra khi cập nhật.");
    }
  };

  if (loading) return <p className="text-center mt-10">Đang tải thông tin...</p>;

  return (
    <div className="px-6 py-10 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={
              user?.profileImage
                ? `http://localhost:8080${user.profileImage}`
                : "https://via.placeholder.com/80"
            }
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-800">{form.name}</h2>
            <p className="text-sm text-gray-500">{form.phoneNumber}</p>
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
              className="mt-1 w-full border px-4 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="mt-1 w-full border px-4 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mt-1 block w-full text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-md"
          >
            Lưu thay đổi
          </button>

          {message && (
            <p className="text-center text-green-600 font-medium mt-4">{message}</p>
          )}
        </form>

        {/* Link đổi mật khẩu */}
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
  );
};

export default Profile;
