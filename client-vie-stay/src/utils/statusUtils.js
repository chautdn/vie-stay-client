export const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusColor = (status) => {
  const statusColors = {
    pending: {
      color: "text-yellow-800",
      bg: "bg-yellow-100",
    },
    accepted: {
      color: "text-green-800",
      bg: "bg-green-100",
    },
    rejected: {
      color: "text-red-800",
      bg: "bg-red-100",
    },
    withdrawn: {
      color: "text-gray-800",
      bg: "bg-gray-100",
    },
  };

  return statusColors[status] || statusColors.pending;
};

export const getStatusText = (status) => {
  const statusTexts = {
    pending: "Chờ xử lý",
    accepted: "Đã chấp nhận",
    rejected: "Đã từ chối",
    withdrawn: "Đã rút lại",
  };

  return statusTexts[status] || status;
};
