import React from 'react'

const DemoModal = ({ isOpen, onClose, planData }) => {
    if (!isOpen || !planData) return null

    // Demo images cho từng gói - sử dụng ảnh local
    const demoImages = {
        'vip-special': {
            desktop: '/assets/image/demo-vipnoibat.jpg',
            mobile: '/assets/image/demo-vipnoibat-mobile.jpg'
        },
        'vip-1': {
            desktop: '/assets/image/demo-vip1.jpg',
            mobile: '/assets/image/demo-vip1-mobile.jpg'
        },
        'vip-2': {
            desktop: '/assets/image/demo-vip2.jpg',
            mobile: '/assets/image/demo-vip2-mobile.jpg'
        },
        'vip-3': {
            desktop: '/assets/image/demo-vip3.jpg',
            mobile: '/assets/image/demo-vip3-mobile.jpg'
        },
        'normal': {
            desktop: '/assets/image/demo-tinthuong.jpg',
            mobile: '/assets/image/demo-tinthuong-mobile.jpg'
        }
    }

    const currentImages = demoImages[planData.id] || {}

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-20 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        Demo {planData.name}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                    >
                        ×
                    </button>
                </div>

                {/* Images */}
                <div className="p-6">
                    <div className="flex justify-center">
                        <div className="w-full max-w-4xl">
                            <h3 className="text-lg font-medium mb-3 text-center">Demo hiển thị</h3>
                            <img 
                                src={currentImages.desktop}
                                alt={`${planData.name} Demo`}
                                className="w-full h-auto object-contain rounded-lg shadow-lg"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=Demo+Image'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DemoModal