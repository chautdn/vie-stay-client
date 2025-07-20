import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState({
    status: '',
    reportType: ''
  });

  // Fetch reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.reportType) params.reportType = filter.reportType;

      const response = await axios.get('http://localhost:8080/api/reports', {
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Cần có token admin
        }
      });
      
      setReports(response.data.data.reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Lỗi khi tải danh sách reports');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reports/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Update report status
  const updateReportStatus = async (reportId, status, adminNote = '') => {
    try {
      await axios.patch(`http://localhost:8080/api/reports/${reportId}/status`, {
        status,
        adminNote
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      alert('Cập nhật trạng thái thành công!');
      fetchReports(); // Reload data
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Lỗi khi cập nhật trạng thái');
    }
  };

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, [filter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      'scam': 'Lừa đảo',
      'duplicate': 'Trùng lặp',
      'cant_contact': 'Không liên hệ được',
      'fake': 'Thông tin sai',
      'other': 'Khác'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Quản lý Report</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Tổng Reports</h3>
          <p className="text-2xl font-bold">{stats.totalCount || 0}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-yellow-700">Đang chờ</h3>
          <p className="text-2xl font-bold text-yellow-800">{stats.statusStats?.pending || 0}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-blue-700">Đang xem xét</h3>
          <p className="text-2xl font-bold text-blue-800">{stats.statusStats?.reviewing || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-green-700">Đã xử lý</h3>
          <p className="text-2xl font-bold text-green-800">{stats.statusStats?.resolved || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Trạng thái</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({...filter, status: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Tất cả</option>
              <option value="pending">Đang chờ</option>
              <option value="reviewing">Đang xem xét</option>
              <option value="resolved">Đã xử lý</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Loại report</label>
            <select
              value={filter.reportType}
              onChange={(e) => setFilter({...filter, reportType: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Tất cả</option>
              <option value="scam">Lừa đảo</option>
              <option value="duplicate">Trùng lặp</option>
              <option value="cant_contact">Không liên hệ được</option>
              <option value="fake">Thông tin sai</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchReports}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bài đăng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người gửi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report._id.slice(-8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{report.postTitle}</div>
                  <div className="text-sm text-gray-500">ID: {report.postId?._id?.slice(-8) || report.postId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{report.fullname}</div>
                  <div className="text-sm text-gray-500">{report.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{getTypeLabel(report.reportType)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {report.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateReportStatus(report._id, 'reviewing')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Xem xét
                      </button>
                      <button
                        onClick={() => updateReportStatus(report._id, 'resolved', 'Đã xử lý')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Xử lý
                      </button>
                      <button
                        onClick={() => updateReportStatus(report._id, 'rejected', 'Không hợp lệ')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Từ chối
                      </button>
                    </>
                  )}
                  {report.status === 'reviewing' && (
                    <>
                      <button
                        onClick={() => updateReportStatus(report._id, 'resolved', 'Đã xử lý')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Xử lý
                      </button>
                      <button
                        onClick={() => updateReportStatus(report._id, 'rejected', 'Không hợp lệ')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Từ chối
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      alert(`Chi tiết report:\n\nNội dung: ${report.message}\nEmail: ${report.postOwner?.email}\nSĐT chủ tin: ${report.postOwner?.phoneNumber}`);
                    }}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {reports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Không có report nào
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportManagement;
