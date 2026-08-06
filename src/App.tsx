// src/App.tsx
import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { MainApp } from './pages/MainApp';
import { PedigreeBuilderPage } from './pages/PedigreeBuilderPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ContactPage } from './pages/ContactPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ExplanationPage } from './pages/InfoPage';
import ComingSoonPage from './pages/ComingSoonPage';

// ============================================================================
// 1. SCROLL TO TOP - ENHANCED VERSION
// ============================================================================

interface ScrollToTopWrapperProps {
  children: React.ReactNode;
}

const ScrollToTopWrapper: React.FC<ScrollToTopWrapperProps> = ({ children }) => {
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    // Only scroll if the path actually changed (not first render)
    if (previousPath.current !== location.pathname) {
      previousPath.current = location.pathname;
      
      // Use multiple scroll methods for reliability
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });

      // Fallback: scroll document element and body
      document.documentElement.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });

      document.body.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });

      // Force scroll for stubborn browsers (like mobile Safari)
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 100);
    }
  }, [location.pathname]);

  // Also scroll when the component mounts (for direct navigation)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);

    return () => clearTimeout(timeoutId);
  }, []);

  return <>{children}</>;
};

// ============================================================================
// 2. ROUTE CHANGE LISTENER
// ============================================================================

interface RouteChangeListenerProps {
  children: React.ReactNode;
}

const RouteChangeListener: React.FC<RouteChangeListenerProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Log route changes for debugging
    console.log(`📍 Navigated to: ${location.pathname}`);
    
    // Analytics tracking (if needed)
    // if (typeof window.gtag !== 'undefined') {
    //   window.gtag('config', 'GA_MEASUREMENT_ID', {
    //     page_path: location.pathname,
    //   });
    // }

    // Reset any sticky scroll containers
    const scrollContainers = document.querySelectorAll('.scroll-container, .pedigree-canvas');
    scrollContainers.forEach(container => {
      container.scrollTop = 0;
      container.scrollLeft = 0;
    });
  }, [location]);

  return <>{children}</>;
};

// ============================================================================
// 3. SCROLL TO TOP BUTTON (optional utility)
// ============================================================================

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-full backdrop-blur-sm cursor-pointer hover:bg-emerald-500/30 transition-all group"
      aria-label="Back to top"
    >
      <svg 
        className="w-5 h-5 text-emerald-400 group-hover:-translate-y-0.5 transition-transform" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

// ============================================================================
// 4. APP COMPONENT
// ============================================================================

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
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/pedigree" element={<PedigreeBuilderPage />} />
              <Route path="/coming_soon" element={<ComingSoonPage />} />
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