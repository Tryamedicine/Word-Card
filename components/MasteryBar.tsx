import React from 'react';

interface MasteryBarProps {
  level: number; // 0 to 5
}

const MasteryBar: React.FC<MasteryBarProps> = ({ level }) => {
  return (
    <div className="flex space-x-1 h-1.5 w-full max-w-[100px]">
      {[1, 2, 3, 4, 5].map((step) => (
        <div
          key={step}
          className={`flex-1 rounded-full transition-all duration-500 ${
            level >= step
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
              : 'bg-white/10'
          }`}
        />
      ))}
    </div>
  );
};

export default MasteryBar;