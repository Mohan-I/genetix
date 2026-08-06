import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Twitter, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Helper function to handle active page styling dynamically
  const getLinkClass = (path: string) => {
    const baseClass = "text-[11px] font-mono transition-colors";
    const isActive = location.pathname === path;
    if (isHomePage) {
      return `${baseClass} text-white/40 hover:text-white/80`;
    }
    return isActive
      ? `${baseClass} text-emerald-400 border-b border-emerald-500/50 pb-0.5`
      : `${baseClass} text-white/40 hover:text-white/80`;
  };

  const getMobileLinkClass = (path: string) => {
    const isActive = !isHomePage && location.pathname === path;
    return isActive
      ? "text-emerald-400"
      : "text-white/60";
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/explanation', label: 'How It Works' },
    { path: '/resources', label: 'Resources' },
    { path: '/contact', label: 'Contact' },
  ];

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as const },
    },
  };

  const listContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05, delayChildren: 0.05 },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
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

        {/* Central Navigation Links (desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className={getLinkClass(link.path)}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Action & Socials Section (desktop) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex items-center gap-4"
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

        {/* Mobile: Launch App (compact) + Hamburger toggle */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            to="/app"
            className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono rounded hover:bg-emerald-500/20 transition-all"
          >
            Launch →
          </Link>
          <button
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="relative w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                  className="absolute"
                >
                  <X className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.15 }}
                  className="absolute"
                >
                  <Menu className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden overflow-hidden border-t border-white/10 bg-[#0a0a0c]/95 backdrop-blur-xl"
          >
            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="px-6 py-5 flex flex-col gap-4"
            >
              {navLinks.map((link) => (
                <motion.div key={link.path} variants={listItemVariants}>
                  <Link
                    to={link.path}
                    className={`block text-sm font-mono transition-colors ${getMobileLinkClass(link.path)}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                variants={listItemVariants}
                className="flex items-center gap-5 pt-3 mt-1 border-t border-white/10"
              >
                <a
                  href="https://github.com/mohan-i/genetix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white/80 transition-colors flex items-center gap-2 text-xs font-mono"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a
                  href="https://x.com/Mohan_Yadav_Dev?t=XPV2skK6t93sGaoXmiaT7A&s=09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white/80 transition-colors flex items-center gap-2 text-xs font-mono"
                >
                  <Twitter className="w-4 h-4" /> Twitter
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;