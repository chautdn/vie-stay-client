import React, { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRoomStore } from '../../../store/owner/roomStore'
import { usePostStore } from '../../../store/postStore'
import { Button } from '../../../components/common'
import UnifiedItem from '../../../components/common/UnifiedItem'
import { sortByPackagePriority } from '../../../utils/packageStyles'

const List = ({ 
    categoryCode, 
    showPopular = false, 
    currentPage = 1, 
    resultsPerPage = 10,
    contentType = 'room' // 'room', 'post', hoặc 'all'
}) => {
    const [searchParams] = useSearchParams()
    const [sortBy, setSortBy] = useState('default')
    
    const { 
        searchRooms, 
        searchResults: roomResults, 
        isLoading: roomLoading, 
        getAllRooms, 
        rooms,
        getPopularRooms,
        popularRooms = []
    } = useRoomStore()

    const {
        searchPosts,
        searchResults: postResults,
        isLoading: postLoading,
        getAllPosts,
        posts,
        getFeaturedPosts,
        featuredPosts = []
    } = usePostStore()

    const isLoading = roomLoading || postLoading

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
            // Load popular content based on contentType
            if (contentType === 'room' || contentType === 'all') {
                getPopularRooms && getPopularRooms(20)
            }
            if (contentType === 'post' || contentType === 'all') {
                getFeaturedPosts && getFeaturedPosts({ limit: 20 })
            }
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
            
            // Search based on content type
            if (contentType === 'room' || contentType === 'all') {
                searchRooms(apiParams)
            }
            if (contentType === 'post' || contentType === 'all') {
                searchPosts && searchPosts(apiParams)
            }
        } else {
            // Load all content based on contentType
            if (contentType === 'room' || contentType === 'all') {
                getAllRooms()
            }
            if (contentType === 'post' || contentType === 'all') {
                getAllPosts && getAllPosts()
            }
        }
    }, [searchParams, categoryCode, showPopular, contentType])

    // Sort items based on package priority and merge room + post data
    const sortedItems = useMemo(() => {
        let allItems = []
        
        if (showPopular) {
            if (contentType === 'room') {
                allItems = popularRooms || []
            } else if (contentType === 'post') {
                allItems = featuredPosts || []
            } else { // contentType === 'all'
                allItems = [
                    ...(popularRooms || []).map(item => ({ ...item, itemType: 'room' })),
                    ...(featuredPosts || []).map(item => ({ ...item, itemType: 'post' }))
                ]
            }
        } else if (searchParams.toString()) {
            if (contentType === 'room') {
                allItems = roomResults || []
            } else if (contentType === 'post') {
                allItems = postResults || []
            } else { // contentType === 'all'
                allItems = [
                    ...(roomResults || []).map(item => ({ ...item, itemType: 'room' })),
                    ...(postResults || []).map(item => ({ ...item, itemType: 'post' }))
                ]
            }
        } else {
            if (contentType === 'room') {
                allItems = rooms || []
            } else if (contentType === 'post') {
                allItems = posts || []
            } else { // contentType === 'all'
                allItems = [
                    ...(rooms || []).map(item => ({ ...item, itemType: 'room' })),
                    ...(posts || []).map(item => ({ ...item, itemType: 'post' }))
                ]
            }
        }

        // Sort by package priority (featured posts first)
        return sortByPackagePriority(allItems)
    }, [
        showPopular, contentType, popularRooms, featuredPosts, 
        roomResults, postResults, rooms, posts, searchParams
    ])

    const startIndex = (currentPage - 1) * resultsPerPage
    const endIndex = startIndex + resultsPerPage
    const currentItems = sortedItems.slice(startIndex, endIndex)

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

    const getTitle = () => {
        if (showPopular) {
            if (contentType === 'room') return 'Phòng trọ nổi bật'
            if (contentType === 'post') return 'Tin đăng nổi bật'
            return 'Tin đăng nổi bật'
        }
        
        if (contentType === 'room') return 'Danh sách phòng trọ'
        if (contentType === 'post') return 'Danh sách tin đăng'
        return 'Danh sách tin đăng'
    }

    return (
        <div className='w-full p-2 bg-white shadow-md rounded-md px-6'>
            <div className='flex items-center justify-between my-3'>
                <h4 className='text-xl font-semibold'>
                    {getTitle()}
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

            <div className='items space-y-2'>
                {currentItems?.length > 0 ? (
                    currentItems.map(item => {
                        // Determine item type
                        const itemType = item.itemType || 
                                        (item.baseRent !== undefined ? 'room' : 'post')
                        
                        return (
                            <UnifiedItem
                                key={`${itemType}-${item._id}`}
                                item={item}
                                type={itemType}
                            />
                        )
                    })
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">
                            {contentType === 'post' ? '📝' : '🏠'}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            {showPopular 
                                ? `Chưa có ${contentType === 'post' ? 'tin đăng' : 'phòng trọ'} nổi bật`
                                : `Không tìm thấy ${contentType === 'post' ? 'tin đăng' : 'phòng trọ'} nào`
                            }
                        </h3>
                        <p className="text-gray-500">
                            {showPopular 
                                ? 'Hãy quay lại sau để xem các tin đăng được đánh giá cao'
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
        searchResults: roomSearchResults, 
        rooms,
        popularRooms = []
    } = useRoomStore()
    
    const {
        searchResults: postSearchResults,
        posts,
        featuredPosts = []
    } = usePostStore()
    
    return {
        roomSearchResults,
        postSearchResults,
        rooms,
        posts,
        popularRooms,
        featuredPosts
    }
}

export default List