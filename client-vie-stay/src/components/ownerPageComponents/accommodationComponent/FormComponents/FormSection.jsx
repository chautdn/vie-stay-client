// src/components/ownerComponent/FormComponents/FormSection.jsx

import React from 'react';

const FormSection = ({ icon: Icon, title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        {Icon && <Icon className="h-5 w-5 text-blue-600 mr-3" />}
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
};

export default FormSection;