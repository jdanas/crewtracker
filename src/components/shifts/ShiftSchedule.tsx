// src/components/shifts/ShiftSchedule.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Shift } from '../../types';

export default function ShiftSchedule() {
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/shifts');
        console.log('Shifts data fetched:', response.data);
        setShifts(response.data);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };

    fetchShifts();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-800">Shift Schedule</h2>
      </div>
      <div className="space-y-4">
        {shifts.map((shift) => {
          const startTime = new Date(shift.startTime);
          const endTime = new Date(shift.endTime);

          // Check if the date values are valid
          if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            console.error('Invalid date value:', shift);
            return null;
          }

          return (
            <div
              key={shift.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{shift.role}</p>
                  <p className="text-sm text-gray-500">
                    {format(startTime, 'PPp')} - {format(endTime, 'PPp')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}