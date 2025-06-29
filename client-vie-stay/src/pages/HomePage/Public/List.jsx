import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRoomStore } from '../../../store/owner/roomStore'
import { Button, Item } from '../../../components/common'

const List = ({ 
    categoryCode, 
    showPopular = false, 
    currentPage = 1, 
    resultsPerPage = 10 
}) => {
    const [searchParams] = useSearchParams()
    const [sortBy, setSortBy] = useState('default')
    
    const { 
        searchRooms, 
        searchResults, 
        isLoading, 
        getAllRooms, 
        rooms,
        getPopularRooms,
        popularRooms = []
    } = useRoomStore()

    useEffect(() => {
        let params = []
        for (let entry of searchParams.entries()) {
            params.push(entry);
        }
        
        let searchParamsObject = {}
        params?.forEach(i => {
            if (Object.keys(searchParamsObject)?.some(item => item === i[0])) {
                searchParamsObject[i[0]] = [...searchParamsObject[i[0]], i[1]]
            } else {
                searchParamsObject = { ...searchParamsObject, [i[0]]: [i[1]] }
            }
        })

        if (categoryCode) searchParamsObject.categoryCode = categoryCode

        if (showPopular) {
            getPopularRooms && getPopularRooms(20)
        } else if (Object.keys(searchParamsObject).length > 0) {
            const apiParams = {}
            Object.keys(searchParamsObject).forEach(key => {
                if (key !== 'page') {
                    const value = searchParamsObject[key][0]
                    if (['minRent', 'maxRent', 'minSize', 'maxSize', 'capacity'].includes(key)) {
                        apiParams[key] = parseInt(value)
                    } else if (key === 'isAvailable') {
                        apiParams[key] = value === 'true'
                    } else {
                        apiParams[key] = value
                    }
                }
            })
            searchRooms(apiParams)
        } else {
            getAllRooms()
        }
    }, [searchParams, categoryCode, showPopular])

    const allRooms = showPopular 
        ? (popularRooms || [])
        : (searchParams.toString() ? (searchResults || []) : (rooms || []))

    const startIndex = (currentPage - 1) * resultsPerPage
    const endIndex = startIndex + resultsPerPage
    const currentRooms = allRooms.slice(startIndex, endIndex)

    const handleSort = (type) => {
        setSortBy(type)
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    return (
        <div className='w-full p-2 bg-white shadow-md rounded-md px-6'>
            <div className='flex items-center justify-between my-3'>
                <h4 className='text-xl font-semibold'>
                    {showPopular ? 'Phòng trọ nổi bật' : 'Danh sách tin đăng'}
                </h4>
                <span>Cập nhật: {new Date().toLocaleString('vi-VN')}</span>
            </div>
            
            {!showPopular && (
                <div className='flex items-center gap-2 my-2'>
                    <span>Sắp xếp:</span>
                    <Button 
                        bgColor={sortBy === 'default' ? 'bg-orange-500' : 'bg-gray-200'} 
                        textColor={sortBy === 'default' ? 'text-white' : 'text-gray-700'}
                        text='Mặc định' 
                        onClick={() => handleSort('default')}
                    />
                    <Button 
                        bgColor={sortBy === 'newest' ? 'bg-orange-500' : 'bg-gray-200'}
                        textColor={sortBy === 'newest' ? 'text-white' : 'text-gray-700'}
                        text='Mới nhất' 
                        onClick={() => handleSort('newest')}
                    />
                    <Button 
                        bgColor={sortBy === 'price' ? 'bg-orange-500' : 'bg-gray-200'}
                        textColor={sortBy === 'price' ? 'text-white' : 'text-gray-700'}
                        text='Giá thấp đến cao' 
                        onClick={() => handleSort('price')}
                    />
                    <Button 
                        bgColor={sortBy === 'area' ? 'bg-orange-500' : 'bg-gray-200'}
                        textColor={sortBy === 'area' ? 'text-white' : 'text-gray-700'}
                        text='Diện tích' 
                        onClick={() => handleSort('area')}
                    />
                </div>
            )}

            <div className='items'>
                {currentRooms?.length > 0 ? (
                    currentRooms.map(room => (
                        <Item
                            key={room?._id}
                            room={room}
                        />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🏠</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            {showPopular ? 'Chưa có phòng nổi bật' : 'Không tìm thấy phòng nào'}
                        </h3>
                        <p className="text-gray-500">
                            {showPopular 
                                ? 'Hãy quay lại sau để xem các phòng được đánh giá cao'
                                : 'Thử thay đổi tiêu chí tìm kiếm của bạn'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export const useListData = () => {
    const { 
        searchResults, 
        rooms,
        popularRooms = []
    } = useRoomStore()
    
    return {
        searchResults,
        rooms,
        popularRooms
    }
}

export default List