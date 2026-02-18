import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import logoImage from '../assets/logo.png';
import DateSelector from '../components/DateSelector';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    if (user) {
      setAdminUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [selectedDate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/dashboard/daily?date=${selectedDate}`);
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>กำลังโหลด...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #ddd',
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
            <h1 style={{ margin: 0, fontSize: '28px', color: '#2d3748' }}>📊 Dashboard (รายวัน)</h1>
            <p style={{ margin: '5px 0', color: '#4a5568', fontSize: '16px', fontWeight: 'bold' }}>
              Andaman Embrace Patong
            </p>
            <p style={{ margin: '5px 0', color: '#718096', fontSize: '14px' }}>
              IT Repair Request System
            </p>
            <p style={{ margin: '5px 0', color: '#666' }}>
              ยินดีต้อนรับ, {adminUser?.fullName || 'Admin'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/admin/requests')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            จัดการคำขอซ่อม
          </button>
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
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ออกจากระบบ
          </button>
        </div>
      </div>

      <DateSelector selectedDate={selectedDate} onDateChange={handleDateChange} />

      {stats && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              padding: '20px',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0' }}>ทั้งหมด</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
                {stats.totalRequests}
              </p>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: '#ffc107',
              color: 'white',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0' }}>รอดำเนินการ</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
                {stats.byStatus['รอดำเนินการ'] || 0}
              </p>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: '#17a2b8',
              color: 'white',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0' }}>กำลังดำเนินการ</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
                {stats.byStatus['กำลังดำเนินการ'] || 0}
              </p>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: '#28a745',
              color: 'white',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0' }}>เสร็จสิ้น</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
                {stats.byStatus['เสร็จสิ้น'] || 0}
              </p>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: '#dc3545',
              color: 'white',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0' }}>ยกเลิก</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
                {stats.byStatus['ยกเลิก'] || 0}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <h2>ตามประเภทอุปกรณ์</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(stats.byEquipmentType).map(([type, count]: [string, any]) => (
                  <div key={type} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px'
                  }}>
                    <span>{type}</span>
                    <span style={{ fontWeight: 'bold' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <h2>ตามแผนก</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(stats.byDepartment).map(([dept, count]: [string, any]) => (
                  <div key={dept} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px'
                  }}>
                    <span>{dept}</span>
                    <span style={{ fontWeight: 'bold' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
