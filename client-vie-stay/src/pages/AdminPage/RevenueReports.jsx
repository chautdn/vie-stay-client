import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Building2,
  Users,
  Star,
  MapPin,
  Eye,
  Filter
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const RevenueReports = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  });
  const [revenueData, setRevenueData] = useState({
    statistics: {
      totalAccommodations: 0,
      approvedAccommodations: 0,
      avgRating: 0,
      totalRooms: 0
    },
    monthlyTrend: [],
    topAccommodations: [],
    districtStats: []
  });

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // API call function with auth headers
  const apiCall = async (endpoint, options = {}) => {
    const token = getAuthToken();
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    };

    const response = await fetch(`http://localhost:8080${endpoint}`, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  };

  useEffect(() => {
    fetchRevenueData();
  }, [selectedPeriod, dateRange]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        period: selectedPeriod,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });

      const response = await apiCall(`/admin/revenue-report?${params}`);
      
      if (response.status === 'success') {
        setRevenueData(response.data);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const calculateGrowthRate = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  // Transform district data for charts
  const transformedDistrictData = revenueData.districtStats.map(district => ({
    district: district._id || 'Unknown',
    accommodations: district.accommodationCount || 0,
    rooms: district.totalRooms || 0,
    avgRating: district.avgRating || 0,
    // Mock revenue calculation - replace with actual revenue data when available
    revenue: (district.accommodationCount || 0) * 50000000
  }));

  // Transform monthly trend data for charts
  const transformedMonthlyData = revenueData.monthlyTrend.map(item => ({
    month: `${item._id?.month || 1}/${item._id?.year || 2024}`,
    accommodations: item.accommodationsAdded || 0,
    rooms: item.totalRooms || 0,
    // Mock revenue calculation
    revenue: (item.estimatedRevenue || item.totalRooms * 50000) || 0
  }));

  // Calculate summary statistics
  const totalRevenue = transformedMonthlyData.reduce((sum, item) => sum + item.revenue, 0);
  const avgMonthlyRevenue = transformedMonthlyData.length > 0 ? totalRevenue / transformedMonthlyData.length : 0;
  const currentMonth = transformedMonthlyData[transformedMonthlyData.length - 1];
  const previousMonth = transformedMonthlyData[transformedMonthlyData.length - 2];
  const revenueGrowth = currentMonth && previousMonth 
    ? calculateGrowthRate(currentMonth.revenue, previousMonth.revenue)
    : 0;

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend === 'up' && <TrendingUp className="h-4 w-4 mr-1" />}
              {trend === 'down' && <TrendingDown className="h-4 w-4 mr-1" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue Reports</h1>
          <p className="text-gray-600">Analytics and financial insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="month">Monthly</option>
            <option value="quarter">Quarterly</option>
            <option value="year">Yearly</option>
          </select>
          <button 
            onClick={fetchRevenueData}
            className="flex items-center px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Estimated Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          color="bg-green-500"
          trend={revenueGrowth > 0 ? 'up' : revenueGrowth < 0 ? 'down' : null}
          trendValue={`${revenueGrowth}% vs last month`}
        />
        <StatCard
          title="Monthly Average"
          value={formatCurrency(avgMonthlyRevenue)}
          icon={BarChart3}
          color="bg-blue-500"
          subtitle="Average monthly revenue"
        />
        <StatCard
          title="Total Accommodations"
          value={formatNumber(revenueData.statistics.totalAccommodations)}
          icon={Building2}
          color="bg-purple-500"
          subtitle="Approved properties"
        />
        <StatCard
          title="Avg Rating"
          value={revenueData.statistics.avgRating ? revenueData.statistics.avgRating.toFixed(1) : "N/A"}
          icon={Star}
          color="bg-yellow-500"
          subtitle="Across all properties"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>2024</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={transformedMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Revenue']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Accommodations Growth */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Accommodations Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transformedMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="accommodations" fill="#10b981" name="New Accommodations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* District Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance by District</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={transformedDistrictData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="district" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.replace('Quận ', '')}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'revenue') return [formatCurrency(value), 'Estimated Revenue'];
                if (name === 'accommodations') return [value, 'Properties'];
                if (name === 'avgRating') return [value.toFixed(1), 'Avg Rating'];
                return [value, name];
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="revenue" />
            <Bar yAxisId="right" dataKey="accommodations" fill="#10b981" name="accommodations" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Performing Accommodations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Accommodations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accommodation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rooms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenueData.topAccommodations.length > 0 ? (
                revenueData.topAccommodations.map((accommodation, index) => (
                  <tr key={accommodation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            #{index + 1}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {accommodation.name}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {accommodation.type?.replace('_', ' ') || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {accommodation.address?.district || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {accommodation.totalRooms || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {accommodation.averageRating?.toFixed(1) || 'N/A'}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          ({accommodation.totalReviews || 0})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <Building2 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No accommodation data available</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Growth Insights</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Properties</span>
              <span className="text-sm font-medium">{revenueData.statistics.totalAccommodations}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Approved Properties</span>
              <span className="text-sm font-medium text-green-600">{revenueData.statistics.approvedAccommodations}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Rooms</span>
              <span className="text-sm font-medium">{revenueData.statistics.totalRooms}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg. Rating</span>
              <span className="text-sm font-medium text-yellow-600">
                {revenueData.statistics.avgRating ? revenueData.statistics.avgRating.toFixed(1) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* District Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">District Overview</h4>
          <div className="space-y-4">
            {transformedDistrictData.slice(0, 4).map((district, index) => (
              <div key={district.district} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {district.district.replace('Quận ', '')}
                  </span>
                </div>
                <span className="text-sm font-medium">{district.accommodations}</span>
              </div>
            ))}
            {transformedDistrictData.length === 0 && (
              <p className="text-sm text-gray-500">No district data available</p>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Platform commission (5%)</span>
              <span className="text-sm font-medium">{formatCurrency(totalRevenue * 0.05)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg. revenue/property</span>
              <span className="text-sm font-medium">
                {revenueData.statistics.totalAccommodations > 0 
                  ? formatCurrency(totalRevenue / revenueData.statistics.totalAccommodations)
                  : formatCurrency(0)
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Growth rate</span>
              <span className={`text-sm font-medium ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenueGrowth}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active districts</span>
              <span className="text-sm font-medium">{transformedDistrictData.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Custom Date Range</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchRevenueData}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            <span className="text-sm">Revenue Summary (PDF)</span>
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            <span className="text-sm">Financial Data (CSV)</span>
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            <span className="text-sm">Analytics Report (Excel)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevenueReports;