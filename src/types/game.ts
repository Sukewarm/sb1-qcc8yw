export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameScore = {
  score: number;
  difficulty: Difficulty;
  date: string;
};

export type Position = {
  x: number;
  y: number;
};