import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Twitter } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Helper function to handle active page styling dynamically
  const getLinkClass = (path: string) => {
    const baseClass = "text-[11px] font-mono transition-colors";
    const isActive = location.pathname === path;
    return isActive
      ? `${baseClass} text-emerald-400 border-b border-emerald-500/50 pb-0.5`
      : `${baseClass} text-white/40 hover:text-white/80`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0c]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-sm flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="text-[#0a0a0c] font-bold text-sm">G</span>
            </div>
            <span className="text-sm font-mono text-white/80 tracking-wider">GENETIX</span>
            <span className="text-[9px] font-mono text-emerald-500/60 bg-emerald-500/10 px-1.5 py-0.5 hidden md:flex rounded">
              v4.2
            </span>
          </Link>
        </motion.div>

        {/* Central Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {isHomePage ? (
            <>
              <Link to="/" className="text-[11px] font-mono text-white/40 hover:text-white/80 transition-colors">Home</Link>
              <Link to="/explanation" className="text-[11px] font-mono text-white/40 hover:text-white/80 transition-colors">How It Works</Link>
              <Link to="/resources" className="text-[11px] font-mono text-white/40 hover:text-white/80 transition-colors">Resources</Link>
              <Link to="/contact" className="text-[11px] font-mono text-white/40 hover:text-white/80 transition-colors">Contact</Link>
            </>
          ) : (
            <>
              <Link to="/" className={getLinkClass('/')}>Home</Link>
              <Link to="/explanation" className={getLinkClass('/explanation')}>How It Works</Link>
              <Link to="/resources" className={getLinkClass('/resources')}>Resources</Link>
              <Link to="/contact" className={getLinkClass('/contact')}>Contact</Link>
            </>
          )}
        </div>

        {/* Right Action & Socials Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <a
            href="https://github.com/mohan-i/genetix"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://x.com/Mohan_Yadav_Dev?t=XPV2skK6t93sGaoXmiaT7A&s=09"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <Twitter className="w-4 h-4" />
          </a>
          
          <Link
            to="/app"
            className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded hover:bg-emerald-500/20 transition-all hover:shadow-lg hover:shadow-emerald-500/10"
          >
            Launch App →
          </Link>
        </motion.div>

      </div>
    </nav>
  );
};

export default Header;