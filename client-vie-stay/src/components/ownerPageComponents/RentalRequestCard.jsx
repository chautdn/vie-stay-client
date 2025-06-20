import React from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Eye,
  AlertTriangle,
  Building,
  Home
} from 'lucide-react';

const RentalRequestCard = ({ 
  request, 
  accommodationName, 
  roomInfo, 
  onViewDetails 
}) => {

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'accepted':
        return 'Đã chấp nhận';
      case 'rejected':
        return 'Đã từ chối';
      case 'withdrawn':
        return 'Đã rút lại';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'normal':
        return 'text-blue-600';
      case 'low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatPrice = (price) => {
    if (!price) return 'Chưa xác định';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Avatar */}
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            {request.tenantId?.profileImage ? (
              <img 
                src={request.tenantId.profileImage} 
                alt={request.tenantId.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User size={20} className="text-blue-600" />
            )}
          </div>
          
          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-semibold text-gray-900 truncate">
                {request.tenantId?.name || 'Không có tên'}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                {getStatusText(request.status)}
              </span>
              {request.priority && request.priority !== 'normal' && (
                <span className={`flex items-center gap-1 text-xs font-medium ${getPriorityColor(request.priority)}`}>
                  <AlertTriangle size={10} />
                  {request.priority}
                </span>
              )}
            </div>
            
            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Mail size={12} />
                <span className="truncate">{request.tenantId?.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Building size={12} />
                <span className="truncate">{accommodationName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Home size={12} />
                <span className="truncate">{roomInfo.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{formatDate(request.createdAt)}</span>
              </div>
            </div>

            {/* Price and Duration */}
            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className="font-medium text-green-600">
                {formatPrice(request.proposedRent)}/tháng
              </span>
              <span className="text-gray-500">
                {request.guestCount} người
              </span>
              <span className="text-gray-500">
                {formatDate(request.proposedStartDate)}
              </span>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={onViewDetails}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye size={18} />
        </button>
      </div>
    </div>
  );
};

export default RentalRequestCard;