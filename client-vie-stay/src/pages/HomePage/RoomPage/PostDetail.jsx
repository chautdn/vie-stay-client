import React, { useEffect, useState } from "react";
import { Toaster } from 'react-hot-toast';
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { formatCurrencyVND } from "../../../utils/FormatPricePrint";
import { usePostStore } from "../../../store/postStore";
import RoomImageSlider from "../../../components/RoomDetail/RoomImageSlider";
import RoomInfo from "../../../components/postDetail/RoomInfo";
import UserInfoPost from "../../../components/postDetail/UserInfoPost";
import ReportModal from "../../../components/RoomDetail/ReportModal";
import { NewestPosts } from "../Public";

const PostDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { getPostById } = usePostStore();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const [reportForm, setReportForm] = useState({
    reportType: 'scam',
    message: '',
    fullname: '',
    phone: ''
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch post data
  useEffect(() => {
    if (!post && id) {
      const fetchPostDetail = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await getPostById(id);
          let postData = null;

          if (response?.status === "success" && response?.data?.post) {
            postData = response.data.post;
          } else if (response?.data?.post) {
            postData = response.data.post;
          } else if (response?.post) {
            postData = response.post;
          } else if (response?._id) {
            postData = response;
          }

          if (postData) {
            setPost(postData);
          } else {
            throw new Error("Không tìm thấy thông tin tin đăng");
          }
        } catch (err) {
          console.error("❌ Lỗi fetch post detail:", err);
          setError(err.message || "Lỗi khi tải thông tin tin đăng");
        } finally {
          setIsLoading(false);
        }
      };

      fetchPostDetail();
    }
  }, [post, id, getPostById]);

  // Helper functions
  const formatAmenity = (amenity) => {
    const amenityMapping = {
      air_conditioning: "Điều hòa",
      wifi: "Wifi miễn phí",
      washing_machine: "Máy giặt",
      elevator: "Thang máy",
      balcony: "Ban công",
      fully_furnished: "Nội thất đầy đủ",
      pet_friendly: "Cho phép nuôi thú cưng",
      cooking_allowed: "Cho phép nấu ăn",
      utilities_included: "Bao điện nước",
      security: "An toàn",
      parking: "Chỗ để xe",
      security_camera: "Camera an ninh",
      tv: "TV",
      refrigerator: "Tủ lạnh",
      microwave: "Lò vi sóng",
      desk: "Bàn làm việc",
      wardrobe: "Tủ quần áo",
      window: "Cửa sổ",
    };
    return amenityMapping[amenity] || amenity.replace(/_/g, " ");
  };

  const formatRoomType = (type) => {
    const typeMapping = {
      single: "Phòng đơn",
      double: "Phòng đôi",
      shared: "Phòng chia sẻ",
      studio: "Phòng studio",
      apartment: "Căn hộ mini",
      dormitory: "Ký túc xá",
    };
    return typeMapping[type] || type;
  };

  const formatAddress = () => {
    if (post?.address?.fullAddress) {
      return post.address.fullAddress;
    }
    if (post?.address) {
      const addr = post.address;
      const parts = [];
      if (addr.street) parts.push(addr.street);
      if (addr.ward) parts.push(addr.ward);
      if (addr.district) parts.push(addr.district);
      if (addr.city) parts.push(addr.city);
      return parts.join(", ") || "Địa chỉ đang cập nhật";
    }
    return "Địa chỉ đang cập nhật";
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    console.log("Report submitted:", {
      postId: post._id,
      ...reportForm
    });
    setIsReport(false);
    setReportForm({
      reportType: 'scam',
      message: '',
      fullname: '',
      phone: ''
    });
  };

  // Loading và Error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Có lỗi xảy ra</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Quay lại
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <div className="text-gray-400 text-6xl mb-4">🏠</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy tin đăng</h2>
        <p className="text-gray-600 mb-4">Tin đăng bạn tìm kiếm không tồn tại hoặc đã bị xóa</p>
        <button
          onClick={() => navigate("/search")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Tìm tin khác
        </button>
      </div>
    );
  }

  const postImages = post?.images && post.images.length > 0 
    ? post.images 
    : ["https://t3.ftcdn.net/jpg/02/15/15/46/360_F_215154625_hJg9QkfWH9Cu6LCTUc8TiuV6jQSI0C5X.jpg"];

  return (
    <div className='w-full flex gap-4 relative'>
      {/* Toast Container */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />

      {/* Modals */}
      <ReportModal
        isOpen={isReport}
        onClose={() => setIsReport(false)}
        reportForm={reportForm}
        setReportForm={setReportForm}
        onSubmit={handleReportSubmit}
      />

      {/* Left Column - 70% width */}
      <div className='w-[70%]'>
        <RoomImageSlider
          images={postImages}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />

        {/* Main Content Card */}
        <div className='bg-white rounded-md shadow-md p-4'>
          <RoomInfo
            post={post}
            formatRoomType={formatRoomType}
            formatAddress={formatAddress}
          />
          
          {/* Description Section */}
          <div className='mt-8'>
            <h3 className='font-semibold text-xl my-4'>Thông tin mô tả</h3>
            <div className='flex flex-col gap-3'>
              <span>{post?.description || "Mô tả đang được cập nhật..."}</span>
            </div>
          </div>
          
          {/* Room Features Table */}
          <div className='mt-8'>
            <h3 className='font-semibold text-xl my-4'>Đặc điểm tin đăng</h3>
            <table className='w-full'>
              <tbody className='w-full'>
                <tr className='w-full'>
                  <td className='p-2'>Mã tin</td>
                  <td className='p-2'>#{post?._id?.slice(-6) || "000000"}</td>
                </tr>
                <tr className='w-full bg-gray-200'>
                  <td className='p-2'>Khu vực</td>
                  <td className='p-2'>{formatAddress()}</td>
                </tr>
                <tr className='w-full'>
                  <td className='p-2'>Loại tin rao</td>
                  <td className='p-2'>Cho thuê phòng trọ</td>
                </tr>
                <tr className='w-full bg-gray-200'>
                  <td className='p-2'>Đối tượng</td>
                  <td className='p-2'>{post?.capacity || 1} người</td>
                </tr>
                <tr className='w-full'>
                  <td className='p-2'>Diện tích</td>
                  <td className='p-2'>{post?.area || 0} m²</td>
                </tr>
                <tr className='w-full bg-gray-200'>
                  <td className='p-2'>Ngày đăng</td>
                  <td className='p-2'>{new Date(post?.createdAt || Date.now()).toLocaleDateString('vi-VN')}</td>
                </tr>
                <tr className='w-full'>
                  <td className='p-2'>Trạng thái</td>
                  <td className='p-2'>
                    <span className={`px-2 py-1 rounded text-sm ${
                      post?.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {post?.isAvailable ? 'Còn trống' : 'Đã thuê'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Amenities */}
          {post?.amenities && post.amenities.length > 0 && (
            <div className='mt-8'>
              <h3 className='font-semibold text-xl my-4'>Tiện nghi</h3>
              <div className="grid grid-cols-2 gap-2">
                {post.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {formatAmenity(amenity)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Utility Rates */}
          {post?.utilityRates && Object.keys(post.utilityRates).length > 0 && (
            <div className='mt-8'>
              <h3 className='font-semibold text-xl my-4'>Chi phí dịch vụ</h3>
              <table className='w-full'>
                <tbody className='w-full'>
                  {Object.entries(post.utilityRates).map(([key, value], index) =>
                    value && value.rate ? (
                      <tr key={key} className={`w-full ${index % 2 === 1 ? 'bg-gray-200' : ''}`}>
                        <td className='p-2 capitalize'>
                          {key === "water" ? "Tiền nước" : 
                           key === "electricity" ? "Tiền điện" : 
                           key === "internet" ? "Internet" : key}
                        </td>
                        <td className='p-2'>
                          {value.type === "fixed"
                            ? `${formatCurrencyVND(value.rate)} / tháng`
                            : `${formatCurrencyVND(value.rate)} / đơn vị`}
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - 30% width */}
      <div className='w-[30%] flex flex-col gap-8'>
        <UserInfoPost
          post={post}
          isFavorited={isFavorited}
          setIsFavorited={setIsFavorited}
          setIsReport={setIsReport}
          // Không truyền setIsRentalRequest
        />

        <NewestPosts />
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={() => setShowFullscreen(false)}
        >
          <div className="keen-slider w-full max-w-6xl h-[90vh]">
            {postImages.map((img, i) => (
              <div key={i} className="keen-slider__slide flex justify-center items-center">
                <img src={img} alt={`Ảnh ${i}`} className="max-h-full max-w-full object-contain" />
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-5 right-6 text-white text-3xl bg-black bg-opacity-50 hover:bg-opacity-75 px-4 py-2 rounded-full"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default PostDetail;