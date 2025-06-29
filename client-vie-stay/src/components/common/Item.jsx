import React, { memo, useState, useEffect } from 'react'
import icons from '../../utils/icons'
import { useNavigate, Link } from 'react-router-dom'
import { formatVietnameseToString } from '../../utils/Common/formatVietnameseToString'

const { MdOutlineStarPurple500, IoIosHeart, IoIosHeartEmpty, BsBookmarkStarFill } = icons

// ✅ SỬA: Cập nhật props để nhận room object từ backend
const Item = ({ room }) => {
    const [isHoverHeart, setIsHoverHeart] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const navigate = useNavigate()
    
    // ✅ SỬA: Extract data từ room object
    const {
        _id: id,
        name: title,
        description,
        images = [],
        baseRent,
        size,
        fullAddress,
        district,
        ward,
        city,
        user,
        averageRating: star = 0,
        accommodation
    } = room || {}

    // ✅ THÊM: Check xem tin đã được lưu chưa khi component mount
    useEffect(() => {
        if (id) {
            const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]')
            setIsSaved(savedPosts.includes(id))
        }
    }, [id])

    // ✅ THÊM: Function để toggle save/unsave
    const handleToggleSave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (!id) return
        
        const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]')
        
        if (isSaved) {
            const updatedPosts = savedPosts.filter(postId => postId !== id)
            localStorage.setItem('savedPosts', JSON.stringify(updatedPosts))
            setIsSaved(false)
            console.log('Đã xóa tin khỏi danh sách đã lưu')
        } else {
            const updatedPosts = [...savedPosts, id]
            localStorage.setItem('savedPosts', JSON.stringify(updatedPosts))
            setIsSaved(true)
            console.log('Đã lưu tin')
        }
    }
    
    // ✅ SỬA: Xử lý images an toàn
    const displayImages = Array.isArray(images) && images.length > 0 
        ? images.slice(0, 4) 
        : ['https://t3.ftcdn.net/jpg/02/15/15/46/360_F_215154625_hJg9QkfWH9Cu6LCTUc8TiuV6jQSI0C5X.jpg']

    const handleStar = (starCount) => {
        let stars = []
        for (let i = 1; i <= +starCount; i++) {
            stars.push(
                <MdOutlineStarPurple500 
                    key={i}
                    className='star-item' 
                    size={18} 
                    color='yellow' 
                />
            )
        }
        return stars
    }

    // ✅ SỬA: Format địa chỉ từ backend data
    const formatAddress = () => {
        if (fullAddress) {
            return fullAddress
        }
        
        // Fallback format nếu không có fullAddress
        const addressParts = []
        if (ward) addressParts.push(ward)
        if (district) addressParts.push(district)
        if (city) addressParts.push(city)
        
        return addressParts.length > 0 ? addressParts.join(', ') : 'Địa chỉ đang cập nhật'
    }

    // ✅ SỬA: Format price
    const formatPrice = () => {
        if (!baseRent) return '0 đ'
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(baseRent)
    }

    // ✅ SỬA: Format size
    const formatSize = () => {
        return size ? `${size}m²` : '0m²'
    }

    return (
        <div className='w-full relative flex gap-5 border-t-2 border-orange-400 p-4 cursor-pointer'>
            <Link 
                to={`/chi-tiet/${formatVietnameseToString(title || 'phong-tro')}/${id}`} 
                className='w-2/5 grid grid-cols-2 gap-0.5 items-center cursor-pointer relative'
            >
                {/* ✅ SỬA: Hiển thị đủ 4 ảnh hoặc ảnh placeholder */}
                {[0, 1, 2, 3].map((index) => (
                    <img 
                        key={index} 
                        src={displayImages[index] || displayImages[0]} 
                        alt={`Preview ${index + 1}`} 
                        className='w-full h-[140px] object-cover' 
                        onError={(e) => {
                            e.target.src = 'https://t3.ftcdn.net/jpg/02/15/15/46/360_F_215154625_hJg9QkfWH9Cu6LCTUc8TiuV6jQSI0C5X.jpg'
                        }}
                    />
                ))}

                {/* ✅ SỬA: Biểu tượng trái tim với save functionality */}
                <span
                    className='absolute right-1 bottom-1 z-10 cursor-pointer p-1 rounded-full bg-black bg-opacity-20 hover:bg-opacity-40 transition-all'
                    onMouseEnter={() => setIsHoverHeart(true)}
                    onMouseLeave={() => setIsHoverHeart(false)}
                    onClick={handleToggleSave}
                    title={isSaved ? 'Xóa khỏi danh sách đã lưu' : 'Lưu tin này'}
                >
                    {isSaved ? (
                        <IoIosHeart size={24} color='red' />
                    ) : isHoverHeart ? (
                        <IoIosHeart size={24} color='pink' />
                    ) : (
                        <IoIosHeartEmpty size={24} color='white' />
                    )}
                </span>

                {/* Số lượng hình ảnh */}
                <span className='bg-black bg-opacity-50 text-white px-2 py-1 rounded-md absolute left-1 bottom-1 text-xs'>
                    {`${images.length || 1} ảnh`}
                </span>
            </Link>

            <div className='w-3/5'>
                <div className='items-center gap-1'>
                    <div className='flex items-center justify-between'>
                        <div className='flex'>
                            {handleStar(+star).map((starElement, number) => (
                                <span key={number}>{starElement}</span>
                            ))}
                        </div>
                        <div className='w-[10%] flex justify-end'>
                            <BsBookmarkStarFill size={24} color='orange' />
                        </div>
                    </div>
                    
                    <h3 className='text-red-600 font-medium ml-1 mt-2'>
                        {title || 'Phòng trọ'}
                    </h3>
                    
                    <div className='my-2 flex items-center justify-between overflow-hidden'>
                        <span className='font-bold flex-3 text-green-500'>
                            {formatPrice()}
                        </span>
                        <span className='flex-1'>
                            {formatSize()}
                        </span>
                        <span className='flex-3 whitespace-nowrap overflow-hidden text-ellipsis'>
                            {formatAddress()}
                        </span>
                    </div>
                    
                    <p className='text-gray-500 w-full h-[100px] text-ellipsis overflow-hidden cursor-text'>
                        {description || 'Mô tả đang được cập nhật...'}
                    </p>
                    
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center my-3'>
                            <img 
                                src={user?.avatar || "https://www.kindpng.com/picc/m/22-223863_no-avatar-png-circle-transparent-png.png"}
                                alt="avatar" 
                                className='w-[30px] h-[30px] object-cover rounded-full'
                                onError={(e) => {
                                    e.target.src = "https://www.kindpng.com/picc/m/22-223863_no-avatar-png-circle-transparent-png.png"
                                }}
                            />
                            <p className='ml-2'>{user?.name || 'Chủ trọ'}</p>
                        </div>
                        
                        <div className='flex items-center gap-1'>
                            <button
                                type='button'
                                className='bg-blue-500 text-white p-1 rounded-lg hover:bg-blue-600 transition-colors'
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (user?.phone) {
                                        window.open(`tel:${user.phone}`)
                                    }
                                }}
                            >
                                {`Gọi ${user?.phone || 'SĐT'}`}
                            </button>
                            <button
                                type='button'
                                className='border border-blue-500 text-blue-500 p-1 rounded-lg hover:bg-blue-50 transition-colors'
                                onClick={(e) => {
                                    e.preventDefault()
                                    // TODO: Implement Zalo integration
                                    console.log('Zalo chat with:', user?.phone)
                                }}
                            >
                                Nhắn zalo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Item)
