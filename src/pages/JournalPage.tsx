import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, BookOpen, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';


type Dream = {
  id: string;
  title: string;
  date: string;
  summary: string;
  sentiment: {
    name: string;
    color: string;
  };
};

const JournalPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dreams
    setTimeout(() => {
      const journalData = generateDummyDreamJournal(7);
      setDreams(journalData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredDreams = dreams
    .filter(dream => 
      dream.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      dream.summary.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className={`text-3xl md:text-4xl font-serif font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Dream Journal
          </h1>
          
          <div className="flex items-center gap-3">
            <div className={`relative rounded-lg overflow-hidden shadow-sm ${
              isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-300'
            }`}>
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} size={16} />
              <input
                type="text"
                placeholder="Search dreams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`py-2 pl-10 pr-4 w-full md:w-64 focus:outline-none ${
                  isDarkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            
            <button
              onClick={toggleSortDirection}
              className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-800 text-gray-300 hover:text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              aria-label="Toggle sort direction"
            >
              {sortDirection === 'desc' ? (
                <ArrowDown size={16} />
              ) : (
                <ArrowUp size={16} />
              )}
            </button>
            
            <button
              className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-800 text-gray-300 hover:text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              aria-label="Filter dreams"
            >
              <Filter size={16} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className={`p-6 rounded-xl animate-pulse ${
                isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="space-y-3 w-full">
                    <div className={`h-4 rounded w-1/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className={`h-6 rounded w-3/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className={`h-4 rounded w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className={`h-4 rounded w-2/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDreams.length === 0 ? (
          <div className={`p-8 rounded-xl text-center ${
            isDarkMode ? 'bg-gray-800/50' : 'bg-white shadow-md'
          }`}>
            <BookOpen className={`mx-auto mb-4 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} size={48} />
            <h2 className={`text-xl font-medium mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              No dreams found
            </h2>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              {searchTerm 
                ? `No dreams match your search for "${searchTerm}"`
                : "You haven't recorded any dreams yet"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className={`mt-4 px-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredDreams.map((dream, index) => (
              <motion.div
                key={dream.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800/50 hover:bg-gray-800' 
                    : 'bg-white shadow-md hover:shadow-xl'
                }`}
                onClick={() => navigate(`/story/${dream.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {format(new Date(dream.date), 'MMMM d, yyyy')}
                      </span>
                    </div>
                    
                    <h2 className={`text-xl font-serif font-bold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {dream.title}
                    </h2>
                    
                    <p className={`mb-4 line-clamp-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {dream.summary}
                    </p>
                    
                    <div className={`inline-block px-3 py-1 rounded-full text-xs ${
                      isDarkMode 
                        ? `bg-${dream.sentiment.color}-900/30 text-${dream.sentiment.color}-400` 
                        : `bg-${dream.sentiment.color}-100 text-${dream.sentiment.color}-700`
                    }`}>
                      {dream.sentiment.name}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default JournalPage;