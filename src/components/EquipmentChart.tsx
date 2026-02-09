import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EquipmentChartProps {
  data: { [key: string]: number };
}

const EquipmentChart: React.FC<EquipmentChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    จำนวน: value,
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">คำขอแยกตามประเภทอุปกรณ์</h3>
        <p className="text-gray-500 text-center py-8">ไม่มีข้อมูล</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">คำขอแยกตามประเภทอุปกรณ์</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="จำนวน" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EquipmentChart;
