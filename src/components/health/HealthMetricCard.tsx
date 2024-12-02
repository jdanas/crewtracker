import React, { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  title: string;
  value: string;
}

export default function HealthMetricCard({ icon, title, value }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gray-50 rounded-full">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}