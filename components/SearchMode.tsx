import React, { useState } from 'react';
import { Search, Loader2, Plus, Sparkles } from 'lucide-react';
import { fetchWordDefinition } from '../services/geminiService';
import { WordData } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface SearchModeProps {
  onAddWord: (word: WordData) => void;
}

const SearchMode: React.FC<SearchModeProps> = ({ onAddWord }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WordData | null>(null);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);
    setIsSaved(false);

    try {
      const data = await fetchWordDefinition(query.trim());
      const newWord: WordData = {
        id: uuidv4(),
        text: query.trim(),
        ...data,
        mastery: 0,
        lastReviewed: Date.now()
      };
      setResult(newWord);
    } catch (err) {
      setError("Could not define word. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result && !isSaved) {
      onAddWord(result);
      setIsSaved(true);
    }
  };

  const hasResult = !!result;

  return (
    <div className="flex-1 flex flex-col px-6 max-w-md mx-auto w-full overflow-y-auto scrollbar-hide">
      
      {/* Animated Header Section */}
      <div 
        className={`flex flex-col items-center w-full transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
          hasResult ? 'mt-10 mb-8' : 'mt-[30vh] mb-12'
        }`}
      >
        {/* Logo */}
        <h1 className={`font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 tracking-tight text-center transition-all duration-700 ${
          hasResult ? 'text-4xl mb-6' : 'text-5xl mb-8'
        }`}>
          Word Card
        </h1>

        {/* Google-style Search Bar */}
        <form onSubmit={handleSearch} className="w-full relative group z-20">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="text-white/40 group-focus-within:text-white transition-colors" size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search English words..."
            className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-full py-4 pl-14 pr-20 text-lg text-white placeholder-white/30 focus:outline-none transition-all shadow-lg hover:shadow-xl focus:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          />
          <button
            type="submit"
            disabled={loading || !query}
            className="absolute inset-y-2 right-2 px-6 bg-white/10 hover:bg-white/20 disabled:opacity-0 rounded-full text-white transition-all font-medium text-sm flex items-center justify-center min-w-[3rem]"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Go'}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 animate-[fadeIn_0.3s_ease-out] p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 text-center text-sm backdrop-blur-md mx-auto w-full">
          {error}
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="animate-[slideUp_0.5s_cubic-bezier(0.16,1,0.3,1)] flex-1 w-full pb-6">
          <div className="relative overflow-hidden bg-white/10 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 shadow-2xl ring-1 ring-white/5">
            {/* Glossy overlay */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 uppercase tracking-wider">
                  {result.partOfSpeech}
                </span>
                <button
                  onClick={handleSave}
                  disabled={isSaved}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-full transition-all duration-300 ${
                    isSaved 
                    ? 'bg-green-500/20 text-green-300 border-green-500/30 cursor-default' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:scale-105 hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <Sparkles size={14} />
                      <span className="text-xs font-bold">Saved</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span className="text-sm font-bold">Add</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-1 tracking-tight">{result.text}</h2>
                <div className="flex items-center space-x-2">
                    <p className="text-white/50 text-lg font-mono">{result.phonetic}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-2">Definition</h3>
                  <p className="text-xl text-white/90 leading-relaxed font-light">{result.definition}</p>
                </div>

                <div className="p-6 bg-black/20 rounded-2xl border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-white/10 group-hover:bg-white/20 transition-colors" />
                  <h3 className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-2">Example</h3>
                  <p className="text-white/80 italic leading-relaxed text-lg">"{result.example}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SearchMode;