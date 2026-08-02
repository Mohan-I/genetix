// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { MainApp } from './pages/MainApp';
import { PedigreeBuilderPage } from './pages/PedigreeBuilderPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ContactPage } from './pages/ContactPage';
import { ExplanationPage } from './pages/InfoPage';

// ScrollToTop wrapper component that ensures scrolling to top on navigation
const ScrollToTopWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  return <>{children}</>;
};

// Route change listener for debugging and analytics
const RouteChangeListener: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    console.log(`📍 Navigated to: ${location.pathname}`);
  }, [location]);

  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTopWrapper>
          <RouteChangeListener>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/app" element={<MainApp />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/explanation" element={<ExplanationPage />} />
              <Route path="/pedigree" element={<PedigreeBuilderPage />} />
              <Route path="/analysis" element={<Navigate to="/app" replace />} />
              <Route path="*" element={
                <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-light text-white/20">404</h1>
                    <p className="text-white/40 font-mono text-sm mt-4">Page not found</p>
                    <a href="/" className="inline-block mt-6 px-6 py-2 border border-emerald-500/30 text-emerald-400 text-xs font-mono hover:bg-emerald-500/10 transition-all">
                      Back to Home
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </RouteChangeListener>
        </ScrollToTopWrapper>
      </Router>
    </ErrorBoundary>
  );
}

export default App;