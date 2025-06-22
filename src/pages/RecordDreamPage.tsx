import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, Loader, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import AudioVisualizer from '../components/AudioVisualizer';

const RecordDreamPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dreamText, setDreamText] = useState('');
  const [error, setError] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Shakespearean'); // Add style selection
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const startRecording = async () => {
    console.log('🎤 Starting recording process...');
    setError(''); // Clear any previous errors
    setIsRecording(true);
    setRecordingTime(0);
    audioChunksRef.current = [];

    // Timer
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    try {
      console.log('🔍 Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      console.log('✅ Microphone access granted');
      
      // Check supported MIME types
      const mimeTypes = [
        'audio/webm',
        'audio/webm;codecs=opus',
        'audio/mp4',
        'audio/wav'
      ];
      
      let selectedMimeType = 'audio/webm';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          console.log(`📋 Using MIME type: ${mimeType}`);
          break;
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        console.log(`📊 Audio chunk received: ${e.data.size} bytes`);
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstart = () => {
        console.log('🎵 MediaRecorder started');
      };

      mediaRecorder.onstop = () => {
        console.log('🛑 MediaRecorder stopped');
      };

      mediaRecorder.start(1000); // Collect data every second
      console.log('✅ Recording started successfully');
    } catch (err) {
      console.error('❌ Error accessing microphone:', err);
      setError(`Microphone error: ${err.message}`);
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const stopRecording = () => {
    console.log('🛑 Stopping recording...');
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        console.log(`📦 Total audio chunks: ${audioChunksRef.current.length}`);
        
        if (audioChunksRef.current.length === 0) {
          console.error('❌ No audio data recorded');
          setError('No audio data was recorded. Please try again.');
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorderRef.current?.mimeType || 'audio/webm' 
        });
        
        console.log(`📊 Created audio blob: ${audioBlob.size} bytes, type: ${audioBlob.type}`);
        
        if (audioBlob.size === 0) {
          console.error('❌ Audio blob is empty');
          setError('Recorded audio is empty. Please try again.');
          return;
        }
        
        processDreamAudio(audioBlob);
      };
      
      // Stop all tracks to release microphone
      mediaRecorderRef.current.stream?.getTracks().forEach(track => {
        track.stop();
        console.log('🎤 Microphone track stopped');
      });
    }
  };

  const processDreamAudio = async (audioBlob: Blob) => {
    console.log('🔄 Starting audio processing...');
    console.log('Audio blob details:', {
      size: audioBlob.size,
      type: audioBlob.type
    });
    
    setIsProcessing(true);
    setError('');

    try {
      if (audioBlob.size === 0) {
        throw new Error('Audio blob is empty');
      }

      const formData = new FormData();
      formData.append('audio', audioBlob, 'dream.webm');
      formData.append('style', selectedStyle);

      console.log('📤 Sending request to backend...');
      console.log('Selected style:', selectedStyle);

      // Send to backend
      const response = await fetch('http://localhost:8000/api/process-dream', {
        method: 'POST',
        body: formData,
      });

      console.log('📥 Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error response:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Success response:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }

      setDreamText(data.transcribed_text || data.transcription);

      // Store the complete response data
      const storyData = {
        transcription: data.transcribed_text || data.transcription,
        dominant_emotion: data.dominant_emotion,
        secondary_emotion: data.secondary_emotion,
        story: data.story,
        style: selectedStyle,
        timestamp: new Date().toISOString()
      };

      console.log('💾 Storing story data:', storyData);
      // Store in memory instead of localStorage for this session
      (window as any).dreamStoryData = storyData;
      
    } catch (err: any) {
      console.error('❌ Processing error:', err);
      setError(`Failed to process dream audio: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const processAndNavigate = async () => {
  const storyData = (window as any).dreamStoryData;
  if (!storyData || !storyData.story) {
    setError('No story data available. Please try recording again.');
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/api/stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Dream on ' + new Date(storyData.timestamp).toLocaleDateString(),
        date: storyData.timestamp,
        summary: storyData.transcription,
        sentiment: {
          name: storyData.dominant_emotion,
          color: 'purple',
        },
        content: storyData.story,
        originalFragment: storyData.transcription,
        symbols: ['dream', 'mystery'], // optionally extract
        emotions: [storyData.dominant_emotion, storyData.secondary_emotion],
      }),
    });

    const savedStory = await response.json();
    navigate(`/story/${savedStory.id}`);
  } catch (err) {
    console.error('Error saving story:', err);
    setError('Failed to save story. Please try again.');
  }
};


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={`text-3xl md:text-4xl font-serif font-bold mb-6 text-center ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Record Your Dream
        </h1>

        <p className={`text-center mb-8 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Speak your dream fragments as soon as you wake up, and we'll transform them into a story.
        </p>

        {/* Style Selection */}
        <div className={`p-4 rounded-lg mb-6 ${
          isDarkMode ? 'bg-gray-800/50' : 'bg-white shadow-md'
        }`}>
          <h3 className={`text-lg font-medium mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Choose Story Style
          </h3>
          <div className="flex flex-wrap gap-3">
            {['Shakespearean', 'Tarantino', 'Sci-Fi'].map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStyle === style
                    ? 'bg-purple-600 text-white'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className={`p-8 rounded-xl mb-8 ${
          isDarkMode ? 'bg-gray-800/50' : 'bg-white shadow-md'
        }`}>
          {!dreamText ? (
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                <motion.div
                  animate={{
                    scale: isRecording ? [1, 1.1, 1] : 1,
                    transition: { repeat: isRecording ? Infinity : 0, duration: 2 }
                  }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg ${
                    isRecording ? 'bg-red-500' : isDarkMode ? 'bg-purple-600' : 'bg-purple-500'
                  }`}
                >
                  {isRecording ? (
                    <Square className="text-white" size={32} />
                  ) : (
                    <Mic className="text-white" size={32} />
                  )}
                </motion.div>
                {isRecording && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {formatTime(recordingTime)}
                  </div>
                )}
              </div>

              {isRecording && <AudioVisualizer />}

              <div className="mt-8">
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="animate-spin text-purple-500" size={20} />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Processing your dream...
                    </span>
                  </div>
                ) : isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
                  >
                    Stop Recording
                  </button>
                ) : (
                  <button
                    onClick={startRecording}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
                  >
                    Start Recording
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3 className={`text-xl font-medium mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Your Dream Fragments
              </h3>
             
              <div className={`p-4 rounded-lg mb-6 ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <p className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>
                  {dreamText}
                </p>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setDreamText('');
                    setError('');
                    // Clear stored data
                    delete (window as any).dreamStoryData;
                  }}
                  className={`${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  } font-medium py-2 px-4 rounded-lg transition-colors`}
                >
                  Retry
                </button>

                <button
                  onClick={processAndNavigate}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 size={16} />
                      <span>Create Story</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="text-center text-red-500 font-medium mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}

        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="mb-2"><strong>Tips for best results:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Record as soon as you wake up, before dreams fade</li>
            <li>Speak clearly but don't worry about being coherent</li>
            <li>Include emotions, colors, and sensations you remember</li>
            <li>Mention any recurring symbols or themes</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default RecordDreamPage;