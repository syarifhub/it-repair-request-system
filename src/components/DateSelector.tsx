import React from 'react';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const [year, month, day] = selectedDate.split('-');
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2025 }, (_, i) => 2026 + i);
  
  const months = [
    { value: '01', label: 'มกราคม' },
    { value: '02', label: 'กุมภาพันธ์' },
    { value: '03', label: 'มีนาคม' },
    { value: '04', label: 'เมษายน' },
    { value: '05', label: 'พฤษภาคม' },
    { value: '06', label: 'มิถุนายน' },
    { value: '07', label: 'กรกฎาคม' },
    { value: '08', label: 'สิงหาคม' },
    { value: '09', label: 'กันยายน' },
    { value: '10', label: 'ตุลาคม' },
    { value: '11', label: 'พฤศจิกายน' },
    { value: '12', label: 'ธันวาคม' }
  ];

  const getDaysInMonth = (year: string, month: string) => {
    return new Date(parseInt(year), parseInt(month), 0).getDate();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDayChange = (newDay: string) => {
    onDateChange(`${year}-${month}-${newDay.padStart(2, '0')}`);
  };

  const handleMonthChange = (newMonth: string) => {
    const maxDay = getDaysInMonth(year, newMonth);
    const adjustedDay = Math.min(parseInt(day), maxDay).toString().padStart(2, '0');
    onDateChange(`${year}-${newMonth}-${adjustedDay}`);
  };

  const handleYearChange = (newYear: string) => {
    const maxDay = getDaysInMonth(newYear, month);
    const adjustedDay = Math.min(parseInt(day), maxDay).toString().padStart(2, '0');
    onDateChange(`${newYear}-${month}-${adjustedDay}`);
  };

  const handleToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onDateChange(today);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '15px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '2px solid #4facb8',
      marginBottom: '20px',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontWeight: 'bold', color: '#2d3748', fontSize: '14px' }}>
          เลือกวันที่
        </label>
        <select
          value={day}
          onChange={(e) => handleDayChange(e.target.value)}
          style={{
            padding: '10px 15px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            minWidth: '100px'
          }}
        >
          {days.map(d => (
            <option key={d} value={d.toString().padStart(2, '0')}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontWeight: 'bold', color: '#2d3748', fontSize: '14px' }}>
          เลือกเดือน
        </label>
        <select
          value={month}
          onChange={(e) => handleMonthChange(e.target.value)}
          style={{
            padding: '10px 15px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            minWidth: '150px'
          }}
        >
          {months.map(m => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontWeight: 'bold', color: '#2d3748', fontSize: '14px' }}>
          เลือกปี
        </label>
        <select
          value={year}
          onChange={(e) => handleYearChange(e.target.value)}
          style={{
            padding: '10px 15px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            minWidth: '100px'
          }}
        >
          {years.map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleToday}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4facb8',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
          marginTop: '20px'
        }}
      >
        📅 วันนี้
      </button>
    </div>
  );
};

export default DateSelector;
