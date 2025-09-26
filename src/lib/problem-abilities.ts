// 各問題がどのアビリティに属するかの設定
// calculateAbilities関数の重み付けに基づいて、主要なアビリティを定義

export interface ProblemAbility {
  name: string;
  icon: string;
  weight: number; // そのアビリティでの重み（0-1）
}

export interface ProblemAbilityMapping {
  primary: ProblemAbility;    // 主要なアビリティ（最も重みが高い）
  secondary?: ProblemAbility; // 副次的なアビリティ（2番目に重みが高い場合）
}

// アビリティの基本情報
const ABILITY_INFO = {
  reading: { name: '読解', icon: '/image/ability/reading.png' },
  attention: { name: '集中・注意', icon: '/image/ability/attention.png' },
  memory: { name: '記憶', icon: '/image/ability/memory.png' },
  cognition: { name: '認知', icon: '/image/ability/cognition.png' }
};

// 各問題のアビリティ対応関係
// 正しいカテゴリ分類に基づく
export const PROBLEM_ABILITY_MAPPING: Record<string, ProblemAbilityMapping> = {
  problem1: {
    // 読解問題
    primary: { ...ABILITY_INFO.reading, weight: 1.0 }
  },

  problem2: {
    // 読解問題
    primary: { ...ABILITY_INFO.reading, weight: 1.0 }
  },

  problem3: {
    // 記憶問題
    primary: { ...ABILITY_INFO.memory, weight: 1.0 }
  },

  problem4: {
    // 記憶問題
    primary: { ...ABILITY_INFO.memory, weight: 1.0 }
  },

  problem5: {
    // 認知問題
    primary: { ...ABILITY_INFO.cognition, weight: 1.0 }
  },

  problem6: {
    // 認知問題
    primary: { ...ABILITY_INFO.cognition, weight: 1.0 }
  },

  problem7: {
    // 集中・注意問題
    primary: { ...ABILITY_INFO.attention, weight: 1.0 }
  },

  problem8: {
    // 集中・注意問題
    primary: { ...ABILITY_INFO.attention, weight: 1.0 }
  }
};

// 問題番号から対応するアビリティ情報を取得
export function getProblemAbilities(problemKey: string): ProblemAbilityMapping | null {
  return PROBLEM_ABILITY_MAPPING[problemKey] || null;
}

// 全問題のアビリティ情報を取得（結果ページで使用）
export function getAllProblemAbilities(): Record<string, ProblemAbilityMapping> {
  return PROBLEM_ABILITY_MAPPING;
}