import { Problem2Pattern } from '@/types';

// 問題1の正解
export const PROBLEM1_ANSWERS = {
  star: 2,
  heart: 1,
  triangle: 3
};

// 問題2のパターン（5問分）
export const PROBLEM2_PATTERNS: Problem2Pattern[] = [
  { numbers: [0, 1, 2, 3, 4, 6, 7, 8, 9], answer: 5 },
  { numbers: [0, 1, 3, 4, 5, 6, 7, 8, 9], answer: 2 },
  { numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9], answer: 0 },
  { numbers: [0, 1, 2, 3, 4, 5, 6, 8, 9], answer: 7 },
  { numbers: [0, 1, 2, 3, 5, 6, 7, 8, 9], answer: 4 }
];

// タイマー設定（秒）
export const TIMER_DURATION = 30;

// アビリティ名のマッピング
export const ABILITY_NAMES = {
  reading: '読解',
  attention: '集中・注意',
  memory: '記憶',
  cognition: '認知'
} as const;