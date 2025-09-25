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
    problem3: string[];
    problem4: number[];
    problem5: string;
    problem6: number;
    problem7: {
      circle: number;
      doubleCircle: number;
      filledCircle: number;
    };
    problem8: {
      yellow: number;
      green: number;
      blue: number;
      cyan: number;
    };
  };
  scores: {
    problem1: number;
    problem2: number;
    problem3: number;
    problem4: number;
    problem5: number;
    problem6: number;
    problem7: number;
    problem8: number;
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
    problem3: string;
    problem4: string;
    problem5: string;
    problem6: string;
    problem7: string;
    problem8: string;
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