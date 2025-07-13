import React, { useState } from 'react';
import RentalRequestCard from './RentalRequestCard';
import RentalRequestDetails from './RentalRequestDetails';
import AcceptRequestModal from './AcceptRequestModal';
import RejectRequestModal from './RejectRequestModal';
import { Users } from 'lucide-react';

const RentalRequestList = ({ 
  requests, 
  isLoading, 
  onAccept, 
  onReject, 
  onDelete, 
  onViewDetails,
  getAccommodationName,
  getRoomInfo
}) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleViewDetails = async (requestId) => {
    try {
      const details = await onViewDetails(requestId);
      setSelectedRequest(details.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Failed to load request details:', error);
    }
  };

  const handleAcceptRequest = (requestId) => {
    const request = requests.find(r => r._id === requestId);
    setSelectedRequest(request);
    setShowAcceptModal(true);
  };

  const handleRejectRequest = (requestId) => {
    const request = requests.find(r => r._id === requestId);
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const handleConfirmAccept = async (acceptData) => {
    if (!selectedRequest) return;
    
    setActionLoading(true);
    try {
      await onAccept(selectedRequest._id, acceptData);
      setShowAcceptModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Failed to accept request:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async (responseMessage) => {
    if (!selectedRequest) return;
    
    setActionLoading(true);
    try {
      await onReject(selectedRequest._id, responseMessage);
      setShowRejectModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Failed to reject request:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const closeModals = () => {
    setShowDetailsModal(false);
    setShowAcceptModal(false);
    setShowRejectModal(false);
    setSelectedRequest(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="grid grid-cols-12 gap-4 py-4">
                  <div className="col-span-1">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                  <div className="col-span-1">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                  <div className="col-span-1">
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="col-span-1">
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có yêu cầu thuê nhà
          </h3>
          <p className="text-gray-500">
            Chưa có yêu cầu thuê nhà nào được gửi đến bạn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
            <div className="col-span-1">STT</div>
            <div className="col-span-2">Người thuê</div>
            <div className="col-span-2">Tòa nhà</div>
            <div className="col-span-1">Phòng</div>
            <div className="col-span-2">Thời gian</div>
            <div className="col-span-1">Giá đề xuất</div>
            <div className="col-span-1">Trạng thái</div>
            <div className="col-span-2">Thao tác</div>
          </div>
        </div>

        {/* Requests */}
        <div className="divide-y divide-gray-100">
          {requests.map((request, index) => (
            <RentalRequestCard
              key={request._id}
              request={request}
              index={index}
              accommodationName={getAccommodationName(request.accommodationId)}
              roomInfo={getRoomInfo(request.roomId)}
              onViewDetails={handleViewDetails}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <RentalRequestDetails
        isOpen={showDetailsModal}
        onClose={closeModals}
        request={selectedRequest}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
      />

      <AcceptRequestModal
        isOpen={showAcceptModal}
        onClose={closeModals}
        onConfirm={handleConfirmAccept}
        request={selectedRequest}
        isLoading={actionLoading}
      />

      <RejectRequestModal
        isOpen={showRejectModal}
        onClose={closeModals}
        onConfirm={handleConfirmReject}
        request={selectedRequest}
        isLoading={actionLoading}
      />
    </>
  );
};

export default RentalRequestList;