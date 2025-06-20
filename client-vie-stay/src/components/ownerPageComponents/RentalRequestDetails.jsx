import React, { useState } from 'react';
import RentalRequestDetailsHeader from './rentalRequestComponent/RentalRequestDetailsHeader';
import RentalRequestPriorityInfo from './rentalRequestComponent/RentalRequestPriorityInfo';
import TenantInformation from './rentalRequestComponent/TenantInformation';
import PropertyInformation from './rentalRequestComponent/PropertyInformation';
import RentalDetailsInfo from './rentalRequestComponent/RentalDetailsInfo';
import RentalRequestMessages from './rentalRequestComponent/RentalRequestMessages';
import RentalRequestActions from './rentalRequestComponent/RentalRequestActions';
import AcceptRentalModal from './rentalRequestComponent/AcceptRentalModal';
import RejectRentalModal from './rentalRequestComponent/RejectRentalModal';

const RentalRequestDetails = ({ request, onClose, onAccept, onReject }) => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [acceptData, setAcceptData] = useState({
    startDate: '',
    endDate: '',
    monthlyRent: '',
    deposit: '',
    notes: ''
  });

  if (!request) return null;

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'Khẩn cấp';
      case 'high':
        return 'Cao';
      case 'normal':
        return 'Bình thường';
      case 'low':
        return 'Thấp';
      default:
        return 'Bình thường';
    }
  };

  const calculateStayDuration = () => {
    if (request.proposedStartDate && request.proposedEndDate) {
      const start = new Date(request.proposedStartDate);
      const end = new Date(request.proposedEndDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffMonths = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      
      if (diffMonths > 0) {
        return `${diffMonths} tháng${remainingDays > 0 ? ` ${remainingDays} ngày` : ''}`;
      }
      return `${diffDays} ngày`;
    }
    return 'Không xác định';
  };

  // Handlers
  const handleAccept = () => {
    const data = {
      responseMessage,
      ...acceptData
    };
    onAccept(request._id, data);
    setShowAcceptModal(false);
    resetForm();
  };

  const handleReject = () => {
    onReject(request._id, responseMessage);
    setShowRejectModal(false);
    resetForm();
  };

  const resetForm = () => {
    setResponseMessage('');
    setAcceptData({
      startDate: '',
      endDate: '',
      monthlyRent: '',
      deposit: '',
      notes: ''
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <RentalRequestDetailsHeader 
            request={request}
            onClose={onClose}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />

          <div className="p-6 space-y-6">
            
            {/* Priority & Timestamps */}
            <RentalRequestPriorityInfo 
              request={request}
              formatDate={formatDate}
              getPriorityColor={getPriorityColor}
              getPriorityText={getPriorityText}
            />

            {/* Tenant Information */}
            <TenantInformation tenant={request.tenantId} />

            {/* Room & Accommodation Information */}
            <PropertyInformation 
              room={request.roomId}
              formatPrice={formatPrice}
            />

            {/* Rental Request Details */}
            <RentalDetailsInfo 
              request={request}
              formatPrice={formatPrice}
              calculateStayDuration={calculateStayDuration}
            />

            {/* Messages */}
            <RentalRequestMessages 
              request={request}
              formatDate={formatDate}
            />

            {/* Action Buttons */}
            <RentalRequestActions 
              request={request}
              onShowAcceptModal={() => setShowAcceptModal(true)}
              onShowRejectModal={() => setShowRejectModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Accept Modal */}
      <AcceptRentalModal 
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        responseMessage={responseMessage}
        setResponseMessage={setResponseMessage}
        acceptData={acceptData}
        setAcceptData={setAcceptData}
        onAccept={handleAccept}
        request={request}
      />

      {/* Reject Modal */}
      <RejectRentalModal 
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        responseMessage={responseMessage}
        setResponseMessage={setResponseMessage}
        onReject={handleReject}
      />
    </>
  );
};

export default RentalRequestDetails;