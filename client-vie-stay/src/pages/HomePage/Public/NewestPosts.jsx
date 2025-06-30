import React, { useEffect } from 'react'
import { useRoomStore } from '../../../store/owner/roomStore'
import { NewPostItem } from '../../../components/common'

const NewestPosts = () => {
    const { getNewestRoom, rooms, isLoading } = useRoomStore()

    useEffect(() => {
        const loadNewestRooms = async () => {
            try {
                await getNewestRoom()
            } catch (error) {
                console.error('Error loading newest rooms:', error)
            }
        }

        loadNewestRooms()
    }, [getNewestRoom])

    if (isLoading) {
        return (
            <div className="w-full bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Tin đăng mới nhất</h3>
                <div className="space-y-3">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="animate-pulse flex">
                            <div className="w-16 h-16 bg-gray-300 rounded mr-3"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                <div className="h-3 bg-gray-300 rounded w-1/2 mb-1"></div>
                                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (!rooms || rooms.length === 0) {
        return (
            <div className="w-full bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Tin đăng mới nhất</h3>
                <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">📋</div>
                    <p className="text-gray-500">Chưa có tin đăng mới</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
                Tin đăng mới nhất ({rooms.length})
            </h3>
            
            <div className="space-y-0">
                {rooms.map((room) => (
                    <NewPostItem
                        key={room._id || room.id}
                        room={room}
                    />
                ))}
            </div>
            
            {/* Show more link */}
            {rooms.length >= 10 && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Xem tất cả tin đăng →
                    </button>
                </div>
            )}
        </div>
    )
}

export default NewestPosts