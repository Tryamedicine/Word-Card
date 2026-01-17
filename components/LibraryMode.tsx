import React from 'react';
import { WordData } from '../types';
import MasteryBar from './MasteryBar';

interface LibraryModeProps {
  words: WordData[];
}

const LibraryMode: React.FC<LibraryModeProps> = ({ words }) => {
  // Sort words by last reviewed (most recent first)
  const sortedWords = [...words].sort((a, b) => b.lastReviewed - a.lastReviewed);

  return (
    <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto p-6 overflow-hidden">
      <div className="mb-6 mt-2 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Library</h1>
          <p className="text-white/40 text-sm">{words.length} words collected</p>
        </div>
        
        {/* Simple Stat - Average Mastery */}
        {words.length > 0 && (
          <div className="text-right">
            <span className="text-2xl font-bold text-white">
              {Math.round(words.reduce((acc, w) => acc + w.mastery, 0) / words.length * 20)}%
            </span>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Avg Mastery</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-20 space-y-3 pr-2 scrollbar-thin">
        {words.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/30">Your library is empty.</p>
          </div>
        ) : (
          sortedWords.map((word) => (
            <div 
              key={word.id} 
              className="group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 backdrop-blur-md rounded-2xl p-5 transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-baseline space-x-3">
                  <h3 className="text-xl font-bold text-white">{word.text}</h3>
                  <span className="text-sm font-mono text-white/40">{word.phonetic}</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-white/20 border border-white/10 px-2 py-0.5 rounded-full">
                  {word.partOfSpeech}
                </span>
              </div>
              
              <p className="text-white/70 text-sm line-clamp-1 mb-4 font-light">{word.definition}</p>
              
              <div className="flex items-center justify-between">
                <div className="w-24">
                  <MasteryBar level={word.mastery} />
                </div>
                <span className="text-[10px] text-white/30">
                  Last: {new Date(word.lastReviewed).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LibraryMode;