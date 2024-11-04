import React, { useEffect, useRef } from 'react';
import { GameState } from '../hooks/useGame';
import { DifficultySelector } from './DifficultySelector';

type GameCanvasProps = {
  gameState: GameState;
};

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    score, 
    gameOver, 
    startGame, 
    difficulty, 
    changeDifficulty,
    initializeCanvas,
    difficultySelected 
  } = gameState;

  useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas(canvasRef.current);
    }
  }, [canvasRef, initializeCanvas]);

  return (
    <div className="relative">
      <div className="mb-4 flex justify-end">
        <div className="bg-emerald-500/90 px-3 py-1 rounded-full">
          <span className="text-white font-bold">Score: {score}</span>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="bg-emerald-900 rounded-lg shadow-lg"
      />
      
      {gameOver && (
        <div className="absolute inset-0 bg-gray-900/95 rounded-lg flex items-center justify-center">
          <div className="text-center space-y-8 max-w-[320px]">
            <div>
              <h2 className="text-white text-5xl font-bold mb-3 drop-shadow-glow">
                {score > 0 ? 'Game Over!' : 'Snake Game'}
              </h2>
              {score > 0 && (
                <p className="text-emerald-400 text-2xl font-medium">
                  Final Score: {score}
                </p>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-gray-300 text-xl font-medium">Select Difficulty</p>
                <DifficultySelector
                  difficulty={difficulty}
                  onDifficultyChange={changeDifficulty}
                  disabled={!gameOver}
                />
              </div>
              
              {difficultySelected && (
                <button
                  onClick={startGame}
                  className="w-full px-8 py-3 bg-emerald-500 text-white text-lg rounded-lg hover:bg-emerald-600 transition-all hover:scale-105 font-medium shadow-lg shadow-emerald-500/20"
                >
                  {score > 0 ? 'Play Again' : 'Start Game'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};