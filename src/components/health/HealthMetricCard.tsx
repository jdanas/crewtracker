import React, { ReactNode, useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  icon: ReactNode;
  title: string;
  value: string;
}

export default function HealthMetricCard({ icon, title, value }: Props) {
  const [metricValue, setMetricValue] = useState(value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/health-metrics?title=${title}`);
        setMetricValue(response.data.value);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [title]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gray-50 rounded-full">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{metricValue}</p>
        </div>
      </div>
    </div>
  );
}