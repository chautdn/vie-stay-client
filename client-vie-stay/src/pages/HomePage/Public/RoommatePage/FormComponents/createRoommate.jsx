import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialForm = {
  roomNumber: "",
  name: "",
  description: "",
  type: "shared",
  size: "",
  capacity: 1,
  maxRoommates: 1,
  hasPrivateBathroom: false,
  furnishingLevel: "unfurnished",
  images: [],
  amenities: [],
  isAvailable: true,
  availableFrom: "",
  baseRent: 0,
  deposit: 0,
  utilityRates: {
    water: { type: "per_cubic_meter", rate: 0 },
    electricity: { type: "per_kwh", rate: 0 },
    internet: { type: "fixed", rate: 0 },
    sanitation: { type: "fixed", rate: 0 },
  },
  additionalFees: [],
  address: {
    street: "",
    ward: "",
    district: "Quận Hải Châu",
    city: "Đà Nẵng",
    fullAddress: "",
  },
  contactInfo: {
    phone: "",
    email: "",
    website: "",
  },
  averageRating: 0,
  totalRatings: 0,
  viewCount: 0,
  favoriteCount: 0,
};

const availableAmenities = [
  "wifi", "air_conditioning", "desk", "tv", "refrigerator", "microwave", "fan", "wardrobe"
];

const furnishingOptions = ["unfurnished", "semi", "fully"];
const districtOptions = [
  "Quận Hải Châu", "Quận Thanh Khê", "Quận Sơn Trà", "Quận Ngũ Hành Sơn",
  "Quận Liên Chiểu", "Quận Cẩm Lệ", "Huyện Hòa Vang", "Huyện Hoàng Sa"
];

const CreateRoommate = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setForm({ ...form, [name]: newValue });
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleNestedChange = (section, field, value) => {
    setForm(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
    setErrors(prev => ({ ...prev, [`${section}.${field}`]: "" }));
  };

  const handleAmenityChange = (amenity) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
    setErrors(prev => ({ ...prev, amenities: "" }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setForm(prev => ({ ...prev, images: urls }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Tên phòng là bắt buộc";
    if (!form.description.trim()) newErrors.description = "Mô tả là bắt buộc";

    if (!form.address.street.trim()) newErrors["address.street"] = "Địa chỉ là bắt buộc";
    if (!form.address.ward.trim()) newErrors["address.ward"] = "Phường/Xã là bắt buộc";
    if (!form.address.district.trim()) newErrors["address.district"] = "Quận/Huyện là bắt buộc";
    if (!form.address.fullAddress.trim()) newErrors["address.fullAddress"] = "Địa chỉ đầy đủ là bắt buộc";

    if (!form.contactInfo.phone.trim()) {
      newErrors["contactInfo.phone"] = "SĐT liên hệ là bắt buộc";
    } else if (!/^[0-9]{9,11}$/.test(form.contactInfo.phone.trim())) {
      newErrors["contactInfo.phone"] = "Số điện thoại không hợp lệ (9-11 chữ số)";
    }

    if (form.contactInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactInfo.email)) {
      newErrors["contactInfo.email"] = "Email không hợp lệ";
    }

    if (form.amenities.length === 0) {
      newErrors.amenities = "Vui lòng chọn ít nhất một tiện nghi";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post("http://localhost:8080/roommates", form);
      toast.success("Đăng tin thành công!");
      navigate("/roommates");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi khi đăng tin.");
    }
  };

  const getInputClass = (field) => `w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[field] ? "border-red-500" : ""}`;
  const getError = (field) => errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-bold mb-4">Đăng tin phòng ở ghép</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input className={getInputClass("name")} name="name" value={form.name} onChange={handleChange} placeholder="Tên phòng" />
            {getError("name")}
          </div>
          <div>
            <input className={getInputClass("roomNumber")} name="roomNumber" value={form.roomNumber} onChange={handleChange} placeholder="Số phòng" />
          </div>
        </div>

        <div>
          <textarea className={getInputClass("description")} rows="4" name="description" value={form.description} onChange={handleChange} placeholder="Mô tả phòng..." />
          {getError("description")}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input className={getInputClass("size")} type="number" name="size" value={form.size} onChange={handleChange} placeholder="Diện tích (m²)" />
          <input className={getInputClass("availableFrom")} type="date" name="availableFrom" value={form.availableFrom} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select className={getInputClass("type")} name="type" value={form.type} onChange={handleChange}>
            <option value="shared">Ở ghép</option>
            <option value="dormitory">Ký túc xá</option>
          </select>
          <select className={getInputClass("furnishingLevel")} name="furnishingLevel" value={form.furnishingLevel} onChange={handleChange}>
            {furnishingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input className={getInputClass("capacity")} type="number" name="capacity" value={form.capacity} onChange={handleChange} placeholder="Sức chứa" />
          <input className={getInputClass("maxRoommates")} type="number" name="maxRoommates" value={form.maxRoommates} onChange={handleChange} placeholder="Số người tối đa" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="hasPrivateBathroom" checked={form.hasPrivateBathroom} onChange={handleChange} />
          <label>Có nhà vệ sinh riêng</label>
        </div>

        <div>
          <label className="font-semibold">Tiện nghi:</label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {availableAmenities.map(item => (
              <label key={item} className="flex items-center gap-2">
                <input type="checkbox" checked={form.amenities.includes(item)} onChange={() => handleAmenityChange(item)} />
                {item}
              </label>
            ))}
          </div>
          {getError("amenities")}
        </div>

        <div>
          <input type="file" multiple onChange={handleImageUpload} accept="image/*" />
          <div className="flex flex-wrap gap-2 mt-2">
            {form.images.map((img, idx) => (
              <img key={idx} src={img} alt={`img-${idx}`} className="w-20 h-20 object-cover rounded" />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-semibold">Địa chỉ</label>
          <input className={getInputClass("address.street")} placeholder="Số nhà, tên đường" value={form.address.street} onChange={(e) => handleNestedChange("address", "street", e.target.value)} />
          {getError("address.street")}
          <input className={getInputClass("address.ward")} placeholder="Phường/Xã" value={form.address.ward} onChange={(e) => handleNestedChange("address", "ward", e.target.value)} />
          {getError("address.ward")}
          <select className={getInputClass("address.district")} value={form.address.district} onChange={(e) => handleNestedChange("address", "district", e.target.value)}>
            {districtOptions.map(d => <option key={d}>{d}</option>)}
          </select>
          {getError("address.district")}
          <input className={getInputClass("address.fullAddress")} placeholder="Địa chỉ đầy đủ" value={form.address.fullAddress} onChange={(e) => handleNestedChange("address", "fullAddress", e.target.value)} />
          {getError("address.fullAddress")}
        </div>

        <div className="space-y-2">
          <label className="font-semibold">Thông tin liên hệ</label>
          <input className={getInputClass("contactInfo.phone")} placeholder="SĐT" value={form.contactInfo.phone} onChange={(e) => handleNestedChange("contactInfo", "phone", e.target.value)} />
          {getError("contactInfo.phone")}
          <input className={getInputClass("contactInfo.email")} placeholder="Email" value={form.contactInfo.email} onChange={(e) => handleNestedChange("contactInfo", "email", e.target.value)} />
          {getError("contactInfo.email")}
          <input className={getInputClass("contactInfo.website")} placeholder="Website" value={form.contactInfo.website} onChange={(e) => handleNestedChange("contactInfo", "website", e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input className={getInputClass("baseRent")} type="number" name="baseRent" value={form.baseRent} onChange={handleChange} placeholder="Giá thuê cơ bản" />
          <input className={getInputClass("deposit")} type="number" name="deposit" value={form.deposit} onChange={handleChange} placeholder="Tiền đặt cọc" />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Đăng tin</button>
      </form>
    </div>
  );
};

export default CreateRoommate;
