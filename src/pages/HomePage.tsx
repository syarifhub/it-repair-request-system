import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #4facb8 0%, #2d8a99 100%)',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '700px',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Logo Area */}
        <div style={{ 
          marginBottom: '20px', 
          minHeight: '120px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <img 
            src={logoImage}
            alt="Andaman Embrace Patong Logo" 
            style={{ 
              maxWidth: '200px',
              maxHeight: '120px',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain'
            }}
            onError={(e) => {
              console.error('Logo failed to load');
              const img = e.currentTarget;
              img.style.display = 'none';
            }}
          />
        </div>

        <h1 style={{ 
          fontSize: '32px', 
          marginBottom: '10px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Andaman Embrace Patong
        </h1>
        <h2 style={{ 
          fontSize: '24px', 
          marginBottom: '10px',
          color: '#4a5568'
        }}>
          ระบบแจ้งซ่อมอุปกรณ์ IT
        </h2>
        <p style={{ 
          fontSize: '16px', 
          color: '#718096', 
          marginBottom: '40px' 
        }}>
          IT Repair Request System
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <button
            onClick={() => navigate('/create-request')}
            style={{
              padding: '20px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            📝 แจ้งซ่อม
          </button>

          <button
            onClick={() => navigate('/track-request')}
            style={{
              padding: '20px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e7e34'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
          >
            📍 ติดตามสถานะ
          </button>

          <button
            onClick={() => window.open('/คู่มือการใช้งานระบบแจ้งซ่อมอุปกรณ์ IT.pdf', '_blank')}
            style={{
              padding: '20px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#117a8b'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#17a2b8'}
          >
            📖 คู่มือการใช้งาน
          </button>

          <button
            onClick={() => navigate('/admin/login')}
            style={{
              padding: '20px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#545b62'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
          >
            🔐 Admin Login
          </button>
        </div>

        <div style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0 }}>ประเภทอุปกรณ์ที่รองรับ</h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center'
          }}>
            {['Computer', 'Printer', 'CCTV', 'UPS', 'Software'].map(type => (
              <span
                key={type}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e9ecef',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
