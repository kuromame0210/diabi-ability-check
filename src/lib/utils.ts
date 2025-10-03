import { ABILITY_NAMES, ABILITY_NAMES_HIRAGANA, ABILITY_ICONS, PROBLEM1_ANSWERS, PROBLEM2_PATTERNS } from './constants';
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
  // 問題4の正解（mondai1.png ～ mondai5.png の正解）
  const correctAnswers = [3, 5, 4, 6, 7];

  const correctCount = answers.reduce((count, answer, index) => {
    return count + (answer === correctAnswers[index] ? 1 : 0);
  }, 0);

  if (correctCount === 5) return 2.5;
  if (correctCount === 3) return 1;
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
  // 問題7の正解（マークの数：○=9個、◎=7個、●=8個）
  const correctAnswers = {
    circle: 9,        // ○（白丸）
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
    // 読解: 問題1,2が主体（各50%）
    reading: Math.min(5, Math.max(0, (base1 * 0.5 + base2 * 0.5) * 5 + (Math.random() - 0.5) * 0.1)),

    // 集中・注意: 問題7,8が主体（各50%）
    attention: Math.min(5, Math.max(0, (base7 * 0.5 + base8 * 0.5) * 5 + (Math.random() - 0.5) * 0.1)),

    // 記憶: 問題3,4が主体（各50%）
    memory: Math.min(5, Math.max(0, (base3 * 0.5 + base4 * 0.5) * 5 + (Math.random() - 0.5) * 0.1)),

    // 認知: 問題5,6が主体（各50%）
    cognition: Math.min(5, Math.max(0, (base5 * 0.5 + base6 * 0.5) * 5 + (Math.random() - 0.5) * 0.1))
  };
}

// アビリティ分析
export function analyzeAbilities(abilities: UserData['abilities']): AbilityAnalysis {
  // 順番を統一: どっかい、きおく、認知、集中
  const orderedKeys = ['reading', 'memory', 'cognition', 'attention'] as const;
  const entries = orderedKeys.map(key => [key, abilities[key]] as [string, number]);

  // 全部0点かチェック（全分野が0.5以下）
  const allZero = entries.every(([, value]) => value <= 0.5);

  // 全部低得点かチェック（全分野が2.5以下）
  const allLow = entries.every(([, value]) => value <= 2.5);

  // 3点以上の分野を取得（3.0以上）
  const strongEntries = entries.filter(([, value]) => value >= 3.0);

  // 得意分野の決定
  let strongestNames: Array<{name: string; nameHiragana: string; icon: string}>;

  if (allZero || allLow) {
    // 全部0点または全部低得点の場合は得意分野なし
    strongestNames = [];
  } else if (strongEntries.length > 0) {
    // 3点以上の分野があれば、それらを得意分野とする
    strongestNames = strongEntries.map(([key]) => ({
      name: ABILITY_NAMES[key as keyof typeof ABILITY_NAMES],
      nameHiragana: ABILITY_NAMES_HIRAGANA[key as keyof typeof ABILITY_NAMES_HIRAGANA],
      icon: ABILITY_ICONS[key as keyof typeof ABILITY_ICONS]
    }));
  } else {
    // それ以外の場合は最高値の分野を得意とする
    const maxValue = Math.max(...entries.map(([, value]) => value));
    const maxEntries = entries.filter(([, value]) => Math.abs(value - maxValue) < 0.1);
    strongestNames = maxEntries.map(([key]) => ({
      name: ABILITY_NAMES[key as keyof typeof ABILITY_NAMES],
      nameHiragana: ABILITY_NAMES_HIRAGANA[key as keyof typeof ABILITY_NAMES_HIRAGANA],
      icon: ABILITY_ICONS[key as keyof typeof ABILITY_ICONS]
    }));
  }

  // のびしろの決定（最低値の分野）
  const minValue = Math.min(...entries.map(([, value]) => value));
  const weakestEntry = entries.find(([, value]) => Math.abs(value - minValue) < 0.1);

  return {
    strongest: strongestNames,
    weakest: {
      name: ABILITY_NAMES[weakestEntry![0] as keyof typeof ABILITY_NAMES],
      nameHiragana: ABILITY_NAMES_HIRAGANA[weakestEntry![0] as keyof typeof ABILITY_NAMES_HIRAGANA],
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