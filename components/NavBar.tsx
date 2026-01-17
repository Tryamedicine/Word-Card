import React from 'react';
import { Search, RotateCw, BookOpen } from 'lucide-react';
import { AppView } from '../types';

interface NavBarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentView, onNavigate }) => {
  const getItemClass = (view: AppView) => {
    const isActive = currentView === view;
    return `flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
      isActive ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'
    }`;
  };

  return (
    <div className="h-24 px-6 pb-6 pt-2 flex items-center justify-around bg-black/20 backdrop-blur-2xl border-t border-white/10 shrink-0 z-50">
      <button 
        onClick={() => onNavigate(AppView.SEARCH)}
        className={getItemClass(AppView.SEARCH)}
      >
        <div className={`p-3 rounded-full ${currentView === AppView.SEARCH ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : ''}`}>
          <Search size={24} strokeWidth={currentView === AppView.SEARCH ? 2.5 : 2} />
        </div>
        <span className="text-[10px] font-medium tracking-wide">Search</span>
      </button>

      <button 
        onClick={() => onNavigate(AppView.REVIEW)}
        className={getItemClass(AppView.REVIEW)}
      >
        <div className={`p-3 rounded-full ${currentView === AppView.REVIEW ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : ''}`}>
          <RotateCw size={24} strokeWidth={currentView === AppView.REVIEW ? 2.5 : 2} />
        </div>
        <span className="text-[10px] font-medium tracking-wide">Review</span>
      </button>

      <button 
        onClick={() => onNavigate(AppView.LIBRARY)}
        className={getItemClass(AppView.LIBRARY)}
      >
        <div className={`p-3 rounded-full ${currentView === AppView.LIBRARY ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : ''}`}>
          <BookOpen size={24} strokeWidth={currentView === AppView.LIBRARY ? 2.5 : 2} />
        </div>
        <span className="text-[10px] font-medium tracking-wide">Library</span>
      </button>
    </div>
  );
};

export default NavBar;