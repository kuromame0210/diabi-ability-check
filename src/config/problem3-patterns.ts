/**
 * Problem 3 Patterns Configuration
 * 記憶テスト問題のパターン定義
 * 
 * ⚠️ CONFIGURATION NOTES:
 * - この ファイルを編集することで問題パターンを変更できます
 * - 配列の順序: [左上, 中上, 右上, 左中, 中中, 右中, 左下, 中下, 右下]
 * - 空白は空文字 '' で表現
 * - 先方の指定に応じてパターンを更新してください
 * 
 * 🔧 HOW TO MODIFY:
 * 1. EXAMPLE_PATTERN: 例題で表示するパターン（固定）
 * 2. MAIN_PATTERN: 本問題で表示するパターン（固定）
 * 3. INPUT_CANDIDATES: 入力候補の選択肢
 * 
 * 📋 CURRENT SPECIFICATION:
 * - 例題: 3箇所に文字/記号配置
 * - 本問題: 5箇所に文字/記号/数字配置
 * - 入力候補: 2種類から開始（拡張可能）
 */

// 例題パターン（3箇所配置）
// 指定: 1段目[空白,2,空白] / 2段目[空白,空白,△] / 3段目[4,空白,空白]
export const EXAMPLE_PATTERN = [
  '',   '2',  '',     // 1段目: 空白, 2, 空白
  '',   '',   '△',    // 2段目: 空白, 空白, 三角マーク
  '4',  '',   ''      // 3段目: 4, 空白, 空白
];

// 本問題パターン（5箇所配置）
// 指定: 1段目[3,空白,6] / 2段目[○,♥,空白] / 3段目[空白,空白,9]
export const MAIN_PATTERN = [
  '3',  '',   '6',    // 1段目: 数字の3, 空白, 数字の6
  '○',  '♥',  '',     // 2段目: 丸マーク, ハートマーク, 空白
  '',   '',   '9'     // 3段目: 空白, 空白, 数字の9
];

// 入力候補（グリッド表示用）
// ⚠️ 先方指定により変更予定 - この配列を編集してください
export const INPUT_CANDIDATES = [
  '2', '△', '4',      // 例題用候補
  '3', '6', '○', '♥', '9'  // 本問題用候補
];

// 問題3のタイマー設定
export const PROBLEM3_TIMERS = {
  DISPLAY_TIME: 10,    // 見本表示時間（秒）
  COUNTDOWN_TIME: 5,   // カウントダウン時間（秒）
  INPUT_TIME: 30       // 入力時間（秒）
};

// 採点設定
export const PROBLEM3_SCORING = {
  TOTAL_SCORE: 2.5,    // 問題3の満点
  REQUIRED_CORRECT: 3   // 満点に必要な正解数
};

/**
 * パターン取得ヘルパー関数
 */
export const getProblem3Patterns = () => {
  return {
    example: EXAMPLE_PATTERN,
    main: MAIN_PATTERN,
    candidates: INPUT_CANDIDATES,
    timers: PROBLEM3_TIMERS,
    scoring: PROBLEM3_SCORING
  };
};