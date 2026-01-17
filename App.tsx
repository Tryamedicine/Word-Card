import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import NavBar from './components/NavBar';
import SearchMode from './components/SearchMode';
import ReviewMode from './components/ReviewMode';
import LibraryMode from './components/LibraryMode';
import { AppView, WordData } from './types';
import { fetchWords, addWord, updateWordMastery } from './services/googleSheetsService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.SEARCH);
  const [words, setWords] = useState<WordData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from Google Sheets
  useEffect(() => {
    const loadWords = async () => {
      try {
        const data = await fetchWords();
        setWords(data);
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadWords();
  }, []);

  // No local storage sync needed


  const handleAddWord = async (word: WordData) => {
    // Prevent duplicates based on text
    if (!words.some(w => w.text.toLowerCase() === word.text.toLowerCase())) {
      // Optimistic update
      setWords(prev => [word, ...prev]);
      // Sync with backend
      await addWord(word);
    }
  };

  const handleUpdateMastery = async (id: string, isKnown: boolean) => {
    const wordToUpdate = words.find(w => w.id === id);
    if (!wordToUpdate) return;

    let newMastery = wordToUpdate.mastery;
    if (isKnown) {
      newMastery = Math.min(5, wordToUpdate.mastery + 1); // +20%
    } else {
      newMastery = Math.max(0, wordToUpdate.mastery - 1); // -20%
    }
    const lastReviewed = Date.now();

    // Optimistic update
    setWords(prevWords => prevWords.map(word => {
      if (word.id === id) {
        return {
          ...word,
          mastery: newMastery,
          lastReviewed
        };
      }
      return word;
    }));

    // Sync with backend
    await updateWordMastery(id, newMastery, lastReviewed);
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