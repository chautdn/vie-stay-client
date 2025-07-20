import React from "react";

export default function ProfileEmergencyContact({ value, onChange, errors }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <label className="font-semibold text-gray-700">Người liên hệ khẩn cấp</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            type="text"
            placeholder="Họ tên người liên hệ"
            value={value.name}
            onChange={e => onChange("name", e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
        </div>
        <div>
          <input
            type="text"
            placeholder="Mối quan hệ"
            value={value.relationship}
            onChange={e => onChange("relationship", e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.relationship && <div className="text-red-500 text-sm mt-1">{errors.relationship}</div>}
        </div>
        <div>
          <input
            type="text"
            placeholder="Số điện thoại"
            value={value.phoneNumber}
            onChange={e => onChange("phoneNumber", e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.phoneNumber && <div className="text-red-500 text-sm mt-1">{errors.phoneNumber}</div>}
        </div>
      </div>
    </div>
  );
}
