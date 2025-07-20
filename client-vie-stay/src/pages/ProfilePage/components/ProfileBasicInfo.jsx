import React from "react";

export default function ProfileBasicInfo({ value, onChange, errors }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <label className="font-medium text-gray-700">Họ tên</label>
        <input
          type="text"
          value={value.name}
          onChange={e => onChange("name", e.target.value)}
          maxLength={50}
          className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
      </div>
      <div>
        <label className="font-medium text-gray-700">Email</label>
        <input type="email" value={value.email} readOnly className="mt-1 w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-500" />
      </div>
      <div>
        <label className="font-medium text-gray-700">Số điện thoại</label>
        <input
          type="text"
          value={value.phoneNumber}
          onChange={e => onChange("phoneNumber", e.target.value)}
          maxLength={11}
          className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.phoneNumber && <div className="text-red-500 text-sm mt-1">{errors.phoneNumber}</div>}
      </div>
      <div>
        <label className="font-medium text-gray-700">Ngày sinh</label>
        <input
          type="date"
          value={value.dateOfBirth || ""}
          onChange={e => onChange("dateOfBirth", e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.dateOfBirth && <div className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</div>}
      </div>
    </div>
  );
}
