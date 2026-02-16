import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import logoImage from '../assets/logo.png';

export const AdminRequestsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [filters, setFilters] = useState({
    status: '',
    equipmentType: '',
    department: '',
    page: 1
  });
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [updateData, setUpdateData] = useState({
    status: '',
    notes: ''
  });

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.equipmentType) params.append('equipmentType', filters.equipmentType);
      if (filters.department) params.append('department', filters.department);
      params.append('page', filters.page.toString());
      params.append('limit', '10');

      const response = await api.get(`/admin/repair-requests?${params}`);
      setRequests(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (requestId: string, action: 'accept' | 'cancel' | 'complete' | 'delete') => {
    try {
      if (action === 'delete') {
        // ยืนยันก่อนลบ
        const confirmed = window.confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?\n\nการลบจะไม่สามารถกู้คืนได้');
        if (!confirmed) return;

        await api.delete(`/admin/repair-requests/${requestId}`);
        alert('ลบรายการสำเร็จ!');
        fetchRequests();
        return;
      }

      let status = '';
      let notes = '';
      
      if (action === 'accept') {
        status = 'กำลังดำเนินการ';
        notes = 'รับงานแล้ว';
      } else if (action === 'cancel') {
        status = 'ยกเลิก';
        notes = 'ยกเลิกโดย Admin';
      } else if (action === 'complete') {
        status = 'เสร็จสิ้น';
        notes = 'ดำเนินการเสร็จสิ้น';
      }
      
      await api.patch(`/admin/repair-requests/${requestId}`, { status, notes });
      alert('อัพเดทสำเร็จ!');
      fetchRequests();
    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || 'ไม่สามารถดำเนินการได้'));
    }
  };

  const handleUpdateRequest = async (requestId: string) => {
    try {
      await api.patch(`/admin/repair-requests/${requestId}`, updateData);
      alert('อัพเดทสำเร็จ!');
      setSelectedRequest(null);
      setUpdateData({ status: '', notes: '' });
      fetchRequests();
    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || 'ไม่สามารถอัพเดทได้'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'รอดำเนินการ': return '#ffc107';
      case 'กำลังดำเนินการ': return '#17a2b8';
      case 'เสร็จสิ้น': return '#28a745';
      case 'ยกเลิก': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {/* Logo */}
          <div style={{ 
            minHeight: '60px',
            minWidth: '90px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <img 
              src={logoImage}
              alt="Andaman Embrace Patong Logo" 
              style={{ 
                maxWidth: '90px',
                maxHeight: '60px',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#2d3748' }}>🔧 จัดการคำขอซ่อม</h1>
            <p style={{ margin: '5px 0', color: '#4a5568', fontSize: '16px', fontWeight: 'bold' }}>
              Andaman Embrace Patong
            </p>
            <p style={{ margin: '5px 0', color: '#718096', fontSize: '14px' }}>
              IT Repair Request System
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/admin/reports')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            รายงานรายเดือน
          </button>
          <button
            onClick={() => navigate('/admin/dashboard')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← กลับ Dashboard
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">ทุกสถานะ</option>
          <option value="รอดำเนินการ">รอดำเนินการ</option>
          <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
          <option value="เสร็จสิ้น">เสร็จสิ้น</option>
          <option value="ยกเลิก">ยกเลิก</option>
        </select>

        <select
          value={filters.equipmentType}
          onChange={(e) => setFilters({ ...filters, equipmentType: e.target.value, page: 1 })}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">ทุกประเภทอุปกรณ์</option>
          <option value="Computer">Computer</option>
          <option value="Printer">Printer</option>
          <option value="CCTV">CCTV</option>
          <option value="UPS">UPS</option>
          <option value="Software">Software</option>
        </select>

        <select
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value, page: 1 })}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">ทุกแผนก</option>
          <option value="Front Office">Front Office</option>
          <option value="Housekeeping">Housekeeping</option>
          <option value="Food & Beverage">Food & Beverage</option>
          <option value="Engineering">Engineering</option>
          <option value="Accounting">Accounting</option>
          <option value="Sales & Marketing">Sales & Marketing</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Reservation">Reservation</option>
          <option value="Other">Other</option>
        </select>

        <button
          onClick={() => setFilters({ status: '', equipmentType: '', department: '', page: 1 })}
          style={{
            padding: '8px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ล้างตัวกรอง
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>กำลังโหลด...</h2>
        </div>
      ) : (
        <>
          {/* Requests Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>รหัส</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>วันที่แจ้ง</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>หัวข้อ</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>อุปกรณ์</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>แผนก</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>ผู้แจ้ง</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>สถานะ</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>วันที่เสร็จสิ้น</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => {
                  // หาวันที่เสร็จสิ้น จาก statusHistory
                  const completedHistory = request.statusHistory?.find(
                    (h: any) => h.newStatus === 'เสร็จสิ้น'
                  );
                  const completedDate = completedHistory?.changedAt;

                  return (
                    <tr key={request._id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '12px' }}>
                        <a
                          href={`/track/${request.requestNumber}`}
                          style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#007bff',
                            textDecoration: 'none',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                          {request.requestNumber}
                        </a>
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px' }}>
                        {new Date(request.createdAt).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </td>
                      <td style={{ padding: '12px' }}>{request.title}</td>
                      <td style={{ padding: '12px' }}>{request.equipmentType}</td>
                      <td style={{ padding: '12px' }}>{request.department}</td>
                      <td style={{ padding: '12px' }}>{request.reporterName}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          display: 'inline-block',
                          minWidth: '120px',
                          textAlign: 'center',
                          padding: '6px 12px',
                          borderRadius: '12px',
                          backgroundColor: getStatusColor(request.status),
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {request.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px' }}>
                        {completedDate ? (
                          new Date(completedDate).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })
                        ) : (
                          '-'
                        )}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                          {request.status === 'รอดำเนินการ' && (
                            <>
                              <button
                                onClick={() => handleQuickAction(request._id, 'accept')}
                                title="รับงาน"
                                style={{
                                  padding: '6px 10px',
                                  backgroundColor: '#28a745',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '16px',
                                  fontWeight: 'bold'
                                }}
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => handleQuickAction(request._id, 'cancel')}
                                title="ยกเลิก"
                                style={{
                                  padding: '6px 10px',
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '16px',
                                  fontWeight: 'bold'
                                }}
                              >
                                ✕
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setUpdateData({ status: request.status, notes: '' });
                                }}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#007bff',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '14px'
                                }}
                            >
                              แก้ไข
                            </button>
                          </>
                        )}
                        {request.status === 'กำลังดำเนินการ' && (
                          <button
                            onClick={() => handleQuickAction(request._id, 'complete')}
                            title="เสร็จสิ้น"
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: 'bold'
                            }}
                          >
                            ✓ เสร็จสิ้น
                          </button>
                        )}
                        {request.status === 'ยกเลิก' && (
                          <button
                            onClick={() => handleQuickAction(request._id, 'delete')}
                            title="ลบรายการ"
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: 'bold'
                            }}
                          >
                            ❌ ลบ
                          </button>
                        )}
                        {request.status === 'เสร็จสิ้น' && (
                          <span style={{ color: '#6c757d', fontSize: '14px' }}>-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              marginTop: '20px'
            }}>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={filters.page === 1}
                style={{
                  padding: '8px 16px',
                  backgroundColor: filters.page === 1 ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: filters.page === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                ← ก่อนหน้า
              </button>
              <span>
                หน้า {pagination.page} / {pagination.totalPages} (ทั้งหมด {pagination.total} รายการ)
              </span>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={filters.page >= pagination.totalPages}
                style={{
                  padding: '8px 16px',
                  backgroundColor: filters.page >= pagination.totalPages ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: filters.page >= pagination.totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                ถัดไป →
              </button>
            </div>
          )}
        </>
      )}

      {/* Update Modal */}
      {selectedRequest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2>แก้ไขคำขอซ่อม</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>หัวข้อ:</strong> {selectedRequest.title}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>รายละเอียด:</strong>
              <p style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                {selectedRequest.problemDescription}
              </p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                สถานะ
              </label>
              <select
                value={updateData.status}
                onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="รอดำเนินการ">รอดำเนินการ</option>
                <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                <option value="ยกเลิก">ยกเลิก</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                หมายเหตุ
              </label>
              <textarea
                value={updateData.notes}
                onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                rows={3}
                placeholder="เพิ่มหมายเหตุ (ถ้ามี)"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleUpdateRequest(selectedRequest._id)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                บันทึก
              </button>
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setUpdateData({ status: '', notes: '' });
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
