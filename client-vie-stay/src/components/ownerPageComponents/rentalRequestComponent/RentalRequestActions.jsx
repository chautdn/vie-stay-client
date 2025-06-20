import React from 'react';
import { Check, XIcon } from 'lucide-react';

const RentalRequestActions = ({ 
  request, 
  onShowAcceptModal, 
  onShowRejectModal 
}) => {
  if (request.status !== 'pending') {
    return null;
  }

  return (
    <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
      <button
        onClick={onShowAcceptModal}
        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
      >
        <Check size={18} />
        Chấp nhận yêu cầu
      </button>
      <button
        onClick={onShowRejectModal}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
      >
        <XIcon size={18} />
        Từ chối yêu cầu
      </button>
    </div>
  );
};

export default RentalRequestActions;