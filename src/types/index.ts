// TypeScript型定義

export interface UserData {
  name: string;
  testDate: string;
  testTime: string;
  answers: {
    problem1: {
      star: number;
      heart: number;
      triangle: number;
    };
    problem2: number[];
  };
  scores: {
    problem1: number;
    problem2: number;
    total: number;
  };
  abilities: {
    reading: number;
    attention: number;
    memory: number;
    cognition: number;
  };
  analysis: {
    strongest: string;
    weakest: string;
  };
  timestamps: {
    start: string;
    problem1: string;
    problem2: string;
    end: string;
  };
}

export interface Problem2Pattern {
  numbers: number[];
  answer: number;
}

export interface AbilityAnalysis {
  strongest: string;
  weakest: string;
}