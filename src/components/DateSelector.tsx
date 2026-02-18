import React from 'react';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '15px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '2px solid #4facb8',
      marginBottom: '20px'
    }}>
      <label style={{ fontWeight: 'bold', color: '#2d3748' }}>
        📅 เลือกวันที่:
      </label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        max={today}
        min="2026-01-01"
        style={{
          padding: '8px 12px',
          fontSize: '16px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      />
      <button
        onClick={() => onDateChange(today)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#4facb8',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        วันนี้
      </button>
    </div>
  );
};

export default DateSelector;
