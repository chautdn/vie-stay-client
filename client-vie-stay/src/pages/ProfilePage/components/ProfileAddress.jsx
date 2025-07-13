import React from "react";

export default function ProfileAddress({ value, onChange, errors }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <label className="font-semibold text-gray-700">Địa chỉ</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Số nhà, đường"
          value={value.street}
          onChange={e => onChange("street", e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Phường/Xã"
          value={value.ward}
          onChange={e => onChange("ward", e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Quận/Huyện"
          value={value.district}
          onChange={e => onChange("district", e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Thành phố"
          value={value.city}
          onChange={e => onChange("city", e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <input
        type="text"
        placeholder="Địa chỉ đầy đủ"
        value={value.fullAddress}
        onChange={e => onChange("fullAddress", e.target.value)}
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {errors.fullAddress && <div className="text-red-500 text-sm mt-1">{errors.fullAddress}</div>}
    </div>
  );
}
