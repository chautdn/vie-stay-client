import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccommodationStore } from '../../store/owner/accommodationStore';
import { 
  Building, 
  Home, 
  Users, 
  TrendingUp, 
  DollarSign,
  Calendar,
  ArrowUpRight,
  Eye,
  Plus,
  MoreVertical
} from 'lucide-react';


const Dashboard = () => {
  const navigate = useNavigate();
  
  // ✅ SỬA: Get error state from store
  const {
    accommodations,
    isLoading,
    error,
    getAllAccommodations,
    clearError
  } = useAccommodationStore();

  // ✅ SỬA: Load accommodations with better error handling
  useEffect(() => {
    const loadAccommodations = async () => {
      try {
       
        await getAllAccommodations();
      
      } catch (error) {
      
      }
    };

    loadAccommodations();
  }, []); // ✅ SỬA: Remove getAllAccommodations từ dependency

 

  const calculateStats = () => {
    
    
    if (!accommodations || accommodations.length === 0) {
      return {
        totalAccommodations: 0,
        totalRooms: 0,
        occupiedRooms: 0,
        monthlyRevenue: 0,
        occupancyRate: 0,
        pendingRequests: 0,
        overduePayments: 0
      };
    }


    const totalAccommodations = accommodations.length;
    const totalRooms = accommodations.reduce((sum, acc) => sum + (acc.totalRooms || 0), 0);
    const occupiedRooms = accommodations.reduce((sum, acc) => sum + ((acc.totalRooms || 0) - (acc.availableRooms || acc.totalRooms || 0)), 0);
    const monthlyRevenue = accommodations.reduce((sum, acc) => sum + (acc.monthlyRevenue || 0), 0);
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    const stats = {
      totalAccommodations,
      totalRooms,
      occupiedRooms,
      monthlyRevenue,
      occupancyRate,
      pendingRequests: 0, // ✅ THÊM: Default values
      overduePayments: 0
    };
    
    
    return stats;
  };

  const stats = calculateStats();

  
  const enhancedAccommodations = accommodations.map(acc => ({
    ...acc,
    image: acc.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
    occupiedRooms: (acc.totalRooms || 0) - (acc.availableRooms || acc.totalRooms || 0),
    occupancyRate: acc.totalRooms > 0 ? Math.round(((acc.totalRooms - (acc.availableRooms || acc.totalRooms)) / acc.totalRooms) * 100) : 0,
    monthlyRevenue: acc.monthlyRevenue || 0
  }));

 

  const recentActivities = [
    { id: 1, type: 'new_tenant', message: 'Nguyễn Văn A đã thuê phòng 101 tại Tòa nhà A', time: '2 giờ trước' },
    { id: 2, type: 'payment', message: 'Thanh toán tiền thuê tháng 12 từ phòng 205', time: '4 giờ trước' },
    { id: 3, type: 'request', message: 'Yêu cầu sửa chữa từ phòng 301 tại Tòa nhà B', time: '6 giờ trước' },
    { id: 4, type: 'checkout', message: 'Trần Thị B đã trả phòng 102', time: '1 ngày trước' },
  ];

  const handleManageRooms = (accommodationId) => {
    navigate(`/owner/rooms/${accommodationId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              <ArrowUpRight className={`h-4 w-4 mr-1 ${changeType === 'decrease' ? 'rotate-180' : ''}`} />
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  // ✅ THÊM: Error state
  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    onClick={async () => {
                      clearError();
                      try {
                        await getAllAccommodations();
                      } catch (err) {
                        console.error("Retry failed:", err);
                      }
                    }}
                    className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu dashboard...</p>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Chào mừng trở lại! Đây là tổng quan về hoạt động kinh doanh của bạn.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <button 
            onClick={() => navigate('/owner/create')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Thêm tòa nhà
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng tòa nhà"
          value={stats.totalAccommodations}
          icon={Building}
          change={stats.totalAccommodations > 0 ? "+2 tháng này" : ""}
          changeType="increase"
          color="bg-blue-500"
        />
        <StatCard
          title="Tổng phòng"
          value={stats.totalRooms}
          icon={Home}
          change={stats.totalRooms > 0 ? "+4 tháng này" : ""}
          changeType="increase"
          color="bg-green-500"
        />
        <StatCard
          title="Phòng đã thuê"
          value={stats.occupiedRooms}
          icon={Users}
          change={stats.occupiedRooms > 0 ? "+3 tháng này" : ""}
          changeType="increase"
          color="bg-purple-500"
        />
        <StatCard
          title="Doanh thu tháng"
          value={formatPrice(stats.monthlyRevenue)}
          icon={DollarSign}
          change={stats.monthlyRevenue > 0 ? "+12% so với tháng trước" : ""}
          changeType="increase"
          color="bg-orange-500"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tỷ lệ lấp đầy</h3>
            <span className="text-2xl font-bold text-blue-600">{stats.occupancyRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${stats.occupancyRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Yêu cầu chờ</h3>
            <span className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">Cần xử lý trong ngày</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Gần đây nhất: Phòng 301</span>
            <span className="bg-yellow-100 text-yellow-800 rounded-full px-2 py-1">Chi tiết</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Thanh toán trễ</h3>
            <span className="text-2xl font-bold text-red-600">{stats.overduePayments}</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">Cần nhắc nhở</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Gần đây nhất: Phòng 205</span>
            <span className="bg-red-100 text-red-800 rounded-full px-2 py-1">Chi tiết</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accommodations */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Tòa nhà của bạn</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Xem tất cả
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {enhancedAccommodations.length === 0 ? (
              <div className="text-center py-12">
                <Building size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có tòa nhà nào
                </h3>
                <p className="text-gray-500 mb-4">
                  Bắt đầu bằng cách thêm tòa nhà đầu tiên của bạn
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-5 w-5 mr-2" />
                  Thêm tòa nhà
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {enhancedAccommodations.map((accommodation) => (
                  <div key={accommodation._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={accommodation.image}
                          alt={accommodation.name}
                          className="h-16 w-16 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400';
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {accommodation.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleManageRooms(accommodation._id)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                              title="Quản lý phòng"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {accommodation.address || 'Chưa có địa chỉ'}
                        </p>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Phòng:</span>
                            <span className="ml-1 font-medium">{accommodation.occupiedRooms}/{accommodation.totalRooms}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Lấp đầy:</span>
                            <span className={`ml-1 font-medium ${
                              accommodation.occupancyRate >= 80 ? 'text-green-600' :
                              accommodation.occupancyRate >= 60 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {accommodation.occupancyRate}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Doanh thu:</span>
                            <span className="ml-1 font-medium text-blue-600">
                              {formatPrice(accommodation.monthlyRevenue)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Hoạt động gần đây</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'new_tenant' ? 'bg-green-100' :
                    activity.type === 'payment' ? 'bg-blue-100' :
                    activity.type === 'request' ? 'bg-yellow-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'new_tenant' && <Users className="h-4 w-4 text-green-600" />}
                    {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'request' && <Calendar className="h-4 w-4 text-yellow-600" />}
                    {activity.type === 'checkout' && <Home className="h-4 w-4 text-gray-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;