import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HealthData } from '../../types';

// Mock data for the chart
const mockChartData = [
  { time: '00:00', heartRate: 68 },
  { time: '04:00', heartRate: 65 },
  { time: '08:00', heartRate: 72 },
  { time: '12:00', heartRate: 75 },
  { time: '16:00', heartRate: 73 },
  { time: '20:00', heartRate: 70 },
];

interface Props {
  data: HealthData;
}

export default function HealthChart({ data }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Heart Rate Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="heartRate"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}