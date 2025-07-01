import React from 'react'
import { Header, Intro } from '../../../components/common'
import { Outlet, useLocation } from 'react-router-dom'
import { Navigation, Search, ServicePrice } from './index'
import { Contact } from '../../../components/common'

const Home = () => {
    const location = useLocation();

    return (
        <div className='w-full flex gap-6 flex-col items-center h-full'>
            <Header />
            <Navigation />
            {location.pathname !== '/bang-gia-dich-vu' && (
                <>
                    <Search />
                </>
            )}
            <div className='w-4/5 lg:w-4/6 flex flex-col items-center justify-center mt-3'>
                <Outlet />
            </div>
            {location.pathname !== '/bang-gia-dich-vu' && (
                <>
                    <Intro/>
            <Contact />                
                </>
            )}
            <div className='h-[500px]'></div>
        </div>
    )
}

export default Home