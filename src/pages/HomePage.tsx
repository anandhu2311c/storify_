import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, BookOpen, CloudLightning, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-3xl"
      >
        <motion.div variants={item}>
          <h1 className={`text-4xl md:text-6xl font-serif font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Transform Your Dreams Into{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500">
              Stories
            </span>
          </h1>
        </motion.div>

        <motion.p 
          variants={item}
          className={`text-lg md:text-xl mb-10 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Capture your dreams as soon as you wake up and watch them transform into beautiful narratives.
        </motion.p>

        <motion.div 
          variants={item}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <button
            onClick={() => navigate('/record')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Mic size={20} />
            <span>Record Dream</span>
          </button>
          <button
            onClick={() => navigate('/journal')}
            className={`${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
            } font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
          >
            <BookOpen size={20} />
            <span>View Journal</span>
          </button>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: <Mic className="text-purple-500 mb-3" size={32} />,
              title: "Voice Recording",
              description: "Easily capture your dream memories by speaking into your device upon waking."
            },
            {
              icon: <CloudLightning className="text-indigo-500 mb-3" size={32} />,
              title: "Sentiment Analysis",
              description: "Our AI detects emotions and themes in your dream to enhance storytelling."
            },
            {
              icon: <Sparkles className="text-pink-500 mb-3" size={32} />,
              title: "Dream Stories",
              description: "Receive a beautifully crafted narrative based on your dream fragments."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className={`p-6 rounded-xl ${
                isDarkMode 
                  ? 'bg-gray-800/50 hover:bg-gray-800/80' 
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
              } shadow-md hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex flex-col items-center text-center">
                {feature.icon}
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {feature.title}
                </h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;