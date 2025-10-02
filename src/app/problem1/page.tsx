'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TIMER_DURATION } from '@/lib/constants';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';
import Problem1Layout from '../../components/Problem1Layout';

/**
 * Problem 1 Page (もんだい１)
 * 
 * SYSTEM ARCHITECTURE NOTES:
 * - 問題1の本問（2段階構成の2段階目）
 * - 例題で練習した後の実際のテスト問題
 * - 回答データはlocalStorageに保存後、問題2の説明ページへ遷移
 * 
 * PROBLEM TYPE: Visual Tracking (線つなぎ問題)
 * - 画像: /image/mondai1.png
 * - 例題と同じ形式だが問題内容は異なる
 * - 3つの記号（★♥▲）から3つの数字（123）への線つなぎ
 * 
 * TIMER IMPLEMENTATION:
 * - 制限時間: TIMER_DURATION（定数で管理）
 * - 時間切れ時は自動的にhandleSubmit実行
 * - 右上に残り時間表示（赤色で注意喚起）
 * 
 * DATA PERSISTENCE:
 * - 回答データ: localStorage['problem1Answers'] (JSON形式)
 * - タイムスタンプ: localStorage['problem1Time'] (ISO文字列)
 * - これらのデータは結果ページで使用される
 * 
 * UI/UX DESIGN PATTERN:
 * - 例題と同じ横配置レイアウト（画像 + 回答エリア）
 * - ただし答え表示機能は無し（テストのため）
 * - 完答時のみ送信ボタンが有効化
 * 
 * ROUTING FLOW:
 * - 前: example（例題ページ）
 * - 次: problem2-explanation（問題2説明ページ）
 * 
 * DESIGN CONSISTENCY NOTES:
 * - ProblemTitleコンポーネントで統一
 * - Card + Backgroundパターンで統一
 * - セレクトボックスは例題と同じスタイル
 * - ボタンサイズも統一（px-10 py-4 text-xl）
 */
export default function Problem1() {
  // TIMER STATE:
  // - TIMER_DURATION: 定数ファイルで管理（問題2は30秒、問題1は異なる可能性）
  // - 毎秒カウントダウンし、0になったら自動送信
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  
  // ANSWER STATE:
  // - 例題と同じ構造（star/heart/triangle）
  // - ただし正解データは保持しない（テストのため）
  const [answers, setAnswers] = useState({
    star: '',
    heart: '',
    triangle: ''
  });

  const router = useRouter();

  // DATA SUBMISSION HANDLER:
  // - localStorage保存 + 次ページ遷移を一括処理
  // - useCallbackでメモ化（useEffectの依存関係で使用のため）
  // - 未回答項目は0として保存（結果計算で使用）
  const handleSubmit = useCallback(() => {
    // ANSWER DATA PROCESSING:
    // - 文字列 → 数値変換（計算処理のため）
    // - 未選択の場合は0にフォールバック
    const problem1Answers = {
      star: parseInt(answers.star) || 0,
      heart: parseInt(answers.heart) || 0,
      triangle: parseInt(answers.triangle) || 0
    };

    // LOCAL STORAGE PERSISTENCE:
    // - 回答データ: JSON形式で保存
    // - 時刻データ: ISO文字列で保存（結果ページで使用）
    localStorage.setItem('problem1Answers', JSON.stringify(problem1Answers));
    localStorage.setItem('problem1Time', new Date().toISOString());

    // ROUTING TO NEXT STAGE:
    // 問題2は3段階構成のため、まず説明ページへ遷移
    // （問題1は2段階構成だったが、問題2は説明→例題→問題の流れ）
    router.push('/problem2-explanation');
  }, [answers.star, answers.heart, answers.triangle, router]);

  // TIMER EFFECT:
  // - 1秒間隔でカウントダウン
  // - 残り1秒以下になったら自動送信
  // - コンポーネントアンマウント時にタイマー停止
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // TIME UP: 自動的に回答を送信
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // CLEANUP: メモリリーク防止
    return () => clearInterval(timer);
  }, [handleSubmit]);

  // INPUT CHANGE HANDLER:
  // - 例題と同じパターン
  // - ただし正解表示機能は無い（テスト問題のため）
  const handleInputChange = (symbol: 'star' | 'heart' | 'triangle', value: string) => {
    setAnswers(prev => ({
      ...prev,
      [symbol]: value
    }));
  };

  // COMPLETION VALIDATION:
  // - 全ての選択肢に回答があるかチェック
  // - 送信ボタンの有効/無効制御に使用
  const isAnswerComplete = answers.star && answers.heart && answers.triangle;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      <Card>
        <div className="overflow-y-auto h-full">
          {/* 
            COMPONENTIZATION NOTE - PROBLEM1 PAGE:
            ProblemTitleコンポーネントを使用してタイトル部分を共通化
            
            WHY THIS IS SAFE TO COMPONENTIZE:
            - タイトル + 区切り線 + 説明文は全問題ページで確実に同じパターン
            - 例題ページと同じ構造で統一性を保持
            - 残り7問追加時にも同じパターンで再利用可能
            
            WHAT IS NOT COMPONENTIZED:
            - タイマー機能: 問題ページ固有（例題には無い）
            - 回答エリア: 問題2は全く異なる形式（数字探し）
            - 送信ボタン: 各問題で異なる遷移先と処理ロジック
          */}
          <ProblemTitle
            title="もんだい１"
            instruction="きごうから めだけでせんをたどったさきのすうじをせんたくしてください"
            additionalInfo={`のこり: ${timeLeft}びょう`}
          />

          <Problem1Layout
            imageSrc="/image/mondai1.png"
            imageAlt="線つなぎ問題"
            answers={answers}
            onAnswerChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>
      </Card>
    </div>
  );
}