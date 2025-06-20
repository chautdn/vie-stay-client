// src/components/ownerComponent/FormComponents/constants.js

export const accommodationTypes = [
    { value: "duplex", label: "Duplex" },
    { value: "house", label: "Nhà riêng" },
    { value: "apartment_building", label: "Chung cư" },
    { value: "hotel", label: "Khách sạn" },
    { value: "motel", label: "Nhà nghỉ" },
    { value: "hostel", label: "Hostel" },
    { value: "guesthouse", label: "Nhà trọ" },
    { value: "resort", label: "Resort" },
    { value: "villa", label: "Villa" },
    { value: "homestay", label: "Homestay" },
  ];
  
  export const districts = [
    "Quận Hải Châu", "Quận Thanh Khê", "Quận Sơn Trà", "Quận Ngũ Hành Sơn",
    "Quận Liên Chiểu", "Quận Cẩm Lệ", "Huyện Hòa Vang", "Huyện Hoàng Sa",
  ];
  
  export const amenitiesList = [
    { value: "wifi", label: "WiFi" }, { value: "parking", label: "Chỗ đậu xe" },
    { value: "pool", label: "Hồ bơi" }, { value: "gym", label: "Phòng gym" },
    { value: "laundry", label: "Giặt ủi" }, { value: "elevator", label: "Thang máy" },
    { value: "security", label: "Bảo vệ 24/7" }, { value: "air_conditioning", label: "Điều hòa" },
    { value: "heating", label: "Sưởi ấm" }, { value: "kitchen", label: "Bếp" },
    { value: "restaurant", label: "Nhà hàng" }, { value: "bar", label: "Quầy bar" },
    { value: "garden", label: "Vườn" }, { value: "terrace", label: "Sân thượng" },
    { value: "balcony", label: "Ban công" }, { value: "sea_view", label: "View biển" },
    { value: "mountain_view", label: "View núi" }, { value: "pets_allowed", label: "Cho phép thú cưng" },
    { value: "smoking_allowed", label: "Cho phép hút thuốc" }, { value: "wheelchair_accessible", label: "Tiếp cận xe lăn" },
  ];
  
  export const documentTypes = [
    { value: "business_license", label: "Giấy phép kinh doanh" },
    { value: "property_deed", label: "Sổ đỏ/Giấy chứng nhận QSDĐ" },
    { value: "tax_certificate", label: "Giấy chứng nhận thuế" },
    { value: "fire_safety", label: "Giấy chứng nhận PCCC" },
    { value: "other", label: "Khác" },
  ];
  
  export const requiredDocTypes = ["business_license", "property_deed", "tax_certificate", "fire_safety"];