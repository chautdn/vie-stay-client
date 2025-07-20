import React from "react";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=random";
const IMAGE_BASE_URL = "http://localhost:8080"; // Domain backend

export default function ProfileAvatar({ value, onChange, error }) {
  let avatarSrc = DEFAULT_AVATAR;
  if (value && typeof value === "string" && value.trim() !== "") {
    if (value.startsWith("http")) {
      avatarSrc = value;
    } else if (value.startsWith("/uploads")) {
      avatarSrc = `${IMAGE_BASE_URL}${value}`;
    } else {
      avatarSrc = value;
    }
  } else if (value && typeof value === "object") {
    avatarSrc = URL.createObjectURL(value);
  }

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <label className="font-semibold text-gray-700 mb-1 text-xl">Ảnh đại diện</label>
      <div className="w-full flex flex-col items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={e => onChange(e.target.files[0])}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 max-w-[180px]"
        />
      </div>
      <img
        src={avatarSrc}
        alt="avatar"
        className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow-lg mt-2"
      />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}
