import React, { memo, useState, useEffect } from 'react'
import { PageNumber } from '../../../components/common'
import { useSearchParams, useNavigate } from 'react-router-dom'
import icons from '../../../utils/icons'

const { GrChapterNext } = icons

const Pagination = ({ currentPage, setCurrentPage, totalResults, resultsPerPage }) => {
    const [arrPage, setArrPage] = useState([])
    const [isHideEnd, setIsHideEnd] = useState(false)
    const [isHideStart, setIsHideStart] = useState(false)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

   

    // ✅ SỬA: Tính toán maxPage
    const maxPage = Math.ceil(totalResults / resultsPerPage)

    // ✅ SỬA: Early return nếu không đủ điều kiện
    if (!totalResults || !resultsPerPage || maxPage <= 1) {
        return null
    }

    useEffect(() => {
        const generatePageNumbers = () => {
            const pages = []
            const startPage = Math.max(1, currentPage - 2)
            const endPage = Math.min(maxPage, currentPage + 2)

            // Previous button
            if (currentPage > 1) {
                pages.push('‹ Trước')
            }

            // Start ellipsis
            if (startPage > 1) {
                pages.push(1)
                if (startPage > 2) {
                    pages.push('...')
                    setIsHideStart(true)
                }
            }

            // Page numbers
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i)
            }

            // End ellipsis
            if (endPage < maxPage) {
                if (endPage < maxPage - 1) {
                    pages.push('...')
                    setIsHideEnd(true)
                }
                pages.push(maxPage)
            }

            // Next button
            if (currentPage < maxPage) {
                pages.push('Tiếp ›')
            }

            setArrPage(pages)
        }

        generatePageNumbers()
    }, [currentPage, maxPage])

    // ✅ SỬA: Handle page change
    const handlePageChange = (page) => {
        if (setCurrentPage) {
            setCurrentPage(page)
        }
        
        // ✅ THÊM: Scroll to top khi đổi trang
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="flex justify-center items-center mt-6">
            <div className="flex items-center border border-gray-300 rounded">
                {arrPage.map((item, index) => (
                    <PageNumber
                        key={index}
                        text={item}
                        currentPage={currentPage}
                        setCurrentPage={handlePageChange}
                        pageValue={
                            item === '‹ Trước' ? currentPage - 1 :
                            item === 'Tiếp ›' ? currentPage + 1 :
                            typeof item === 'number' ? item : undefined
                        }
                    />
                ))}
            </div>
            
            {/* ✅ THÊM: Thông tin debug */}
            <div className="ml-4 text-sm text-gray-500">
                Trang {currentPage}/{maxPage}
            </div>
        </div>
    )
}

export default memo(Pagination)