import React, { useState, useEffect } from 'react'
import { usePostStore } from '../../../store/postStore'
import { PostItem } from '../../../components/common'
import { getSavedPosts, clearAllSavedPosts } from '../../../utils/localStorage'

const SavedPosts = () => {
    const [savedPostIds, setSavedPostIds] = useState([])
    const [savedPosts, setSavedPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const { getPostById } = usePostStore()

    const loadSavedPosts = async () => {
        try {
            setLoading(true)
            const savedIds = getSavedPosts()
            setSavedPostIds(savedIds)

            if (savedIds.length > 0) {
                const postPromises = savedIds.map(async (id) => {
                    try {
                        const result = await getPostById(id)
                        let postData = null
                        if (result?.status === 'success' && result?.data?.post) {
                            postData = result.data.post
                        } else if (result?.data?.post) {
                            postData = result.data.post
                        } else if (result?.post) {
                            postData = result.post
                        } else if (result?._id) {
                            postData = result
                        }
                        return postData || null
                    } catch (error) {
                        return null
                    }
                })

                const posts = await Promise.all(postPromises)
                const validPosts = posts.filter(post => post !== null)
                setSavedPosts(validPosts)

                // Cleanup logic - chỉ xóa invalid IDs
                if (validPosts.length < savedIds.length) {
                    const validIds = validPosts.map(post => post._id?.toString() || post._id)
                    const invalidIds = savedIds.filter(id => !validIds.includes(id))

                    if (invalidIds.length > 0) {
                        const cleanedIds = savedIds.filter(id => validIds.includes(id))
                        localStorage.setItem('savedPosts', JSON.stringify(cleanedIds))
                        setSavedPostIds(cleanedIds)
                        window.dispatchEvent(new CustomEvent('savedPostsChanged', {
                            detail: { key: 'savedPosts', action: 'cleanup' }
                        }))
                    }
                }
            } else {
                setSavedPosts([])
            }
        } catch (error) {
            setSavedPosts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSavedPosts()
    }, [getPostById])

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
            setSavedPosts([])
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
                {savedPosts.map((post) => (
                    <PostItem
                        key={post._id?.toString() || post._id}
                        post={post}
                    />
                ))}
            </div>

            {savedPostIds.length > 0 && savedPosts.length === 0 && !loading && (
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