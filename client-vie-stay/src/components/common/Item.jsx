import React, { memo, useState, useEffect, useCallback } from 'react'
import icons from '../../utils/icons'
import { useNavigate, Link } from 'react-router-dom'
import { formatVietnameseToString } from '../../utils/Common/formatVietnameseToString'
import { getSavedPosts, savePost, unsavePost, isPostSaved } from '../../utils/localStorage'

const { MdOutlineStarPurple500, IoIosHeart, IoIosHeartEmpty, BsBookmarkStarFill } = icons

const Item = ({ room }) => {
    const [isHoverHeart, setIsHoverHeart] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    
    // ✅ Extract data từ room object
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

    // ✅ Check saved status khi component mount và ID thay đổi
    useEffect(() => {
        if (id) {
            const savedStatus = isPostSaved(id)
            setIsSaved(savedStatus)
        }
    }, [id])

    // ✅ Listen for localStorage changes
    useEffect(() => {
        const handleSavedPostsChanged = (event) => {
            if (event.detail?.key === 'savedPosts' && id) {
                const newSavedStatus = isPostSaved(id)
                setIsSaved(newSavedStatus)
            }
        }

        window.addEventListener('savedPostsChanged', handleSavedPostsChanged)
        
        return () => {
            window.removeEventListener('savedPostsChanged', handleSavedPostsChanged)
        }
    }, [id])

    // ✅ Function để toggle save/unsave
    const handleToggleSave = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (!id) return

        const currentSavedStatus = isPostSaved(id)
        
        if (currentSavedStatus) {
            const success = unsavePost(id)
            if (success) {
                setIsSaved(false)
            }
        } else {
            const success = savePost(id)
            if (success) {
                setIsSaved(true)
            }
        }
    }, [id])
    
    // ✅ Memoize các computed values
    const displayImages = React.useMemo(() => {
        return Array.isArray(images) && images.length > 0 
            ? images.slice(0, 4) 
            : ['https://t3.ftcdn.net/jpg/02/15/15/46/360_F_215154625_hJg9QkfWH9Cu6LCTUc8TiuV6jQSI0C5X.jpg']
    }, [images])

    const stars = React.useMemo(() => {
        const starArray = []
        for (let i = 1; i <= +star; i++) {
            starArray.push(
                <MdOutlineStarPurple500 
                    key={i}
                    className='star-item' 
                    size={18} 
                    color='yellow' 
                />
            )
        }
        return starArray
    }, [star])

    const formattedAddress = React.useMemo(() => {
        if (fullAddress) return fullAddress
        
        const addressParts = []
        if (ward) addressParts.push(ward)
        if (district) addressParts.push(district)
        if (city) addressParts.push(city)
        
        return addressParts.length > 0 ? addressParts.join(', ') : 'Địa chỉ đang cập nhật'
    }, [fullAddress, ward, district, city])

    const formattedPrice = React.useMemo(() => {
        if (!baseRent) return '0 đ'
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(baseRent)
    }, [baseRent])

    const formattedSize = React.useMemo(() => {
        return size ? `${size}m²` : '0m²'
    }, [size])

    // ✅ Event handlers
    const handlePhoneCall = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if (user?.phone) {
            window.open(`tel:${user.phone}`)
        }
    }, [user?.phone])

    const handleZaloChat = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        // TODO: Implement Zalo integration
    }, [user?.phone])

    const handleImageError = useCallback((e) => {
        e.target.src = 'https://t3.ftcdn.net/jpg/02/15/15/46/360_F_215154625_hJg9QkfWH9Cu6LCTUc8TiuV6jQSI0C5X.jpg'
    }, [])

    const handleAvatarError = useCallback((e) => {
        e.target.src = "https://www.kindpng.com/picc/m/22-223863_no-avatar-png-circle-transparent-png.png"
    }, [])

    // ✅ Early return nếu không có room data
    if (!room || !id) {
        return null
    }

    return (
        <div className='w-full relative flex gap-5 border-t-2 border-orange-400 p-4 cursor-pointer'>
            <Link 
                to={`/chi-tiet/${formatVietnameseToString(title || 'phong-tro')}/${id}`} 
                className='w-2/5 grid grid-cols-2 gap-0.5 items-center cursor-pointer relative'
            >
                {[0, 1, 2, 3].map((index) => (
                    <img 
                        key={index} 
                        src={displayImages[index] || displayImages[0]} 
                        alt={`Preview ${index + 1}`} 
                        className='w-full h-[140px] object-cover' 
                        onError={handleImageError}
                        loading="lazy"
                    />
                ))}

                {/* Heart icon */}
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

                <span className='bg-black bg-opacity-50 text-white px-2 py-1 rounded-md absolute left-1 bottom-1 text-xs'>
                    {`${images.length || 1} ảnh`}
                </span>
            </Link>

            <div className='w-3/5'>
                <div className='items-center gap-1'>
                    <div className='flex items-center justify-between'>
                        <div className='flex'>
                            {stars.map((starElement, number) => (
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
                            {formattedPrice}
                        </span>
                        <span className='flex-1'>
                            {formattedSize}
                        </span>
                        <span className='flex-3 whitespace-nowrap overflow-hidden text-ellipsis'>
                            {formattedAddress}
                        </span>
                    </div>
                    
                    <p className='text-gray-500 w-full h-[100px] text-ellipsis overflow-hidden cursor-text'>
                        {description || 'Mô tả đang được cập nhật...'}
                    </p>
                    
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center my-3'>
                            <img 
                                src={user?.avatar || user?.profileImage || "https://www.kindpng.com/picc/m/22-223863_no-avatar-png-circle-transparent-png.png"}
                                alt="avatar" 
                                className='w-[30px] h-[30px] object-cover rounded-full'
                                onError={handleAvatarError}
                                loading="lazy"
                            />
                            <p className='ml-2'>{user?.name || 'Chủ trọ'}</p>
                        </div>
                        
                        <div className='flex items-center gap-1'>
                            <button
                                type='button'
                                className='bg-blue-500 text-white p-1 rounded-lg hover:bg-blue-600 transition-colors text-xs'
                                onClick={handlePhoneCall}
                                disabled={!user?.phone}
                            >
                                {user?.phone ? `Gọi ${user.phone}` : 'Chưa có SĐT'}
                            </button>
                            <button
                                type='button'
                                className='border border-blue-500 text-blue-500 p-1 rounded-lg hover:bg-blue-50 transition-colors text-xs'
                                onClick={handleZaloChat}
                                disabled={!user?.phone}
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

// ✅ Improved comparison function
const areEqual = (prevProps, nextProps) => {
    const prevRoom = prevProps.room
    const nextRoom = nextProps.room
    
    return (
        prevRoom?._id === nextRoom?._id &&
        prevRoom?.name === nextRoom?.name &&
        prevRoom?.baseRent === nextRoom?.baseRent &&
        prevRoom?.isAvailable === nextRoom?.isAvailable &&
        prevRoom?.user?.phone === nextRoom?.user?.phone &&
        JSON.stringify(prevRoom?.images) === JSON.stringify(nextRoom?.images)
    )
}

export default memo(Item, areEqual)
