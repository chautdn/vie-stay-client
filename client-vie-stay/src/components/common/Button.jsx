import React, { memo } from 'react'

const Button = ({ 
    text, 
    textColor = 'text-gray-700', 
    bgColor = 'bg-gray-200', 
    IcAfter, 
    onClick, 
    fullWidth, 
    px = 'px-4'
}) => {
    return (
        <button
            type='button'
            className={`py-2 ${px} ${textColor} ${bgColor} ${fullWidth && 'w-full'} outline-none rounded-md hover:opacity-80 transition-opacity flex items-center justify-center gap-1`}
            onClick={onClick}
        >
            <span>{text}</span>
            {IcAfter && <span><IcAfter /></span>}
        </button>
    )
}

export default memo(Button)