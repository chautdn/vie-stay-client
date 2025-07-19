import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import icons from '../../../utils/icons'

const { MdKeyboardArrowDown, MdKeyboardArrowUp } = icons

const Navigation = () => {
    const location = useLocation()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    
    const navigation = [
        { name: 'Trang chủ', path: '/', code: 'home' },
        { 
            name: 'Phòng trọ Đà Nẵng', 
            path: '/search?city=da-nang', 
            code: 'danang',
            hasDropdown: true,
            dropdownItems: [
                {
                    name: 'Cho thuê qua Web',
                    path: '/search?city=da-nang&type=room',
                    code: 'room-online',
                    description: 'Thuê trực tiếp qua website'
                },
                {
                    name: 'Danh sách bài đăng',
                    path: '/search?city=da-nang&type=post',
                    code: 'post-listing',
                    description: 'Xem thông tin liên hệ chủ nhà'
                }
            ]
        },
        { name: 'Blog', path: '/search?type=blog', code: 'blog' },
        { name: 'Tìm người ở ghép', path: '/search?propertyType=shared_room', code: 'shared' },
        { name: 'Bảng giá dịch vụ', path: '/bang-gia-dich-vu', code: 'serviceprice' }
    ]

    const isActive = (item) => {
        if (item.code === 'home') {
            return location.pathname === '/' && !location.search
        }
        
        // Check if current path matches any dropdown item
        if (item.hasDropdown) {
            return item.dropdownItems.some(dropdownItem => 
                location.pathname + location.search === dropdownItem.path
            )
        }
        
        return location.pathname + location.search === item.path
    }

    const isDropdownItemActive = (dropdownItem) => {
        return location.pathname + location.search === dropdownItem.path
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Close dropdown when location changes
    useEffect(() => {
        setIsDropdownOpen(false)
    }, [location])

    return (
        <div className='w-full flex justify-center items-center h-[40px] bg-secondary1 text-white'>
            <div className='w-3/5 h-full flex items-center text-sm font-medium'>
                {navigation.map(item => (
                    <div key={item.code} className='h-full flex justify-center items-center relative'>
                        {item.hasDropdown ? (
                            <div ref={dropdownRef} className='relative h-full'>
                                {/* Dropdown Trigger */}
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={`
                                        hover:bg-secondary2 h-full py-2 px-4 flex items-center gap-1 transition-colors
                                        ${isActive(item) ? 'bg-secondary2' : ''}
                                    `}
                                >
                                    {item.name}
                                    {isDropdownOpen ? (
                                        <MdKeyboardArrowUp size={16} />
                                    ) : (
                                        <MdKeyboardArrowDown size={16} />
                                    )}
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className='absolute top-full left-0 z-50 bg-white text-gray-800 shadow-lg rounded-b-md border border-gray-200 min-w-[280px]'>
                                        {item.dropdownItems.map(dropdownItem => (
                                            <NavLink
                                                key={dropdownItem.code}
                                                to={dropdownItem.path}
                                                className={`
                                                    block px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0
                                                    ${isDropdownItemActive(dropdownItem) ? 'bg-orange-50 text-orange-600' : ''}
                                                `}
                                            >
                                                <div className='flex flex-col'>
                                                    <span className='font-medium text-sm'>
                                                        {dropdownItem.name}
                                                    </span>
                                                    <span className='text-xs text-gray-500 mt-1'>
                                                        {dropdownItem.description}
                                                    </span>
                                                </div>
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <NavLink 
                                to={item.path}
                                className={`
                                    hover:bg-secondary2 h-full py-2 px-4 flex items-center transition-colors
                                    ${isActive(item) ? 'bg-secondary2' : ''}
                                `}
                            >
                                {item.name}
                            </NavLink>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Navigation