import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const BillingModals = ({
  showCreateBill,
  setShowCreateBill,
  showEditBill,
  setShowEditBill,
  editingBill,
  billForm,
  setBillForm,
  createCustomBill,
  updateBill,
  formatPrice
}) => {

  const isEditMode = showEditBill && editingBill;

  const addBillItem = () => {
    setBillForm(prev => ({
      ...prev,
      items: [...prev.items, {
        name: '',
        type: 'other',
        amount: 0,
        quantity: 1,
        unitPrice: 0,
        description: ''
      }]
    }));
  };

  const updateBillItem = (index, field, value) => {
    setBillForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          
          // Auto-calculate amount when quantity or unitPrice changes
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.amount = (updatedItem.quantity || 0) * (updatedItem.unitPrice || 0);
          }
          
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const removeBillItem = (index) => {
    setBillForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Calculate totals for the bill
  const calculateTotals = () => {
    const subtotal = billForm.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const tax = 0; // Add tax calculation if needed
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <>
      {/* Create/Edit Bill Modal */}
      {(showCreateBill || showEditBill) && (
        <div className="fixed inset-0 bg-opacity backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditMode ? 'Chỉnh sửa hóa đơn' : 'Tạo hóa đơn mới'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateBill(false);
                    setShowEditBill(false);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Bill Type Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-1">
                  {isEditMode ? `Chỉnh sửa hóa đơn ${editingBill.billNumber}` : 'Hóa đơn tùy chỉnh'}
                </h4>
                <p className="text-sm text-blue-700">
                  {isEditMode ? 'Cập nhật thông tin hóa đơn chưa gửi' : 'Tự do thêm các khoản phí khác nhau'}
                </p>
              </div>

              {/* Billing Period */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
                  <input
                    type="date"
                    value={billForm.billingPeriod.from}
                    onChange={(e) => setBillForm(prev => ({
                      ...prev,
                      billingPeriod: { ...prev.billingPeriod, from: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
                  <input
                    type="date"
                    value={billForm.billingPeriod.to}
                    onChange={(e) => setBillForm(prev => ({
                      ...prev,
                      billingPeriod: { ...prev.billingPeriod, to: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Custom Bill Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">Danh mục chi phí</label>
                  <button
                    onClick={addBillItem}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Thêm mục
                  </button>
                </div>

                {billForm.items.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">Chưa có mục nào trong hóa đơn</p>
                    <button
                      onClick={addBillItem}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Thêm mục đầu tiên
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="hidden md:grid grid-cols-12 gap-3 text-sm font-medium text-gray-700 pb-2 border-b">
                      <div className="col-span-3">Tên mục</div>
                      <div className="col-span-2">Loại</div>
                      <div className="col-span-2">Số lượng</div>
                      <div className="col-span-2">Đơn giá</div>
                      <div className="col-span-2">Thành tiền</div>
                      <div className="col-span-1">Thao tác</div>
                    </div>

                    {/* Items */}
                    {billForm.items.map((item, index) => (
                      <div key={index} className="space-y-3 md:space-y-0 md:grid md:grid-cols-12 gap-3 items-center p-4 bg-gray-50 rounded-lg">
                        <div className="col-span-3">
                          <label className="block text-xs font-medium text-gray-700 mb-1 md:hidden">Tên mục</label>
                          <input
                            type="text"
                            placeholder="Tên mục"
                            value={item.name}
                            onChange={(e) => updateBillItem(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1 md:hidden">Loại</label>
                          <select
                            value={item.type}
                            onChange={(e) => updateBillItem(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            <option value="rent">Tiền thuê</option>
                            <option value="water">Nước</option>
                            <option value="electricity">Điện</option>
                            <option value="internet">Internet</option>
                            <option value="parking">Đỗ xe</option>
                            <option value="security">Bảo vệ</option>
                            <option value="maintenance">Bảo trì</option>
                            <option value="cleaning">Vệ sinh</option>
                            <option value="other">Khác</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1 md:hidden">Số lượng</label>
                          <input
                            type="number"
                            min="1"
                            placeholder="Số lượng"
                            value={item.quantity}
                            onChange={(e) => {
                              const quantity = parseInt(e.target.value) || 0;
                              updateBillItem(index, 'quantity', quantity);
                              updateBillItem(index, 'amount', item.unitPrice * quantity);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1 md:hidden">Đơn giá</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="Đơn giá"
                            value={item.unitPrice}
                            onChange={(e) => {
                              const price = parseInt(e.target.value) || 0;
                              updateBillItem(index, 'unitPrice', price);
                              updateBillItem(index, 'amount', price * item.quantity);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1 md:hidden">Thành tiền</label>
                          <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900">
                            {formatPrice(item.amount || 0)}
                          </div>
                        </div>
                        <div className="col-span-1">
                          <button
                            onClick={() => removeBillItem(index)}
                            className="w-full md:w-auto p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa mục"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Total */}
                    <div className="flex justify-end pt-4 border-t">
                      <div className="text-right space-y-1">
                        <div className="flex justify-between gap-8">
                          <span className="text-sm text-gray-600">Tạm tính:</span>
                          <span className="text-sm font-medium">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span className="text-sm text-gray-600">Thuế:</span>
                          <span className="text-sm font-medium">{formatPrice(tax)}</span>
                        </div>
                        <div className="flex justify-between gap-8 pt-1 border-t">
                          <span className="text-base font-semibold text-gray-900">Tổng cộng:</span>
                          <span className="text-lg font-bold text-gray-900">{formatPrice(total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hạn thanh toán</label>
                <input
                  type="date"
                  value={billForm.dueDate}
                  onChange={(e) => setBillForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Để trống để sử dụng mặc định (5 ngày từ ngày tạo)</p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                <textarea
                  value={billForm.notes}
                  onChange={(e) => setBillForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Thêm ghi chú cho hóa đơn (tùy chọn)..."
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateBill(false);
                    setShowEditBill(false);
                  }}
                  className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={isEditMode ? updateBill : createCustomBill}
                  disabled={
                    !billForm.billingPeriod.from || 
                    !billForm.billingPeriod.to ||
                    billForm.items.length === 0 || 
                    total <= 0
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isEditMode ? `Cập nhật hóa đơn (${formatPrice(total)})` : `Tạo hóa đơn (${formatPrice(total)})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BillingModals;