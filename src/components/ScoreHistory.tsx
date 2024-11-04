import React from 'react';
import { GameScore } from '../types/game';
import { Trophy, Medal, Calendar } from 'lucide-react';

type ScoreHistoryProps = {
  scores: GameScore[];
};

export const ScoreHistory: React.FC<ScoreHistoryProps> = ({ scores }) => {
  return (
    <div className="w-80 bg-gray-800/95 p-6 rounded-xl shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-white">Score History</h2>
      </div>
      
      {scores.length === 0 ? (
        <div className="text-center py-8">
          <Medal className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            No scores yet. Start playing!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {scores.map((score, index) => (
            <div
              key={index}
              className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between group hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 text-center">
                  <span className="text-2xl font-bold text-white">{score.score}</span>
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${
                    score.difficulty === 'easy' ? 'text-emerald-400' :
                    score.difficulty === 'medium' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {score.difficulty.charAt(0).toUpperCase() + score.difficulty.slice(1)}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(score.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              {index === 0 && (
                <div className="bg-yellow-500/10 px-2 py-1 rounded">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};