import React, { memo } from 'react'
import clsx from 'clsx'

const PageNumber = ({ text, currentPage, setCurrentPage, icon, pageValue }) => {

    const handleClick = () => {
        if (setCurrentPage && pageValue !== undefined) {
            setCurrentPage(pageValue)
        } else if (setCurrentPage && typeof text === 'number') {
            setCurrentPage(text)
        }
    }

    // Không clickable nếu là ellipsis hoặc không có setCurrentPage
    const isClickable = setCurrentPage && text !== '...'
    const isActive = typeof text === 'number' && text === currentPage

    return (
        <div
            className={clsx(
                'w-[46px] h-[48px] flex items-center justify-center cursor-pointer border transition-colors',
                {
                    'bg-orange-500 text-white border-orange-500': isActive,
                    'bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-300': !isActive && isClickable,
                    'bg-gray-100 text-gray-400 cursor-not-allowed': !isClickable,
                    'rounded-l': text === '‹ Trước',
                    'rounded-r': text === 'Tiếp ›',
                }
            )}
            onClick={isClickable ? handleClick : undefined}
        >
            {icon ? (
                <span className="flex items-center justify-center">
                    {icon}
                </span>
            ) : (
                <span className="text-sm font-medium">{text}</span>
            )}
        </div>
    )
}

export default memo(PageNumber)