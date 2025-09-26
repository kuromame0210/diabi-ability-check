import { Problem2Pattern } from '@/types';

// 問題1の正解
export const PROBLEM1_ANSWERS = {
  star: 2,
  heart: 1,
  triangle: 3
};

// 問題2のパターン（5問分）
export const PROBLEM2_PATTERNS: Problem2Pattern[] = [
  { numbers: [0, 1, 3, 4, 5, 6, 7, 8, 9], answer: 2 },
  { numbers: [8, 1, 6, 9, 2, 4, 3, 0, 5], answer: 7 },
  { numbers: [5, 0, 9, 4, 1, 6, 7, 2, 8], answer: 3 },
  { numbers: [7, 2, 5, 8, 4, 6, 9, 1, 3], answer: 0 },
  { numbers: [2, 8, 4, 9, 3, 6, 0, 7, 5], answer: 1 }
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

// アビリティアイコンのマッピング
export const ABILITY_ICONS = {
  reading: '/image/ability/reading.png',
  attention: '/image/ability/attention.png',
  memory: '/image/ability/memory.png',
  cognition: '/image/ability/cognition.png'
} as const;