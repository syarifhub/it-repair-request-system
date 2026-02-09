import React, { useEffect, useState } from 'react';
import { getAvailableMonths, type AvailableMonth } from '../services/api';

interface MonthYearSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onChange: (month: number, year: number) => void;
}

const MONTH_NAMES = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  selectedMonth,
  selectedYear,
  onChange,
}) => {
  const [availableMonths, setAvailableMonths] = useState<AvailableMonth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableMonths = async () => {
      try {
        const months = await getAvailableMonths();
        setAvailableMonths(months);
      } catch (error) {
        console.error('Error fetching available months:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableMonths();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [year, month] = e.target.value.split('-').map(Number);
    onChange(month, year);
  };

  if (loading) {
    return <div className="text-gray-600">กำลังโหลด...</div>;
  }

  return (
    <div className="mb-6">
      <label htmlFor="month-year-select" className="block text-sm font-medium text-gray-700 mb-2">
        เลือกเดือน-ปี
      </label>
      <select
        id="month-year-select"
        value={`${selectedYear}-${selectedMonth}`}
        onChange={handleChange}
        className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        {availableMonths.length === 0 ? (
          <option value="">ไม่มีข้อมูล</option>
        ) : (
          availableMonths.map((item) => (
            <option
              key={`${item.year}-${item.month}`}
              value={`${item.year}-${item.month}`}
            >
              {MONTH_NAMES[item.month - 1]} {item.year + 543} ({item.count} รายการ)
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default MonthYearSelector;
