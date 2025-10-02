'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TIMER_DURATION, PROBLEM2_PATTERNS } from '@/lib/constants';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';
import AnswerButton from '../../components/AnswerButton';
import NumberDisplay from '../../components/NumberDisplay';

/**
 * Problem 2 Page (もんだい２)
 * 
 * SYSTEM ARCHITECTURE NOTES:
 * - 問題2の本問（3段階構成の3段階目）
 * - 説明→例題で学習した後の実際のテスト問題
 * - 5問セットで30秒の制限時間
 * 
 * PROBLEM TYPE: Number Search (数字探し問題)
 * - PROBLEM2_PATTERNS: 定数ファイルで5問のパターンを管理
 * - 各問題で0-9の数字から1つだけ欠けている数字を見つける
 * - 問題1の3択と異なり、10択セレクトボックス使用
 * 
 * TIMER IMPLEMENTATION:
 * - 制限時間: 30秒（TIMER_DURATION定数）
 * - 5問全体で30秒（1問あたり6秒計算）
 * - 時間切れ時は自動送信
 * 
 * DATA STRUCTURE:
 * - answers: 配列形式（['','','','','']）
 * - 問題1はオブジェクト形式（{star:'', heart:'', triangle:''}）
 * - この違いは問題形式の違いによるもの
 * 
 * UI/UX DESIGN:
 * - Card + Background統一パターン
 * - ProblemTitle左寄せ統一
 * - 5問同時表示（スクロール対応）
 * - 各問題にナンバリング表示
 * 
 * DATA PERSISTENCE:
 * - localStorage['problem2Answers']: 配列形式でJSON保存
 * - localStorage['problem2Time']: タイムスタンプ保存
 * - 結果ページで使用される
 * 
 * ROUTING FLOW:
 * - 前: problem2-example（問題2例題）
 * - 次: result（結果ページ）
 * 
 * DESIGN CONSISTENCY NOTES:
 * - タイマー表示: 問題1と同じスタイル（右上、赤背景）
 * - セレクトボックス: 統一スタイル（border-3 border-yellow-300）
 * - ボタン: 統一スタイル（完答時のみ有効化）
 * 
 * FUTURE EXPANSION NOTES:
 * - 5問パターンはPROBLEM2_PATTERNS配列で管理
 * - 新しい問題パターンは配列に追加で対応可能
 * - 制限時間もTIMER_DURATION定数で柔軟に変更可能
 */
export default function Problem2() {
  // TIMER STATE:
  // - 問題2は30秒制限（問題1とは異なる制限時間）
  // - 5問セットで30秒のためスピード重視
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  
  // ANSWER STATE:
  // - 配列形式: 5問分の回答を配列で管理
  // - 初期値: 空文字列5つの配列
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);
  const router = useRouter();

  // DATA SUBMISSION HANDLER:
  // - 配列形式の回答データを数値配列に変換
  // - 結果ページでの計算処理に対応
  const handleSubmit = useCallback(() => {
    // ANSWER DATA PROCESSING:
    // - 文字列配列 → 数値配列変換
    // - 未回答は0にフォールバック
    const numericAnswers = answers.map(answer => parseInt(answer) || 0);

    // LOCAL STORAGE PERSISTENCE:
    // - JSON配列形式で保存（問題1はオブジェクト形式）
    // - タイムスタンプも同時保存
    localStorage.setItem('problem2Answers', JSON.stringify(numericAnswers));
    localStorage.setItem('problem2Time', new Date().toISOString());

    // ROUTING TO PROBLEM3:
    // 問題2完了後は問題3説明ページへ
    router.push('/problem3-explanation');
  }, [answers, router]);

  // TIMER CALLBACK WRAPPER:
  // - handleSubmitのラッパー（useEffect依存関係のため）
  const handleFinish = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  // TIMER EFFECT:
  // - 問題1と同じパターン
  // - ただし制限時間が異なる（30秒 vs 問題1の時間）
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // TIME UP: 自動送信
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // CLEANUP: メモリリーク防止
    return () => clearInterval(timer);
  }, [handleFinish]);

  // INPUT CHANGE HANDLER:
  // - 配列インデックスベースの更新
  // - 問題1の記号ベース更新とは異なる
  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // COMPLETION VALIDATION:
  // - 全5問に回答があるかチェック
  // - 送信ボタンの有効/無効制御
  const isAllAnswered = answers.every(answer => answer.trim() !== '');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      <Card>
        <div className="overflow-y-auto h-full">
          {/* 
            COMPONENTIZATION NOTE - PROBLEM2 PAGE:
            ProblemTitleコンポーネントを使用してタイトル部分を共通化
            他の問題ページと同じパターンで統一性を保持
            デザインを既存のCard/Backgroundパターンに合わせて更新
          */}
          <ProblemTitle
            title="もんだい２"
            instruction="０から９までの すうじのうち、ひとつだけ たりないすうじを こたえてください。"
            additionalInfo={`のこり: ${timeLeft}びょう`}
          />

          <p className="text-base text-red-600 mb-2 text-center font-bold py-1">
            ※ゆびですうじをなぞらずめだけでみつけてください
          </p>

          {/* 5問を同時表示 */}
          <div className="space-y-4 max-w-5xl mx-auto">
            {PROBLEM2_PATTERNS.map((pattern, index) => (
              <div key={index} className="flex gap-8 items-center justify-center">
                {/* 問題番号 */}
                <div className="text-center flex-shrink-0">
                  <h3 className="text-3xl font-bold text-gray-800">
                    {index + 1}
                  </h3>
                </div>

                {/* 数字表示エリア */}
                <div className="flex justify-center items-center">
                  <NumberDisplay numbers={pattern.numbers.join('')} />
                </div>

                {/* 回答エリア */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <label className="text-2xl font-bold text-gray-800">こたえ:</label>
                  <select
                    value={answers[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="w-16 h-12 text-2xl text-center border-3 border-yellow-300 rounded-2xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all font-bold bg-white shadow-inner"
                  >
                    <option value="">?</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* 送信ボタン */}
          <div className="text-center mt-2">
            <AnswerButton
              onClick={handleSubmit}
              disabled={!isAllAnswered}
              className="px-8 py-2 text-lg"
            />
          </div>

        </div>
      </Card>
    </div>
  );
}