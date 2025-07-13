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
            // ✅ SỬA: Kiểm tra nếu filter hiện tại đã được chọn
            const currentMinRent = searchParams.get('minRent')
            const currentMaxRent = searchParams.get('maxRent')
            
            const isCurrentlySelected = 
                currentMinRent === item.min?.toString() && 
                (item.max === null ? !currentMaxRent : currentMaxRent === item.max?.toString())
            
            if (isCurrentlySelected) {
                // Nếu đang chọn thì bỏ chọn
                newParams.delete('minRent')
                newParams.delete('maxRent')
            } else {
                // Nếu chưa chọn thì set filter mới
                if (item.min !== undefined) newParams.set('minRent', item.min)
                if (item.max !== undefined && item.max !== null) {
                    newParams.set('maxRent', item.max)
                } else {
                    // ✅ SỬA: Với "Trên X triệu" thì xóa maxRent
                    newParams.delete('maxRent')
                }
            }
            newParams.delete('priceCode') // Xóa priceCode cũ
        } else if (type === 'areaCode') {
            // ✅ SỬA: Kiểm tra nếu filter hiện tại đã được chọn
            const currentMinSize = searchParams.get('minSize')
            const currentMaxSize = searchParams.get('maxSize')
            
            const isCurrentlySelected = 
                currentMinSize === item.min?.toString() && 
                (item.max === null ? !currentMaxSize : currentMaxSize === item.max?.toString())
            
            if (isCurrentlySelected) {
                // Nếu đang chọn thì bỏ chọn
                newParams.delete('minSize')
                newParams.delete('maxSize')
            } else {
                // Nếu chưa chọn thì set filter mới
                if (item.min !== undefined) newParams.set('minSize', item.min)
                if (item.max !== undefined && item.max !== null) {
                    newParams.set('maxSize', item.max)
                } else {
                    // ✅ SỬA: Với "Trên X m²" thì xóa maxSize
                    newParams.delete('maxSize')
                }
            }
            newParams.delete('areaCode') // Xóa areaCode cũ
        } else if (type === 'category') {
            // ✅ SỬA: Toggle category filter
            const currentType = searchParams.get('type')
            if (currentType === code) {
                newParams.delete('type')
            } else {
                newParams.set('type', code)
            }
        } else {
            // Fallback cho các type khác
            const currentValue = searchParams.get(type)
            if (currentValue === code) {
                newParams.delete(type)
            } else {
                newParams.set(type, code)
            }
        }
        
        // Reset về trang 1
        newParams.delete('page')
        
        // Navigate với search params mới
        navigate({
            pathname: '/search',
            search: newParams.toString()
        })
    }

    // ✅ THÊM: Function để check item có được chọn không
    const isItemSelected = (item) => {
        if (type === 'priceCode') {
            const currentMinRent = searchParams.get('minRent')
            const currentMaxRent = searchParams.get('maxRent')
            
            return currentMinRent === item.min?.toString() && 
                   (item.max === null ? !currentMaxRent : currentMaxRent === item.max?.toString())
        } else if (type === 'areaCode') {
            const currentMinSize = searchParams.get('minSize')
            const currentMaxSize = searchParams.get('maxSize')
            
            return currentMinSize === item.min?.toString() && 
                   (item.max === null ? !currentMaxSize : currentMaxSize === item.max?.toString())
        } else if (type === 'category') {
            return searchParams.get('type') === item.code
        } else {
            return searchParams.get(type) === item.code
        }
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
                                className={`flex items-center cursor-pointer border-b border-gray-200 border-dashed py-1 transition-colors ${
                                    isItemSelected(item) 
                                        ? 'text-orange-600 font-medium' 
                                        : 'hover:text-orange-600'
                                }`}>
                                <GrNext size={10} color={isItemSelected(item) ? '#ea580c' : 'gray'} className='mr-2' />
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
                                className={`flex items-center cursor-pointer border-b border-gray-200 border-dashed py-1 transition-colors ${
                                    isItemSelected(item) 
                                        ? 'text-orange-600 font-medium' 
                                        : 'hover:text-orange-600'
                                }`}>
                                <GrNext size={10} color={isItemSelected(item) ? '#ea580c' : 'gray'} className='mr-2' />
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
                            className={`flex items-center cursor-pointer border-b border-gray-200 border-dashed py-1 transition-colors ${
                                isItemSelected(item) 
                                    ? 'text-orange-600 font-medium' 
                                    : 'hover:text-orange-600'
                            }`}>
                            <GrNext size={10} color={isItemSelected(item) ? '#ea580c' : 'gray'} className='mr-2' />
                            <p className='text-sm'>{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default memo(ItemSidebar)
