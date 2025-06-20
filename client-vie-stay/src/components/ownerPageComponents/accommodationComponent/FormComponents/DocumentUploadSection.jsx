// src/components/ownerComponent/FormComponents/DocumentUploadSection.jsx

import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import FormSection from './FormSection';
import DocumentUploadItem from './DocumentUploadItem';
import { documentTypes, requiredDocTypes } from './constants';

const DocumentUploadSection = ({ form, errors, documentUploadStatus, handleDocumentUpload, removeUploadedDocument }) => {
  const uploadedRequiredCount = requiredDocTypes.filter(type => form.documents.some(doc => doc.type === type)).length;
  const isAllRequiredUploaded = uploadedRequiredCount === requiredDocTypes.length;

  return (
    <FormSection icon={FileText} title="Giấy tờ pháp lý *">
      {errors.documents && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.documents}</p>
        </div>
      )}
      
      {documentTypes.map((docType) => {
        const hasDoc = form.documents.find((doc) => doc.type === docType.value);
        const isRequired = requiredDocTypes.includes(docType.value);
        const statusInfo = documentUploadStatus[docType.value] || { status: "idle" };

        return (
          <DocumentUploadItem
            key={docType.value} docType={docType} isRequired={isRequired} hasDoc={hasDoc}
            statusInfo={statusInfo} handleDocumentUpload={handleDocumentUpload} removeUploadedDocument={removeUploadedDocument}
          />
        );
      })}
      
      <div className={`border rounded-lg p-4 ${isAllRequiredUploaded ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <p className={`text-sm font-medium ${isAllRequiredUploaded ? 'text-green-900' : 'text-red-900'}`}>
              Bắt buộc: {uploadedRequiredCount}/{requiredDocTypes.length} loại
          </p>
          <p className={`text-xs mt-1 ${isAllRequiredUploaded ? 'text-green-700' : 'text-red-700'}`}>
              {isAllRequiredUploaded ? "✅ Đã đủ tất cả loại giấy tờ bắt buộc" : `⚠️ Còn thiếu ${requiredDocTypes.length - uploadedRequiredCount} loại bắt buộc`}
          </p>
      </div>
    </FormSection>
  );
};

export default DocumentUploadSection;