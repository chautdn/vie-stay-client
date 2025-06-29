import React, { useEffect, useState, useRef } from 'react'
import { List, Pagination } from './index'
import { text } from '../../../utils/Constant'
import { ItemSidebar } from '../../../components/common'
import { useSearchParams } from 'react-router-dom'
import { useRoomStore } from '../../../store/owner/roomStore'
import Province from '../../../components/common/Province'

const HomePage = () => {
    const [params] = useSearchParams()
    const { getAllRooms, searchResults, rooms } = useRoomStore()
    
    const [currentPage, setCurrentPage] = useState(1)
    const resultsPerPage = 3
    const prevFiltersRef = useRef({})

    // ✅ THÊM: Theo dõi thay đổi filter để quyết định có reset page không
    useEffect(() => {
        const currentFilters = {
            type: params.get('type'),
            minRent: params.get('minRent'),
            maxRent: params.get('maxRent'),
            minSize: params.get('minSize'),
            maxSize: params.get('maxSize')
        }

        const prevFilters = prevFiltersRef.current

        // Kiểm tra xem có filter nào thay đổi không (không tính page)
        const filtersChanged = Object.keys(currentFilters).some(
            key => currentFilters[key] !== prevFilters[key]
        )

        if (filtersChanged) {
            // Chỉ reset page khi filter thay đổi, không phải khi chỉ đổi page
            setCurrentPage(1)
        }

        prevFiltersRef.current = currentFilters
    }, [params])

    // Categories cho Đà Nẵng
    const categories = [
        { code: 'single', value: 'Phòng trọ đơn' },
        { code: 'double', value: 'Phòng trọ đôi' },
        { code: 'shared', value: 'Phòng chia sẻ' },
        { code: 'studio', value: 'Phòng studio' },
        { code: 'apartment', value: 'Căn hộ mini' },
        { code: 'dormitory', value: 'Ký túc xá' }
    ]

    // Price ranges cho Đà Nẵng (VND)
    const prices = [
        { code: 'price1', value: 'Dưới 1.5 triệu', order: 1, min: 0, max: 1500000 },
        { code: 'price2', value: '1.5 - 2.5 triệu', order: 2, min: 1500000, max: 2500000 },
        { code: 'price3', value: '2.5 - 3.5 triệu', order: 3, min: 2500000, max: 3500000 },
        { code: 'price4', value: '3.5 - 5 triệu', order: 4, min: 3500000, max: 5000000 },
        { code: 'price5', value: '5 - 7 triệu', order: 5, min: 5000000, max: 7000000 },
        { code: 'price6', value: 'Trên 7 triệu', order: 6, min: 7000000, max: null }
    ]

    // Area ranges
    const areas = [
        { code: 'area1', value: 'Dưới 20m²', order: 1, min: 0, max: 20 },
        { code: 'area2', value: '20 - 30m²', order: 2, min: 20, max: 30 },
        { code: 'area3', value: '30 - 40m²', order: 3, min: 30, max: 40 },
        { code: 'area4', value: '40 - 60m²', order: 4, min: 40, max: 60 },
        { code: 'area5', value: '60 - 80m²', order: 5, min: 60, max: 80 },
        { code: 'area6', value: 'Trên 80m²', order: 6, min: 80, max: null }
    ]

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                await getAllRooms()
            } catch (error) {
                console.error('Error loading rooms:', error)
            }
        }

        loadInitialData()
    }, [params, getAllRooms])

    // ✅ THÊM: Tính toán total results
    const allRooms = params.toString() ? (searchResults || []) : (rooms || [])
    const totalResults = allRooms.length

    // Sắp xếp prices và areas theo order
    const sortedPrices = prices?.slice().sort((a, b) => a.order - b.order)
    const sortedAreas = areas?.slice().sort((a, b) => a.order - b.order)

    return (
        <div className='w-full flex flex-col gap-3'>
            {/* Header Section */}
            <div>
                <h1 className='text-[20px] font-bold text-center'>
                    {text?.HOME_TITLE || 'CHO THUÊ PHÒNG TRỌ TẠI ĐÀ NẴNG - GIÁ RẺ, TIỆN NGHI'}
                </h1>
                <p className='text-sm text-gray-700 text-center'>
                    {text?.HOME_DESCRIPTION || 'Tìm kiếm phòng trọ, nhà trọ tại Đà Nẵng với giá cả hợp lý và đầy đủ tiện nghi'}
                </p>
            </div>

            {/* Main Content */}
            <div>
                <Province />
                <div className='w-full flex gap-3'>
                    {/* Left Content - List + Pagination */}
                    <div className='w-[70%]'>
                        {/* ✅ SỬA: Truyền pagination props vào List */}
                        <List 
                            currentPage={currentPage}
                            resultsPerPage={resultsPerPage}
                        />
                        
                        {/* ✅ SỬA: Pagination chỉ có ở HomePage */}
                        {totalResults > resultsPerPage && (
                            <Pagination 
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalResults={totalResults}
                                resultsPerPage={resultsPerPage}
                            />
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className='w-[30%] flex flex-col gap-4 justify-start items-center'>
                        <ItemSidebar 
                            content={categories} 
                            title='Danh sách cho thuê' 
                            isDouble={false}
                            type='category'
                        />

                        <ItemSidebar 
                            content={sortedPrices} 
                            type='priceCode' 
                            title='Xem theo giá' 
                            isDouble={true} 
                        />

                        <ItemSidebar 
                            content={sortedAreas} 
                            type='areaCode' 
                            title='Xem theo diện tích' 
                            isDouble={true} 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage