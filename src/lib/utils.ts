import { ABILITY_NAMES, ABILITY_ICONS, PROBLEM1_ANSWERS, PROBLEM2_PATTERNS } from './constants';
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

// 問題3の採点
export function scoreProblem3(score: number): number {
  // 問題3の採点は既にproblem3ページで実行済み
  // localStorageから採点済みスコアを取得して返す
  return score;
}

// 問題4の採点
export function scoreProblem4(answers: number[]): number {
  // 問題4の正解（1-8の範囲で仮設定 - 実際の画像に合わせて後で更新）
  const correctAnswers = [4, 7, 3, 6, 5]; // mondai1.png ～ mondai5.png の正解（1-8範囲）
  
  const correctCount = answers.reduce((count, answer, index) => {
    return count + (answer === correctAnswers[index] ? 1 : 0);
  }, 0);

  if (correctCount === 5) return 2.5;
  if (correctCount >= 3) return 1;
  return 0;
}

// 問題5の採点
export function scoreProblem5(answer: string): number {
  // 問題5の正解（全角・半角両方を受け入れ）
  const correctAnswers = ["ココロ", "ｺｺﾛ"]; // 全角と半角カタカナの両方
  
  // 完全一致による採点（全角・半角どちらでも正解）
  if (correctAnswers.includes(answer.trim())) {
    return 2.5;
  }
  
  return 0;
}

// 問題6の採点
export function scoreProblem6(answer: number): number {
  // 問題6の正解（図形の数）
  const correctAnswer = 7; // 提供された画像の図形数
  
  // 完全一致による採点
  if (answer === correctAnswer) {
    return 2.5;
  }
  
  return 0;
}

// 問題7の採点
export function scoreProblem7(answers: { circle: number; doubleCircle: number; filledCircle: number }): number {
  // 問題7の正解（マークの数：○=8個、◎=7個、●=8個）
  const correctAnswers = {
    circle: 8,        // ○（白丸）
    doubleCircle: 7,  // ◎（二重丸）
    filledCircle: 8   // ●（黒丸）
  };
  
  // 正解数をカウント
  let correctCount = 0;
  if (answers.circle === correctAnswers.circle) correctCount++;
  if (answers.doubleCircle === correctAnswers.doubleCircle) correctCount++;
  if (answers.filledCircle === correctAnswers.filledCircle) correctCount++;
  
  // 部分点システム：3つ正解で2.5点、2つ正解で1点
  if (correctCount === 3) return 2.5;
  if (correctCount === 2) return 1;
  return 0;
}

// 問題8の採点
export function scoreProblem8(answers: { yellow: number; green: number; blue: number; cyan: number }): number {
  // 問題8の正解（4色パレットのボール数：黄色=2個、緑=0個、青=1個、水色=1個）
  const correctAnswers = {
    yellow: 2,  // 黄色
    green: 0,   // 緑
    blue: 1,    // 青
    cyan: 1     // 水色
  };
  
  // 正解数をカウント
  let correctCount = 0;
  if (answers.yellow === correctAnswers.yellow) correctCount++;
  if (answers.green === correctAnswers.green) correctCount++;
  if (answers.blue === correctAnswers.blue) correctCount++;
  if (answers.cyan === correctAnswers.cyan) correctCount++;
  
  // 採点システム：4つ全て正解で2.5点、3つ正解で1点
  if (correctCount === 4) return 2.5;
  if (correctCount === 3) return 1;
  return 0;
}

// アビリティスコア計算（8問題対応）
export function calculateAbilities(problem1Score: number, problem2Score: number, problem3Score: number = 0, problem4Score: number = 0, problem5Score: number = 0, problem6Score: number = 0, problem7Score: number = 0, problem8Score: number = 0) {
  const base1 = problem1Score / 2.5;
  const base2 = problem2Score / 2.5;
  const base3 = problem3Score / 2.5;
  const base4 = problem4Score / 2.5;
  const base5 = problem5Score / 2.5;
  const base6 = problem6Score / 2.5;
  const base7 = problem7Score / 2.5;
  const base8 = problem8Score / 2.5;

  return {
    reading: Math.min(5, Math.max(0, (base1 * 0.25 + base5 * 0.18 + base2 * 0.12 + base6 * 0.1 + base7 * 0.12 + base8 * 0.15 + base3 * 0.04 + base4 * 0.04) * 5 + (Math.random() - 0.5))),
    attention: Math.min(5, Math.max(0, (base2 * 0.18 + base4 * 0.18 + base6 * 0.15 + base7 * 0.2 + base8 * 0.2 + base5 * 0.06 + base1 * 0.015 + base3 * 0.015) * 5 + (Math.random() - 0.5))),
    memory: Math.min(5, Math.max(0, (base3 * 0.3 + base8 * 0.2 + base4 * 0.15 + base6 * 0.1 + base7 * 0.12 + base5 * 0.08 + base1 * 0.025 + base2 * 0.025) * 5 + (Math.random() - 0.5))),
    cognition: Math.min(5, Math.max(0, (base1 * 0.12 + base5 * 0.12 + base6 * 0.12 + base7 * 0.15 + base8 * 0.25 + base2 * 0.1 + base3 * 0.09 + base4 * 0.05) * 5 + (Math.random() - 0.5)))
  };
}

// アビリティ分析
export function analyzeAbilities(abilities: UserData['abilities']): AbilityAnalysis {
  const entries = Object.entries(abilities);
  const maxValue = Math.max(...entries.map(([, value]) => value));
  const minValue = Math.min(...entries.map(([, value]) => value));

  // 最高値と同じ値を持つ全ての分野を取得
  const strongestEntries = entries.filter(([, value]) => Math.abs(value - maxValue) < 0.1);
  const weakestEntry = entries.find(([, value]) => Math.abs(value - minValue) < 0.1);

  // 全問正解の場合（全分野が4.5以上）は全分野を得意とする
  const allHigh = entries.every(([, value]) => value >= 4.5);

  const strongestNames = allHigh
    ? entries.map(([key]) => ({
        name: ABILITY_NAMES[key as keyof typeof ABILITY_NAMES],
        icon: ABILITY_ICONS[key as keyof typeof ABILITY_ICONS]
      }))
    : strongestEntries.map(([key]) => ({
        name: ABILITY_NAMES[key as keyof typeof ABILITY_NAMES],
        icon: ABILITY_ICONS[key as keyof typeof ABILITY_ICONS]
      }));

  return {
    strongest: strongestNames,
    weakest: {
      name: ABILITY_NAMES[weakestEntry![0] as keyof typeof ABILITY_NAMES],
      icon: ABILITY_ICONS[weakestEntry![0] as keyof typeof ABILITY_ICONS]
    }
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