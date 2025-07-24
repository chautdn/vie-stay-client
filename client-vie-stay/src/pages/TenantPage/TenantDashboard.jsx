import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import {
  DocumentTextIcon,
  HomeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const TenantDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalDocuments: 0,
    pendingApprovals: 0,
    activeContracts: 0,
    expiringSoon: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // TODO: Implement API calls
      // Mock data for now
      setStats({
        totalDocuments: 3,
        pendingApprovals: 1,
        activeContracts: 1,
        expiringSoon: 0
      });

      setRecentActivities([
        {
          id: 1,
          type: 'document_uploaded',
          title: 'Đã upload giấy tạm trú',
          description: 'Giấy tạm trú đã được tải lên thành công',
          timestamp: '2 giờ trước',
          status: 'success'
        },
        {
          id: 2,
          type: 'approval_pending',
          title: 'Chờ phê duyệt hợp đồng',
          description: 'Hợp đồng mới đang chờ phê duyệt của bạn',
          timestamp: '1 ngày trước',
          status: 'pending'
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-3 text-lg text-gray-600">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <HomeIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Chào mừng trở lại
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {user?.fullname || user?.username}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Documents */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng giấy tờ
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalDocuments}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Chờ phê duyệt
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.pendingApprovals}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Active Contracts */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Hợp đồng hiệu lực
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.activeContracts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Sắp hết hạn
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.expiringSoon}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Hoạt động gần đây
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Các hoạt động và thay đổi mới nhất
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <li key={activity.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-2 w-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-400' :
                      activity.status === 'pending' ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`} />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    {activity.timestamp}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {recentActivities.length === 0 && (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-gray-500">Chưa có hoạt động nào</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Thao tác nhanh
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="/tenant/documents"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-300 hover:border-green-500"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  <DocumentTextIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  Upload giấy tờ
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Tải lên giấy tạm trú, tạm vắng và các giấy tờ khác
                </p>
              </div>
            </a>

            <a
              href="/tenant/contracts"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-300 hover:border-green-500"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                  <DocumentTextIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  Xem hợp đồng
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Xem và quản lý hợp đồng thuê phòng
                </p>
              </div>
            </a>

            <a
              href="/tenant/approvals"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-300 hover:border-green-500"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                  <ClockIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  Phê duyệt
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Xử lý các yêu cầu phê duyệt đang chờ
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;