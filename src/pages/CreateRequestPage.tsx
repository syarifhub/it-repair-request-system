import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import logoImage from '../assets/logo.png';

export const CreateRequestPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    equipmentType: 'Computer',
    department: 'IT',
    title: '',
    problemDescription: '',
    reporterName: '',
    location: ''
  });

  const equipmentTypes = ['Computer', 'Printer', 'CCTV', 'UPS', 'Software'];
  const departments = [
    'Front Office',
    'Housekeeping',
    'Food & Beverage',
    'Engineering',
    'Accounting',
    'Sales & Marketing',
    'Security',
    'IT',
    'HR',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/repair-requests', formData);
      const requestNumber = response.data.data.requestNumber;
      alert(`แจ้งซ่อมสำเร็จ!\n\nรหัสคำขอ: ${requestNumber}\n\nกรุณาเก็บรหัสนี้ไว้สำหรับติดตามสถานะ`);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการแจ้งซ่อม');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
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
          🔧 แจ้งซ่อมอุปกรณ์ IT
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

      {error && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            ประเภทอุปกรณ์ *
          </label>
          <select
            name="equipmentType"
            value={formData.equipmentType}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            {equipmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            แผนก *
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            ชื่อผู้แจ้ง *
          </label>
          <input
            type="text"
            name="reporterName"
            value={formData.reporterName}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            หัวข้อ *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="เช่น: คอมพิวเตอร์เปิดไม่ติด"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            รายละเอียดปัญหา *
          </label>
          <textarea
            name="problemDescription"
            value={formData.problemDescription}
            onChange={handleChange}
            required
            rows={4}
            placeholder="อธิบายปัญหาที่พบโดยละเอียด..."
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            สถานที่ (ถ้ามี)
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="เช่น: ห้อง 301, ชั้น 3"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'กำลังส่ง...' : 'ส่งคำขอซ่อม'}
        </button>
      </form>
    </div>
  );
};
