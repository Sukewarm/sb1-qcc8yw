import React from 'react';
import { GameCanvas } from './components/GameCanvas';
import { ScoreHistory } from './components/ScoreHistory';
import { Gamepad2 } from 'lucide-react';
import { useGame } from './hooks/useGame';

function App() {
  const gameState = useGame();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Gamepad2 className="w-8 h-8 text-emerald-500" />
          <h1 className="text-4xl font-bold text-white">Snake Game</h1>
        </div>
        <p className="text-gray-400">Use WASD or arrow keys to control the snake</p>
      </div>
      
      <div className="flex gap-6">
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl">
          <GameCanvas gameState={gameState} />
        </div>
        <ScoreHistory scores={gameState.scores} />
      </div>
      
      <div className="mt-6 text-gray-400 text-sm">
        <p>Collect food to grow longer and increase your score!</p>
      </div>
    </div>
  );
}

export default App;