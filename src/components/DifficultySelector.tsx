import React from 'react';
import { Difficulty } from '../types/game';
import { Zap, Target, Flame } from 'lucide-react';

type DifficultySelectorProps = {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  disabled: boolean;
};

const difficultyConfig = {
  easy: { icon: Zap, label: 'Easy', color: 'emerald' },
  medium: { icon: Target, label: 'Medium', color: 'slate' },
  hard: { icon: Flame, label: 'Hard', color: 'slate' }
} as const;

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulty,
  onDifficultyChange,
  disabled
}) => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="flex gap-3">
      {difficulties.map((d) => {
        const config = difficultyConfig[d];
        const Icon = config.icon;
        const isSelected = difficulty === d;
        
        return (
          <button
            key={d}
            onClick={() => onDifficultyChange(d)}
            disabled={disabled}
            className={`
              group relative flex-1 px-4 py-3 rounded-xl font-medium transition-all
              flex items-center justify-center gap-2 text-lg
              ${isSelected
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102'}
              ${isSelected && 'ring-2 ring-emerald-400/50'}
            `}
          >
            <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
            {config.label}
          </button>
        );
      })}
    </div>
  );
};