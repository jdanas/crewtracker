import React from 'react';
import { useForm } from 'react-hook-form';
import { Brain, MessageCircle } from 'lucide-react';

interface SurveyForm {
  stress: number;
  mood: number;
  notes: string;
}

export default function MentalHealthSurvey() {
  const { register, handleSubmit } = useForm<SurveyForm>();

  const onSubmit = (data: SurveyForm) => {
    console.log('Survey submitted:', data);
    // TODO: Implement submission to Firebase
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="w-6 h-6 text-purple-500" />
        <h2 className="text-xl font-bold text-gray-800">Wellbeing Check-in</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stress Level (1-10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            className="w-full"
            {...register('stress')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mood Today (1-10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            className="w-full"
            {...register('mood')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Any thoughts to share?
          </label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
            rows={3}
            {...register('notes')}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
        >
          Submit Check-in
        </button>
      </form>
    </div>
  );
}