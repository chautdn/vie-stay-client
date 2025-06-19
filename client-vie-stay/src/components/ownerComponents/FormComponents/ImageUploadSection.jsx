// src/components/ownerComponent/FormComponents/ImageUploadSection.jsx

import React from 'react';
import { UploadCloud, X } from 'lucide-react';
import FormSection from './FormSection';

const ImageUploadSection = ({ imagePreviews, handleImageChange, removeImage }) => {
  return (
    <FormSection title="Hình ảnh nhà trọ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center h-full flex flex-col justify-center">
          <input type="file" id="image-upload" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
          <label htmlFor="image-upload" className="cursor-pointer">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600"><span className="font-semibold text-blue-600">Nhấn để upload</span> hoặc kéo thả</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (hỗ trợ nhiều ảnh)</p>
          </label>
        </div>
        <div className="min-h-[150px]">
          {imagePreviews.length === 0 ? (
            <div className="text-center text-gray-500 p-6">Chưa có ảnh nào được chọn</div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group aspect-square">
                  <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-lg shadow" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
};

export default ImageUploadSection;