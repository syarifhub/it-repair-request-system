import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import logoImage from '../assets/logo.png';

export const TrackRequestPage = () => {
  const navigate = useNavigate();
  const [requestId, setRequestId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [request, setRequest] = useState<any>(null);
  const [cancelling, setCancelling] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRequest(null);

    try {
      const response = await api.get(`/repair-requests/${requestId}`);
      setRequest(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่พบคำขอซ่อมนี้');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!request) return;

    const confirmed = window.confirm(
      'คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการแจ้งซ่อมนี้?\n\nหมายเหตุ: สามารถยกเลิกได้เฉพาะคำขอที่มีสถานะ "รอดำเนินการ" เท่านั้น'
    );

    if (!confirmed) return;

    setCancelling(true);
    setError('');

    try {
      const response = await api.post(`/repair-requests/${request._id}/cancel`);
      setRequest(response.data.data);
      alert('ยกเลิกการแจ้งซ่อมเรียบร้อยแล้ว');
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถยกเลิกการแจ้งซ่อมได้');
    } finally {
      setCancelling(false);
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {/* Logo Area */}
        <div style={{ 
          marginBottom: '15px', 
          minHeight: '100px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <img 
            src={logoImage}
            alt="Andaman Embrace Patong Logo" 
            style={{ 
              maxWidth: '150px',
              maxHeight: '100px',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain'
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <h1 style={{ fontSize: '28px', color: '#2d3748', marginBottom: '5px' }}>
          📍 ติดตามสถานะการซ่อม
        </h1>
        <p style={{ color: '#4a5568', fontSize: '16px', fontWeight: 'bold', margin: '5px 0' }}>
          Andaman Embrace Patong
        </p>
        <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>
          IT Repair Request System
        </p>
      </div>
      
      <button
        onClick={() => navigate('/')}
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← กลับหน้าหลัก
      </button>

      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value.toUpperCase())}
            placeholder="ใส่รหัสคำขอซ่อม (เช่น IT-0001, HK-0002)"
            required
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      {request && (
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ margin: 0 }}>{request.title}</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{
                padding: '6px 12px',
                borderRadius: '20px',
                backgroundColor: getStatusColor(request.status),
                color: 'white',
                fontWeight: 'bold'
              }}>
                {request.status}
              </span>
              {request.status === 'รอดำเนินการ' && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: cancelling ? '#6c757d' : '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: cancelling ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  {cancelling ? 'กำลังยกเลิก...' : '❌ ยกเลิกการแจ้ง'}
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <strong>รหัสคำขอ:</strong>
              <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                {request.requestNumber}
              </p>
            </div>
            <div>
              <strong>ประเภทอุปกรณ์:</strong>
              <p style={{ margin: '5px 0' }}>{request.equipmentType}</p>
            </div>
            <div>
              <strong>แผนก:</strong>
              <p style={{ margin: '5px 0' }}>{request.department}</p>
            </div>
            <div>
              <strong>ผู้แจ้ง:</strong>
              <p style={{ margin: '5px 0' }}>{request.reporterName}</p>
            </div>
            {request.location && (
              <div>
                <strong>สถานที่:</strong>
                <p style={{ margin: '5px 0' }}>{request.location}</p>
              </div>
            )}
            <div>
              <strong>วันที่แจ้ง:</strong>
              <p style={{ margin: '5px 0' }}>
                {new Date(request.createdAt).toLocaleString('th-TH')}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <strong>รายละเอียดปัญหา:</strong>
            <p style={{
              margin: '10px 0',
              padding: '10px',
              backgroundColor: 'white',
              borderRadius: '4px',
              whiteSpace: 'pre-wrap'
            }}>
              {request.problemDescription}
            </p>
          </div>

          {request.statusHistory && request.statusHistory.length > 0 && (
            <div>
              <strong>ประวัติการเปลี่ยนสถานะ:</strong>
              <div style={{ marginTop: '10px' }}>
                {request.statusHistory.map((history: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      padding: '10px',
                      marginBottom: '10px',
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      borderLeft: `4px solid ${getStatusColor(history.newStatus)}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontWeight: 'bold' }}>{history.newStatus}</span>
                      <span style={{ color: '#666', fontSize: '14px' }}>
                        {new Date(history.changedAt).toLocaleString('th-TH')}
                      </span>
                    </div>
                    {history.notes && (
                      <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                        หมายเหตุ: {history.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
