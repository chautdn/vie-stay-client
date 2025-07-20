import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRentalRequestStore } from "../../../store/owner/rentalRequestStore";
import { useAuthStore } from "../../../store/authStore";
import { useCoTenantRequestStore } from "../../../store/owner/co-tenantRequestStore";
import { Calendar, Home, User, MessageCircle, AlertCircle, CheckCircle, XCircle, Clock, Trash2, Wallet } from "lucide-react";
import { formatDate } from "../../../utils/FormatDatePrint";
import SendCotenantRequestModal from "../../../pages/TenantPage/CotenantRequest/SendCotenantRequestModal";

const MyRentalRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    rentalRequests, 
    isLoading, 
    error, 
    getMyRentalRequests,
    withdrawRentalRequest,
    deleteRentalRequest,
    clearError 
  } = useRentalRequestStore();
  const { isLoading: coTenantLoading, error: coTenantError, requestCoTenant } = useCoTenantRequestStore();

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState(""); // "withdraw" or "delete"
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [showCoTenantModal, setShowCoTenantModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  useEffect(() => {
    if (user) {
      getMyRentalRequests();
    }
  }, [user, getMyRentalRequests]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Đang chờ";
      case "accepted":
        return "Đã chấp nhận";
      case "rejected":
        return "Bị từ chối";
      case "withdrawn":
        return "Đã rút lại";
      default:
        return "Không xác định";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "withdrawn":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredRequests = rentalRequests.filter(request => {
    if (selectedStatus === "all") return true;
    return request.status === selectedStatus;
  });

  const handleAction = async (requestId, action) => {
    setSelectedRequestId(requestId);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const handleWithdrawalRequest = (request) => {
    if (request.agreementConfirmationId) {
      navigate(`/withdrawal/request/${request.agreementConfirmationId}`);
    } else {
      alert("Chưa có thông tin agreement confirmation. Vui lòng liên hệ chủ nhà để hoàn tất thủ tục.");
    }
  };

  const handleOpenCoTenantModal = (roomId) => {
    setSelectedRoomId(roomId);
    setShowCoTenantModal(true);
  };

  const handleCloseCoTenantModal = () => {
    setShowCoTenantModal(false);
    setSelectedRoomId(null);
  };

  const handleSubmitCoTenant = async ({ name, phoneNumber, imageCCCD }) => {
    try {
      await requestCoTenant({ roomId: selectedRoomId, name, phoneNumber, imageCCCD });
      handleCloseCoTenantModal();
      alert("Yêu cầu thêm người ở cùng đã được gửi thành công!");
    } catch (error) {
      console.error("Failed to send co-tenant request:", error);
    }
  };

  const confirmAction = async () => {
    try {
      if (actionType === "withdraw") {
        await withdrawRentalRequest(selectedRequestId);
      } else if (actionType === "delete") {
        await deleteRentalRequest(selectedRequestId);
      }
      setShowConfirmDialog(false);
      setSelectedRequestId(null);
      setActionType("");
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const cancelAction = () => {
    setShowConfirmDialog(false);
    setSelectedRequestId(null);
    setActionType("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Yêu cầu thuê phòng của tôi
        </h1>
        <p className="text-gray-600">
          Quản lý tất cả yêu cầu thuê phòng bạn đã gửi
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
          <button
            onClick={clearError}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Đóng
          </button>
        </div>
      )}

      {coTenantError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{coTenantError}</span>
          </div>
        </div>
      )}

      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          {[
            { key: "all", label: "Tất cả", count: rentalRequests.length },
            { key: "pending", label: "Đang chờ", count: rentalRequests.filter(r => r.status === "pending").length },
            { key: "accepted", label: "Đã chấp nhận", count: rentalRequests.filter(r => r.status === "accepted").length },
            { key: "rejected", label: "Bị từ chối", count: rentalRequests.filter(r => r.status === "rejected").length },
            { key: "withdrawn", label: "Đã rút lại", count: rentalRequests.filter(r => r.status === "withdrawn").length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedStatus === tab.key
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedStatus === "all" ? "Chưa có yêu cầu nào" : `Không có yêu cầu ${getStatusText(selectedStatus).toLowerCase()}`}
          </h3>
          <p className="text-gray-500">
            {selectedStatus === "all" 
              ? "Bạn chưa gửi yêu cầu thuê phòng nào." 
              : `Hiện tại bạn không có yêu cầu nào ${getStatusText(selectedStatus).toLowerCase()}.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {getStatusText(request.status)}
                    </div>
                    <span className="text-sm text-gray-500">
                      Gửi lúc: {formatDate(request.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    {request.status === "accepted" && (
                      <button
                        onClick={() => handleWithdrawalRequest(request)}
                        className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center gap-1"
                        title="Yêu cầu rút tiền cọc"
                      >
                        <Wallet className="w-3 h-3" />
                        Rút tiền
                      </button>
                    )}
                    
                    {request.status === "pending" && (
                      <button
                        onClick={() => handleAction(request._id, "withdraw")}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        Rút lại
                      </button>
                    )}
                    
                    {(request.status === "rejected" || request.status === "withdrawn") && (
                      <button
                        onClick={() => handleAction(request._id, "delete")}
                        className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Xóa
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {request.roomId?.name || "Phòng không xác định"}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        <span>{request.accommodationId?.address.fullAddress || "Địa chỉ không xác định"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Chủ nhà: {request.landlordId?.name || "Không xác định"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Ngày bắt đầu: {formatDate(request.proposedStartDate)}</span>
                      </div>
                      {request.proposedEndDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Ngày kết thúc: {formatDate(request.proposedEndDate)}</span>
                        </div>
                      )}
                     
                      {request.roomId?.capacity >= 2 && (
                        <button
                          className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                          onClick={() => handleOpenCoTenantModal(request.roomId._id)}
                        >
                          Gửi yêu cầu thêm người ở cùng
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tin nhắn</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <MessageCircle className="w-4 h-4 text-gray-500 mt-0.5" />
                        <p className="text-sm text-gray-700">
                          {request.message || "Không có tin nhắn"}
                        </p>
                      </div>
                    </div>
                    
                    {request.responseMessage && (
                      <div className="mt-3 bg-blue-50 rounded-lg p-3">
                        <h5 className="font-medium text-blue-900 mb-1">Phản hồi từ chủ nhà:</h5>
                        <p className="text-sm text-blue-800">{request.responseMessage}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {formatDate(request.respondedAt)}
                        </p>
                      </div>
                    )}

                    {request.status === "accepted" && (
                      <div className="mt-3 bg-green-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Wallet className="w-4 h-4 text-green-600" />
                          <h5 className="font-medium text-green-900">Thông tin rút tiền</h5>
                        </div>
                        <p className="text-sm text-green-800">
                          Bạn có thể tạo yêu cầu rút tiền cọc sau khi hoàn tất thủ tục thuê phòng.
                        </p>
                        {request.agreementConfirmationId && (
                          <p className="text-xs text-green-600 mt-1">
                            Mã xác nhận: {request.agreementConfirmationId}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {actionType === "withdraw" ? "Rút lại yêu cầu" : "Xóa yêu cầu"}
            </h3>
            <p className="text-gray-600 mb-6">
              {actionType === "withdraw" 
                ? "Bạn có chắc chắn muốn rút lại yêu cầu thuê phòng này không?"
                : "Bạn có chắc chắn muốn xóa yêu cầu thuê phòng này không? Hành động này không thể hoàn tác."
              }
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelAction}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  actionType === "withdraw" 
                    ? "bg-yellow-500 hover:bg-yellow-600" 
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {actionType === "withdraw" ? "Rút lại" : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCoTenantModal && (
        <SendCotenantRequestModal
          roomId={selectedRoomId}
          onClose={handleCloseCoTenantModal}
          onSubmit={handleSubmitCoTenant}
          isLoading={coTenantLoading}
        />
      )}
    </div>
  );
};

export default MyRentalRequest;