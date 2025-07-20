import React from 'react';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';

const RequestStats = ({ stats, isLoading, requests = [] }) => {
  // Nếu không có stats từ API, tính từ requests
  const finalStats = stats || {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border animate-pulse">
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: 'Tổng số',
      value: finalStats?.total || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Chờ xử lý',
      value: finalStats?.pending || 0,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Đã chấp nhận',
      value: finalStats?.accepted || 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Đã từ chối',
      value: finalStats?.rejected || 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">{item.title}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
            <div className={`p-2 rounded-lg ${item.bgColor}`}>
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestStats;