import React, { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { usePostStore } from '../../../store/postStore'
import { Button } from '../../../components/common'
import PostItem from '../../../components/common/PostItem'
import { sortByPackagePriority } from '../../../utils/packageStyles'

const List = ({ 
    showPopular = false, 
    currentPage = 1, 
    resultsPerPage = 10,
}) => {
    const [searchParams] = useSearchParams()
    const [sortBy, setSortBy] = useState('default')
    const navigate = useNavigate()

    const {
        searchPosts,
        searchResults: postResults,
        isLoading: postLoading,
        getAllPosts,
        posts,
        getFeaturedPosts,
        featuredPosts = []
    } = usePostStore()

    const isLoading = postLoading

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

        if (showPopular) {
            getFeaturedPosts && getFeaturedPosts({ limit: 20 })
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
            searchPosts && searchPosts(apiParams)
        } else {
            getAllPosts && getAllPosts()
        }
    }, [searchParams, showPopular])

    // Chỉ dùng post, không merge với room
    const sortedItems = useMemo(() => {
        let allItems = []
        if (showPopular) {
            allItems = featuredPosts || []
        } else if (searchParams.toString()) {
            allItems = postResults || []
        } else {
            allItems = posts || []
        }

        // Nếu sau này có nhiều loại bài đăng (ví dụ: post, room, news...), sort theo loại trước
        // Hiện tại chỉ có post, nhưng vẫn giữ logic để mở rộng
        allItems = [...allItems].sort((a, b) => {
            // Đưa post lên đầu, các loại khác xuống dưới
            const aType = a.itemType || 'post'
            const bType = b.itemType || 'post'
            if (aType === bType) return 0
            return aType === 'post' ? -1 : 1
        })

        const sortedByPriority = sortByPackagePriority(allItems)

        // Sắp xếp
        if (sortBy === 'newest') {
            return [...sortedByPriority].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        } else if (sortBy === 'price') {
            return [...sortedByPriority].sort((a, b) => (a.baseRent || a.rent || 0) - (b.baseRent || b.rent || 0))
        } else if (sortBy === 'area') {
            return [...sortedByPriority].sort((a, b) => (b.size || b.area || 0) - (a.size || a.area || 0))
        }
        return sortedByPriority
    }, [showPopular, featuredPosts, postResults, posts, searchParams, sortBy])

    const startIndex = (currentPage - 1) * resultsPerPage
    const endIndex = startIndex + resultsPerPage
    const currentItems = sortedItems.slice(startIndex, endIndex)

    const handleSort = (type) => {
        setSortBy(type)
    }

    // Khi click vào post
    const handlePostClick = (post) => {
        if (post.roomId) {
            const id = (post.roomId._id || post.roomId).toString()
            navigate(`/detail/${id}`)
        } else {
            navigate(`/tin-dang/${id}`)
        }
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
                    {showPopular ? 'Tin đăng nổi bật' : 'Danh sách tin đăng'}
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
                    currentItems.map(post => (
                        <div key={post._id} onClick={() => handlePostClick(post)} className="cursor-pointer">
                            <PostItem post={post} />
                        </div>
                    ))
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