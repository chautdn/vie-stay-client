import React, { useEffect, useState } from "react";
import { Toaster, toast } from 'react-hot-toast'; // Thêm toast
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { formatCurrencyVND } from "../../../utils/FormatPricePrint";
import { roomService } from "../../../services/roomService";
import { NewestPosts } from "../Public";

// Import components
import ReportModal from "../../../components/RoomDetail/ReportModal";
import RoomImageSlider from "../../../components/RoomDetail/RoomImageSlider";
import RoomInfo from "../../../components/RoomDetail/RoomInfo";
import RentalRequestModal from "../../../components/RoomDetail/RentalRequestModal";
import UserInfoBox from "../../../components/RoomDetail/UserInfoBox";

const RoomDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const action = queryParams.get("action");

  const { room: roomFromState } = location.state || {};
  const [room, setRoom] = useState(roomFromState || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const [isRentalRequest, setIsRentalRequest] = useState(false);
  const [reportForm, setReportForm] = useState({
    reportType: 'scam',
    message: '',
    fullname: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    if (action === 'rent') {
      setTimeout(() => {
        setIsRentalRequest(true);
      }, 500);
    }
  }, [action]);

  // Fetch room data
  useEffect(() => {
    if (!room && id) {
      const fetchRoomDetail = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await roomService.getRoomById(id);
          let roomData = null;

          if (response?.status === "success" && response?.data?.room) {
            roomData = response.data.room;
          } else if (response?.data?.room) {
            roomData = response.data.room;
          } else if (response?.room) {
            roomData = response.room;
          } else if (response?._id) {
            roomData = response;
          }

          if (roomData) {
            setRoom(roomData);
          } else {
            throw new Error("Không tìm thấy thông tin phòng");
          }
        } catch (err) {
          console.error("❌ Lỗi fetch room detail:", err);
          setError(err.message || "Lỗi khi tải thông tin phòng");
        } finally {
          setIsLoading(false);
        }
      };

      fetchRoomDetail();
    }
  }, [room, id]);

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
    if (room?.fullAddress) {
      return room.fullAddress;
    }
    if (room?.accommodation?.address) {
      const addr = room.accommodation.address;
      const parts = [];
      if (addr.ward) parts.push(addr.ward);
      if (addr.district) parts.push(addr.district);
      if (addr.city) parts.push(addr.city);
      return parts.join(", ") || "Địa chỉ đang cập nhật";
    }
    return "Địa chỉ đang cập nhật";
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const reportData = {
        reportType: reportForm.reportType,
        message: reportForm.message,
        fullname: reportForm.fullname,
        phone: reportForm.phone,
        email: reportForm.email,
        postId: room._id
      };

      const response = await fetch('http://localhost:8080/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Phản ánh đã được gửi thành công! Chúng tôi sẽ xem xét và phản hồi sớm nhất.');
        setIsReport(false);
        setReportForm({
          reportType: 'scam',
          message: '',
          fullname: '',
          phone: '',
          email: ''
        });
      } else {
        toast.error(`Lỗi: ${result.message || 'Không thể gửi phản ánh'}`);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Có lỗi xảy ra khi gửi phản ánh. Vui lòng thử lại.');
    }
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

  if (!room) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <div className="text-gray-400 text-6xl mb-4">🏠</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy phòng</h2>
        <p className="text-gray-600 mb-4">Phòng bạn tìm kiếm không tồn tại hoặc đã bị xóa</p>
        <button
          onClick={() => navigate("/search")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Tìm phòng khác
        </button>
      </div>
    );
  }

  const roomImages = room?.images && room.images.length > 0 
    ? room.images 
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

      <RentalRequestModal
        isOpen={isRentalRequest}
        onClose={() => setIsRentalRequest(false)}
        room={room}
      />

      {/* Left Column - 70% width */}
      <div className='w-[70%]'>
        <RoomImageSlider
          images={roomImages}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />

        {/* Main Content Card */}
        <div className='bg-white rounded-md shadow-md p-4'>
          <RoomInfo
            room={room}
            formatRoomType={formatRoomType}
            formatAddress={formatAddress}
          />
          
          {/* Description Section */}
          <div className='mt-8'>
            <h3 className='font-semibold text-xl my-4'>Thông tin mô tả</h3>
            <div className='flex flex-col gap-3'>
              <span>{room?.description || "Mô tả đang được cập nhật..."}</span>
            </div>
          </div>
          
          {/* Room Features Table */}
          <div className='mt-8'>
            <h3 className='font-semibold text-xl my-4'>Đặc điểm tin đăng</h3>
            <table className='w-full'>
              <tbody className='w-full'>
                <tr className='w-full'>
                  <td className='p-2'>Mã tin</td>
                  <td className='p-2'>#{room?._id?.slice(-6) || "000000"}</td>
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
                  <td className='p-2'>{room?.capacity || 1} người</td>
                </tr>
                <tr className='w-full'>
                  <td className='p-2'>Diện tích</td>
                  <td className='p-2'>{room?.size || 0} m²</td>
                </tr>
                <tr className='w-full bg-gray-200'>
                  <td className='p-2'>Ngày đăng</td>
                  <td className='p-2'>{new Date(room?.createdAt || Date.now()).toLocaleDateString('vi-VN')}</td>
                </tr>
                <tr className='w-full'>
                  <td className='p-2'>Trạng thái</td>
                  <td className='p-2'>
                    <span className={`px-2 py-1 rounded text-sm ${
                      room?.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {room?.isAvailable ? 'Còn trống' : 'Đã thuê'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Amenities */}
          {room?.amenities && room.amenities.length > 0 && (
            <div className='mt-8'>
              <h3 className='font-semibold text-xl my-4'>Tiện nghi</h3>
              <div className="grid grid-cols-2 gap-2">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {formatAmenity(amenity)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Utility Rates */}
          {room?.utilityRates && Object.keys(room.utilityRates).length > 0 && (
            <div className='mt-8'>
              <h3 className='font-semibold text-xl my-4'>Chi phí dịch vụ</h3>
              <table className='w-full'>
                <tbody className='w-full'>
                  {Object.entries(room.utilityRates).map(([key, value], index) =>
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
        <UserInfoBox
          room={room}
          isFavorited={isFavorited}
          setIsFavorited={setIsFavorited}
          setIsReport={setIsReport}
          setIsRentalRequest={setIsRentalRequest}
        />

        <NewestPosts />
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div
          className="fixed inset-0 bg-opacity backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullscreen(false)}
        >
          <div className="keen-slider w-full max-w-6xl h-[90vh]">
            {roomImages.map((img, i) => (
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

export default RoomDetail;