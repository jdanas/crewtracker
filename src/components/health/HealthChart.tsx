// src/components/health/HealthChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HealthData } from '../../types';

interface Props {
  data: HealthData | HealthData[];
}

export default function HealthChart({ data }: Props) {
  // Transform data into array format that Recharts expects
  const chartData = React.useMemo(() => {
    if (!data) return [];
    
    // If single object, convert to array
    const dataArray = Array.isArray(data) ? data : [data];
    
    // Transform data into format Recharts expects
    return dataArray.map(item => ({
      time: new Date(item.time).toLocaleTimeString(),
      heartRate: item.heartRate,
      steps: item.steps,
      sleepHours: item.sleepHours
    }));
  }, [data]);

  // Don't render chart if no data
  if (!chartData.length) {
    return <div>No data available</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Heart Rate Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
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