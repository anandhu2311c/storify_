import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Save, Share2, ArrowLeft, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';

const DreamStoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [dreamStory, setDreamStory] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!id || id === 'generated') {
      const tempStory = (window as any).dreamStoryData;
      if (tempStory) {
        setDreamStory({
          title: 'Untitled Dream',
          date: tempStory.timestamp,
          summary: tempStory.transcription,
          sentiment: {
            name: tempStory.dominant_emotion,
            color: 'purple',
          },
          content: tempStory.story,
          originalFragment: tempStory.transcription,
          symbols: ['dream', 'mystery'],
          emotions: [tempStory.dominant_emotion, tempStory.secondary_emotion],
        });
      }
      return;
    }

    fetch(`http://localhost:8000/api/stories/${id}`)
      .then(res => res.json())
      .then(data => {
        setDreamStory(data);
        setIsSaved(true);
      })
      .catch(err => console.error('Failed to fetch story:', err));
  }, [id]);

  const handleSave = async () => {
    if (!dreamStory || isSaving || isSaved) return;
    setIsSaving(true);

    try {
      const response = await fetch('http://localhost:8000/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dreamStory),
      });
      const savedStory = await response.json();
      setIsSaved(true);
      navigate(`/story/${savedStory.id}`);
    } catch (error) {
      console.error('Error saving story:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!dreamStory) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className={`h-8 w-64 rounded mb-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className={`h-4 w-full max-w-md rounded mb-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className={`h-4 w-full max-w-md rounded mb-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className={`h-4 w-2/3 max-w-md rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>
      </div>
    );
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 ${
            isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          } transition-colors`}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      <div
        className={`p-6 md:p-8 rounded-xl mb-8 ${
          isDarkMode ? 'bg-gray-800/50' : 'bg-white shadow-md'
        }`}
      >
        <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {format(new Date(dreamStory.date), 'MMMM d, yyyy • h:mm a')}
            </p>
            <h1
              className={`text-2xl md:text-3xl font-serif font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {dreamStory.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-colors ${
                isLiked
                  ? 'text-pink-500 bg-pink-100 dark:bg-pink-900/30'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-pink-400 hover:bg-gray-700'
                  : 'text-gray-500 hover:text-pink-500 hover:bg-gray-100'
              }`}
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            </button>

            <button
              onClick={() => {}}
              className={`p-2 rounded-full ${
                isDarkMode
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Share2 size={20} />
            </button>

            {!isSaved ? (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-2 py-2 px-3 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {isSaving ? (
                  <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Save size={16} />
                )}
                <span>Save</span>
              </button>
            ) : (
              <span
                className={`flex items-center gap-2 py-2 px-3 rounded-lg ${
                  isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                }`}
              >
                <BookOpen size={16} />
                <span>Saved</span>
              </span>
            )}
          </div>
        </div>

        {/* Sentiment Tag */}
        <div className="mb-8">
          <div
            className={`inline-block mb-4 px-3 py-1 rounded-full text-sm ${
              isDarkMode
                ? `bg-${dreamStory.sentiment.color}-900/30 text-${dreamStory.sentiment.color}-400`
                : `bg-${dreamStory.sentiment.color}-100 text-${dreamStory.sentiment.color}-700`
            }`}
          >
            {dreamStory.sentiment.name}
          </div>

          <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
            {dreamStory.content.split('\n\n').map((paragraph: string, i: number) => (
              <motion.p
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                key={i}
                className="mb-4 font-serif leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>

        {/* Original Fragment */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Original Dream Fragment
          </h3>
          <p className={`text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            "{dreamStory.originalFragment}"
          </p>
        </div>
      </div>

      {/* Dream Insights */}
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white shadow-md'}`}>
        <h2 className={`text-xl font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Dream Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Key Symbols
            </h3>
            <div className="flex flex-wrap gap-2">
              {dreamStory.symbols.map((symbol: string, i: number) => (
                <span
                  key={i}
                  className={`px-2 py-1 rounded-full text-xs ${
                    isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {symbol}
                </span>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Emotions
            </h3>
            <div className="flex flex-wrap gap-2">
              {dreamStory.emotions.map((emotion: string, i: number) => (
                <span
                  key={i}
                  className={`px-2 py-1 rounded-full text-xs ${
                    isDarkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamStoryPage;
