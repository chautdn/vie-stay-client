// src/components/ownerComponent/FormComponents/ContactInfoSection.jsx

import React from 'react';
import { Phone, AlertCircle } from 'lucide-react';
import FormSection from './FormSection';

const ContactInfoSection = ({ form, errors, handleChange }) => {
  return (
    <FormSection icon={Phone} title="Thông tin liên hệ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
          <input
            type="tel" name="contactInfo.phone" value={form.contactInfo.phone} onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors['contactInfo.phone'] ? "border-red-300" : "border-gray-300"}`}
          />
          {errors['contactInfo.phone'] && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors['contactInfo.phone']}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email" name="contactInfo.email" value={form.contactInfo.email} onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors['contactInfo.email'] ? "border-red-300" : "border-gray-300"}`}
          />
          {errors['contactInfo.email'] && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors['contactInfo.email']}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
        <input
          type="url" name="contactInfo.website" value={form.contactInfo.website} onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    </FormSection>
  );
};

export default ContactInfoSection;