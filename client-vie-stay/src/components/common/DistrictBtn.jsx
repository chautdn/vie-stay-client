import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const DistrictBtn = ({ name, code }) => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const handleOnClick = () => {
        // Tạo search params mới với district được chọn
        const newParams = new URLSearchParams(searchParams)
        newParams.set('district', code)
        newParams.delete('page') // Reset về trang 1 khi filter mới
        
        // Navigate đến trang search với district params
        navigate(`/search?${newParams.toString()}`)
    }

    // Kiểm tra xem district này có đang được chọn không
    const isActive = searchParams.get('district') === code

    return (
        <button
            type='button'
            onClick={handleOnClick}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isActive 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300'
            }`}
        >
            {name}
        </button>
    )
}

export default DistrictBtn