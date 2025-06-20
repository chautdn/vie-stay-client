// src/components/ownerComponent/FormComponents/AddressSection.jsx

import React from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import FormSection from './FormSection';
import { districts } from './constants';

const AddressSection = ({ form, errors, handleChange }) => {
  return (
    <FormSection icon={MapPin} title="Địa chỉ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ *</label>
          <input type="text" name="address.street" value={form.address.street} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${errors['address.street'] ? "border-red-300" : "border-gray-300"}`} placeholder="Số nhà, tên đường"/>
          {errors['address.street'] && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors['address.street']}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phường/Xã *</label>
          <input type="text" name="address.ward" value={form.address.ward} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${errors['address.ward'] ? "border-red-300" : "border-gray-300"}`} placeholder="Tên phường/xã"/>
          {errors['address.ward'] && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors['address.ward']}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quận/Huyện *</label>
          <select name="address.district" value={form.address.district} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${errors['address.district'] ? "border-red-300" : "border-gray-300"}`}>
            <option value="">Chọn quận/huyện</option>
            {districts.map((district) => (<option key={district} value={district}>{district}</option>))}
          </select>
          {errors['address.district'] && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors['address.district']}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Thành phố</label>
          <input type="text" name="address.city" value={form.address.city} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ đầy đủ *</label>
        <input type="text" name="address.fullAddress" value={form.address.fullAddress} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${errors['address.fullAddress'] ? "border-red-300" : "border-gray-300"}`} placeholder="Địa chỉ đầy đủ để khách hàng dễ tìm" />
        {errors['address.fullAddress'] && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors['address.fullAddress']}</p>}
      </div>
    </FormSection>
  );
};

export default AddressSection;