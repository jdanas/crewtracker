// src/components/health/HealthDashboard.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, Activity, Moon } from 'lucide-react';
import HealthMetricCard from './HealthMetricCard';
import HealthChart from './HealthChart';
import { HealthData } from '../../types';

export default function HealthDashboard() {
  const [healthData, setHealthData] = useState<HealthData[]>([]);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/health-data');
        console.log('Health data fetched:', response.data);
        setHealthData(response.data);
      } catch (error) {
        console.error('Error fetching health data:', error);
      }
    };

    fetchHealthData();
  }, []);

  if (healthData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Health Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HealthMetricCard
          icon={<Heart className="w-6 h-6 text-red-500" />}
          title="Heart Rate"
          value={`${healthData[0].heartRate} BPM`}
        />
        <HealthMetricCard
          icon={<Activity className="w-6 h-6 text-green-500" />}
          title="Steps"
          value={healthData[0].steps.toLocaleString()}
        />
        <HealthMetricCard
          icon={<Moon className="w-6 h-6 text-blue-500" />}
          title="Sleep"
          value={`${healthData[0].sleepHours} hours`}
        />
      </div>
      <div className="mt-8">
        <HealthChart data={healthData} />
      </div>
    </div>
  );
}