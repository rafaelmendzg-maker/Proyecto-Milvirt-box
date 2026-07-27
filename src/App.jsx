import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthPage from './components/Auth/AuthPage';
import HypervisorPanel from './components/Hypervisor/HypervisorPanel';
import Header from './components/Layout/Header';

function AppContent() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Cargando sistema...</div>;
  return (
    <div className="mil-container">
      {!user ? <AuthPage /> : (
        <>
          <Header />
          <HypervisorPanel />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;