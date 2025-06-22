import React from 'react';
import Navbar from './Navbar';
import { useTheme } from '../../context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode } = useTheme();
  const location = useLocation();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'} transition-colors duration-500`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          {isDarkMode && (
            <>
              <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-purple-900 blur-[150px]" />
              <div className="absolute bottom-1/3 right-1/4 w-1/2 h-1/2 rounded-full bg-blue-900 blur-[150px]" />
              <div className="absolute top-1/3 right-1/4 w-1/3 h-1/3 rounded-full bg-pink-900 blur-[150px]" />
            </>
          )}
        </div>
      </div>

      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-16 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-[calc(100vh-136px)]"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;