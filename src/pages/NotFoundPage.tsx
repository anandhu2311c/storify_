import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoonStar, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <MoonStar 
          className={`mx-auto mb-6 ${
            isDarkMode ? 'text-purple-400' : 'text-purple-600'
          }`} 
          size={64} 
        />
        
        <h1 className={`text-4xl font-serif font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Dream Not Found
        </h1>
        
        <p className={`text-lg mb-8 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          It seems this dream has drifted away into the cosmos. Let's return to reality.
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
        >
          <Home size={20} />
          <span>Return Home</span>
        </button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;