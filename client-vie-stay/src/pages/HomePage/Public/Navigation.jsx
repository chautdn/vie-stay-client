import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const Navigation = () => {
    const location = useLocation()
    
    const navigation = [
        { name: 'Trang chủ', path: '/', code: 'home' },
        { name: 'Phòng trọ Đà Nẵng', path: '/search?city=da-nang', code: 'danang' },
        { name: 'Blog ', path: '/search?type=blog', code: 'blog' },
        { name: 'Tìm người ở ghép', path: '/search?type=shared', code: 'shared' }
    ]

    const isActive = (item) => {
        if (item.code === 'home') {
            return location.pathname === '/' && !location.search
        }
        return location.pathname + location.search === item.path
    }

    return (
        <div className='w-full flex justify-center items-center h-[40px] bg-secondary1 text-white'>
            <div className='w-3/5 h-full flex items-center text-sm font-medium'>
                {navigation.map(item => (
                    <div key={item.code} className='h-full flex justify-center items-center'>
                        <NavLink 
                            to={item.path}
                            className={
                                isActive(item)
                                    ? 'hover:bg-secondary2 h-full py-2 px-4 bg-secondary2 flex items-center' 
                                    : 'hover:bg-secondary2 h-full py-2 px-4 flex items-center'
                            }
                        >
                            {item.name}
                        </NavLink>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Navigation