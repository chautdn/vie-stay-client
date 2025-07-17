import React, { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRoomStore } from '../../../store/owner/roomStore'
import { usePostStore } from '../../../store/postStore'
import { Button } from '../../../components/common'
import { Item } from '../../../components/common'
import PostItem from '../../../components/common/PostItem'
import { sortByPackagePriority } from '../../../utils/packageStyles'

const List = ({ 
    categoryCode, 
    showPopular = false, 
    currentPage = 1, 
    resultsPerPage = 10,
    contentType = 'all' // 'room', 'post', hoặc 'all'
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
            // Load popular data
            if (contentType === 'room') {
                getPopularRooms && getPopularRooms({ limit: 20 })
            } else if (contentType === 'post') {
                getFeaturedPosts && getFeaturedPosts({ limit: 20 })
            } else {
                // Load both
                getPopularRooms && getPopularRooms({ limit: 20 })
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
            
            // Search based on contentType
            if (contentType === 'room') {
                searchRooms && searchRooms(apiParams)
            } else if (contentType === 'post') {
                searchPosts && searchPosts(apiParams)
            } else {
                // Search both
                searchRooms && searchRooms(apiParams)
                searchPosts && searchPosts(apiParams)
            }
        } else {
            // Load all data based on contentType
            if (contentType === 'room') {
                getAllRooms && getAllRooms()
            } else if (contentType === 'post') {
                getAllPosts && getAllPosts()
            } else {
                // Load both
                getAllRooms && getAllRooms()
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
            } else {
                // Merge both popular rooms and featured posts
                const roomsWithType = (popularRooms || []).map(room => ({ ...room, itemType: 'room' }))
                const postsWithType = (featuredPosts || []).map(post => ({ ...post, itemType: 'post' }))
                allItems = [...roomsWithType, ...postsWithType]
            }
        } else if (searchParams.toString()) {
            if (contentType === 'room') {
                allItems = roomResults || []
            } else if (contentType === 'post') {
                allItems = postResults || []
            } else {
                // Merge both search results
                const roomsWithType = (roomResults || []).map(room => ({ ...room, itemType: 'room' }))
                const postsWithType = (postResults || []).map(post => ({ ...post, itemType: 'post' }))
                allItems = [...roomsWithType, ...postsWithType]
            }
        } else {
            if (contentType === 'room') {
                allItems = rooms || []
            } else if (contentType === 'post') {
                allItems = posts || []
            } else {
                // Merge both all data
                const roomsWithType = (rooms || []).map(room => ({ ...room, itemType: 'room' }))
                const postsWithType = (posts || []).map(post => ({ ...post, itemType: 'post' }))
                allItems = [...roomsWithType, ...postsWithType]
            }
        }

        // Sort by package priority (featured items first)
        const sortedByPriority = sortByPackagePriority(allItems)
        
        // Apply additional sorting based on sortBy
        if (sortBy === 'newest') {
            return sortedByPriority.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        } else if (sortBy === 'price') {
            return sortedByPriority.sort((a, b) => (a.baseRent || a.rent || 0) - (b.baseRent || b.rent || 0))
        } else if (sortBy === 'area') {
            return sortedByPriority.sort((a, b) => (b.size || b.area || 0) - (a.size || a.area || 0))
        }
        
        return sortedByPriority
    }, [
        showPopular, contentType, popularRooms, featuredPosts, 
        roomResults, postResults, rooms, posts, searchParams, sortBy
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
            return contentType === 'room' ? 'Phòng trọ nổi bật' : 
                   contentType === 'post' ? 'Tin đăng nổi bật' : 
                   'Nổi bật'
        }
        return contentType === 'room' ? 'Danh sách phòng trọ' : 
               contentType === 'post' ? 'Danh sách tin đăng' : 
               'Danh sách phòng trọ & tin đăng'
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
                        // Render based on item type
                        if (item.itemType === 'post' || (!item.itemType && item.title)) {
                            return (
                                <PostItem
                                    key={item._id}
                                    post={item}
                                />
                            )
                        } else {
                            return (
                                <Item
                                    key={item._id}
                                    room={item}
                                />
                            )
                        }
                    })
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🏠</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            {showPopular 
                                ? 'Chưa có mục nổi bật'
                                : 'Không tìm thấy kết quả nào'
                            }
                        </h3>
                        <p className="text-gray-500">
                            {showPopular 
                                ? 'Hãy quay lại sau để xem các mục được đánh giá cao'
                                : 'Thử thay đổi tiêu chí tìm kiếm của bạn'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* ✅ THÊM: Hiển thị thông tin tổng kết */}
            <div className='mt-4 p-2 bg-gray-50 rounded text-sm text-gray-600'>
                Hiển thị {Math.min(startIndex + 1, sortedItems.length)} - {Math.min(endIndex, sortedItems.length)} 
                trong tổng số {sortedItems.length} kết quả
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
        rooms,
        popularRooms,
        postSearchResults,
        posts,
        featuredPosts
    }
}

export default List