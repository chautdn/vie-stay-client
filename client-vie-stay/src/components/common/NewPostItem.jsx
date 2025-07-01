import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { formatVietnameseToString } from '../../utils/Common/formatVietnameseToString'

const NewPostItem = ({ room }) => {
    // Extract data từ room object
    const {
        _id: id,
        name: title,
        images = [],
        baseRent,
        size,
        fullAddress,
        user,
        createdAt
    } = room || {}

    // Format price
    const formatPrice = () => {
        if (!baseRent) return '0 đ'
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(baseRent)
    }

    // Format size
    const formatSize = () => {
        return size ? `${size}m²` : '0m²'
    }

    // Format date
    const formatDate = () => {
        if (!createdAt) return ''
        const date = new Date(createdAt)
        return date.toLocaleDateString('vi-VN')
    }

    // Get first image
    const displayImage = Array.isArray(images) && images.length > 0 
        ? images[0] 
        : 'https://t3.ftcdn.net/jpg/02/15/15/46/360_F_215154625_hJg9QkfWH9Cu6LCTUc8TiuV6jQSI0C5X.jpg'

    if (!room || !id) {
        return null
    }

    return (
        <Link 
            to={`/chi-tiet/${formatVietnameseToString(title || 'phong-tro')}/${id}`}
            className='w-full flex border-b border-gray-200 py-3 hover:bg-gray-50 transition-colors'
        >
            {/* Image */}
            <div className='w-16 h-16 flex-shrink-0 mr-3'>
                <img 
                    src={displayImage}
                    alt={title || 'Phòng trọ'}
                    className='w-full h-full object-cover rounded'
                    onError={(e) => {
                        e.target.src = 'https://t3.ftcdn.net/jpg/02/15/15/46/360_F_215154625_hJg9QkfWH9Cu6LCTUc8TiuV6jQSI0C5X.jpg'
                    }}
                />
            </div>

            {/* Content */}
            <div className='flex-1 min-w-0'>
                {/* Title */}
                <h4 className='text-sm font-medium text-blue-600 hover:text-blue-800 line-clamp-2 mb-1'>
                    {title || 'Phòng trọ'}
                </h4>
                
                {/* Price and Size */}
                <div className='flex items-center gap-2 text-xs text-gray-600 mb-1'>
                    <span className='text-green-600 font-medium'>
                        {formatPrice()}
                    </span>
                    <span>•</span>
                    <span>{formatSize()}</span>
                </div>

                {/* Address */}
                <p className='text-xs text-gray-500 line-clamp-1 mb-1'>
                    {fullAddress || 'Địa chỉ đang cập nhật'}
                </p>

                {/* Date */}
                <p className='text-xs text-gray-400'>
                    {formatDate()}
                </p>
            </div>
        </Link>
    )
}

export default memo(NewPostItem)