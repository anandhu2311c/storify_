import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import RecordDreamPage from './pages/RecordDreamPage';
import DreamStoryPage from './pages/DreamStoryPage';
import JournalPage from './pages/JournalPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/record" element={<RecordDreamPage />} />
            <Route path="/story/:id" element={<DreamStoryPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;