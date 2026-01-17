import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import NavBar from './components/NavBar';
import SearchMode from './components/SearchMode';
import ReviewMode from './components/ReviewMode';
import LibraryMode from './components/LibraryMode';
import { AppView, WordData } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.SEARCH);
  const [words, setWords] = useState<WordData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('lingoflux_words');
    if (saved) {
      try {
        setWords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('lingoflux_words', JSON.stringify(words));
    }
  }, [words, isLoaded]);

  const handleAddWord = (word: WordData) => {
    // Prevent duplicates based on text
    if (!words.some(w => w.text.toLowerCase() === word.text.toLowerCase())) {
      setWords(prev => [word, ...prev]);
    }
  };

  const handleUpdateMastery = (id: string, isKnown: boolean) => {
    setWords(prevWords => prevWords.map(word => {
      if (word.id === id) {
        let newMastery = word.mastery;
        if (isKnown) {
          newMastery = Math.min(5, word.mastery + 1); // +20% (1 step)
        } else {
          newMastery = Math.max(0, word.mastery - 1); // -20% (1 step)
        }
        return {
          ...word,
          mastery: newMastery,
          lastReviewed: Date.now()
        };
      }
      return word;
    }));
  };

  const renderContent = () => {
    switch (view) {
      case AppView.SEARCH:
        return <SearchMode onAddWord={handleAddWord} />;
      case AppView.REVIEW:
        return <ReviewMode words={words} onUpdateMastery={handleUpdateMastery} />;
      case AppView.LIBRARY:
        return <LibraryMode words={words} />;
      default:
        return <SearchMode onAddWord={handleAddWord} />;
    }
  };

  return (
    <Layout>
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        {renderContent()}
      </main>
      <NavBar currentView={view} onNavigate={setView} />
    </Layout>
  );
};

export default App;