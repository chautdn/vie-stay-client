import React, { useCallback, useEffect, useState } from 'react'
import { SearchItem, Modal } from '../../../components/common'
import icons from '../../../utils/icons'
import { useNavigate, createSearchParams, useLocation } from 'react-router-dom'
import { useRoomStore } from '../../../store/owner/roomStore'

const { BsChevronRight, HiOutlineLocationMarker, TbReportMoney, RiCrop2Line, MdOutlineHouseSiding, FiSearch, AiOutlinePlusCircle } = icons

const Search = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isShowModal, setIsShowModal] = useState(false)
    const [content, setContent] = useState([])
    const [name, setName] = useState('')
    const [queries, setQueries] = useState({})
    const [arrMinMax, setArrMinMax] = useState({})
    const [defaultText, setDefaultText] = useState('')

    // Zustand store
    const { searchRooms, isLoading } = useRoomStore()

    const roomTypes = [
        { code: 'single', value: 'Phòng trọ đơn' },
        { code: 'double', value: 'Phòng trọ đôi' },
        { code: 'shared', value: 'Phòng chia sẻ' },
        { code: 'studio', value: 'Phòng studio' },
        { code: 'apartment', value: 'Căn hộ mini' },
        { code: 'dormitory', value: 'Ký túc xá' }
    ]

    const districts = [
        { code: 'hai-chau', value: 'Hải Châu' },
        { code: 'thanh-khe', value: 'Thanh Khê' },
        { code: 'son-tra', value: 'Sơn Trà' },
        { code: 'ngu-hanh-son', value: 'Ngũ Hành Sơn' },
        { code: 'lien-chieu', value: 'Liên Chiểu' },
        { code: 'cam-le', value: 'Cẩm Lệ' },
        { code: 'hoa-vang', value: 'Hoà Vang' }
    ]

    const features = [
        { code: 'thang_may', value: 'Có thang máy' },
        { code: 'wifi', value: 'Wifi miễn phí' },
        { code: 'may_giat', value: 'Máy giặt' },
        { code: 'dieu_hoa', value: 'Điều hoà' },
        { code: 'ban_cong', value: 'Ban công' },
        { code: 'noi_that_day_du', value: 'Nội thất đầy đủ' },
        { code: 'cho_phep_nuoi_thu_cung', value: 'Cho phép nuôi thú cưng' },
        { code: 'cho_phep_nau_an', value: 'Cho phép nấu ăn' },
        { code: 'cho_de_xe', value: 'Chỗ để xe' },
    ]

    // ✅ SỬA: Fix prices with proper min/max values
    const prices = [
        { code: 'price1', value: 'Dưới 1.5 triệu', min: 0, max: 1500000 },
        { code: 'price2', value: '1.5 - 2.5 triệu', min: 1500000, max: 2500000 },
        { code: 'price3', value: '2.5 - 3.5 triệu', min: 2500000, max: 3500000 },
        { code: 'price4', value: '3.5 - 5 triệu', min: 3500000, max: 5000000 },
        { code: 'price5', value: '5 - 7 triệu', min: 5000000, max: 7000000 },
        { code: 'price6', value: 'Trên 7 triệu', min: 7000000, max: null }
    ]

    // ✅ SỬA: Fix areas with proper min/max values
    const areas = [
        { code: 'area1', value: 'Dưới 20m²', min: 0, max: 20 },
        { code: 'area2', value: '20 - 30m²', min: 20, max: 30 },
        { code: 'area3', value: '30 - 40m²', min: 30, max: 40 },
        { code: 'area4', value: '40 - 60m²', min: 40, max: 60 },
        { code: 'area5', value: '60 - 80m²', min: 60, max: 80 },
        { code: 'area6', value: 'Trên 80m²', min: 80, max: null }
    ]

    useEffect(() => {
        if (!location?.pathname.includes('/search')) {
            setArrMinMax({})
            setQueries({})
        }
    }, [location])

    const handleShowModal = (content, name, defaultText) => {
        setContent(content)
        setName(name)
        setDefaultText(defaultText)
        setIsShowModal(true)
    }

    const handleSubmit = useCallback((e, query, arrMaxMin) => {
        e.stopPropagation()
        setQueries(prev => ({ ...prev, ...query }))
        setIsShowModal(false)
        arrMaxMin && setArrMinMax(prev => ({ ...prev, ...arrMaxMin }))
    }, [])

    const handleSearch = async () => {
        try {
            const searchParams = {}

            // Xử lý type (loại phòng)
            if (queries.category && queries.category !== 'Tìm tất cả') {
                const selectedType = roomTypes.find(type => type.value === queries.category)
                if (selectedType) {
                    searchParams.type = selectedType.code
                }
            }

            // Xử lý features
            if (queries.feature && queries.feature !== 'Đặc điểm nổi bật') {
                const selectedFeature = features.find(f => f.value === queries.feature)
                if (selectedFeature) {
                    searchParams.features = selectedFeature.code
                }
            }

            // Xử lý district (quận/huyện)
            if (queries.district && queries.district !== 'Tất cả quận/huyện') {
                const selectedDistrict = districts.find(district => district.value === queries.district)
                if (selectedDistrict) {
                    searchParams.district = selectedDistrict.code
                }
            }

            // ✅ SỬA: Fix price range handling
            if (queries.price && queries.price !== 'Chọn giá') {
                // Check if it's a predefined price range
                const selectedPrice = prices.find(price => price.value === queries.price)
                if (selectedPrice) {
                    if (selectedPrice.min !== undefined) searchParams.minRent = selectedPrice.min
                    if (selectedPrice.max !== null && selectedPrice.max !== undefined) searchParams.maxRent = selectedPrice.max
                } else if (queries.priceNumber && Array.isArray(queries.priceNumber)) {
                    // ✅ SỬA: Handle custom price from slider
                    const [minTrieu, maxTrieu] = queries.priceNumber
                    if (minTrieu > 0) searchParams.minRent = Math.round(minTrieu * 1000000)
                    if (maxTrieu < 15) searchParams.maxRent = Math.round(maxTrieu * 1000000)
                }
            }

            // ✅ SỬA: Fix area range handling
            if (queries.area && queries.area !== 'Chọn diện tích') {
                // Check if it's a predefined area range
                const selectedArea = areas.find(area => area.value === queries.area)
                if (selectedArea) {
                    if (selectedArea.min !== undefined) searchParams.minSize = selectedArea.min
                    if (selectedArea.max !== null && selectedArea.max !== undefined) searchParams.maxSize = selectedArea.max
                } else if (queries.areaNumber && Array.isArray(queries.areaNumber)) {
                    // ✅ SỬA: Handle custom area from slider
                    const [minM2, maxM2] = queries.areaNumber
                    if (minM2 > 0) searchParams.minSize = Math.round(minM2)
                    if (maxM2 < 90) searchParams.maxSize = Math.round(maxM2)
                }
            }

            // Mặc định chỉ tìm phòng available
            searchParams.isAvailable = true


            // Navigate to search results page
            navigate({
                pathname: '/search',
                search: createSearchParams(searchParams).toString(),
            })

        } catch (error) {
            console.error('Search error:', error)
        }
    }

    return (
        <>
            <div className='p-[10px] w-3/5 my-3 bg-[#febb02] rounded-lg flex-col lg:flex-row flex items-center justify-around gap-2'>
                <span 
                    onClick={() => handleShowModal(roomTypes, 'category', 'Tìm tất cả')} 
                    className='cursor-pointer flex-1'
                >
                    <SearchItem 
                        IconBefore={<MdOutlineHouseSiding />} 
                        fontWeight 
                        IconAfter={<BsChevronRight color='rgb(156, 163, 175)' />} 
                        text={queries.category} 
                        defaultText={'Tìm tất cả'} 
                    />
                </span>

                <span 
                    onClick={() => handleShowModal(features, 'feature', 'Đặc điểm nổi bật')} 
                    className='cursor-pointer flex-1'
                >
                    <SearchItem 
                        IconBefore={<AiOutlinePlusCircle />} 
                        IconAfter={<BsChevronRight color='rgb(156, 163, 175)' />} 
                        text={queries.feature} 
                        defaultText={'Đặc điểm nổi bật'} 
                    />
                </span>
                
                <span 
                    onClick={() => handleShowModal(districts, 'district', 'Tất cả quận/huyện')} 
                    className='cursor-pointer flex-1'
                >
                    <SearchItem 
                        IconBefore={<HiOutlineLocationMarker />} 
                        IconAfter={<BsChevronRight color='rgb(156, 163, 175)' />} 
                        text={queries.district} 
                        defaultText={'Tất cả quận/huyện'} 
                    />
                </span>
                
                <span 
                    onClick={() => handleShowModal(prices, 'price', 'Chọn giá')} 
                    className='cursor-pointer flex-1'
                >
                    <SearchItem 
                        IconBefore={<TbReportMoney />} 
                        IconAfter={<BsChevronRight color='rgb(156, 163, 175)' />} 
                        text={queries.price} 
                        defaultText={'Chọn giá'} 
                    />
                </span>
                
                <span 
                    onClick={() => handleShowModal(areas, 'area', 'Chọn diện tích')} 
                    className='cursor-pointer flex-1'
                >
                    <SearchItem 
                        IconBefore={<RiCrop2Line />} 
                        IconAfter={<BsChevronRight color='rgb(156, 163, 175)' />} 
                        text={queries.area} 
                        defaultText={'Chọn diện tích'} 
                    />
                </span>
                
                <button
                    type='button'
                    onClick={handleSearch}
                    disabled={isLoading}
                    className={`outline-none py-2 px-4 flex-1 bg-orange-500 text-[13.3px] flex items-center justify-center gap-2 text-white font-medium rounded-md ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'
                    }`}
                >
                    <FiSearch />
                    {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
                </button>
            </div>
            
            {isShowModal && (
                <Modal
                    handleSubmit={handleSubmit}
                    queries={queries}
                    arrMinMax={arrMinMax}
                    content={content}
                    name={name}
                    setIsShowModal={setIsShowModal}
                    defaultText={defaultText}
                />
            )}
        </>
    )
}

export default Search