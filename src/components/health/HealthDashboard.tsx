// src/components/health/HealthDashboard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, Activity, Moon } from 'lucide-react';
import HealthMetricCard from './HealthMetricCard';
import HealthChart from './HealthChart';
import { HealthData } from '../../types';

export default function HealthDashboard() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);

  useEffect(() => {
    axios.get('http://localhost:3000/health-data')
      .then(response => setHealthData(response.data))
      .catch(error => console.error('Error fetching health data:', error));
  }, []);

  if (!healthData) {
    return <div>Loading...</div>;
  }

  const chartData: HealthData[] = [
    {
      time: "2023-10-01T10:00:00Z",
      heartRate: 72,
      steps: 5000,
      sleepHours: 8,
      lastUpdated: new Date("2023-10-01T10:00:00Z"),
    },
    // Add more data points as needed
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Health Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HealthMetricCard
          icon={<Heart className="w-6 h-6 text-red-500" />}
          title="Heart Rate"
          value={`${healthData.heartRate} BPM`}
        />
        <HealthMetricCard
          icon={<Activity className="w-6 h-6 text-green-500" />}
          title="Steps"
          value={healthData.steps.toLocaleString()}
        />
        <HealthMetricCard
          icon={<Moon className="w-6 h-6 text-blue-500" />}
          title="Sleep"
          value={`${healthData.sleepHours} hours`}
        />
      </div>
      <div className="mt-8">
        <HealthChart data={chartData} />
      </div>
    </div>
  );
}