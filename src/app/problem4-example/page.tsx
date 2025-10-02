'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';
import AnswerButton from '../../components/AnswerButton';

/**
 * Problem4 Example Page (れいだい４)
 * 
 * SYSTEM ARCHITECTURE NOTES:
 * - 問題4の例題ページ（3段階構成の2段階目）
 * - 問題1と同じ答え表示機能付きパターン
 * - ドット数カウント問題の例題
 * 
 * PROBLEM TYPE: Dot Counting Example (ドット数カウント例題)
 * - 画像: /image/4/reidai.png
 * - 答え: 4個のドット
 * - 時間制限なし（例題のため）
 * 
 * UI/UX DESIGN PATTERN:
 * - 横配置レイアウト（画像 + 回答エリア）
 * - 答え表示機能付き（「こたえる」→正解表示→「つぎへ」）
 * - 時間制限なし（例題のため）
 * - スクロール可能だが最小限に抑えた設計
 * 
 * LAYOUT PHILOSOPHY:
 * - ProblemTitle: 左寄せ統一（説明文）、中央寄せ（タイトル）
 * - 問題画像: 中央配置（重要要素）
 * - 回答エリア: 下寄せ配置で回答に集中しやすく
 * - 正解表示: 横並び配置（正解ボックス + ボタン）でコンパクト
 * 
 * INPUT SYSTEM:
 * - 数値入力フィールド（0-99の範囲想定）
 * - 問題1の3択セレクトと異なり自由入力
 * - 正解: 4（ドット数）
 * 
 * ROUTING FLOW:
 * - 前: problem4-explanation（問題4説明）
 * - 次: problem4（問題4本問）
 * 
 * FUTURE EXPANSION NOTES:
 * - 問題5〜8の例題も同様のパターンで実装予定
 * - 数値入力パターンは他の問題でも使用可能性
 */

export default function Problem4Example() {
  // STATE MANAGEMENT NOTES:
  // - answer: ユーザーの入力値（数値）
  // - showAnswers: 正解表示状態（false: 入力中, true: 正解表示中）
  const [answer, setAnswer] = useState<string>('');
  const [showAnswers, setShowAnswers] = useState(false);
  const router = useRouter();

  // CORRECT ANSWER DEFINITION:
  // 問題4例題の正解（ドット数）
  const correctAnswer = 4;

  // ROUTING LOGIC:
  // 例題完了後は問題4本問へ遷移
  const handleNext = () => {
    router.push('/problem4');
  };

  // ANSWER REVEAL FUNCTIONALITY:
  // 「こたえる」ボタン押下時の処理
  const handleShowAnswers = () => {
    setShowAnswers(true);
    setAnswer(correctAnswer.toString());
  };

  // INPUT CHANGE HANDLER:
  // セレクトボックスの変更処理
  const handleInputChange = (value: string) => {
    if (!showAnswers) {
      setAnswer(value);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      <Card>
        <div className="h-full overflow-y-auto relative" style={{scrollbarWidth: 'thin'}}>
          {/* 
            COMPONENTIZATION NOTE - PROBLEM4 EXAMPLE PAGE:
            ProblemTitleコンポーネントを使用してタイトル部分を共通化
            問題1例題と同じパターンで統一性を保持
          */}
          <ProblemTitle
            title="れんしゅう４"
            instruction="● のかずを こたえてください。もんだいは ぜんぶで ５もんです。"
          />

          {/* 画像と回答エリアを横並び */}
          <div className="grid lg:grid-cols-2 gap-6 items-start" style={{height: '70%'}}>
            {/* 左: 問題画像 */}
            <div className="flex justify-center h-full">
              <div className="border-gray-400 p-4 h-full">
                <Image
                  src="/image/4/0reidai.jpg"
                  alt="例題4"
                  width={400}
                  height={600}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>

            {/* 右: 回答エリア */}
            <div className="h-full flex flex-col justify-end">
              <div className="space-y-4 max-w-sm mx-auto lg:mx-0 border-gray-400 px-6 rounded-xl bg-gray-50">
                <div className="flex items-center justify-between p-4 border-2 border-gray-300 mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-800">ドットのかず:</span>
                  </div>
                  <select
                    value={answer}
                    onChange={(e) => handleInputChange(e.target.value)}
                    disabled={showAnswers}
                    className={`w-20 h-12 text-xl text-center border-2 border-gray-400 rounded-2xl focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-yellow-200 transition-all font-bold shadow-inner ${showAnswers ? 'bg-green-100' : 'bg-white'}`}
                  >
                    <option value="">?</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                </div>

                {/* 正解表示ボックス（答えるボタン押下後） */}
                {showAnswers && (
                  <div className="flex gap-4 mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex-1">
                      <h3 className="text-2xl font-bold text-blue-800 mb-2 text-center">せいかい</h3>
                      <div className="space-y-1 text-center">
                        <p className="text-3xl font-bold">{correctAnswer}こ</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={handleNext}
                        className="transition-transform hover:scale-105"
                      >
                        <img src="/image/next.png" alt="つぎへ" className="h-16 w-auto" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 答えるボタン（最下部） */}
                {!showAnswers && (
                  <div className="text-center mt-6">
                    <AnswerButton
                      onClick={handleShowAnswers}
                      className="px-6 py-3 text-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}