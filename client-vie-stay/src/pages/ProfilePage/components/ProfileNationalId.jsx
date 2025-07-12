import React from "react";

export default function ProfileNationalId({ value, onChange, errors }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <label className="font-medium text-gray-700">Số CMND/CCCD</label>
        <input
          type="text"
          value={value.nationalId}
          onChange={e => onChange("nationalId", e.target.value)}
          maxLength={20}
          className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.nationalId && <div className="text-red-500 text-sm mt-1">{errors.nationalId}</div>}
      </div>
      <div>
        <label className="font-medium text-gray-700">Ảnh CMND/CCCD</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => onChange("nationalIdImage", e.target.files[0])}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
        {value.nationalIdImage && (
          <img
            src={typeof value.nationalIdImage === "string" ? value.nationalIdImage : URL.createObjectURL(value.nationalIdImage)}
            alt="nationalId"
            className="w-40 h-28 object-cover border-2 border-purple-200 rounded-lg shadow mt-2"
          />
        )}
        {errors.nationalIdImage && <div className="text-red-500 text-sm mt-1">{errors.nationalIdImage}</div>}
      </div>
    </div>
  );
}
