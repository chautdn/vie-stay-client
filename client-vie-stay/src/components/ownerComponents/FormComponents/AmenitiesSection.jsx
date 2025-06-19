// src/components/ownerComponent/FormComponents/AmenitiesSection.jsx

import React from 'react';
import { Building2 } from 'lucide-react';
import FormSection from './FormSection';
import { amenitiesList } from './constants';

const AmenitiesSection = ({ form, handleAmenityChange }) => {
  return (
    <FormSection icon={Building2} title="Tiện nghi">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {amenitiesList.map((amenity) => (
          <label key={amenity.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.amenities.includes(amenity.value)}
              onChange={() => handleAmenityChange(amenity.value)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{amenity.label}</span>
          </label>
        ))}
      </div>
    </FormSection>
  );
};

export default AmenitiesSection;