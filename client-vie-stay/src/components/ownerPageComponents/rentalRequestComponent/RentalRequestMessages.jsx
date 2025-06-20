import React from 'react';
import { MessageSquare } from 'lucide-react';

const RentalRequestMessages = ({ request, formatDate }) => {
  return (
    <>
      {/* Request Message */}
      {request.message && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MessageSquare size={20} />
            Lời nhắn từ khách thuê
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">{request.message}</p>
          </div>
        </div>
      )}

      {/* Response from Landlord */}
      {request.landlordResponse && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MessageSquare size={20} />
            Phản hồi của bạn
          </h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">{request.landlordResponse}</p>
            {request.respondedAt && (
              <p className="text-sm text-gray-500 mt-2">
                Phản hồi lúc: {formatDate(request.respondedAt)}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RentalRequestMessages;