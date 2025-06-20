// src/components/ownerComponent/FormComponents/FormActions.jsx

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Component nhận thêm prop isEditMode
const FormActions = ({ loading, isEditMode }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end space-x-4 pb-8">
      <button
        type="button"
        onClick={() => navigate("/owner/accommodations")}
        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Hủy
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
      >
        {loading && <RefreshCw className="animate-spin h-4 w-4 mr-2" />}
        {loading ? "Đang xử lý..." : (isEditMode ? "Lưu thay đổi" : "Tạo nhà trọ")}
      </button>
    </div>
  );
};

export default FormActions;