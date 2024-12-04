// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Ship } from 'lucide-react';
import HealthDashboard from './components/health/HealthDashboard';
import MentalHealthSurvey from './components/mental/MentalHealthSurvey';
import ShiftSchedule from './components/shifts/ShiftSchedule';
import AnonymousFeedback from './components/feedback/AnonymousFeedback';
import ErrorBoundary from './components/errorboundary/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';

// Protected Route Component
const ProtectedLayout = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Ship className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Crew Wellbeing Tracker</h1>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <HealthDashboard />
            <ShiftSchedule />
          </div>
          <div className="space-y-8">
            <MentalHealthSurvey />
            <AnonymousFeedback />
          </div>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedLayout />} />
            {/* Add more routes as needed */}
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App; 