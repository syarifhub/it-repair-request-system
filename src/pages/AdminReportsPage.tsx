import { useState, useEffect } from 'react';
import { getMonthlyStats, getMonthlyRequests, type MonthlyStats, type MonthlyRequest } from '../services/api';

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export default function AdminReportsPage() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [stats, setStats] = useState<MonthlyStats | null>(null);
  const [requests, setRequests] = useState<MonthlyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedYear, currentPage]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, requestsData] = await Promise.all([
        getMonthlyStats(selectedMonth, selectedYear),
        getMonthlyRequests(selectedMonth, selectedYear, currentPage, 20)
      ]);
      setStats(statsData);
      setRequests(requestsData.data);
      setTotalPages(requestsData.pagination.totalPages);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>📊 รายงานรายเดือน</h1>
        <p style={{ color: '#666' }}>สรุปข้อมูลคำขอซ่อมแยกตามเดือน</p>
      </div>

      {/* Month/Year Selector */}
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '16px' }}>เลือกเดือน</label>
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              style={{ 
                padding: '12px 16px', 
                border: '2px solid #e0e0e0', 
                borderRadius: '8px', 
                fontSize: '16px',
                minWidth: '180px',
                cursor: 'pointer'
              }}
            >
              {THAI_MONTHS.map((month, index) => (
                <option key={index + 1} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '16px' }}>เลือกปี</label>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              style={{ 
                padding: '12px 16px', 
                border: '2px solid #e0e0e0', 
                borderRadius: '8px', 
                fontSize: '16px',
                minWidth: '150px',
                cursor: 'pointer'
              }}
            >
              {Array.from({ length: 10 }, (_, i) => 2569 + i).map(year => (
                <option key={year} value={year - 543}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ 
            display: 'inline-block', 
            width: '50px', 
            height: '50px', 
            border: '5px solid #f3f3f3', 
            borderTop: '5px solid #3498db', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          }}></div>
          <p style={{ marginTop: '20px', color: '#666', fontSize: '18px' }}>กำลังโหลดข้อมูล...</p>
        </div>
      ) : stats && stats.totalRequests > 0 ? (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#3b82f6', color: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
              <div style={{ fontSize: '16px', marginBottom: '10px', opacity: 0.9 }}>คำขอทั้งหมด</div>
              <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{stats.totalRequests}</div>
              <div style={{ fontSize: '14px', marginTop: '5px', opacity: 0.8 }}>รายการ</div>
            </div>
            <div style={{ backgroundColor: '#f59e0b', color: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}>
              <div style={{ fontSize: '16px', marginBottom: '10px', opacity: 0.9 }}>รอดำเนินการ</div>
              <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{stats.byStatus['รอดำเนินการ'] || 0}</div>
              <div style={{ fontSize: '14px', marginTop: '5px', opacity: 0.8 }}>รายการ</div>
            </div>
            <div style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}>
              <div style={{ fontSize: '16px', marginBottom: '10px', opacity: 0.9 }}>กำลังดำเนินการ</div>
              <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{stats.byStatus['กำลังดำเนินการ'] || 0}</div>
              <div style={{ fontSize: '14px', marginTop: '5px', opacity: 0.8 }}>รายการ</div>
            </div>
            <div style={{ backgroundColor: '#10b981', color: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
              <div style={{ fontSize: '16px', marginBottom: '10px', opacity: 0.9 }}>เสร็จสิ้น</div>
              <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{stats.byStatus['เสร็จสิ้น'] || 0}</div>
              <div style={{ fontSize: '14px', marginTop: '5px', opacity: 0.8 }}>รายการ</div>
            </div>
            <div style={{ backgroundColor: '#ef4444', color: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>
              <div style={{ fontSize: '16px', marginBottom: '10px', opacity: 0.9 }}>ยกเลิก</div>
              <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{stats.byStatus['ยกเลิก'] || 0}</div>
              <div style={{ fontSize: '14px', marginTop: '5px', opacity: 0.8 }}>รายการ</div>
            </div>
          </div>

          {/* Statistics Tables */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px', marginBottom: '30px' }}>
            {/* Department Stats */}
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#333', borderBottom: '3px solid #3b82f6', paddingBottom: '10px' }}>
                🏢 สถิติตามแผนก
              </h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>แผนก</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>จำนวน</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.byDepartment).map(([dept, count]) => (
                    <tr key={dept} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '14px', fontSize: '15px' }}>{dept}</td>
                      <td style={{ padding: '14px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: '#3b82f6' }}>{count}</td>
                      <td style={{ padding: '14px', textAlign: 'right', color: '#666' }}>
                        {((count / stats.totalRequests) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Equipment Stats */}
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#333', borderBottom: '3px solid #10b981', paddingBottom: '10px' }}>
                💻 สถิติตามอุปกรณ์
              </h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>ประเภท</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>จำนวน</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6', fontWeight: '600' }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.byEquipmentType).map(([type, count]) => (
                    <tr key={type} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '14px', fontSize: '15px' }}>{type}</td>
                      <td style={{ padding: '14px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: '#10b981' }}>{count}</td>
                      <td style={{ padding: '14px', textAlign: 'right', color: '#666' }}>
                        {((count / stats.totalRequests) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Department-Equipment Breakdown */}
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#333', borderBottom: '3px solid #f59e0b', paddingBottom: '10px' }}>
              🔧 สถิติแยกตามแผนกและอุปกรณ์
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {stats.byDepartmentEquipment && Object.entries(stats.byDepartmentEquipment).map(([dept, equipment]: [string, any]) => (
                <div key={dept} style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>{dept}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Object.entries(equipment).map(([type, count]: [string, any]) => (
                      <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>
                        <span style={{ fontSize: '14px', color: '#555' }}>{type}</span>
                        <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#f59e0b' }}>{count} ครั้ง</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requests Table */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '25px', borderBottom: '2px solid #f0f0f0' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#333' }}>📋 รายการคำขอทั้งหมด ({stats.totalRequests} รายการ)</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '14px', color: '#666' }}>เลขคำขอ</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '14px', color: '#666' }}>แผนก</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '14px', color: '#666' }}>อุปกรณ์</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '14px', color: '#666' }}>หัวข้อ</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '14px', color: '#666' }}>สถานะ</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', fontSize: '14px', color: '#666' }}>วันที่</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '16px' }}>
                        <span style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '15px' }}>{request.requestNumber}</span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '15px' }}>{request.department}</td>
                      <td style={{ padding: '16px', fontSize: '15px' }}>{request.equipmentType}</td>
                      <td style={{ padding: '16px', fontSize: '15px', maxWidth: '300px' }}>{request.title}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '600',
                          backgroundColor: 
                            request.status === 'เสร็จสิ้น' ? '#d1fae5' :
                            request.status === 'กำลังดำเนินการ' ? '#fef3c7' :
                            request.status === 'รอดำเนินการ' ? '#dbeafe' :
                            request.status === 'ยกเลิก' ? '#fee2e2' : '#f3f4f6',
                          color:
                            request.status === 'เสร็จสิ้น' ? '#065f46' :
                            request.status === 'กำลังดำเนินการ' ? '#92400e' :
                            request.status === 'รอดำเนินการ' ? '#1e40af' :
                            request.status === 'ยกเลิก' ? '#991b1b' : '#374151'
                        }}>
                          {request.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#666' }}>
                        {new Date(request.createdAt).toLocaleDateString('th-TH', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ padding: '20px', borderTop: '2px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '10px 20px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '15px'
                  }}
                >
                  ← ก่อนหน้า
                </button>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#666' }}>
                  หน้า {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '10px 20px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '15px'
                  }}
                >
                  ถัดไป →
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ backgroundColor: 'white', padding: '60px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📭</div>
          <p style={{ fontSize: '22px', color: '#666', marginBottom: '10px' }}>ไม่มีข้อมูลสำหรับเดือนนี้</p>
          <p style={{ fontSize: '16px', color: '#999' }}>ลองเลือกเดือนอื่นหรือสร้างคำขอใหม่</p>
        </div>
      )}
    </div>
  );
}
