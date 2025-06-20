import React from 'react';
import { X, FileText } from 'lucide-react';

const RentalRequestDetailsHeader = ({ request, onClose, getStatusColor, getStatusText }) => {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <FileText size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Chi tiết yêu cầu thuê
          </h2>
          <p className="text-sm text-gray-500">
            ID: {request._id}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(request.status)}`}>
          {getStatusText(request.status)}
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default RentalRequestDetailsHeader;