import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { injectThemeVariables } from './constants/theme';
import { Toaster } from './components/ui/sonner';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Flashcards from './pages/Flashcards';
import KnowledgeGraph from './pages/KnowledgeGraph';
import Chat from './pages/Chat';
import Settings from './pages/Settings';

// Layout
import AppLayout from './components/AppLayout';
import PublicLayout from './components/PublicLayout';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-teal"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppContent() {
  useEffect(() => {
    console.log('AppContent mounted');
    injectThemeVariables();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/features" element={<PublicLayout><Features /></PublicLayout>} />
      <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Documents />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/flashcards"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Flashcards />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/knowledge-graph"
        element={
          <ProtectedRoute>
            <AppLayout>
              <KnowledgeGraph />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Chat />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  // Use Vite's import.meta.env for environment variables
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID;

  // Log for debugging
  if (import.meta.env.DEV || process.env.NODE_ENV === 'development') {
    console.log('App rendering, Google Client ID:', clientId ? 'Set' : 'Not set');
    if (!clientId) {
      console.warn('⚠️ VITE_GOOGLE_CLIENT_ID is not set in .env file');
    }
  }

  return (
    <ErrorBoundary>
      <div className="App">
        <GoogleOAuthProvider clientId={clientId || ''}>
          <AuthProvider>
            <WorkspaceProvider>
              <BrowserRouter>
                <AppContent />
                <Toaster />
              </BrowserRouter>
            </WorkspaceProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;

