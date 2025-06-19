// src/components/ownerComponent/FormComponents/DocumentUploadItem.jsx

import React from 'react';
import { FileText, CheckCircle, AlertCircle, RefreshCw, Plus, X } from 'lucide-react';

const DocumentUploadItem = ({ docType, isRequired, hasDoc, statusInfo, handleDocumentUpload, removeUploadedDocument }) => {
  const borderColor = hasDoc ? "border-green-300 bg-green-50" : isRequired ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50";
  const iconColor = hasDoc ? "text-green-600" : isRequired ? "text-red-500" : "text-gray-400";

  return (
    <div className={`border-2 rounded-lg p-4 transition-all ${borderColor}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className={`h-4 w-4 ${iconColor}`} />
            <h4 className="font-medium text-sm text-gray-900">{docType.label}</h4>
            {hasDoc && <CheckCircle className="h-4 w-4 text-green-600" />}
          </div>
          {hasDoc ? (
            <div>
              <p className="text-xs text-gray-700 font-medium truncate" title={hasDoc.fileName}>{hasDoc.fileName}</p>
              <a href={hasDoc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate">Xem file</a>
            </div>
          ) : (
            <p className={`text-xs ${isRequired ? "text-red-600" : "text-gray-500"}`}>
              {isRequired ? "Chưa có giấy tờ. Vui lòng upload." : "Có thể bỏ qua."}
            </p>
          )}
        </div>
        <div className="w-40 flex-shrink-0">
          {hasDoc ? (
            <button type="button" onClick={() => removeUploadedDocument(docType.value)} className="w-full flex items-center justify-center px-3 py-1.5 border border-red-300 text-red-700 bg-white hover:bg-red-50 rounded-lg text-sm font-medium">
              <X className="h-4 w-4 mr-1" />Xóa
            </button>
          ) : (
            <>
              <input type="file" id={`upload-${docType.value}`} className="hidden" onChange={(e) => handleDocumentUpload(e, docType.value)} accept="image/*,application/pdf" disabled={statusInfo.status === "uploading"} />
              <label htmlFor={`upload-${docType.value}`} className={`w-full flex items-center justify-center px-3 py-1.5 border rounded-lg text-sm font-medium cursor-pointer ${statusInfo.status === "uploading" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "border-blue-300 text-blue-700 bg-white hover:bg-blue-50"}`}>
                {statusInfo.status === "uploading" ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
                {statusInfo.status === "uploading" ? "Đang tải..." : "Chọn file"}
              </label>
            </>
          )}
        </div>
      </div>
      {statusInfo.status === "uploading" && <p className="text-xs text-gray-600 mt-2 animate-pulse">Đang tải lên file: {statusInfo.fileName}...</p>}
      {statusInfo.status === "error" && (
        <div className="mt-2 p-2 bg-red-100 rounded-md"><p className="text-xs text-red-700 font-medium">Lỗi upload: {statusInfo.error}</p></div>
      )}
    </div>
  );
};

export default DocumentUploadItem;