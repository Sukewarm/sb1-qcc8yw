import { useCallback, useEffect, useRef, useState } from 'react';
import { Position, Difficulty, GameScore } from '../types/game';

const GRID_SIZE = 20;
const SPEEDS = {
  easy: 150,
  medium: 100,
  hard: 70
};

// Load scores from localStorage if available
const getInitialScores = (): GameScore[] => {
  const savedScores = localStorage.getItem('snakeGameScores');
  return savedScores ? JSON.parse(savedScores) : [];
};

export type GameState = ReturnType<typeof useGame>;

export const useGame = () => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [difficultySelected, setDifficultySelected] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [scores, setScores] = useState<GameScore[]>(getInitialScores);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const snake = useRef<Position[]>([{ x: 10, y: 10 }]);
  const food = useRef<Position>({ x: 15, y: 15 });
  const direction = useRef<Position>({ x: 0, y: 0 });
  const gameLoop = useRef<number>();

  const refreshScores = useCallback(() => {
    const savedScores = localStorage.getItem('snakeGameScores');
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

  const drawGame = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 400, 400);
    
    // Draw snake
    snake.current.forEach((segment, index) => {
      const size = GRID_SIZE - 1;
      if (index === 0) {
        ctx.fillStyle = '#059669';
      } else {
        ctx.fillStyle = '#34d399';
      }
      ctx.fillRect(
        segment.x * GRID_SIZE,
        segment.y * GRID_SIZE,
        size,
        size
      );
    });

    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(
      food.current.x * GRID_SIZE + GRID_SIZE/2,
      food.current.y * GRID_SIZE + GRID_SIZE/2,
      GRID_SIZE/2 - 1,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, []);

  const moveSnake = useCallback(() => {
    const head = { ...snake.current[0] };
    head.x += direction.current.x;
    head.y += direction.current.y;

    // Wall collision
    if (
      head.x < 0 ||
      head.x >= 400/GRID_SIZE ||
      head.y < 0 ||
      head.y >= 400/GRID_SIZE
    ) {
      endGame();
      return;
    }

    // Self collision
    if (snake.current.some(segment => segment.x === head.x && segment.y === head.y)) {
      endGame();
      return;
    }

    snake.current.unshift(head);

    // Food collision
    if (head.x === food.current.x && head.y === food.current.y) {
      setScore(s => s + 1);
      spawnFood();
    } else {
      snake.current.pop();
    }
  }, []);

  const spawnFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * (400/GRID_SIZE)),
      y: Math.floor(Math.random() * (400/GRID_SIZE))
    };
    
    if (snake.current.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      spawnFood();
      return;
    }
    
    food.current = newFood;
  }, []);

  const endGame = useCallback(() => {
    setGameOver(true);
    setDifficultySelected(false);
    if (gameLoop.current) {
      cancelAnimationFrame(gameLoop.current);
    }
    
    if (score > 0) {
      const newScore: GameScore = {
        score,
        difficulty,
        date: new Date().toISOString()
      };
      const updatedScores = [...scores, newScore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      
      localStorage.setItem('snakeGameScores', JSON.stringify(updatedScores));
      setScores(updatedScores);
      refreshScores(); // Ensure scores are immediately updated
    }
  }, [score, difficulty, scores, refreshScores]);

  const startGame = useCallback(() => {
    snake.current = [{ x: 10, y: 10 }];
    direction.current = { x: 0, y: 0 };
    setScore(0);
    setGameOver(false);
    spawnFood();
    drawGame();
    refreshScores(); // Refresh scores when starting new game
  }, [spawnFood, drawGame, refreshScores]);

  const changeDifficulty = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setDifficultySelected(true);
    if (!gameOver) {
      endGame();
    }
  }, [gameOver, endGame]);

  const initializeCanvas = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
    drawGame();
    setIsInitialized(true);
    refreshScores(); // Initial scores load
  }, [drawGame, refreshScores]);

  useEffect(() => {
    if (!canvasRef.current || !isInitialized || gameOver) return;

    const gameInterval = setInterval(() => {
      if (direction.current.x !== 0 || direction.current.y !== 0) {
        moveSnake();
        drawGame();
      }
    }, SPEEDS[difficulty]);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          if (direction.current.y !== 1) {
            direction.current = { x: 0, y: -1 };
          }
          break;
        case 's':
        case 'arrowdown':
          if (direction.current.y !== -1) {
            direction.current = { x: 0, y: 1 };
          }
          break;
        case 'a':
        case 'arrowleft':
          if (direction.current.x !== 1) {
            direction.current = { x: -1, y: 0 };
          }
          break;
        case 'd':
        case 'arrowright':
          if (direction.current.x !== -1) {
            direction.current = { x: 1, y: 0 };
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(gameInterval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [difficulty, gameOver, moveSnake, drawGame, isInitialized]);

  return { 
    score, 
    gameOver, 
    startGame, 
    difficulty, 
    changeDifficulty,
    scores,
    initializeCanvas,
    difficultySelected
  };
};