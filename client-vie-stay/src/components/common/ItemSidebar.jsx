import React, { memo } from 'react'
import icons from '../../utils/icons'
import { formatVietnameseToString } from '../../utils/Common/formatVietnameseToString'
import { Link } from 'react-router-dom'
import { createSearchParams, useNavigate, useSearchParams, useLocation } from "react-router-dom"

const { GrNext } = icons

const ItemSidebar = ({ title, content, isDouble, type }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const handleFilterPosts = (code, item) => {
        // Tạo search params mới
        const newParams = new URLSearchParams(searchParams)
        
        // Xử lý theo type khác nhau
        if (type === 'priceCode') {
            if (item.min !== undefined) newParams.set('minRent', item.min)
            if (item.max !== undefined && item.max !== null) newParams.set('maxRent', item.max)
            newParams.delete('priceCode') // Xóa priceCode cũ
        } else if (type === 'areaCode') {
            if (item.min !== undefined) newParams.set('minSize', item.min)
            if (item.max !== undefined && item.max !== null) newParams.set('maxSize', item.max)
            newParams.delete('areaCode') // Xóa areaCode cũ
        } else if (type === 'category') {
            newParams.set('type', code)
        } else {
            // Fallback cho các type khác
            newParams.set(type, code)
        }
        
        // Reset về trang 1
        newParams.delete('page')
        
        // Navigate với search params mới
        navigate({
            pathname: '/search',
            search: newParams.toString()
        })
    }

    if (isDouble) {
        // Split content into two columns if isDouble = true
        const half = Math.ceil(content.length / 2)
        const firstColumn = content.slice(0, half)
        const secondColumn = content.slice(half)

        return (
            <div className='p-4 rounded-md bg-white w-full shadow-sm border border-gray-200'>
                <h3 className='text-lg font-semibold mb-4 text-gray-800'>
                    {title}
                </h3>
                <div className='flex gap-4'>
                    {/* First Column */}
                    <div className='flex flex-col gap-2 w-1/2'>
                        {firstColumn.map(item => (
                            <div
                                key={item.code}
                                onClick={() => handleFilterPosts(item.code, item)}
                                className='flex items-center cursor-pointer hover:text-orange-600 border-b border-gray-200 border-dashed py-1 transition-colors'>
                                <GrNext size={10} color='gray' className='mr-2' />
                                <p className='text-sm'>{item.value}</p>
                            </div>
                        ))}
                    </div>
                    {/* Second Column */}
                    <div className='flex flex-col gap-2 w-1/2'>
                        {secondColumn.map(item => (
                            <div
                                key={item.code}
                                onClick={() => handleFilterPosts(item.code, item)}
                                className='flex items-center cursor-pointer hover:text-orange-600 border-b border-gray-200 border-dashed py-1 transition-colors'>
                                <GrNext size={10} color='gray' className='mr-2' />
                                <p className='text-sm'>{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    } else {
        // Single-column layout if isDouble = false
        return (
            <div className='p-4 rounded-md bg-white w-full shadow-sm border border-gray-200'>
                <h3 className='text-lg font-semibold mb-4 text-gray-800'>
                    {title}
                </h3>
                <div className='flex flex-col gap-2'>
                    {content.map(item => (
                        <div
                            key={item.code}
                            onClick={() => handleFilterPosts(item.code, item)}
                            className='flex items-center cursor-pointer hover:text-orange-600 border-b border-gray-200 border-dashed py-1 transition-colors'>
                            <GrNext size={10} color='gray' className='mr-2' />
                            <p className='text-sm'>{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default memo(ItemSidebar)
