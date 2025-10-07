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
  return {
    // 読解: 問題1 + 問題2（最大5点）
    reading: problem1Score + problem2Score,

    // 集中・注意: 問題7 + 問題8（最大5点）
    attention: problem7Score + problem8Score,

    // 記憶: 問題3 + 問題4（最大5点）
    memory: problem3Score + problem4Score,

    // 認知: 問題5 + 問題6（最大5点）
    cognition: problem5Score + problem6Score
  };
}

// アビリティ分析
export function analyzeAbilities(abilities: UserData['abilities']): AbilityAnalysis {
  // 順番を統一: どっかい、きおく、認知、集中
  const orderedKeys = ['reading', 'memory', 'cognition', 'attention'] as const;
  const entries = orderedKeys.map(key => [key, abilities[key]] as [string, number]);

  // 最大値と最小値を取得
  const maxValue = Math.max(...entries.map(([, value]) => value));
  const minValue = Math.min(...entries.map(([, value]) => value));

  // 全て同点かチェック（差が0.1以下）
  const allSame = Math.abs(maxValue - minValue) < 0.1;

  let strongestNames: Array<{name: string; nameHiragana: string; icon: string}>;
  let weakestNames: Array<{name: string; nameHiragana: string; icon: string}>;

  if (allSame) {
    // 全て同点の場合
    if (maxValue < 3.0) {
      // 全てが3点未満で同点の場合：全てを「のびしろ」
      strongestNames = [];
      weakestNames = entries.map(([key]) => ({
        name: ABILITY_NAMES[key as keyof typeof ABILITY_NAMES],
        nameHiragana: ABILITY_NAMES_HIRAGANA[key as keyof typeof ABILITY_NAMES_HIRAGANA],
        icon: ABILITY_ICONS[key as keyof typeof ABILITY_ICONS]
      }));
    } else {
      // 全てが3点以上で同点の場合：全てを「とくい」
      strongestNames = entries.map(([key]) => ({
        name: ABILITY_NAMES[key as keyof typeof ABILITY_NAMES],
        nameHiragana: ABILITY_NAMES_HIRAGANA[key as keyof typeof ABILITY_NAMES_HIRAGANA],
        icon: ABILITY_ICONS[key as keyof typeof ABILITY_ICONS]
      }));
      weakestNames = [];
    }
  } else {
    // 点数に差がある場合
    // 最も得点が高い項目：とくい（同点の場合、複数可）
    const maxEntries = entries.filter(([, value]) => Math.abs(value - maxValue) < 0.1);
    strongestNames = maxEntries.map(([key]) => ({
      name: ABILITY_NAMES[key as keyof typeof ABILITY_NAMES],
      nameHiragana: ABILITY_NAMES_HIRAGANA[key as keyof typeof ABILITY_NAMES_HIRAGANA],
      icon: ABILITY_ICONS[key as keyof typeof ABILITY_ICONS]
    }));

    // 最も点数が低い項目：のびしろ（同点の場合、複数可）
    const minEntries = entries.filter(([, value]) => Math.abs(value - minValue) < 0.1);
    weakestNames = minEntries.map(([key]) => ({
      name: ABILITY_NAMES[key as keyof typeof ABILITY_NAMES],
      nameHiragana: ABILITY_NAMES_HIRAGANA[key as keyof typeof ABILITY_NAMES_HIRAGANA],
      icon: ABILITY_ICONS[key as keyof typeof ABILITY_ICONS]
    }));
  }

  return {
    strongest: strongestNames,
    weakest: weakestNames.length > 0 ? weakestNames[0] : {
      name: ABILITY_NAMES[entries[0][0] as keyof typeof ABILITY_NAMES],
      nameHiragana: ABILITY_NAMES_HIRAGANA[entries[0][0] as keyof typeof ABILITY_NAMES_HIRAGANA],
      icon: ABILITY_ICONS[entries[0][0] as keyof typeof ABILITY_ICONS]
    },
    weakestAll: weakestNames
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