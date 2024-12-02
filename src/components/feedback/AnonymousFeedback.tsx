// src/components/feedback/AnonymousFeedback.tsx
import { MessageSquare, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface FeedbackForm {
  category: string;
  message: string;
}

export default function AnonymousFeedback() {
  const { register, handleSubmit, reset } = useForm<FeedbackForm>();

  const onSubmit = (data: FeedbackForm) => {
    axios.post('http://localhost:3000/feedback', data)
      .then(response => {
        console.log('Feedback submitted:', response.data);
        reset();
      })
      .catch(error => console.error('Error submitting feedback:', error));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <MessageSquare className="w-6 h-6 text-teal-500" />
        <h2 className="text-xl font-bold text-gray-800">Anonymous Feedback</h2>
      </div>
      <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
        <Lock className="w-4 h-4" />
        <p>Your feedback will remain completely anonymous</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            {...register('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200"
          >
            <option value="safety">Safety Concern</option>
            <option value="wellbeing">Wellbeing Issue</option>
            <option value="suggestion">Suggestion</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Message
          </label>
          <textarea
            {...register('message')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200"
            rows={4}
            placeholder="Share your thoughts..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
}