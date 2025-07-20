import React, { memo } from 'react'
import icons from '../../utils/icons'
import { useNavigate, useSearchParams } from "react-router-dom"

const { GrNext } = icons

const ItemSidebar = ({ title, content, isDouble, type }) => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const handleFilterPosts = (code, item) => {
        // Tạo search params mới
        const newParams = new URLSearchParams(searchParams)

        // Chỉ filter cho post, sửa type thành propertyType cho đúng API post
        if (type === 'priceCode') {
            const currentMinRent = searchParams.get('minRent')
            const currentMaxRent = searchParams.get('maxRent')
            const isCurrentlySelected =
                currentMinRent === item.min?.toString() &&
                (item.max === null ? !currentMaxRent : currentMaxRent === item.max?.toString())

            if (isCurrentlySelected) {
                newParams.delete('minRent')
                newParams.delete('maxRent')
            } else {
                if (item.min !== undefined) newParams.set('minRent', item.min)
                if (item.max !== undefined && item.max !== null) {
                    newParams.set('maxRent', item.max)
                } else {
                    newParams.delete('maxRent')
                }
            }
        } else if (type === 'areaCode') {
            const currentMinSize = searchParams.get('minSize')
            const currentMaxSize = searchParams.get('maxSize')
            const isCurrentlySelected =
                currentMinSize === item.min?.toString() &&
                (item.max === null ? !currentMaxSize : currentMaxSize === item.max?.toString())

            if (isCurrentlySelected) {
                newParams.delete('minSize')
                newParams.delete('maxSize')
            } else {
                if (item.min !== undefined) newParams.set('minSize', item.min)
                if (item.max !== undefined && item.max !== null) {
                    newParams.set('maxSize', item.max)
                } else {
                    newParams.delete('maxSize')
                }
            }
        } else if (type === 'category') {
            // Sửa thành propertyType cho post
            const currentType = searchParams.get('propertyType')
            if (currentType === code) {
                newParams.delete('propertyType')
            } else {
                newParams.set('propertyType', code)
            }
        } else {
            const currentValue = searchParams.get(type)
            if (currentValue === code) {
                newParams.delete(type)
            } else {
                newParams.set(type, code)
            }
        }

        // Reset về trang 1
        newParams.delete('page')

        // Chuyển hướng chỉ tới trang /search (post)
        navigate({
            pathname: '/search',
            search: newParams.toString()
        })
    }

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
            // Sửa thành propertyType cho post
            return searchParams.get('propertyType') === item.code
        } else {
            return searchParams.get(type) === item.code
        }
    }

    if (isDouble) {
        const half = Math.ceil(content.length / 2)
        const firstColumn = content.slice(0, half)
        const secondColumn = content.slice(half)

        return (
            <div className='p-4 rounded-md bg-white w-full shadow-sm border border-gray-200'>
                <h3 className='text-lg font-semibold mb-4 text-gray-800'>
                    {title}
                </h3>
                <div className='flex gap-4'>
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
