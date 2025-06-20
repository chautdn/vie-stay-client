"use client"

import React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

function Pagination({ total, page, limit, onPageChange }) {
  const totalPages = Math.ceil(total / limit)

  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    // Always show first page
    if (totalPages > 1) {
      rangeWithDots.push(1)
    }

    // Calculate range around current page
    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i)
    }

    // Add dots and range
    if (page - delta > 2) {
      rangeWithDots.push("...")
    }

    rangeWithDots.push(...range)

    // Add dots before last page if needed
    if (page + delta < totalPages - 1) {
      rangeWithDots.push("...")
    }

    // Always show last page
    if (totalPages > 1 && !rangeWithDots.includes(totalPages)) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Mobile pagination */}
      <div className="flex justify-between items-center px-4 py-3 sm:hidden">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Trước
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Trang <span className="font-semibold">{page}</span> / <span className="font-semibold">{totalPages}</span>
          </span>
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Sau
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:items-center sm:justify-between px-6 py-4">
        <div>
          <p className="text-sm text-gray-700">
            Hiển thị <span className="font-semibold text-gray-900">{(page - 1) * limit + 1}</span> -{" "}
            <span className="font-semibold text-gray-900">{Math.min(page * limit, total)}</span> trong{" "}
            <span className="font-semibold text-gray-900">{total}</span> kết quả
          </p>
        </div>

        <div className="flex items-center space-x-1">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Trang trước</span>
          </button>

          {/* Page numbers */}
          {visiblePages.map((pageNum, index) => (
            <React.Fragment key={index}>
              {pageNum === "..." ? (
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border transition-colors ${
                    page === pageNum
                      ? "z-10 bg-blue-50 border-blue-500 text-blue-600 font-semibold"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  {pageNum}
                </button>
              )}
            </React.Fragment>
          ))}

          {/* Next button */}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Trang sau</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Pagination
