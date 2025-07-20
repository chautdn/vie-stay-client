import React, { memo, useState, useEffect, useCallback } from 'react'
import icons from '../../utils/icons'
import { Link, useNavigate } from 'react-router-dom'
import { formatVietnameseToString } from '../../utils/Common/formatVietnameseToString'
import { getSavedPosts, savePost, unsavePost, isPostSaved } from '../../utils/localStorage'
import { getPackageStyle } from '../../utils/packageStyles'

const { MdOutlineStarPurple500, IoIosHeart, IoIosHeartEmpty, BsBookmarkStarFill, MdPhone, MdMessage } = icons

const PostItem = ({ post }) => {
    const [isHoverHeart, setIsHoverHeart] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const navigate = useNavigate()
    
    // Extract data từ post object
    const {
        _id: id,
        title,
        description,
        images = [],
        rent,
        area,
        address = {},
        contactName,
        contactPhone,
        contactEmail,
        userId,
        featuredType = 'THUONG',
        propertyType,
        amenities = [],
        viewCount = 0
    } = post || {}

    // Get package style
    const packageStyle = getPackageStyle(featuredType)

    // Check saved status
    useEffect(() => {
        if (id) {
            const savedStatus = isPostSaved(id)
            setIsSaved(savedStatus)
        }
    }, [id])

    // Listen for localStorage changes
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

    // Toggle save/unsave giống Item.jsx
    const handleToggleSave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!post._id) return
        const postId = post._id.toString()
        if (isPostSaved(postId)) {
            unsavePost(postId)
            setIsSaved(false)
        } else {
            savePost(postId)
            setIsSaved(true)
        }
    }
    
    // Memoize computed values
    const displayImages = React.useMemo(() => {
        return Array.isArray(images) && images.length > 0 
            ? images.slice(0, 4) 
            : ['https://t3.ftcdn.net/jpg/02/15/15/46/360_F_215154625_hJg9QkfWH9Cu6LCTUc8TiuV6jQSI0C5X.jpg']
    }, [images])

    const formattedAddress = React.useMemo(() => {
        const { street, ward, district } = address
        const addressParts = []
        
        if (street) addressParts.push(street)
        if (ward) addressParts.push(ward)
        if (district) addressParts.push(district)
        
        return addressParts.length > 0 ? addressParts.join(', ') : 'Địa chỉ đang cập nhật'
    }, [address])

    const formattedPrice = React.useMemo(() => {
        if (!rent) return '0 đ'
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(rent)
    }, [rent])

    const formattedSize = React.useMemo(() => {
        return area ? `${area}m²` : '0m²'
    }, [area])

    const propertyTypeText = React.useMemo(() => {
        const types = {
            'single_room': 'Phòng đơn',
            'shared_room': 'Phòng chia sẻ',
            'apartment': 'Căn hộ',
            'house': 'Nhà nguyên căn',
            'studio': 'Studio',
            'dormitory': 'Ký túc xá'
        }
        return types[propertyType] || 'Phòng trọ'
    }, [propertyType])

    // Event handlers
    const handleViewDetail = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!id) return

        if (post.roomId) {
            // Nếu có roomId, chuyển sang trang chi tiết phòng để thuê trực tiếp
            navigate(`/detail/${post?.roomId?._id}`)
        } else {
            // Nếu không có roomId, chuyển sang trang chi tiết post
            navigate(`/tin-dang/${id}`)
        }
    }, [id, title, post.roomId, navigate])

    const handlePhoneCall = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (contactPhone) {
            window.location.href = `tel:${contactPhone}`
        }
    }, [contactPhone])

    const handleImageError = useCallback((e) => {
        e.target.src = 'https://t3.ftcdn.net/jpg/02/15/15/46/360_F_215154625_hJg9QkfWH9Cu6LCTUc8TiuV6jQSI0C5X.jpg'
    }, [])

    const handleAvatarError = useCallback((e) => {
        e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    }, [])

    // Early return nếu không có post data
    if (!post || !id) {
        return null
    }

    return (
        <div className={`w-full relative flex gap-5 border-t-2 border-orange-400 p-4 cursor-pointer ${packageStyle.colorClass} ${packageStyle.animation}`}>
            {/* Package Badge */}
            {packageStyle.showBadge && (
                <div className="absolute top-2 left-2 z-10">
                    <span className={packageStyle.badgeClass}>
                        {packageStyle.badgeText}
                    </span>
                </div>
            )}

            <Link 
                to={`/tin-dang/${id}`} 
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
                        <div className='flex items-center gap-2'>
                            <span className='text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded'>
                                {propertyTypeText}
                            </span>
                            <span className='text-xs text-gray-500'>
                                {viewCount} lượt xem
                            </span>
                        </div>
                        <div className='w-[10%] flex justify-end'>
                            <BsBookmarkStarFill size={24} color='orange' />
                        </div>
                    </div>
                    
                    <h3 className={`ml-1 mt-2 ${packageStyle.titleClass}`}>
                        {title || 'Tin đăng'}
                    </h3>
                    
                    <div className='my-2 flex items-center justify-between overflow-hidden'>
                        <span className={`font-bold flex-3 ${packageStyle.priceClass}`}>
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
                                src={userId?.profileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                                alt="avatar" 
                                className='w-[30px] h-[30px] object-cover rounded-full'
                                onError={handleAvatarError}
                                loading="lazy"
                            />
                            <p className='ml-2'>{contactName || userId?.name || 'Người đăng'}</p>
                        </div>
                        
                        <div className='flex items-center gap-2'>
                            {/* Phone button - chỉ hiển thị cho VIP packages */}
                            {packageStyle.showCallButton && contactPhone && (
                                <button
                                    type='button'
                                    className='bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center gap-1'
                                    onClick={handlePhoneCall}
                                    title='Gọi điện ngay'
                                >
                                    <MdPhone size={16} />
                                    Gọi ngay
                                </button>
                            )}
                            
                            {/* View detail button */}
                            <button
                                type='button'
                                className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-1'
                                onClick={handleViewDetail}
                            >
                                <MdMessage size={16} />
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Improved comparison function
const areEqual = (prevProps, nextProps) => {
    const prevPost = prevProps.post
    const nextPost = nextProps.post
    
    return (
        prevPost?._id === nextPost?._id &&
        prevPost?.title === nextPost?.title &&
        prevPost?.rent === nextPost?.rent &&
        prevPost?.featuredType === nextPost?.featuredType &&
        JSON.stringify(prevPost?.images) === JSON.stringify(nextPost?.images)
    )
}

export default memo(PostItem, areEqual)