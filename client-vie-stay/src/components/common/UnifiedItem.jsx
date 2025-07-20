import React from 'react'
import Item from './Item'
import PostItem from './PostItem'

const UnifiedItem = ({ item, type }) => {
    if (type === 'post') {
        return <PostItem post={item} />
    } else {
        return <Item room={item} />
    }
}

export default UnifiedItem