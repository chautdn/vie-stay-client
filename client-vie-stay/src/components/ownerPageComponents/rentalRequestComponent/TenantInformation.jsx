import React from 'react';
import { User, Mail, Phone } from 'lucide-react';

const TenantInformation = ({ tenant }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <User size={20} />
        Thông tin người thuê
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {tenant?.name || 'Không có tên'}
              </p>
              <p className="text-sm text-gray-500">Khách thuê</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-gray-600">
            <Mail size={16} />
            <span>{tenant?.email}</span>
          </div>
          
          {tenant?.phoneNumber && (
            <div className="flex items-center gap-3 text-gray-600">
              <Phone size={16} />
              <span>{tenant.phoneNumber}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {tenant?.dateOfBirth && (
            <div>
              <span className="text-sm font-medium text-gray-700">Ngày sinh:</span>
              <p className="text-gray-600">
                {new Date(tenant.dateOfBirth).toLocaleDateString('vi-VN')}
              </p>
            </div>
          )}
          
          {tenant?.address && (
            <div>
              <span className="text-sm font-medium text-gray-700">Địa chỉ:</span>
              <p className="text-gray-600">{tenant.address}</p>
            </div>
          )}

          {tenant?.emergencyContact && (
            <div>
              <span className="text-sm font-medium text-gray-700">Liên hệ khẩn cấp:</span>
              <p className="text-gray-600">{tenant.emergencyContact}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantInformation;