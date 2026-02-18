import React from 'react';
import type { MonthlyRequest } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface MonthlyRequestsTableProps {
  requests: MonthlyRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onSort: (field: string) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const MonthlyRequestsTable: React.FC<MonthlyRequestsTableProps> = ({
  requests,
  pagination,
  onPageChange,
  onSort,
  sortBy,
  sortOrder,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (requestNumber: string) => {
    navigate(`/admin/requests/${requestNumber}`);
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCompletionDate = (request: MonthlyRequest) => {
    if (!request.statusHistory || request.statusHistory.length === 0) {
      return '-';
    }
    const completedEntry = request.statusHistory.find(
      (entry: any) => entry.status === 'เสร็จสิ้น'
    );
    return completedEntry ? formatDate(completedEntry.timestamp) : '-';
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">รายการคำขอทั้งหมด</h3>
        <p className="text-gray-500 text-center py-8">ไม่มีข้อมูล</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        รายการคำขอทั้งหมด ({pagination.total} รายการ)
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('requestNumber')}
              >
                เลขคำขอ {getSortIcon('requestNumber')}
              </th>
              <th
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('createdAt')}
              >
                วันที่แจ้ง {getSortIcon('createdAt')}
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                วันที่เสร็จสิ้น
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('department')}
              >
                แผนก {getSortIcon('department')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('equipmentType')}
              >
                ประเภทอุปกรณ์ {getSortIcon('equipmentType')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                หัวข้อ
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('status')}
              >
                สถานะ {getSortIcon('status')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr
                key={request._id}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a
                    href={`/track/${request.requestNumber}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/track/${request.requestNumber}`);
                    }}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {request.requestNumber}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {formatDate(request.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {getCompletionDate(request)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.equipmentType}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {request.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      request.status === 'เสร็จสิ้น'
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'กำลังดำเนินการ'
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'ยกเลิก'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          แสดง {(pagination.page - 1) * pagination.limit + 1} ถึง{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} จาก{' '}
          {pagination.total} รายการ
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← ก่อนหน้า
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            หน้า {pagination.page} / {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ถัดไป →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyRequestsTable;
