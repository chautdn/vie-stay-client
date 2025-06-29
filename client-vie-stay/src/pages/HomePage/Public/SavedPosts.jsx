import React, { useState, useEffect } from 'react'
import { useRoomStore } from '../../../store/owner/roomStore'
import { Item } from '../../../components/common'
import { getSavedPosts } from '../../../utils/localStorage'

const SavedPosts = () => {
    const [savedPostIds, setSavedPostIds] = useState([])
    const [savedRooms, setSavedRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const { getRoomById } = useRoomStore()

    useEffect(() => {
        const loadSavedPosts = async () => {
            try {
                const savedIds = getSavedPosts()
                setSavedPostIds(savedIds)

                if (savedIds.length > 0) {
                    // Fetch details for each saved post
                    const roomPromises = savedIds.map(id => getRoomById(id))
                    const rooms = await Promise.all(roomPromises)
                    setSavedRooms(rooms.filter(room => room !== null))
                }
            } catch (error) {
                console.error('Error loading saved posts:', error)
            } finally {
                setLoading(false)
            }
        }

        loadSavedPosts()
    }, [getRoomById])

    // Listen for localStorage changes
    useEffect(() => {
        const handleStorageChange = () => {
            const savedIds = getSavedPosts()
            setSavedPostIds(savedIds)
            // Re-fetch room data if needed
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Đang tải tin đã lưu...</div>
            </div>
        )
    }

    if (savedPostIds.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <div className="text-gray-500 text-lg mb-4">
                    Bạn chưa lưu tin nào
                </div>
                <button
                    onClick={() => window.history.back()}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
                >
                    Quay lại trang chủ
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">
                Tin đã lưu ({savedPostIds.length})
            </h1>
            
            <div className="space-y-4">
                {savedRooms.map((room) => (
                    <Item
                        key={room.id}
                        id={room.id}
                        images={room.images}
                        user={room.user}
                        title={room.title}
                        attributes={room.attributes}
                        address={room.address}
                        description={room.description}
                        star={room.star}
                    />
                ))}
            </div>
        </div>
    )
}

export default SavedPosts