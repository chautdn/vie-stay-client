// src/components/ownerComponent/FormComponents/BasicInfoSection.jsx

import React from 'react';
import { Building2, AlertCircle } from 'lucide-react';
import FormSection from './FormSection';
import { accommodationTypes } from './constants';

const BasicInfoSection = ({ form, errors, handleChange }) => {
  return (
    <FormSection icon={Building2} title="Thông tin cơ bản">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tên nhà trọ *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${errors.name ? "border-red-300" : "border-gray-300"}`} />
          {errors.name && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Loại hình *</label>
          <select name="type" value={form.type} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${errors.type ? "border-red-300" : "border-gray-300"}`}>
            <option value="">Chọn loại hình</option>
            {accommodationTypes.map((type) => (<option key={type.value} value={type.value}>{type.label}</option>))}
          </select>
          {errors.type && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.type}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tổng số phòng</label>
          <input type="number" name="totalRooms" value={form.totalRooms} onChange={handleChange} min="0" className={`w-full px-3 py-2 border rounded-lg ${errors.totalRooms ? "border-red-300" : "border-gray-300"}`}/>
          {errors.totalRooms && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.totalRooms}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Số phòng trống</label>
          <input type="number" name="availableRooms" value={form.availableRooms} onChange={handleChange} min="0" className={`w-full px-3 py-2 border rounded-lg ${errors.availableRooms ? "border-red-300" : "border-gray-300"}`}/>
          {errors.availableRooms && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.availableRooms}</p>}
        </div>
      </div>
    </FormSection>
  );
};

export default BasicInfoSection;