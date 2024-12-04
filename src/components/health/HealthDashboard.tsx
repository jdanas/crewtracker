// src/components/health/HealthDashboard.tsx
import { useEffect, useState } from 'react';
import { Heart, Activity, Moon } from 'lucide-react';
import HealthMetricCard from './HealthMetricCard';
import HealthChart from './HealthChart';
import { HealthData } from '../../types';
import axiosInstance from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';

export default function HealthDashboard() {
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        if (!user?.id) {
          setError('No user ID available');
          setLoading(false);
          return;
        }
  
        console.log('Fetching health data for user:', user.id);
        
        const response = await axiosInstance.get('/health-data', {
          headers: {
            'user-id': user.id
          }
        });
        
        console.log('Raw response data:', response.data);
        
        // Transform the data to match HealthData interface
        const formattedData = Array.isArray(response.data) ? response.data.map(item => ({
          time: item.time,
          heartRate: item.heartrate, // Transform from heartrate to heartRate
          steps: item.steps,
          sleepHours: item.sleephours, // Transform from sleephours to sleepHours
          lastUpdated: new Date(item.lastupdated) // Transform from lastupdated to lastUpdated
        })) : [];
  
        console.log('Formatted health data:', formattedData);
        
        setHealthData(formattedData);
      } catch (error: any) {
        console.error('Error fetching health data:', error);
        setError(error.response?.data?.error || error.message || 'Failed to load health data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchHealthData();
  }, [user]);
  
  // Debug render cycle
  console.log('Current healthData state:', healthData);
  console.log('Current loading state:', loading);
  console.log('Current error state:', error);

  if (loading) {
    return <div className="p-6">Loading health data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!healthData || healthData.length === 0) {
    return <div className="p-6">No health data available</div>;
  }

  // Debug data being used for rendering
  console.log('Rendering with data:', {
    heartRate: healthData[0]?.heartRate,
    steps: healthData[0]?.steps,
    sleepHours: healthData[0]?.sleepHours
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Health Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HealthMetricCard
          icon={<Heart className="w-6 h-6 text-red-500" />}
          title="Heart Rate"
          value={`${healthData[0]?.heartRate || 0} BPM`}
        />
        <HealthMetricCard
          icon={<Activity className="w-6 h-6 text-green-500" />}
          title="Steps"
          value={(healthData[0]?.steps || 0).toLocaleString()}
        />
        <HealthMetricCard
          icon={<Moon className="w-6 h-6 text-blue-500" />}
          title="Sleep"
          value={`${healthData[0]?.sleepHours || 0} hours`}
        />
      </div>
      <div className="mt-8">
        <HealthChart data={healthData} />
      </div>
    </div>
  );
}