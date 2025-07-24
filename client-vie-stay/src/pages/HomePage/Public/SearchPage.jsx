import React, { useEffect, useState, useRef } from 'react'
import { List, Pagination } from './index'
import { ItemSidebar } from '../../../components/common'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { usePostStore } from '../../../store/postStore'
import { location } from '../../../utils/Constant'
import icons from '../../../utils/icons'

const { IoMdClose } = icons

const SearchPage = () => {
    const [params] = useSearchParams()
    const navigate = useNavigate()
 
    const { searchPosts, searchResults: postSearchResults } = usePostStore()

    const [currentPage, setCurrentPage] = useState(1)
    const resultsPerPage = 5
    const prevParamsRef = useRef('')

    // ✅ SỬA: Categories, prices, areas definitions
    const categories = [
      { code: 'single_room', value: 'Phòng trọ đơn' },
        { code: 'double', value: 'Phòng trọ đôi' },
        { code: 'shared_room', value: 'Phòng chia sẻ' },
        { code: 'studio', value: 'Phòng studio' },
        { code: 'apartment', value: 'Căn hộ mini' },
        { code: 'house', value: 'Nhà nguyên căn' }
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
        { code: 'bao_dien_nuoc', value: 'Bao điện nước' },
        { code: 'bao_an_toan', value: 'An toàn' },
        { code: 'cho_de_xe', value: 'Chỗ để xe' },
        { code: 'camera_an_ninh', value: 'Camera an ninh' }
    ]

    const prices = [
        { code: 'price1', value: 'Dưới 1.5 triệu', order: 1, min: 0, max: 1500000 },
        { code: 'price2', value: '1.5 - 2.5 triệu', order: 2, min: 1500000, max: 2500000 },
        { code: 'price3', value: '2.5 - 3.5 triệu', order: 3, min: 2500000, max: 3500000 },
        { code: 'price4', value: '3.5 - 5 triệu', order: 4, min: 3500000, max: 5000000 },
        { code: 'price5', value: '5 - 7 triệu', order: 5, min: 5000000, max: 7000000 },
        { code: 'price6', value: 'Trên 7 triệu', order: 6, min: 7000000, max: null }
    ]

    const areas = [
        { code: 'area1', value: 'Dưới 20m²', order: 1, min: 0, max: 20 },
        { code: 'area2', value: '20 - 30m²', order: 2, min: 20, max: 30 },
        { code: 'area3', value: '30 - 40m²', order: 3, min: 30, max: 40 },
        { code: 'area4', value: '40 - 60m²', order: 4, min: 40, max: 60 },
        { code: 'area5', value: '60 - 80m²', order: 5, min: 60, max: 80 },
        { code: 'area6', value: 'Trên 80m²', order: 6, min: 80, max: null }
    ]

    // ✅ SỬA: Main search effect
    useEffect(() => {
        const loadSearchData = async () => {
            try {
                let searchParamsObject = {}
                
                // ✅ Parse all URL parameters
                for (let [key, value] of params.entries()) {
                    if (key !== 'page') {
                        if (['minRent', 'maxRent', 'minSize', 'maxSize', 'capacity'].includes(key)) {
                            searchParamsObject[key] = parseInt(value)
                        } else if (key === 'isAvailable') {
                            searchParamsObject[key] = value === 'true'
                        } else {
                            searchParamsObject[key] = value
                        }
                    }
                }

                // ✅ Gọi API search với các params
                if (Object.keys(searchParamsObject).length > 0) {
                    await searchPosts(searchParamsObject)
                } else {
                    // Nếu không có filter, load tất cả phòng available
                    await searchPosts({ isAvailable: true })
                }
            } catch (error) {
                console.error('Error searching rooms:', error)
            }
        }

        loadSearchData()
    }, [params, searchPosts])

    // ✅ SỬA: Reset page khi filter thay đổi
    useEffect(() => {
        const currentParamsString = params.toString()
        const prevParamsString = prevParamsRef.current

        const currentFilters = new URLSearchParams(currentParamsString)
        const prevFilters = new URLSearchParams(prevParamsString)
        
        currentFilters.delete('page')
        prevFilters.delete('page')

        if (currentFilters.toString() !== prevFilters.toString()) {
            setCurrentPage(1)
        }

        prevParamsRef.current = currentParamsString
    }, [params.toString()])

    // ✅ SỬA: Function để lấy active filters
    const getActiveFilters = () => {
    const activeFilters = []

    // District filter
    const selectedDistrict = params.get('district')
    if (selectedDistrict) {
        const district = districts.find(dist => dist.code === selectedDistrict)
        if (district) {
            activeFilters.push({
                type: 'district',
                key: 'district',
                label: district.value,
                value: selectedDistrict
            })
        }
    }

    // Features filter
    const selectedFeatures = params.get('features')
    if (selectedFeatures) {
        const feature = features.find(f => f.code === selectedFeatures)
        if (feature) {
            activeFilters.push({
                type: 'feature',
                key: 'features',
                label: feature.value,
                value: selectedFeatures
            })
        }
    }

    // Category filter (propertyType cho post)
    const selectedType = params.get('propertyType')
    if (selectedType) {
        const category = categories.find(cat => cat.code === selectedType)
        if (category) {
            activeFilters.push({
                type: 'category',
                key: 'propertyType',
                label: category.value,
                value: selectedType
            })
        }
    }

    // Price range filter
    const minRent = params.get('minRent')
    const maxRent = params.get('maxRent')
    if (minRent || maxRent) {
        const priceRange = prices.find(price => {
            const minMatch = price.min.toString() === minRent
            const maxMatch = price.max === null ? !maxRent : price.max.toString() === maxRent
            return minMatch && maxMatch
        })
        if (priceRange) {
            activeFilters.push({
                type: 'price',
                key: ['minRent', 'maxRent'],
                label: priceRange.value,
                value: `${minRent}-${maxRent || 'max'}`
            })
        } else {
            let priceLabel = ''
            if (minRent && maxRent) {
                priceLabel = `${(parseInt(minRent)/1000000).toFixed(1)} - ${(parseInt(maxRent)/1000000).toFixed(1)} triệu`
            } else if (minRent) {
                priceLabel = `Từ ${(parseInt(minRent)/1000000).toFixed(1)} triệu`
            } else if (maxRent) {
                priceLabel = `Dưới ${(parseInt(maxRent)/1000000).toFixed(1)} triệu`
            }
            activeFilters.push({
                type: 'price',
                key: ['minRent', 'maxRent'],
                label: priceLabel,
                value: `${minRent || 0}-${maxRent || 'max'}`
            })
        }
    }

    // Area range filter
    const minSize = params.get('minSize')
    const maxSize = params.get('maxSize')
    if (minSize || maxSize) {
        const areaRange = areas.find(area => {
            const minMatch = area.min.toString() === minSize
            const maxMatch = area.max === null ? !maxSize : area.max.toString() === maxSize
            return minMatch && maxMatch
        })
        if (areaRange) {
            activeFilters.push({
                type: 'area',
                key: ['minSize', 'maxSize'],
                label: areaRange.value,
                value: `${minSize}-${maxSize || 'max'}`
            })
        } else {
            let areaLabel = ''
            if (minSize && maxSize) {
                areaLabel = `${minSize} - ${maxSize}m²`
            } else if (minSize) {
                areaLabel = `Từ ${minSize}m²`
            } else if (maxSize) {
                areaLabel = `Dưới ${maxSize}m²`
            }
            activeFilters.push({
                type: 'area',
                key: ['minSize', 'maxSize'],
                label: areaLabel,
                value: `${minSize || 0}-${maxSize || 'max'}`
            })
        }
    }

    return activeFilters
}

    // ✅ SỬA: Function để remove filter
    const removeFilter = (filter) => {
        const newParams = new URLSearchParams(params)
        
        if (Array.isArray(filter.key)) {
            filter.key.forEach(key => newParams.delete(key))
        } else {
            newParams.delete(filter.key)
        }
        
        newParams.delete('page') // Reset về trang 1
        
        navigate({
            pathname: '/search',
            search: newParams.toString()
        })
    }

    // ✅ SỬA: Function để clear all filters
    const clearAllFilters = () => {
        navigate('/home')
    }

    const activeFilters = getActiveFilters()
    const totalResults = (postSearchResults || []).length
    const sortedPrices = prices?.slice().sort((a, b) => a.order - b.order)
    const sortedAreas = areas?.slice().sort((a, b) => a.order - b.order)

    return (
        <div className='w-full flex flex-col gap-3'>
            {/* ✅ SỬA: Header với active filters */}
            <div>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-2'>
                        <h1 className='text-lg font-semibold text-gray-800'>
                            KẾT QUẢ TÌM KIẾM
                        </h1>
                        <span className='text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
                            {totalResults} kết quả
                        </span>
                    </div>
                    
                    {/* ✅ SỬA: Active filters display */}
                    {activeFilters.length > 0 && (
                        <div className='flex items-center gap-2 flex-wrap'>
                            <span className='text-xs text-gray-500 font-medium'>Lọc theo:</span>
                            {activeFilters.map((filter, index) => (
                                <span
                                    key={index}
                                    className='inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium'
                                >
                                    {filter.label}
                                    <button
                                        onClick={() => removeFilter(filter)}
                                        className='ml-2 hover:bg-blue-200 rounded-full p-0.5 transition-colors'
                                        title="Xóa bộ lọc"
                                    >
                                        <IoMdClose size={12} />
                                    </button>
                                </span>
                            ))}
                            <button
                                onClick={clearAllFilters}
                                className='text-xs text-red-600 hover:text-red-800 hover:underline ml-2 font-medium'
                            >
                                Xóa tất cả
                            </button>
                        </div>
                    )}
                </div>

                {/* ✅ THÊM: Empty state message */}
                {totalResults === 0 && (
                    <div className='text-center py-8 text-gray-500'>
                        <p className='text-lg mb-2'>Không tìm thấy kết quả phù hợp</p>
                        <p className='text-sm'>Thử thay đổi tiêu chí tìm kiếm hoặc xóa bộ lọc</p>
                    </div>
                )}
            </div>

            {/* ✅ SỬA: Main Content */}
            <div>
                <div className='w-full flex gap-4'>
                    {/* Left Content - List + Pagination */}
                    <div className='w-[70%]'>
                        <List 
                            currentPage={currentPage}
                            resultsPerPage={resultsPerPage}
                        />
                        
                        {totalResults > resultsPerPage && (
                            <div className='mt-6'>
                                <Pagination 
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalResults={totalResults}
                                    resultsPerPage={resultsPerPage}
                                />
                            </div>
                        )}
                    </div>

                    {/* ✅ SỬA: Right Sidebar */}
                    <div className='w-[30%] flex flex-col gap-4 justify-start items-center'>
                        <ItemSidebar 
                            content={categories} 
                            title='Danh mục cho thuê' 
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

                        {/* ✅ SỬA: Action buttons */}
                        <div className='w-full space-y-2'>
                            <button
                                onClick={clearAllFilters}
                                className='w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors font-medium'
                            >
                                Về trang chủ
                            </button>
                            
                            {activeFilters.length > 0 && (
                                <button
                                    onClick={() => navigate('/search?isAvailable=true')}
                                    className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition-colors text-sm'
                                >
                                    Xem tất cả phòng trọ
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-10' /> {/* Spacer for footer */}
        </div>
    )
}

export default SearchPage