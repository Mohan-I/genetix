import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { MainApp } from './pages/MainApp';

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

function App() {
  return (
    <Router>
      <ScrollToTopWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/app" element={<MainApp />} />
        </Routes>
      </ScrollToTopWrapper>
    </Router>
  );
}

export default App;