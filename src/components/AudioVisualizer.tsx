import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const AudioVisualizer: React.FC = () => {
  const [bars, setBars] = useState<number[]>([]);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Create 30 random bars
    const generateBars = () => {
      return Array.from({ length: 30 }, () => Math.random() * 100);
    };
    
    // Initial bars
    setBars(generateBars());
    
    // Update bars every 100ms to simulate audio visualization
    const interval = setInterval(() => {
      setBars(generateBars());
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-16 flex items-center justify-center">
      <div className="flex items-end h-full space-x-1">
        {bars.map((height, index) => (
          <motion.div
            key={index}
            initial={{ height: `${Math.max(10, height)}%` }}
            animate={{ height: `${Math.max(10, height)}%` }}
            transition={{ duration: 0.1 }}
            className={`w-1 rounded-t-sm ${
              isDarkMode 
                ? 'bg-gradient-to-t from-purple-700 to-indigo-400' 
                : 'bg-gradient-to-t from-purple-500 to-indigo-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioVisualizer;