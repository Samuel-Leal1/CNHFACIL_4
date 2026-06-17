import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Simulado from './views/Simulado';
import AdminQuestoes from './views/AdminQuestoes';
import './App.css';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-gray-200">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-medium">Carregando CNHFácil...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  switch (currentView) {
    case 'dashboard':
      return <Dashboard onNavigate={setCurrentView} />;
    case 'simulado':
      return <Simulado onNavigate={setCurrentView} />;
    case 'admin-questoes':
      return <AdminQuestoes onNavigate={setCurrentView} />;
    default:
      return <Dashboard onNavigate={setCurrentView} />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
