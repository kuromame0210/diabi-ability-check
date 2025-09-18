import { ABILITY_NAMES, PROBLEM1_ANSWERS, PROBLEM2_PATTERNS } from './constants';
import { AbilityAnalysis, UserData } from '@/types';

// 問題1の採点
export function scoreProblem1(answers: { star: number; heart: number; triangle: number }): number {
  const correctCount = Object.entries(answers).reduce((count, [key, value]) => {
    const correctValue = PROBLEM1_ANSWERS[key as keyof typeof PROBLEM1_ANSWERS];
    return count + (value === correctValue ? 1 : 0);
  }, 0);

  if (correctCount === 3) return 2.5;
  if (correctCount === 2) return 1;
  return 0;
}

// 問題2の採点
export function scoreProblem2(answers: number[]): number {
  const correctCount = answers.reduce((count, answer, index) => {
    return count + (answer === PROBLEM2_PATTERNS[index].answer ? 1 : 0);
  }, 0);

  if (correctCount === 5) return 2.5;
  if (correctCount >= 3) return 1;
  return 0;
}

// アビリティスコア計算（ダミーロジック）
export function calculateAbilities(problem1Score: number, problem2Score: number) {
  const base1 = problem1Score / 2.5;
  const base2 = problem2Score / 2.5;

  return {
    reading: Math.min(5, Math.max(0, (base1 * 0.6 + base2 * 0.4) * 5 + (Math.random() - 0.5))),
    attention: Math.min(5, Math.max(0, (base2 * 0.8 + base1 * 0.2) * 5 + (Math.random() - 0.5))),
    memory: Math.min(5, Math.max(0, (base1 * 0.4 + base2 * 0.6) * 5 + (Math.random() - 0.5))),
    cognition: Math.min(5, Math.max(0, (base1 * 0.8 + base2 * 0.2) * 5 + (Math.random() - 0.5)))
  };
}

// アビリティ分析
export function analyzeAbilities(abilities: UserData['abilities']): AbilityAnalysis {
  const entries = Object.entries(abilities);
  const strongest = entries.reduce((a, b) => a[1] > b[1] ? a : b);
  const weakest = entries.reduce((a, b) => a[1] < b[1] ? a : b);

  return {
    strongest: `${ABILITY_NAMES[strongest[0] as keyof typeof ABILITY_NAMES]}が得意です！`,
    weakest: `${ABILITY_NAMES[weakest[0] as keyof typeof ABILITY_NAMES]}をもっと伸ばしましょう`
  };
}

// 現在の日時取得
export function getCurrentDateTime() {
  const now = new Date();
  return {
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().split(' ')[0],
    full: now.toISOString()
  };
}

// Google Sheets にデータ送信
export async function saveUserData(userData: UserData): Promise<boolean> {
  try {
    const response = await fetch('/api/save-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userData })
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to save data:', error);
    return false;
  }
}