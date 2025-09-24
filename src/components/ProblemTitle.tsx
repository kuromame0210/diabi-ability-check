/**
 * ProblemTitle Component
 * 
 * PURPOSE:
 * - 問題ページ共通のタイトル部分を統一するためのコンポーネント
 * - タイトル + 区切り線 + 説明文のセットを提供
 * 
 * COMPONENTIZATION RATIONALE (共通化の方針):
 * - 「絶対に後で共通化できる」確実な部分のみを共通化
 * - 全ての問題ページで確実に使用される部分のみを対象
 * - 変更される可能性が低い安全な部分のみを共通化
 * - 過度な抽象化を避け、柔軟性を保持
 * 
 * SAFE FOR FUTURE EXPANSION (将来性):
 * - 残り8問追加時にも同じパターンで使用可能
 * - additionalInfoでページ固有の情報を柔軟に追加可能
 * - 制約が少なく、後から変更しやすい設計
 * - タイトルと区切り線は全問題で確実に同じパターン
 * 
 * INTENTIONAL LIMITATIONS (意図的な制限):
 * ※以下は現段階では共通化しない（後で大変になる可能性があるため）
 * - 回答エリア: 問題によって形式が大きく異なる（問題1は選択、問題2は数字探し等）
 * - ボタンエリア: 機能が問題ごとに異なる（答え表示 vs 送信 vs その他）
 * - レイアウト詳細: 問題ごとにカスタマイズが必要な可能性
 * - 画像表示部分: サイズや配置が問題によって異なる可能性
 * - タイマー機能: 例題には無く、問題ページ固有
 * 
 * FUTURE COMPONENTIZATION CANDIDATES (将来の共通化候補):
 * - 8問すべて実装後に共通パターンが見えてから検討
 * - 回答エリアは3つ以上同じパターンが出てから共通化
 * - ボタン機能も複数同じパターンが確定してから共通化
 */

import React from 'react';

interface ProblemTitleProps {
  /** メインタイトル（例：「れいだい」「もんだい１」） */
  title: string;
  
  /** 問題の説明文（例：「きごうから めだけでせんをたどったさきのすうじをせんたくしてください」） */
  instruction?: string;
  
  /** 
   * ページ固有の追加情報（例：時間制限なしのメモ）
   * React.ReactNodeで柔軟に対応 - テキスト、JSX要素、何でもOK
   */
  additionalInfo?: React.ReactNode;
}

/**
 * 問題ページ共通のタイトルセクション
 * 
 * DESIGN CONSISTENCY NOTES:
 * - 全問題ページで同じ見た目と構造を保証
 * - タイトルは中央寄せ、説明文は左寄せで統一
 * - 区切り線画像は全ページ共通で使用(/image/border-line.png)
 * - additionalInfoは右上に絶対配置で表示（例：時間制限なし）
 * 
 * TEXT ALIGNMENT POLICY:
 * - タイトル: text-center（重要要素は中央配置）
 * - 説明文: text-left（読みやすさを優先して左寄せ）
 * - この方針は全問題ページで統一
 * 
 * RESPONSIVE DESIGN:
 * - Cardコンポーネント内で使用することを前提
 * - 固定サイズ(80vw x 80vh)内での表示最適化
 * 
 * EXTENSIBILITY NOTES:
 * - 残り6問追加時もこの構造で統一予定
 * - プロパティ追加で対応、基本構造は変更しない方針
 */
export default function ProblemTitle({ title, instruction, additionalInfo }: ProblemTitleProps) {
  return (
    <>
      {/* タイトルセクション */}
      <div className="flex items-center justify-center mb-4 relative">
        <h2 className="text-4xl font-bold text-gray-800 text-center">
          {title}
        </h2>
        
        {/* 追加情報（例題の時間制限なし等） */}
        {additionalInfo && (
          <div className="text-3xl text-black absolute right-0 font-bold">
            {additionalInfo}
          </div>
        )}
      </div>
      
      {/* 区切り線（全ページ共通） */}
      <img src="/image/border-line.png" alt="区切り線" className="w-full h-auto mb-6" />
      
      {/* 説明文 */}
      {instruction && (
        <p className="text-2xl text-gray-800 mb-6 text-left font-bold py-2">
          {instruction}
        </p>
      )}
    </>
  );
}