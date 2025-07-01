import React, { useState } from 'react'
import {DemoModal} from '../../../components/common'

const ServicePrice = () => {
    const [selectedDemo, setSelectedDemo] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const pricingPlans = [
        {
            id: 'vip-special',
            name: 'Tin VIP Nổi Bật',
            stars: 5,
            color: 'bg-red-500',
            textColor: 'text-white',
            dailyPrice: '50.000đ',
            dailyNote: '(Tối thiểu 3 ngày)',
            weeklyPrice: '315.000đ',
            weeklyNote: '(7 ngày)',
            monthlyOriginal: '1.500.000đ',
            monthlyPrice: '1.200.000đ',
            monthlyNote: '(30 ngày)',
            pushPrice: '5.000đ',
            colorFeature: 'MÀU ĐỎ, IN HOA',
            size: 'Rất lớn',
            autoRenewal: true,
            callButton: true
        },
        {
            id: 'vip-1',
            name: 'Tin VIP 1',
            stars: 4,
            color: 'bg-pink-500',
            textColor: 'text-white',
            dailyPrice: '30.000đ',
            dailyNote: '(Tối thiểu 3 ngày)',
            weeklyPrice: '190.000đ',
            weeklyNote: '(7 ngày)',
            monthlyOriginal: '900.000đ',
            monthlyPrice: '800.000đ',
            monthlyNote: '(30 ngày)',
            pushPrice: '3.000đ',
            colorFeature: 'MÀU HỒNG, IN HOA',
            size: 'Lớn',
            autoRenewal: true,
            callButton: true
        },
        {
            id: 'vip-2',
            name: 'Tin VIP 2',
            stars: 3,
            color: 'bg-orange-500',
            textColor: 'text-white',
            dailyPrice: '20.000đ',
            dailyNote: '(Tối thiểu 3 ngày)',
            weeklyPrice: '133.000đ',
            weeklyNote: '(7 ngày)',
            monthlyOriginal: '600.000đ',
            monthlyPrice: '540.000đ',
            monthlyNote: '(30 ngày)',
            pushPrice: '2.000đ',
            colorFeature: 'MÀU CAM, IN HOA',
            size: 'Trung bình',
            autoRenewal: true,
            callButton: false
        },
        {
            id: 'vip-3',
            name: 'Tin VIP 3',
            stars: 2,
            color: 'bg-blue-500',
            textColor: 'text-white',
            dailyPrice: '10.000đ',
            dailyNote: '(Tối thiểu 3 ngày)',
            weeklyPrice: '63.000đ',
            weeklyNote: '(7 ngày)',
            monthlyOriginal: '300.000đ',
            monthlyPrice: '240.000đ',
            monthlyNote: '(30 ngày)',
            pushPrice: '2.000đ',
            colorFeature: 'MÀU XANH, IN HOA',
            size: 'Trung bình',
            autoRenewal: true,
            callButton: false
        },
        {
            id: 'normal',
            name: 'Tin thường',
            stars: 0,
            color: 'bg-gray-600',
            textColor: 'text-white',
            dailyPrice: '2.000đ',
            dailyNote: '(Tối thiểu 3 ngày)',
            weeklyPrice: '12.000đ',
            weeklyNote: '(7 ngày)',
            monthlyOriginal: '60.000đ',
            monthlyPrice: '48.000đ',
            monthlyNote: '(30 ngày)',
            pushPrice: '2.000đ',
            colorFeature: 'Màu mặc định, viết thường',
            size: 'Nhỏ',
            autoRenewal: false,
            callButton: false
        }
    ]

    const renderStars = (count) => {
        return Array.from({ length: count }, (_, i) => (
            <span key={i} className="text-yellow-300">★</span>
        ))
    }

    const formatDate = () => {
        const today = new Date()
        return today.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    const handleDemoClick = (plan) => {
        setSelectedDemo(plan)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedDemo(null)
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-6 bg-white">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Bảng giá tin đăng
                </h1>
                <p className="text-gray-600">
                    Áp dụng từ {formatDate()}
                </p>
            </div>

            {/* Pricing Table */}
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="w-full border-collapse">
                    {/* Header Row */}
                    <thead>
                        <tr>
                            <th className="bg-gray-100 p-4 text-left font-medium text-gray-700 border-r border-gray-200">
                                {/* Empty header cell */}
                            </th>
                            {pricingPlans.map((plan) => (
                                <th key={plan.id} className={`${plan.color} ${plan.textColor} p-4 text-center font-bold border-r border-white last:border-r-0`}>
                                    <div className="flex flex-col items-center">
                                        <span className="text-lg mb-1">{plan.name}</span>
                                        <div className="flex">
                                            {renderStars(plan.stars)}
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {/* Daily Price Row */}
                        <tr className="border-b border-gray-200">
                            <td className="bg-gray-50 p-4 font-medium text-gray-700 border-r border-gray-200">
                                Giá ngày
                            </td>
                            {pricingPlans.map((plan) => (
                                <td key={plan.id} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                                    <div className="font-bold text-lg">{plan.dailyPrice}</div>
                                    <div className="text-sm text-gray-500">{plan.dailyNote}</div>
                                </td>
                            ))}
                        </tr>

                        {/* Weekly Price Row */}
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <td className="bg-gray-50 p-4 font-medium text-gray-700 border-r border-gray-200">
                                <div>Giá tuần</div>
                                <div className="text-sm text-gray-500">(7 ngày)</div>
                            </td>
                            {pricingPlans.map((plan) => (
                                <td key={plan.id} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                                    <div className="font-bold text-lg">{plan.weeklyPrice}</div>
                                </td>
                            ))}
                        </tr>

                        {/* Monthly Price Row */}
                        <tr className="border-b border-gray-200">
                            <td className="bg-gray-50 p-4 font-medium text-gray-700 border-r border-gray-200">
                                <div>Giá tháng</div>
                                <div className="text-sm text-gray-500">(30 ngày)</div>
                            </td>
                            {pricingPlans.map((plan) => (
                                <td key={plan.id} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                                    {plan.monthlyOriginal && (
                                        <div className="text-sm text-gray-400 line-through mb-1">
                                            {plan.monthlyOriginal}
                                        </div>
                                    )}
                                    <div className="font-bold text-lg">{plan.monthlyPrice}</div>
                                </td>
                            ))}
                        </tr>

                        {/* Push Price Row */}
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <td className="bg-gray-50 p-4 font-medium text-gray-700 border-r border-gray-200">
                                Giá đẩy tin
                            </td>
                            {pricingPlans.map((plan) => (
                                <td key={plan.id} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                                    <div className="font-bold">{plan.pushPrice}</div>
                                </td>
                            ))}
                        </tr>

                        {/* Color Feature Row */}
                        <tr className="border-b border-gray-200">
                            <td className="bg-gray-50 p-4 font-medium text-gray-700 border-r border-gray-200">
                                Màu sắc tiêu đề
                            </td>
                            {pricingPlans.map((plan) => (
                                <td key={plan.id} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                                    <div className={`font-bold ${
                                        plan.id === 'vip-special' ? 'text-red-600' :
                                        plan.id === 'vip-1' ? 'text-pink-600' :
                                        plan.id === 'vip-2' ? 'text-orange-600' :
                                        plan.id === 'vip-3' ? 'text-blue-600' :
                                        'text-gray-600'
                                    }`}>
                                        {plan.colorFeature}
                                    </div>
                                </td>
                            ))}
                        </tr>

                        {/* Size Row */}
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <td className="bg-gray-50 p-4 font-medium text-gray-700 border-r border-gray-200">
                                Kích thước tin
                            </td>
                            {pricingPlans.map((plan) => (
                                <td key={plan.id} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                                    <div className="font-medium">{plan.size}</div>
                                </td>
                            ))}
                        </tr>

                        {/* Auto Renewal Row */}
                        <tr className="border-b border-gray-200">
                            <td className="bg-gray-50 p-4 font-medium text-gray-700 border-r border-gray-200">
                                Tự động duyệt (*)
                            </td>
                            {pricingPlans.map((plan) => (
                                <td key={plan.id} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                                    {plan.autoRenewal ? (
                                        <span className="text-green-600 text-xl">✓</span>
                                    ) : (
                                        <span className="text-gray-400">—</span>
                                    )}
                                </td>
                            ))}
                        </tr>

                        {/* Call Button Row */}
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <td className="bg-gray-50 p-4 font-medium text-gray-700 border-r border-gray-200">
                                Hiển thị nút gọi điện
                            </td>
                            {pricingPlans.map((plan) => (
                                <td key={plan.id} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                                    {plan.callButton ? (
                                        <span className="text-green-600 text-xl">✓</span>
                                    ) : (
                                        <span className="text-orange-500 text-xl">💬</span>
                                    )}
                                </td>
                            ))}
                        </tr>

                        {/* Action Buttons Row - Updated */}
                        <tr>
                            <td className="bg-gray-50 p-4 font-medium text-gray-700 border-r border-gray-200">
                                {/* Empty cell */}
                            </td>
                            {pricingPlans.map((plan) => (
                                <td key={plan.id} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                                    <button 
                                        onClick={() => handleDemoClick(plan)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                                    >
                                        Xem demo
                                    </button>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Footer Note */}
            <div className="mt-6 text-sm text-gray-600">
                <p>(*) Tin được tự động duyệt sau khi thanh toán thành công</p>
                <p className="mt-2">
                    <strong>Lưu ý:</strong> Giá có thể thay đổi mà không cần báo trước. 
                    Vui lòng liên hệ để biết thêm chi tiết về các gói dịch vụ.
                </p>
            </div>

            {/* Demo Modal */}
            <DemoModal 
                isOpen={isModalOpen}
                onClose={closeModal}
                planData={selectedDemo}
            />
        </div>
    )
}

export default ServicePrice