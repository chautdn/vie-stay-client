import React from 'react';

const ReportModal = ({ isOpen, onClose, reportForm, setReportForm, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-transparent bg-opacity-25 z-40'
        onClick={onClose}
      />
      
      {/* Offcanvas Panel */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="border-b shadow-sm px-4 py-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Phản ánh tin đăng</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 h-full overflow-y-auto">
          <form onSubmit={onSubmit} className="space-y-4">
            
            {/* Report Type */}
            <div>
              <p className="font-medium text-lg mb-3">Lý do phản ánh:</p>
              
              <div className="space-y-2">
                {[
                  { value: 'scam', label: 'Tin có dấu hiệu lừa đảo' },
                  { value: 'duplicate', label: 'Tin trùng lặp nội dung' },
                  { value: 'cant_contact', label: 'Không liên hệ được chủ tin đăng' },
                  { value: 'fake', label: 'Thông tin không đúng thực tế (giá, diện tích, hình ảnh...)' },
                  { value: 'other', label: 'Lý do khác' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="reportType"
                      value={option.value}
                      checked={reportForm.reportType === option.value}
                      onChange={(e) => setReportForm({...reportForm, reportType: e.target.value})}
                      className="mr-2"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả thêm
              </label>
              <textarea
                id="message"
                rows={3}
                value={reportForm.message}
                onChange={(e) => setReportForm({...reportForm, message: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mô tả thêm"
                style={{ height: '100px' }}
              />
            </div>

            {/* Contact Info */}
            <div>
              <p className="font-medium text-lg mb-3">Thông tin liên hệ</p>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                    Họ tên của bạn
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    value={reportForm.fullname}
                    onChange={(e) => setReportForm({...reportForm, fullname: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email của bạn (để nhận phản hồi)
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={reportForm.email || ''}
                    onChange={(e) => setReportForm({...reportForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại của bạn
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={reportForm.phone}
                    onChange={(e) => setReportForm({...reportForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!reportForm.fullname || !reportForm.phone}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                  reportForm.fullname && reportForm.phone
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Gửi phản ánh
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReportModal;