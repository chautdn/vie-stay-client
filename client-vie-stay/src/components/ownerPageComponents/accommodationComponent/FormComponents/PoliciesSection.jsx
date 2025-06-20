// src/components/ownerComponent/FormComponents/PoliciesSection.jsx

import React from 'react';
import { Clock, AlertCircle, X } from 'lucide-react';
import FormSection from './FormSection';

const PoliciesSection = ({ form, errors, handleChange, handleRuleAdd, handleRuleRemove }) => {
  return (
    <FormSection icon={Clock} title="Chính sách">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Giờ check-in</label>
          <input type="time" name="policies.checkInTime" value={form.policies.checkInTime} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${errors['policies.checkInTime'] ? 'border-red-300' : 'border-gray-300'}`} />
          {errors['policies.checkInTime'] && <p className="mt-1 text-sm text-red-600">{errors['policies.checkInTime']}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Giờ check-out</label>
          <input type="time" name="policies.checkOutTime" value={form.policies.checkOutTime} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${errors['policies.checkOutTime'] ? 'border-red-300' : 'border-gray-300'}`} />
          {errors['policies.checkOutTime'] && <p className="mt-1 text-sm text-red-600">{errors['policies.checkOutTime']}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="flex items-center space-x-2"><input type="checkbox" name="policies.smokingAllowed" checked={form.policies.smokingAllowed} onChange={handleChange} className="rounded" /><span>Cho phép hút thuốc</span></label>
        <label className="flex items-center space-x-2"><input type="checkbox" name="policies.petsAllowed" checked={form.policies.petsAllowed} onChange={handleChange} className="rounded" /><span>Cho phép thú cưng</span></label>
        <label className="flex items-center space-x-2"><input type="checkbox" name="policies.partiesAllowed" checked={form.policies.partiesAllowed} onChange={handleChange} className="rounded" /><span>Cho phép tổ chức tiệc</span></label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Quy định bổ sung</label>
        <div className="space-y-2">
          {(form.policies.additionalRules || []).map((rule, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">{rule}</span>
              <button type="button" onClick={() => handleRuleRemove(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X className="h-4 w-4" /></button>
            </div>
          ))}
          <button type="button" onClick={handleRuleAdd} className="px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50">+ Thêm quy định</button>
        </div>
      </div>
    </FormSection>
  );
};

export default PoliciesSection;