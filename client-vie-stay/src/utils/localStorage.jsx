export const getSavedPosts = () => {
    try {
        return JSON.parse(localStorage.getItem('savedPosts') || '[]')
    } catch (error) {
        console.error('Error getting saved posts:', error)
        return []
    }
}

export const savePost = (postId) => {
    try {
        const savedPosts = getSavedPosts()
        if (!savedPosts.includes(postId)) {
            const updatedPosts = [...savedPosts, postId]
            localStorage.setItem('savedPosts', JSON.stringify(updatedPosts))
            return true
        }
        return false
    } catch (error) {
        console.error('Error saving post:', error)
        return false
    }
}

export const unsavePost = (postId) => {
    try {
        const savedPosts = getSavedPosts()
        const updatedPosts = savedPosts.filter(id => id !== postId)
        localStorage.setItem('savedPosts', JSON.stringify(updatedPosts))
        return true
    } catch (error) {
        console.error('Error unsaving post:', error)
        return false
    }
}

export const isPostSaved = (postId) => {
    try {
        const savedPosts = getSavedPosts()
        return savedPosts.includes(postId)
    } catch (error) {
        console.error('Error checking if post is saved:', error)
        return false
    }
}