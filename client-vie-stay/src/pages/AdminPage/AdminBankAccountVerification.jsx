import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import { ArrowDownCircle, CheckCircle, XCircle, Search } from "lucide-react";
import { toast } from "react-toastify";

const AdminBankAccountVerification = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch users with unverified bank accounts
  useEffect(() => {
    const fetchUnverifiedBankAccounts = async () => {
      try {
        setLoading(true);
        console.log("Fetching unverified bank accounts...");

        const response = await axiosInstance.get(
          `/api/withdrawals/unverified-bank-accounts?page=${currentPage}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("API Response:", response.data);

        // Check if the response structure is correct
        if (response.data && response.data.data) {
          setUsers(response.data.data.users || []);
          setTotalPages(response.data.data.pagination?.totalPages || 1);
        } else {
          console.error("Unexpected response structure:", response.data);
          setUsers([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching unverified bank accounts:", error);
        console.error("Error response:", error.response?.data);
        toast.error("Lỗi khi tải danh sách tài khoản ngân hàng");
        setLoading(false);
      }
    };

    fetchUnverifiedBankAccounts();
  }, [currentPage]);

  // Handle bank account verification
  const handleVerify = async (userId) => {
    try {
      const response = await axiosInstance.put(
        `/api/withdrawals/verify-bank/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(response.data.message);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi khi xác minh tài khoản"
      );
    }
  };

  // Handle search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bankAccount?.accountNumber.includes(searchTerm)
  );

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Xác Minh Tài Khoản Ngân Hàng
        </h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Đang tải...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Không có tài khoản ngân hàng nào cần xác minh
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Người dùng</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Thông tin ngân hàng</th>
                <th className="px-6 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={
                          user.profileImage ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=6366f1&color=fff`
                        }
                        alt={user.name}
                        className="w-8 h-8 rounded-full mr-3"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=6366f1&color=fff`;
                        }}
                      />
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p>
                        <strong>Ngân hàng:</strong> {user.bankAccount.bankName}
                      </p>
                      <p>
                        <strong>Số tài khoản:</strong>{" "}
                        {user.bankAccount.accountNumber}
                      </p>
                      <p>
                        <strong>Chủ tài khoản:</strong>{" "}
                        {user.bankAccount.accountHolderName}
                      </p>
                      {user.bankAccount.branch && (
                        <p>
                          <strong>Chi nhánh:</strong> {user.bankAccount.branch}
                        </p>
                      )}
                      {user.bankAccount.bankCode && (
                        <p>
                          <strong>Mã ngân hàng:</strong>{" "}
                          {user.bankAccount.bankCode}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleVerify(user._id)}
                      className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Xác minh
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Hiển thị {filteredUsers.length} / {users.length} người dùng
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Trước
                </button>
                <span className="text-sm text-gray-600">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Tiếp
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBankAccountVerification;
