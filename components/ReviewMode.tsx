import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { WordData } from '../types';
import { Check, X, RotateCw, Eye } from 'lucide-react';
import MasteryBar from './MasteryBar';

interface ReviewModeProps {
  words: WordData[];
  onUpdateMastery: (id: string, success: boolean) => void;
}

const ReviewMode: React.FC<ReviewModeProps> = ({ words, onUpdateMastery }) => {
  const [deck, setDeck] = useState<WordData[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Initialize randomized deck with max 50 words
  useEffect(() => {
    const shuffled = [...words]
      .sort(() => Math.random() - 0.5)
      .slice(0, 50); // Take top 50
    setDeck(shuffled);
    setActiveIndex(0);
    setIsRevealed(false);
  }, [words]);

  const currentWord = deck[activeIndex];

  // Animation values
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacityLike = useTransform(x, [50, 150], [0, 1]);
  const opacityNope = useTransform(x, [-150, -50], [1, 0]);
  const color = useTransform(
    x,
    [-200, 0, 200],
    ['rgba(239, 68, 68, 0.2)', 'rgba(255, 255, 255, 0)', 'rgba(34, 197, 94, 0.2)']
  );

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      handleSwipe(true);
    } else if (info.offset.x < -100) {
      handleSwipe(false);
    }
  };

  const handleSwipe = (success: boolean) => {
    if (!currentWord) return;
    onUpdateMastery(currentWord.id, success);
    setTimeout(() => {
      setIsRevealed(false);
      setActiveIndex((prev) => prev + 1);
      x.set(0); // Reset position for next card
    }, 200);
  };

  if (words.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <RotateCw className="text-white/40" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No words yet</h2>
        <p className="text-white/50">Search and add words to your library to start reviewing.</p>
      </div>
    );
  }

  if (activeIndex >= deck.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-400 mb-4">All Caught Up!</h2>
        <p className="text-white/50 mb-8">You've reviewed all your words for this session.</p>
        <button
          onClick={() => {
            const shuffled = [...words].sort(() => Math.random() - 0.5);
            setDeck(shuffled);
            setActiveIndex(0);
            setIsRevealed(false);
          }}
          className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white font-medium transition-all"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative w-full overflow-hidden">
      <div className="absolute top-8 text-center">
        <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest">Review Mode</h2>
        <p className="text-white/20 text-xs mt-1">{activeIndex + 1} / {deck.length}</p>
      </div>

      <div className="w-full max-w-sm h-[65vh] relative flex items-center justify-center perspective-1000">
        <AnimatePresence>
          <motion.div
            key={currentWord.id}
            style={{ x, rotate, background: color }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.2 } }}
            className="absolute w-[90%] h-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between p-8 select-none cursor-grab"
          >

            {/* Card Content */}
            <div className="w-full flex flex-col items-center flex-1 justify-center space-y-6">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-3">{currentWord.text}</h1>
                <p className="text-white/40 font-mono text-lg">{currentWord.phonetic}</p>
              </div>

              <div className="w-full relative min-h-[160px] flex items-center justify-center">
                {isRevealed ? (
                  <motion.div
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    className="text-center space-y-4"
                  >
                    <p className="text-lg text-white/90 font-light leading-relaxed">{currentWord.definition}</p>
                    <div className="h-px w-12 bg-white/10 mx-auto" />
                    <p className="text-sm text-white/60 italic">"{currentWord.example}"</p>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setIsRevealed(true)}
                    className="group flex flex-col items-center space-y-3"
                  >
                    <div className="p-4 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors border border-white/5">
                      <Eye className="text-white/50" />
                    </div>
                    <span className="text-xs text-white/30 uppercase tracking-widest font-semibold">Tap to Reveal</span>
                  </button>
                )}
              </div>
            </div>

            {/* Footer Mastery */}
            <div className="w-full flex justify-center pt-6 border-t border-white/5">
              <MasteryBar level={currentWord.mastery} />
            </div>

            {/* Overlay Indicators for Swipe */}
            <motion.div
              style={{ opacity: opacityLike }}
              className="absolute top-8 right-8 border-4 border-green-400 rounded-lg p-2 transform rotate-12"
            >
              <Check size={40} className="text-green-400" strokeWidth={3} />
            </motion.div>

            <motion.div
              style={{ opacity: opacityNope }}
              className="absolute top-8 left-8 border-4 border-red-400 rounded-lg p-2 transform -rotate-12"
            >
              <X size={40} className="text-red-400" strokeWidth={3} />
            </motion.div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Control Hint */}
      <div className="flex justify-between w-full max-w-xs px-8 mt-8 opacity-50">
        <div className="flex items-center space-x-2 text-red-300/60">
          <X size={16} />
          <span className="text-xs font-medium uppercase tracking-wider">Forgot</span>
        </div>
        <div className="flex items-center space-x-2 text-green-300/60">
          <span className="text-xs font-medium uppercase tracking-wider">Know</span>
          <Check size={16} />
        </div>
      </div>
    </div>
  );
};

export default ReviewMode;