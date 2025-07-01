export const getSavedPosts = () => {
    try {
        return JSON.parse(localStorage.getItem('savedPosts') || '[]')
    } catch (error) {
        return []
    }
}

export const savePost = (postId) => {
    try {
        const savedPosts = getSavedPosts()
        if (!savedPosts.includes(postId)) {
            const updatedPosts = [...savedPosts, postId]
            localStorage.setItem('savedPosts', JSON.stringify(updatedPosts))
            
            window.dispatchEvent(new CustomEvent('savedPostsChanged', {
                detail: { key: 'savedPosts', action: 'save', postId }
            }))
            
            return true
        }
        return false
    } catch (error) {
        return false
    }
}

export const unsavePost = (postId) => {
    try {
        const savedPosts = getSavedPosts()
        const updatedPosts = savedPosts.filter(id => id !== postId)
        localStorage.setItem('savedPosts', JSON.stringify(updatedPosts))
        
        window.dispatchEvent(new CustomEvent('savedPostsChanged', {
            detail: { key: 'savedPosts', action: 'unsave', postId }
        }))
        
        return true
    } catch (error) {
        return false
    }
}

export const isPostSaved = (postId) => {
    try {
        const savedPosts = getSavedPosts()
        return savedPosts.includes(postId)
    } catch (error) {
        return false
    }
}

export const clearAllSavedPosts = () => {
    try {
        localStorage.setItem('savedPosts', '[]')
        
        window.dispatchEvent(new CustomEvent('savedPostsChanged', {
            detail: { key: 'savedPosts', action: 'clearAll' }
        }))
        
        return true
    } catch (error) {
        return false
    }
}