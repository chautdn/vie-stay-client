import React, { useState, useEffect } from 'react'
import { useRoomStore } from '../../../store/owner/roomStore'
import { Item } from '../../../components/common'
import { getSavedPosts, clearAllSavedPosts } from '../../../utils/localStorage'

const SavedPosts = () => {
    const [savedPostIds, setSavedPostIds] = useState([])
    const [savedRooms, setSavedRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const { getRoomById } = useRoomStore()

    const loadSavedPosts = async () => {
        try {
            setLoading(true)
            const savedIds = getSavedPosts()
            setSavedPostIds(savedIds)

            if (savedIds.length > 0) {
                const roomPromises = savedIds.map(async (id) => {
                    try {
                        const result = await getRoomById(id)
                        
                        // ✅ Handle response structure từ store
                        let roomData = null
                        if (result?.status === 'success' && result?.data?.room) {
                            roomData = result.data.room
                        } else if (result?.data?.room) {
                            roomData = result.data.room
                        } else if (result?.room) {
                            roomData = result.room
                        } else if (result?._id) {
                            roomData = result
                        }
                        
                        return roomData || null
                    } catch (error) {
                        return null
                    }
                })
                
                const rooms = await Promise.all(roomPromises)
                const validRooms = rooms.filter(room => room !== null)
                setSavedRooms(validRooms)
                
                // ✅ Cleanup logic - chỉ xóa invalid IDs
                if (validRooms.length < savedIds.length) {
                    const validIds = validRooms.map(room => room._id?.toString() || room._id)
                    const invalidIds = savedIds.filter(id => !validIds.includes(id))
                    
                    if (invalidIds.length > 0) {
                        const cleanedIds = savedIds.filter(id => validIds.includes(id))
                        localStorage.setItem('savedPosts', JSON.stringify(cleanedIds))
                        setSavedPostIds(cleanedIds)
                        
                        // Dispatch event để notify other components
                        window.dispatchEvent(new CustomEvent('savedPostsChanged', {
                            detail: { key: 'savedPosts', action: 'cleanup' }
                        }))
                    }
                }
            } else {
                setSavedRooms([])
            }
        } catch (error) {
            // Silently handle error
            setSavedRooms([])
        } finally {
            setLoading(false)
        }
    }

    // ✅ Initial load
    useEffect(() => {
        loadSavedPosts()
    }, [getRoomById])

    // ✅ Listen for localStorage changes
    useEffect(() => {
        const handleSavedPostsChanged = (event) => {
            if (event.detail?.key === 'savedPosts') {
                if (event.detail?.action !== 'cleanup') {
                    loadSavedPosts()
                }
            }
        }

        const handleStorageChange = (event) => {
            if (event.key === 'savedPosts') {
                loadSavedPosts()
            }
        }

        window.addEventListener('savedPostsChanged', handleSavedPostsChanged)
        window.addEventListener('storage', handleStorageChange)
        
        return () => {
            window.removeEventListener('savedPostsChanged', handleSavedPostsChanged)
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [])

    const handleClearAll = () => {
        const success = clearAllSavedPosts()
        if (success) {
            setSavedPostIds([])
            setSavedRooms([])
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
                <div className="text-lg ml-4">Đang tải tin đã lưu...</div>
            </div>
        )
    }

    if (savedPostIds.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <div className="text-gray-500 text-xl mb-2">
                    Bạn chưa lưu tin nào
                </div>
                <div className="text-gray-400 text-sm mb-6">
                    Hãy lưu những tin đăng yêu thích để xem lại sau
                </div>
                <button
                    onClick={() => window.history.back()}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                    Quay lại trang chủ
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">
                    Tin đã lưu ({savedPostIds.length})
                </h1>
                
                <button
                    onClick={handleClearAll}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                    Xóa tất cả
                </button>
            </div>
            
            <div className="space-y-4">
                {savedRooms.map((room) => (
                    <Item
                        key={room._id?.toString() || room._id} 
                        room={room}
                    />
                ))}
            </div>
            
            {savedPostIds.length > 0 && savedRooms.length === 0 && !loading && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-5xl mb-4">⚠️</div>
                    <div className="text-gray-500 text-lg mb-2">
                        Không thể tải được tin đã lưu
                    </div>
                    <div className="text-gray-400 text-sm mb-4">
                        Có thể các tin này đã bị xóa hoặc không còn tồn tại
                    </div>
                    <button
                        onClick={handleClearAll}
                        className="text-orange-500 hover:text-orange-700 underline"
                    >
                        Làm sạch danh sách
                    </button>
                </div>
            )}
        </div>
    )
}

export default SavedPosts