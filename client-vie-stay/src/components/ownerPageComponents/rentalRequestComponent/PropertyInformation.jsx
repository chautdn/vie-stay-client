import React from 'react';
import { Home, Building, MapPin } from 'lucide-react';

const PropertyInformation = ({ room, formatPrice }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Room Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Home size={20} />
          Thông tin phòng
        </h3>
        
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-700">Tên phòng:</span>
            <p className="font-semibold text-gray-900">
              {room?.name || `Phòng ${room?.roomNumber}`}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Loại phòng:</span>
              <p className="text-gray-600">{room?.type}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Sức chứa:</span>
              <p className="text-gray-600">{room?.capacity} người</p>
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-700">Giá thuê gốc:</span>
            <p className="text-lg font-bold text-blue-600">
              {formatPrice(room?.baseRent)}/tháng
            </p>
          </div>

          {room?.deposit && (
            <div>
              <span className="text-sm font-medium text-gray-700">Tiền cọc:</span>
              <p className="font-semibold text-gray-900">
                {formatPrice(room.deposit)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Accommodation Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building size={20} />
          Thông tin tòa nhà
        </h3>
        
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-700">Tên tòa nhà:</span>
            <p className="font-semibold text-gray-900">
              {room?.accommodationId?.name}
            </p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-700">Loại:</span>
            <p className="text-gray-600">{room?.accommodationId?.type}</p>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-700">Địa chỉ:</span>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin size={16} className="mt-0.5 flex-shrink-0" />
              <p>{room?.accommodationId?.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInformation;