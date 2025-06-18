"use client"



import { useState } from "react"

import { useNavigate } from "react-router-dom"

import {

  Building2,

  MapPin,

  Phone,

  ArrowLeft,

  AlertCircle,

  CheckCircle,

  RefreshCw,

  FileText,

  X,

  Clock,

  Plus,

} from "lucide-react"

import { ACCOMMODATION_ROUTES, apiClient } from "../../store/apiRoutes/accommodationRoutes"



function CreateAccommodation() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState({})

  const [success, setSuccess] = useState("")



  // ======================== Cloudinary IMAGE UPLOAD STATE & HANDLERS ========================

  const [imageFiles, setImageFiles] = useState([])

  const [imagePreviews, setImagePreviews] = useState([])

  const [documentUploadStatus, setDocumentUploadStatus] = useState({})



  // 👉 Sửa lại bằng thông tin Cloudinary của bạn!

  const CLOUD_NAME = "dvltsiopl"

  const UPLOAD_PRESET = "viestay_unsigned"



  // Khi chọn file ảnh, cập nhật files và preview

  const handleImageChange = (e) => {
  const newFiles = Array.from(e.target.files);
  if (newFiles.length === 0) return;

  // Thêm các file mới vào danh sách file đã có
  setImageFiles((prevFiles) => [...prevFiles, ...newFiles]);
  
  // Tạo và thêm các preview mới vào danh sách preview đã có
  const newPreviews = newFiles.map(file => URL.createObjectURL(file));
  setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
};



  // Xóa 1 ảnh preview theo index

  const removeImage = (idx) => {

    setImageFiles((prev) => prev.filter((_, i) => i !== idx))

    setImagePreviews((prev) => prev.filter((_, i) => i !== idx))

  }



  // Hàm upload 1 file lên Cloudinary, trả về URL

  async function uploadToCloudinary(file) {

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    const formData = new FormData()

    formData.append("file", file)

    formData.append("upload_preset", UPLOAD_PRESET)

    const res = await fetch(url, {

      method: "POST",

      body: formData,

    })

    const data = await res.json()

    if (data.secure_url) return data.secure_url

    throw new Error(data.error?.message || "Upload thất bại")

  }



  // HÀM MỚI: Xử lý khi người dùng chọn file document để upload

  const handleDocumentUpload = async (e, docType) => {

    const file = e.target.files[0]

    if (!file) return



    setDocumentUploadStatus((prev) => ({

      ...prev,

      [docType]: { status: "uploading", fileName: file.name },

    }))



    try {

      const url = await uploadToCloudinary(file)

      if (url) {

        setForm((prev) => ({

          ...prev,

          documents: [

            ...prev.documents.filter((doc) => doc.type !== docType),

            {

              type: docType,

              url: url,

              fileName: file.name,

              uploadedAt: new Date().toISOString(),

            },

          ],

        }))

        setDocumentUploadStatus((prev) => ({

          ...prev,

          [docType]: { ...prev[docType], status: "success" },

        }))

      } else {

        throw new Error("Không nhận được URL từ Cloudinary.")

      }

    } catch (error) {

      console.error("Lỗi upload document:", error)

      setDocumentUploadStatus((prev) => ({

        ...prev,

        [docType]: {

          ...prev[docType],

          status: "error",

          error: error.message,

        },

      }))

    }

  }



  // HÀM MỚI: Xóa document đã upload

  const removeUploadedDocument = (docType) => {

    const docTypeLabel = documentTypes.find((t) => t.value === docType)?.label || docType

    if (window.confirm(`Bạn có chắc muốn xóa ${docTypeLabel}?`)) {

      setForm((prev) => ({

        ...prev,

        documents: prev.documents.filter((doc) => doc.type !== docType),

      }))

      setDocumentUploadStatus((prev) => ({

        ...prev,

        [docType]: { status: "idle", fileName: null, error: null },

      }))

    }

  }



  // ======================== Các state và function khác ========================

  const [form, setForm] = useState({

    name: "",

    description: "",

    type: "",

    images: [],

    documents: [],

    amenities: [],

    address: {

      street: "",

      ward: "",

      district: "",

      city: "Đà Nẵng",

      fullAddress: "",

    },

    contactInfo: {

      phone: "",

      email: "",

      website: "",

    },

    totalRooms: 0,

    availableRooms: 0,

    policies: {

      checkInTime: "",

      checkOutTime: "",

      smokingAllowed: false,

      petsAllowed: false,

      partiesAllowed: false,

      quietHours: {

        start: "",

        end: "",

      },

      additionalRules: [],

    },

  })



  const ownerId = "675f7c5b4c57ca2d5e8b4567"



  const accommodationTypes = [

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

  ]



  const districts = [

    "Quận Hải Châu",

    "Quận Thanh Khê",

    "Quận Sơn Trà",

    "Quận Ngũ Hành Sơn",

    "Quận Liên Chiểu",

    "Quận Cẩm Lệ",

    "Huyện Hòa Vang",

    "Huyện Hoàng Sa",

  ]



  const amenitiesList = [

    { value: "wifi", label: "WiFi" },

    { value: "parking", label: "Chỗ đậu xe" },

    { value: "pool", label: "Hồ bơi" },

    { value: "gym", label: "Phòng gym" },

    { value: "laundry", label: "Giặt ủi" },

    { value: "elevator", label: "Thang máy" },

    { value: "security", label: "Bảo vệ 24/7" },

    { value: "air_conditioning", label: "Điều hòa" },

    { value: "heating", label: "Sưởi ấm" },

    { value: "kitchen", label: "Bếp" },

    { value: "restaurant", label: "Nhà hàng" },

    { value: "bar", label: "Quầy bar" },

    { value: "garden", label: "Vườn" },

    { value: "terrace", label: "Sân thượng" },

    { value: "balcony", label: "Ban công" },

    { value: "sea_view", label: "View biển" },

    { value: "mountain_view", label: "View núi" },

    { value: "pets_allowed", label: "Cho phép thú cưng" },

    { value: "smoking_allowed", label: "Cho phép hút thuốc" },

    { value: "wheelchair_accessible", label: "Tiếp cận xe lăn" },

  ]



  const documentTypes = [

    { value: "business_license", label: "Giấy phép kinh doanh" },

    { value: "property_deed", label: "Sổ đỏ/Giấy chứng nhận quyền sử dụng đất" },

    { value: "tax_certificate", label: "Giấy chứng nhận thuế" },

    { value: "fire_safety", label: "Giấy chứng nhận PCCC" },

    { value: "other", label: "Khác" },

  ]



  const requiredDocTypes = ["business_license", "property_deed", "tax_certificate", "fire_safety"]



  const handleChange = (e) => {

    const { name, value, type, checked } = e.target

    const keys = name.split(".")



    if (keys.length === 1) {

      setForm((prev) => ({

        ...prev,

        [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,

      }))

    } else if (keys.length === 2) {

      setForm((prev) => ({

        ...prev,

        [keys[0]]: {

          ...prev[keys[0]],

          [keys[1]]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,

        },

      }))

    } else if (keys.length === 3) {

      setForm((prev) => ({

        ...prev,

        [keys[0]]: {

          ...prev[keys[0]],

          [keys[1]]: {

            ...prev[keys[0]][keys[1]],

            [keys[2]]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,

          },

        },

      }))

    }



    if (errors[name]) {

      setErrors((prev) => ({ ...prev, [name]: "" }))

    }

  }



  const handleAmenityChange = (amenityValue) => {

    setForm((prev) => ({

      ...prev,

      amenities: prev.amenities.includes(amenityValue)

        ? prev.amenities.filter((a) => a !== amenityValue)

        : [...prev.amenities, amenityValue],

    }))

  }



  const handleRuleAdd = () => {

    const rule = prompt("Nhập quy định mới:")

    if (rule && rule.trim()) {

      setForm((prev) => ({

        ...prev,

        policies: {

          ...prev.policies,

          additionalRules: [...(prev.policies.additionalRules || []), rule.trim()],

        },

      }))

    }

  }



  const handleRuleRemove = (index) => {

    setForm((prev) => ({

      ...prev,

      policies: {

        ...prev.policies,

        additionalRules: (prev.policies.additionalRules || []).filter((_, i) => i !== index),

      },

    }))

  }



  const validateForm = () => {

    const newErrors = {}



    if (!form.name.trim()) newErrors.name = "Tên nhà trọ là bắt buộc"

    if (!form.type) newErrors.type = "Loại hình là bắt buộc"

    if (!form.contactInfo.phone.trim()) newErrors["contactInfo.phone"] = "Số điện thoại là bắt buộc"

    if (!form.address.street.trim()) newErrors["address.street"] = "Địa chỉ là bắt buộc"

    if (!form.address.ward.trim()) newErrors["address.ward"] = "Phường/Xã là bắt buộc"

    if (!form.address.district) newErrors["address.district"] = "Quận/Huyện là bắt buộc"

    if (!form.address.fullAddress.trim()) newErrors["address.fullAddress"] = "Địa chỉ đầy đủ là bắt buộc"



    const phoneRegex = /^(\+84|0)[0-9]{9,10}$/

    if (form.contactInfo.phone && !phoneRegex.test(form.contactInfo.phone)) {

      newErrors["contactInfo.phone"] = "Số điện thoại không hợp lệ (VD: 0123456789)"

    }



    if (form.contactInfo.email) {

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

      if (!emailRegex.test(form.contactInfo.email)) {

        newErrors["contactInfo.email"] = "Email không hợp lệ"

      }

    }



    if (form.totalRooms < 0) newErrors.totalRooms = "Số phòng không thể âm"

    if (form.availableRooms < 0) newErrors.availableRooms = "Số phòng trống không thể âm"

    if (form.availableRooms > form.totalRooms) {

      newErrors.availableRooms = "Số phòng trống không thể lớn hơn tổng số phòng"

    }



    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

    if (form.policies.checkInTime && !timeRegex.test(form.policies.checkInTime)) {

      newErrors["policies.checkInTime"] = "Thời gian check-in không hợp lệ (HH:MM)"

    }

    if (form.policies.checkOutTime && !timeRegex.test(form.policies.checkOutTime)) {

      newErrors["policies.checkOutTime"] = "Thời gian check-out không hợp lệ (HH:MM)"

    }

    if (form.policies.quietHours.start && !timeRegex.test(form.policies.quietHours.start)) {

      newErrors["policies.quietHours.start"] = "Thời gian bắt đầu giờ yên tĩnh không hợp lệ (HH:MM)"

    }

    if (form.policies.quietHours.end && !timeRegex.test(form.policies.quietHours.end)) {

      newErrors["policies.quietHours.end"] = "Thời gian kết thúc giờ yên tĩnh không hợp lệ (HH:MM)"

    }



    const missingDocTypes = requiredDocTypes.filter((type) => !form.documents.find((doc) => doc.type === type))

    if (missingDocTypes.length > 0) {

      const missingLabels = missingDocTypes

        .map((type) => documentTypes.find((dt) => dt.value === type)?.label || type)

        .join(", ")

      newErrors.documents = `Thiếu các loại giấy tờ: ${missingLabels}`

    }



    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }



  const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccess("");
  setErrors({});

  if (!validateForm()) {
    return;
  }

  setLoading(true);

  try {
    // ---- BƯỚC 1: UPLOAD ẢNH LÊN CLOUDINARY (NẾU CÓ) ----
    let uploadedImageUrls = [];
    if (imageFiles.length > 0) {
      // Tạo một mảng các promise cho việc upload từng ảnh
      const uploadPromises = imageFiles.map((file) => uploadToCloudinary(file));
      // Chờ cho tất cả các ảnh được upload xong
      uploadedImageUrls = await Promise.all(uploadPromises);
    }

    // ---- BƯỚC 2: TẠO DỮ LIỆU ĐỂ GỬI ĐI ----
    const formData = {
      ...form,
      images: uploadedImageUrls, // <-- Thêm mảng URL ảnh đã upload vào đây
      ownerId,
      approvalStatus: "pending",
      isActive: true,
    };

    // ---- BƯỚC 3: GỌI API ĐỂ TẠO NHÀ TRỌ ----
    await apiClient.post(ACCOMMODATION_ROUTES.CREATE, formData);
    setSuccess("Tạo nhà trọ thành công! Đang chờ admin duyệt.");

    setTimeout(() => {
      navigate("/owner/accommodations");
    }, 2000);
    
  } catch (err) {
    console.error("Lỗi khi tạo nhà trọ:", err);
    setErrors({ submit: `Có lỗi xảy ra khi tạo nhà trọ: ${err.message}` });
  } finally {
    setLoading(false);
  }
};



  const getError = (field) => errors[field]



  return (

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Header */}

      <div className="mb-8">

        <div className="flex items-center space-x-4 mb-4">

          <button

            onClick={() => navigate("/owner/accommodations")}

            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"

          >

            <ArrowLeft className="h-5 w-5" />

          </button>

          <div>

            <h1 className="text-3xl font-bold text-gray-900">Tạo nhà trọ mới</h1>

            <p className="text-gray-600">Điền đầy đủ thông tin để tạo nhà trọ mới</p>

          </div>

        </div>

      </div>



      {/* Success Message */}

      {success && (

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">

          <div className="flex items-start">

            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />

            <div>

              <h3 className="text-green-800 font-medium">Thành công!</h3>

              <p className="text-green-700 text-sm mt-1">{success}</p>

            </div>

          </div>

        </div>

      )}



      {/* Submit Error */}

      {errors.submit && (

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">

          <div className="flex items-start">

            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />

            <div>

              <h3 className="text-red-800 font-medium">Lỗi</h3>

              <p className="text-red-700 text-sm mt-1">{errors.submit}</p>

            </div>

          </div>

        </div>

      )}



      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Basic Information */}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

          <div className="flex items-center mb-6">

            <Building2 className="h-5 w-5 text-blue-600 mr-2" />

            <h2 className="text-xl font-semibold text-gray-900">Thông tin cơ bản</h2>

          </div>
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <div className="flex items-center mb-4">
    <FileText className="h-5 w-5 text-blue-600 mr-2" />
    <h2 className="text-xl font-semibold text-gray-900">Hình ảnh nhà trọ</h2>
  </div>

  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
    <input
      type="file"
      id="image-upload"
      multiple
      accept="image/*"
      onChange={handleImageChange}
      className="hidden"
    />
    <label
      htmlFor="image-upload"
      className="mx-auto cursor-pointer flex flex-col items-center justify-center"
    >
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      </div>
      <p className="text-blue-600 font-medium">Nhấn để chọn ảnh</p>
      <p className="text-xs text-gray-500 mt-1">Hỗ trợ nhiều ảnh (PNG, JPG, GIF...)</p>
    </label>
  </div>

  {/* Image Previews Section */}
  {imagePreviews.length > 0 && (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Xem trước ({imagePreviews.length} ảnh):</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative group">
            <img src={preview} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-lg" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Xóa ảnh"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )}
</div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Tên nhà trọ *</label>

              <input

                type="text"

                name="name"

                value={form.name}

                onChange={handleChange}

                maxLength={200}

                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${

                  getError("name") ? "border-red-300" : "border-gray-300"

                }`}

                placeholder="VD: Nhà trọ Hải Châu"

              />

              {getError("name") && (

                <p className="mt-1 text-sm text-red-600 flex items-center">

                  <AlertCircle className="h-4 w-4 mr-1" />

                  {getError("name")}

                </p>

              )}

            </div>





            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Loại hình *</label>

              <select

                name="type"

                value={form.type}

                onChange={handleChange}

                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${

                  getError("type") ? "border-red-300" : "border-gray-300"

                }`}

              >

                <option value="">Chọn loại hình</option>

                {accommodationTypes.map((type) => (

                  <option key={type.value} value={type.value}>

                    {type.label}

                  </option>

                ))}

              </select>

              {getError("type") && (

                <p className="mt-1 text-sm text-red-600 flex items-center">

                  <AlertCircle className="h-4 w-4 mr-1" />

                  {getError("type")}

                </p>

              )}

            </div>

          </div>



          <div className="mt-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>

            <textarea

              name="description"

              value={form.description}

              onChange={handleChange}

              rows={4}

              maxLength={2000}

              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"

              placeholder="Mô tả chi tiết về nhà trọ, tiện nghi, vị trí..."

            />

            <p className="text-xs text-gray-500 mt-1">{form.description.length}/2000 ký tự</p>

          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Tổng số phòng</label>

              <input

                type="number"

                name="totalRooms"

                value={form.totalRooms}

                onChange={handleChange}

                min="0"

                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${

                  getError("totalRooms") ? "border-red-300" : "border-gray-300"

                }`}

              />

              {getError("totalRooms") && (

                <p className="mt-1 text-sm text-red-600 flex items-center">

                  <AlertCircle className="h-4 w-4 mr-1" />

                  {getError("totalRooms")}

                </p>

              )}

            </div>



            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Số phòng trống</label>

              <input

                type="number"

                name="availableRooms"

                value={form.availableRooms}

                onChange={handleChange}

                min="0"

                max={form.totalRooms}

                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${

                  getError("availableRooms") ? "border-red-300" : "border-gray-300"

                }`}

              />

              {getError("availableRooms") && (

                <p className="mt-1 text-sm text-red-600 flex items-center">

                  <AlertCircle className="h-4 w-4 mr-1" />

                  {getError("availableRooms")}

                </p>

              )}

            </div>

          </div>

        </div>



        {/* Address Information */}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

          <div className="flex items-center mb-6">

            <MapPin className="h-5 w-5 text-blue-600 mr-2" />

            <h2 className="text-xl font-semibold text-gray-900">Địa chỉ</h2>

          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ *</label>

              <input

                type="text"

                name="address.street"

                value={form.address.street}

                onChange={handleChange}

                maxLength={200}

                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${

                  getError("address.street") ? "border-red-300" : "border-gray-300"

                }`}

                placeholder="Số nhà, tên đường"

              />

              {getError("address.street") && (

                <p className="mt-1 text-sm text-red-600 flex items-center">

                  <AlertCircle className="h-4 w-4 mr-1" />

                  {getError("address.street")}

                </p>

              )}

            </div>



            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Phường/Xã *</label>

              <input

                type="text"

                name="address.ward"

                value={form.address.ward}

                onChange={handleChange}

                maxLength={100}

                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${

                  getError("address.ward") ? "border-red-300" : "border-gray-300"

                }`}

                placeholder="Tên phường/xã"

              />

              {getError("address.ward") && (

                <p className="mt-1 text-sm text-red-600 flex items-center">

                  <AlertCircle className="h-4 w-4 mr-1" />

                  {getError("address.ward")}

                </p>

              )}

            </div>

          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Quận/Huyện *</label>

              <select

                name="address.district"

                value={form.address.district}

                onChange={handleChange}

                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${

                  getError("address.district") ? "border-red-300" : "border-gray-300"

                }`}

              >

                <option value="">Chọn quận/huyện</option>

                {districts.map((district) => (

                  <option key={district} value={district}>

                    {district}

                  </option>

                ))}

              </select>

              {getError("address.district") && (

                <p className="mt-1 text-sm text-red-600 flex items-center">

                  <AlertCircle className="h-4 w-4 mr-1" />

                  {getError("address.district")}

                </p>

              )}

            </div>



            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Thành phố</label>

              <input

                type="text"

                name="address.city"

                value={form.address.city}

                onChange={handleChange}

                disabled

                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"

              />

            </div>

          </div>



          <div className="mt-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ đầy đủ *</label>

            <input

              type="text"

              name="address.fullAddress"

              value={form.address.fullAddress}

              onChange={handleChange}

              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${

                getError("address.fullAddress") ? "border-red-300" : "border-gray-300"

              }`}

              placeholder="Địa chỉ đầy đủ để khách hàng dễ tìm"

            />

            {getError("address.fullAddress") && (

              <p className="mt-1 text-sm text-red-600 flex items-center">

                <AlertCircle className="h-4 w-4 mr-1" />

                {getError("address.fullAddress")}

              </p>

            )}

          </div>

        </div>



        {/* Contact Information */}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

          <div className="flex items-center mb-6">

            <Phone className="h-5 w-5 text-blue-600 mr-2" />

            <h2 className="text-xl font-semibold text-gray-900">Thông tin liên hệ</h2>

          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>

              <input

                type="tel"

                name="contactInfo.phone"

                value={form.contactInfo.phone}

                onChange={handleChange}

                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${

                  getError("contactInfo.phone") ? "border-red-300" : "border-gray-300"

                }`}

                placeholder="0123456789 hoặc +84123456789"

              />

              {getError("contactInfo.phone") && (

                <p className="mt-1 text-sm text-red-600 flex items-center">

                  <AlertCircle className="h-4 w-4 mr-1" />

                  {getError("contactInfo.phone")}

                </p>

              )}

            </div>



            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>

              <input

                type="email"

                name="contactInfo.email"

                value={form.contactInfo.email}

                onChange={handleChange}

                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${

                  getError("contactInfo.email") ? "border-red-300" : "border-gray-300"

                }`}

                placeholder="example@email.com"

              />

              {getError("contactInfo.email") && (

                <p className="mt-1 text-sm text-red-600 flex items-center">

                  <AlertCircle className="h-4 w-4 mr-1" />

                  {getError("contactInfo.email")}

                </p>

              )}

            </div>

          </div>



          <div className="mt-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>

            <input

              type="url"

              name="contactInfo.website"

              value={form.contactInfo.website}

              onChange={handleChange}

              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"

              placeholder="https://example.com"

            />

          </div>

        </div>



        {/* Policies */}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

          <div className="flex items-center mb-6">

            <Clock className="h-5 w-5 text-blue-600 mr-2" />

            <h2 className="text-xl font-semibold text-gray-900">Chính sách</h2>

          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Giờ check-in</label>

              <input

                type="time"

                name="policies.checkInTime"

                value={form.policies.checkInTime}

                onChange={handleChange}

                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${

                  getError("policies.checkInTime") ? "border-red-300" : "border-gray-300"

                }`}

              />

              {getError("policies.checkInTime") && (

                <p className="mt-1 text-sm text-red-600 flex items-center">

                  <AlertCircle className="h-4 w-4 mr-1" />

                  {getError("policies.checkInTime")}

                </p>

              )}

            </div>



            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Giờ check-out</label>

              <input

                type="time"

                name="policies.checkOutTime"

                value={form.policies.checkOutTime}

                onChange={handleChange}

                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${

                  getError("policies.checkOutTime") ? "border-red-300" : "border-gray-300"

                }`}

              />

              {getError("policies.checkOutTime") && (

                <p className="mt-1 text-sm text-red-600 flex items-center">

                  <AlertCircle className="h-4 w-4 mr-1" />

                  {getError("policies.checkOutTime")}

                </p>

              )}

            </div>

          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Giờ yên tĩnh - Bắt đầu</label>

              <input

                type="time"

                name="policies.quietHours.start"

                value={form.policies.quietHours.start}

                onChange={handleChange}

                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${

                  getError("policies.quietHours.start") ? "border-red-300" : "border-gray-300"

                }`}

              />

              {getError("policies.quietHours.start") && (

                <p className="mt-1 text-sm text-red-600 flex items-center">

                  <AlertCircle className="h-4 w-4 mr-1" />

                  {getError("policies.quietHours.start")}

                </p>

              )}

            </div>



            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">Giờ yên tĩnh - Kết thúc</label>

              <input

                type="time"

                name="policies.quietHours.end"

                value={form.policies.quietHours.end}

                onChange={handleChange}

                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${

                  getError("policies.quietHours.end") ? "border-red-300" : "border-gray-300"

                }`}

              />

              {getError("policies.quietHours.end") && (

                <p className="mt-1 text-sm text-red-600 flex items-center">

                  <AlertCircle className="h-4 w-4 mr-1" />

                  {getError("policies.quietHours.end")}

                </p>

              )}

            </div>

          </div>



          <div className="mt-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <label className="flex items-center space-x-2">

                <input

                  type="checkbox"

                  name="policies.smokingAllowed"

                  checked={form.policies.smokingAllowed}

                  onChange={handleChange}

                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"

                />

                <span className="text-sm text-gray-700">Cho phép hút thuốc</span>

              </label>



              <label className="flex items-center space-x-2">

                <input

                  type="checkbox"

                  name="policies.petsAllowed"

                  checked={form.policies.petsAllowed}

                  onChange={handleChange}

                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"

                />

                <span className="text-sm text-gray-700">Cho phép thú cưng</span>

              </label>



              <label className="flex items-center space-x-2">

                <input

                  type="checkbox"

                  name="policies.partiesAllowed"

                  checked={form.policies.partiesAllowed}

                  onChange={handleChange}

                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"

                />

                <span className="text-sm text-gray-700">Cho phép tổ chức tiệc</span>

              </label>

            </div>

          </div>



          <div className="mt-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">Quy định bổ sung</label>

            <div className="space-y-2">

              {(form.policies.additionalRules || []).map((rule, index) => (

                <div key={index} className="flex items-center space-x-2">

                  <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">{rule}</span>

                  <button

                    type="button"

                    onClick={() => handleRuleRemove(index)}

                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"

                  >

                    <X className="h-4 w-4" />

                  </button>

                </div>

              ))}

              <button

                type="button"

                onClick={handleRuleAdd}

                className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"

              >

                + Thêm quy định

              </button>

            </div>

          </div>

        </div>



        {/* Amenities */}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

          <div className="flex items-center mb-6">

            <Building2 className="h-5 w-5 text-blue-600 mr-2" />

            <h2 className="text-xl font-semibold text-gray-900">Tiện nghi</h2>

          </div>



          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">

            {amenitiesList.map((amenity) => (

              <label key={amenity.value} className="flex items-center space-x-2 cursor-pointer">

                <input

                  type="checkbox"

                  checked={form.amenities.includes(amenity.value)}

                  onChange={() => handleAmenityChange(amenity.value)}

                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"

                />

                <span className="text-sm text-gray-700">{amenity.label}</span>

              </label>

            ))}

          </div>

        </div>



        {/* Documents Upload - Required */}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

          <div className="flex items-center mb-6">

            <FileText className="h-5 w-5 text-blue-600 mr-2" />

            <h2 className="text-xl font-semibold text-gray-900">Giấy tờ pháp lý *</h2>

            <span className="ml-2 text-sm text-red-600 font-medium">(Bắt buộc 4 loại chính)</span>

          </div>



          {getError("documents") && (

            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">

              <p className="text-sm text-red-600 flex items-center">

                <AlertCircle className="h-4 w-4 mr-1" />

                {getError("documents")}

              </p>

            </div>

          )}



          <div className="space-y-4">

            {/* Document Type Cards - Giao diện mới */}

            {documentTypes.map((docType) => {

              const hasDoc = form.documents.find((doc) => doc.type === docType.value)

              const isRequired = docType.value !== "other"

              const statusInfo = documentUploadStatus[docType.value] || { status: "idle" }



              return (

                <div

                  key={docType.value}

                  className={`border-2 rounded-lg p-4 transition-all ${

                    hasDoc ? "border-green-300 bg-green-50" : isRequired ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"

                  }`}

                >

                  <div className="flex items-start justify-between">

                    {/* Cột thông tin */}

                    <div className="flex-1 mr-4">

                      <div className="flex items-center space-x-2 mb-2">

                        <FileText className={`h-4 w-4 ${hasDoc ? "text-green-600" : isRequired ? "text-red-500" : "text-gray-400"}`} />

                        <h4 className="font-medium text-sm text-gray-900">{docType.label}</h4>

                        {hasDoc && <CheckCircle className="h-4 w-4 text-green-600" />}

                      </div>

                      {hasDoc ? (

                        <div>

                          <p className="text-xs text-gray-700 font-medium truncate" title={hasDoc.fileName}>

                            {hasDoc.fileName}

                          </p>

                          <a

                            href={hasDoc.url}

                            target="_blank"

                            rel="noopener noreferrer"

                            className="text-xs text-blue-600 hover:underline truncate"

                          >

                            Xem file

                          </a>

                        </div>

                      ) : (

                        <p className={`text-xs ${isRequired ? "text-red-600" : "text-gray-500"}`}>

                          {isRequired ? "Chưa có giấy tờ này. Vui lòng upload." : "Có thể bỏ qua."}

                        </p>

                      )}

                    </div>



                    {/* Cột hành động (Upload/Xóa) */}

                    <div className="w-40 flex-shrink-0">

                      {hasDoc ? (

                        <button

                          type="button"

                          onClick={() => removeUploadedDocument(docType.value)}

                          className="w-full flex items-center justify-center px-3 py-1.5 border border-red-300 text-red-700 bg-white hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"

                        >

                          <X className="h-4 w-4 mr-1" />

                          Xóa

                        </button>

                      ) : (

                        <>

                          <input

                            type="file"

                            id={`upload-${docType.value}`}

                            className="hidden"

                            onChange={(e) => handleDocumentUpload(e, docType.value)}

                            accept="image/*,application/pdf"

                            disabled={statusInfo.status === "uploading"}

                          />

                          <label

                            htmlFor={`upload-${docType.value}`}

                            className={`w-full flex items-center justify-center px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors cursor-pointer ${

                              statusInfo.status === "uploading"

                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"

                                : "border-blue-300 text-blue-700 bg-white hover:bg-blue-50"

                            }`}

                          >

                            {statusInfo.status === "uploading" ? (

                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />

                            ) : (

                              <Plus className="h-4 w-4 mr-1" />

                            )}

                            {statusInfo.status === "uploading" ? "Đang tải..." : "Chọn file"}

                          </label>

                        </>

                      )}

                    </div>

                  </div>

                  {/* Hiển thị trạng thái upload hoặc lỗi */}

                  {statusInfo.status === "uploading" && (

                    <p className="text-xs text-gray-600 mt-2 animate-pulse">Đang tải lên file: {statusInfo.fileName}...</p>

                  )}

                  {statusInfo.status === "error" && (

                    <div className="mt-2 p-2 bg-red-100 rounded-md">

                      <p className="text-xs text-red-700 font-medium">Lỗi upload: {statusInfo.error}</p>

                    </div>

                  )}

                </div>

              )

            })}



            {/* Summary */}

            <div

              className={`border rounded-lg p-4 ${

                requiredDocTypes.every((type) => form.documents.find((doc) => doc.type === type))

                  ? "bg-green-50 border-green-200"

                  : "bg-red-50 border-red-200"

              }`}

            >

              <div className="flex items-center space-x-2">

                <FileText

                  className={`h-5 w-5 ${

                    requiredDocTypes.every((type) => form.documents.find((doc) => doc.type === type))

                      ? "text-green-600"

                      : "text-red-600"

                  }`}

                />

                <div>

                  <p

                    className={`text-sm font-medium ${

                      requiredDocTypes.every((type) => form.documents.find((doc) => doc.type === type))

                        ? "text-green-900"

                        : "text-red-900"

                    }`}

                  >

                    Bắt buộc:{" "}

                    {requiredDocTypes.filter((type) => form.documents.find((doc) => doc.type === type)).length}/4 loại

                    {form.documents.find((doc) => doc.type === "other") && " + 1 tùy chọn"}

                  </p>

                  <p

                    className={`text-xs mt-1 ${

                      requiredDocTypes.every((type) => form.documents.find((doc) => doc.type === type))

                        ? "text-green-700"

                        : "text-red-700"

                    }`}

                  >

                    {requiredDocTypes.every((type) => form.documents.find((doc) => doc.type === type))

                      ? "✅ Đã đủ tất cả loại giấy tờ bắt buộc"

                      : `⚠️ Còn thiếu ${4 - requiredDocTypes.filter((type) => form.documents.find((doc) => doc.type === type)).length} loại bắt buộc`}

                  </p>



                  {!requiredDocTypes.every((type) => form.documents.find((doc) => doc.type === type)) && (

                    <div className="mt-2">

                      <p className="text-xs text-red-600 font-medium">Còn thiếu:</p>

                      <ul className="text-xs text-red-600 mt-1 space-y-1">

                        {requiredDocTypes

                          .filter((type) => !form.documents.find((doc) => doc.type === type))

                          .map((type) => (

                            <li key={type}>• {documentTypes.find((dt) => dt.value === type)?.label}</li>

                          ))}

                      </ul>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>

        </div>



        {/* Submit Buttons */}

        <div className="flex justify-end space-x-4 pb-8">

          <button

            type="button"

            onClick={() => navigate("/owner/accommodations")}

            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"

          >

            Hủy

          </button>

          <button

            type="submit"

            disabled={loading}

            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"

          >

            {loading && <RefreshCw className="animate-spin h-4 w-4 mr-2" />}

            {loading ? "Đang tạo..." : "Tạo nhà trọ"}

          </button>

        </div>

      </form>

    </div>

  )

}



export default CreateAccommodation