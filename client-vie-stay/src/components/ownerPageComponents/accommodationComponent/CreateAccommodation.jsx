// src/pages/OwnerPage/CreateAccommodation.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Import API utilities
import { ACCOMMODATION_ROUTES, apiClient } from "../../../store/owner/accommodationRoutes";

// Import các component con
import StatusAlert from './FormComponents/StatusAlert';
import BasicInfoSection from './FormComponents/BasicInfoSection';
import AddressSection from './FormComponents/AddressSection';
import ContactInfoSection from './FormComponents/ContactInfoSection';
import PoliciesSection from './FormComponents/PoliciesSection';
import AmenitiesSection from './FormComponents/AmenitiesSection';
import ImageUploadSection from './FormComponents/ImageUploadSection';
import DocumentUploadSection from './FormComponents/DocumentUploadSection';
import FormActions from './FormComponents/FormActions';
import { documentTypes, requiredDocTypes } from './FormComponents/constants';

function CreateAccommodation() {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();

    // =================================================================
    // SECTION: STATE MANAGEMENT
    // =================================================================
    const [pageLoading, setPageLoading] = useState(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false); // ✅ THÊM: Missing state
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [documentUploadStatus, setDocumentUploadStatus] = useState({});
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
            fullAddress: "" 
        },
        contactInfo: { 
            phone: "", 
            email: "", 
            website: "" 
        },
        totalRooms: 0, 
        availableRooms: 0,
        policies: { 
            checkInTime: "", 
            checkOutTime: "", 
            smokingAllowed: false, 
            petsAllowed: false, 
            partiesAllowed: false, 
            quietHours: { start: "", end: "" }, 
            additionalRules: [] 
        },
    });
    
    // =================================================================
    // SECTION: CONFIG & CONSTANTS (ownerId removed)
    // =================================================================
    const CLOUD_NAME = "dvltsiopl";
    const UPLOAD_PRESET = "viestay_unsigned";
    // ✅ REMOVED: ownerId hardcode - AxiosInstance sẽ tự động lấy từ token

    // =================================================================
    // SECTION: DATA FETCHING FOR EDIT MODE
    // =================================================================
    useEffect(() => {
        if (isEditMode) {
            const fetchAccommodationData = async () => {
                setPageLoading(true);
                try {
                    // ✅ SỬA: Sử dụng relative URL với AxiosInstance
                    const response = await apiClient.get(`/api/accommodations/${id}`);
                    console.log("📝 Edit mode - fetched data:", response);
                    
                    // ✅ SỬA: Handle response structure
                    const accommodationData = response.data || response;
                    setForm(accommodationData);
                    setImagePreviews(accommodationData.images || []);
                    
                } catch (error) {
                    console.log("❌ Error fetching accommodation data:", error);
                    console.error("❌ Error fetching accommodation data:", error);
                    setErrors({ 
                        submit: error.displayMessage || 
                                error.response?.data?.message || 
                                "Không thể tải dữ liệu để chỉnh sửa." 
                    });
                } finally {
                    setPageLoading(false);
                }
            };
            fetchAccommodationData();
        }
    }, [id, isEditMode]);

    // =================================================================
    // SECTION: LOGIC & HANDLERS
    // =================================================================
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const keys = name.split('.');
    
        if (keys.length === 1) {
          setForm((prev) => ({ 
            ...prev, 
            [name]: type === "checkbox" ? checked : 
                   type === "number" ? Number(value) : 
                   value 
          }));
        } else if (keys.length === 2) {
          setForm((prev) => ({ 
            ...prev, 
            [keys[0]]: { 
              ...prev[keys[0]], 
              [keys[1]]: type === "checkbox" ? checked : 
                        type === "number" ? Number(value) : 
                        value 
            } 
          }));
        } else if (keys.length === 3) {
           setForm((prev) => ({ 
             ...prev, 
             [keys[0]]: { 
               ...prev[keys[0]], 
               [keys[1]]: { 
                 ...prev[keys[0]][keys[1]], 
                 [keys[2]]: type === "checkbox" ? checked : 
                           type === "number" ? Number(value) : 
                           value 
               } 
             } 
           }));
        }
    
        // Clear errors
        if (errors[name] || errors[`${keys[0]}.${keys[1]}`]) {
          const newErrors = { ...errors };
          delete newErrors[name];
          delete newErrors[`${keys[0]}.${keys[1]}`];
          setErrors(newErrors);
        }
    };
    
    const handleImageChange = (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length === 0) return;
        
        setImageFiles((prevFiles) => [...prevFiles, ...newFiles]);
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    };

    const removeImage = (idx) => {
        const imageToRemove = imagePreviews[idx];
        const newPreviews = imagePreviews.filter((_, index) => index !== idx);
        setImagePreviews(newPreviews);

        if (imageToRemove.startsWith('blob:')) {
            const fileIndex = imagePreviews.filter(p => p.startsWith('blob:')).indexOf(imageToRemove);
            if(fileIndex > -1) {
                setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== fileIndex));
            }
        } else {
            setForm(prevForm => ({ 
              ...prevForm, 
              images: prevForm.images.filter(imgUrl => imgUrl !== imageToRemove) 
            }));
        }
    };

    async function uploadToCloudinary(file) {
        const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        
        const res = await fetch(url, { method: "POST", body: formData });
        const data = await res.json();
        
        if (data.secure_url) return data.secure_url;
        throw new Error(data.error?.message || "Upload thất bại");
    }
    
    const handleDocumentUpload = async (e, docType) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setDocumentUploadStatus((prev) => ({ 
          ...prev, 
          [docType]: { status: "uploading", fileName: file.name } 
        }));
        
        try {
            const url = await uploadToCloudinary(file);
            setForm((prev) => ({
                ...prev,
                documents: [
                    ...prev.documents.filter((doc) => doc.type !== docType),
                    { 
                      type: docType, 
                      url: url, 
                      fileName: file.name, 
                      uploadedAt: new Date().toISOString() 
                    },
                ],
            }));
            setDocumentUploadStatus((prev) => ({ 
              ...prev, 
              [docType]: { status: "success" } 
            }));
        } catch (error) {
            setDocumentUploadStatus((prev) => ({ 
              ...prev, 
              [docType]: { status: "error", error: error.message } 
            }));
        }
    };

    const removeUploadedDocument = (docType) => {
        if (window.confirm(`Bạn có chắc muốn xóa giấy tờ này?`)) {
            setForm((prev) => ({ 
              ...prev, 
              documents: prev.documents.filter((doc) => doc.type !== docType) 
            }));
            setDocumentUploadStatus((prev) => ({ 
              ...prev, 
              [docType]: { status: "idle", fileName: null, error: null } 
            }));
        }
    };
    
    const handleAmenityChange = (amenityValue) => {
        setForm((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenityValue)
                ? prev.amenities.filter((a) => a !== amenityValue)
                : [...prev.amenities, amenityValue],
        }));
    };

    const handleRuleAdd = () => {
        const rule = prompt("Nhập quy định mới:");
        if (rule && rule.trim()) {
            setForm((prev) => ({ 
              ...prev, 
              policies: { 
                ...prev.policies, 
                additionalRules: [...(prev.policies.additionalRules || []), rule.trim()] 
              } 
            }));
        }
    };

    const handleRuleRemove = (index) => {
        setForm((prev) => ({ 
          ...prev, 
          policies: { 
            ...prev.policies, 
            additionalRules: (prev.policies.additionalRules || []).filter((_, i) => i !== index) 
          } 
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!form.name.trim()) newErrors.name = "Tên nhà trọ là bắt buộc";
        if (!form.type) newErrors.type = "Loại hình là bắt buộc";
        if (!form.contactInfo.phone.trim()) newErrors["contactInfo.phone"] = "Số điện thoại là bắt buộc";
        if (!form.address.street.trim()) newErrors["address.street"] = "Địa chỉ là bắt buộc";
        if (!form.address.ward.trim()) newErrors["address.ward"] = "Phường/Xã là bắt buộc";
        if (!form.address.district) newErrors["address.district"] = "Quận/Huyện là bắt buộc";
        if (!form.address.fullAddress.trim()) newErrors["address.fullAddress"] = "Địa chỉ đầy đủ là bắt buộc";
        
        const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
        if (form.contactInfo.phone && !phoneRegex.test(form.contactInfo.phone)) {
            newErrors["contactInfo.phone"] = "Số điện thoại không hợp lệ (VD: 0123456789)";
        }
        
        const missingDocTypes = requiredDocTypes.filter((type) => 
          !form.documents.find((doc) => doc.type === type)
        );
        if (missingDocTypes.length > 0) {
            const missingLabels = missingDocTypes.map((type) => 
              documentTypes.find((dt) => dt.value === type)?.label || type
            ).join(", ");
            newErrors.documents = `Thiếu các loại giấy tờ bắt buộc: ${missingLabels}`;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            console.log("❌ Form validation failed:", errors);
            return;
        }
        
        setIsSubmitting(true);
        setErrors({});
        
        try {
            console.log("🔄 Submitting form...", { isEditMode, form });
            
            // ✅ SỬA: Upload images trước khi submit
            let imageUrls = [...form.images]; // Existing images
            
            if (imageFiles.length > 0) {
                console.log("📸 Uploading new images...");
                const uploadPromises = imageFiles.map(file => uploadToCloudinary(file));
                const newImageUrls = await Promise.all(uploadPromises);
                imageUrls = [...imageUrls, ...newImageUrls];
                console.log("✅ Images uploaded:", newImageUrls);
            }

            // ✅ SỬA: Prepare accommodation data (ownerId removed - backend sẽ lấy từ token)
            const accommodationData = {
                ...form,
                images: imageUrls,
                // ownerId removed - AxiosInstance interceptor sẽ tự động thêm user info
            };

            console.log("📦 Final accommodation data:", accommodationData);
            
            let response;
            
            if (isEditMode) {
                // ✅ SỬA: Sử dụng relative URL với AxiosInstance
                response = await apiClient.put(`/api/accommodations/${id}`, accommodationData);
                console.log("✅ Update response:", response);
            } else {
                // ✅ SỬA: Sử dụng relative URL với AxiosInstance
                response = await apiClient.post('/api/accommodations', accommodationData);
                console.log("✅ Create response:", response);
            }

            // Handle success
            setErrors({});
            setSuccess(isEditMode ? "Cập nhật nhà trọ thành công!" : "Tạo nhà trọ thành công!");
            
            // Clear form if create mode
            if (!isEditMode) {
                setForm({
                    name: "", description: "", type: "", images: [], documents: [], amenities: [],
                    address: { street: "", ward: "", district: "", city: "Đà Nẵng", fullAddress: "" },
                    contactInfo: { phone: "", email: "", website: "" },
                    totalRooms: 0, availableRooms: 0,
                    policies: { checkInTime: "", checkOutTime: "", smokingAllowed: false, petsAllowed: false, partiesAllowed: false, quietHours: { start: "", end: "" }, additionalRules: [] },
                });
                setImageFiles([]);
                setImagePreviews([]);
                setDocumentUploadStatus({});
            }
            
            // Navigate back to list after delay
            setTimeout(() => {
                navigate("/owner/accommodations");
            }, 1500);
            
        } catch (error) {
            console.error("❌ Submit error:", error);
            
            // ✅ SỬA: Handle error từ AxiosInstance
            let errorMessage = "Có lỗi xảy ra khi lưu dữ liệu";
            
            if (error.displayMessage) {
                errorMessage = error.displayMessage;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setErrors({ submit: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading state for edit mode
    if (pageLoading) {
        return (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
            </div>
        );
    }

    // ======================== RENDER FORM ========================
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                    <button 
                        onClick={() => navigate("/owner/accommodations")} 
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {isEditMode ? "Chỉnh sửa nhà trọ" : "Tạo nhà trọ mới"}
                        </h1>
                        <p className="text-gray-600">
                            {isEditMode 
                                ? "Cập nhật thông tin cho nhà trọ của bạn" 
                                : "Điền đầy đủ thông tin để tạo nhà trọ mới"
                            }
                        </p>
                    </div>
                </div>
            </div>

            <StatusAlert type="success" message={success} />
            <StatusAlert type="error" message={errors.submit} />

            <form onSubmit={handleSubmit} className="space-y-8">
                <BasicInfoSection 
                    form={form} 
                    errors={errors} 
                    handleChange={handleChange} 
                />
                <AddressSection 
                    form={form} 
                    errors={errors} 
                    handleChange={handleChange} 
                />
                <ContactInfoSection 
                    form={form} 
                    errors={errors} 
                    handleChange={handleChange} 
                />
                <ImageUploadSection 
                    imagePreviews={imagePreviews} 
                    handleImageChange={handleImageChange} 
                    removeImage={removeImage} 
                />
                <PoliciesSection 
                    form={form} 
                    errors={errors} 
                    handleChange={handleChange} 
                    handleRuleAdd={handleRuleAdd} 
                    handleRuleRemove={handleRuleRemove} 
                />
                <AmenitiesSection 
                    form={form} 
                    handleAmenityChange={handleAmenityChange} 
                />
                <DocumentUploadSection 
                    form={form} 
                    errors={errors} 
                    documentUploadStatus={documentUploadStatus} 
                    handleDocumentUpload={handleDocumentUpload} 
                    removeUploadedDocument={removeUploadedDocument} 
                />
                <FormActions 
                    loading={isSubmitting} 
                    isEditMode={isEditMode} 
                />
            </form>
        </div>
    );
}

export default CreateAccommodation;