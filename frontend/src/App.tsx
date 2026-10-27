import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { OrderConfigPage } from './pages/OrderConfigPage';
import { ClientDashboardPage } from './pages/ClientDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthModal } from './components/AuthModal';
import { ChatbotWidget } from './components/ChatbotWidget';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, currentUser, login } = useApp();

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      <Navbar />

      <div className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'order-config' && <OrderConfigPage />}
        {currentView === 'client-dashboard' && <ClientDashboardPage />}
        {currentView === 'admin-dashboard' && <AdminDashboardPage />}
      </div>

      <Footer />
      <AuthModal />

      {/* Floating AI Chatbot — visible on all pages */}
      <ChatbotWidget />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
