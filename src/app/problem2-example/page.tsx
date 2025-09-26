'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';

/**
 * Problem2 Example Page (れいだい２)
 * 
 * SYSTEM ARCHITECTURE NOTES:
 * - 問題2の例題ページ（3段階構成の2段階目）
 * - 説明ページで理解した内容を実際に体験
 * - 問題1例題と同じ答え表示機能を実装
 * 
 * PROBLEM TYPE: Number Search (数字探し問題)
 * - 数字列: 012346789 (5が欠けている)
 * - 正解: 5
 * - 0-9の10択セレクトボックス（問題1は3択）
 * 
 * LAYOUT DESIGN DECISION:
 * - 縦配置採用: 数字列の見切れ防止
 * - 問題1は横配置（画像+回答）、問題2は縦配置（数字+回答）
 * - この違いは問題形式に最適化した結果
 * 
 * UI IMPROVEMENTS:
 * - 黒枠統一: 数字表示、回答ボックスともにborder-2 border-black
 * - 大きな文字サイズ: 数字(text-4xl)、ボタン(text-2xl)で見やすく
 * - シンプル構成: 余計な装飾を排除
 * 
 * LAYOUT PHILOSOPHY:
 * - 数字表示: 中央配置（重要要素として目立たせる）
 * - 回答エリア: 中央配置のボックス内で左寄せ
 * - 正解表示: 横並び（正解ボックス + ボタン）
 * 
 * NUMBER DISPLAY REQUIREMENTS:
 * - 改行なし: whitespace-nowrap で強制1行表示
 * - 見切れ防止: 縦配置により十分な横幅確保
 * - 黒枠強調: border-2 border-black + bg-white で明確に
 * 
 * ROUTING FLOW:
 * - 前: problem2-explanation（問題2説明）
 * - 次: problem2（問題2本問）
 * 
 * DESIGN CONSISTENCY NOTES:
 * - ProblemTitleで統一（左寄せ説明文）
 * - 答え表示機能は問題1例題と同じパターン
 * - ボタンサイズとスタイルも統一
 * 
 * SIZE OPTIMIZATION DETAILS:
 * - セレクトボックス: w-24 h-16 text-2xl（大きく見やすく）
 * - ボタン: px-8 py-4 text-2xl + border-2（はっきり強調）
 * - 正解表示: text-2xl〜text-4xl（段階的なサイズ）
 */

export default function Problem2Example() {
  // STATE MANAGEMENT NOTES:
  // - answer: 単一回答（問題1は3つの記号、問題2は1つの数字）
  // - showAnswer: 正解表示状態（問題1例題と同じパターン）
  const [answer, setAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const router = useRouter();

  // EXAMPLE PROBLEM DEFINITION:
  // - 数字列: 0,1,2,3,4,6,7,8,9（5が意図的に欠けている）
  // - 正解: 5
  // - この例題で数字探しのパターンを学習
  const correctAnswer = '5';
  const exampleNumbers = '012346789'; // 5が欠けている

  // ROUTING LOGIC:
  // 例題完了後は問題2本問へ（3段階構成の最終段階）
  // - データ保存は不要（例題のため）
  const handleNext = () => {
    // 問題2ページに遷移
    router.push('/problem2');
  };

  // ANSWER REVEAL FUNCTIONALITY:
  // 問題1例題と同じパターン
  // - 正解表示 + 選択状態更新
  const handleShowAnswer = () => {
    setShowAnswer(true);
    setAnswer(correctAnswer);
  };

  // INPUT CHANGE HANDLER:
  // - 0-9の10択対応（問題1は3択）
  // - 正解表示後は変更不可
  const handleInputChange = (value: string) => {
    if (!showAnswer) {
      setAnswer(value);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      <Card>
        <div className="h-full overflow-y-auto relative" style={{scrollbarWidth: 'thin'}}>
          
          {/* 
            COMPONENTIZATION NOTE - PROBLEM2 EXAMPLE PAGE:
            ProblemTitleコンポーネントを使用してタイトル部分を共通化
            問題1例題ページと同じパターンで統一性を保持
          */}
          <ProblemTitle
            title="れいだい"
            instruction="０からきゅうまでのすうじのうち、ひとつだけたりないすうじをみつけてください"
            additionalInfo="※じかんせいげんはありません"
          />

          {/* 問題と回答エリアを上下に配置 */}
          <div className="flex flex-col gap-8" style={{height: '70%'}}>
            {/* 上: 数字表示エリア */}
            <div className="flex justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800 mb-4">
                  すうじ：
                </div>
                <div className="text-4xl font-bold font-mono text-gray-800 tracking-widest whitespace-nowrap border-2 border-black p-6 bg-white rounded-lg">
                  {exampleNumbers.split('').join('  ')}
                </div>
              </div>
            </div>

            {/* 下: 回答エリア */}
            <div className="flex justify-center">
              <div className="space-y-4 w-80 text-left">
                <div className="flex items-center justify-between p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-gray-800">たりないすうじ:</span>
                  </div>
                  <select
                    value={answer}
                    onChange={(e) => handleInputChange(e.target.value)}
                    disabled={showAnswer}
                    className={`w-24 h-16 text-2xl text-center border-2 border-black rounded-2xl focus:outline-none focus:border-black focus:ring-2 focus:ring-yellow-200 transition-all font-bold shadow-inner ${showAnswer ? 'bg-green-100' : 'bg-white'}`}
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

                {/* 正解表示ボックス（答えるボタン押下後） */}
                {showAnswer && (
                  <div className="flex gap-4 mb-4">
                    <div className="p-3 flex-1">
                      <h3 className="text-2xl font-bold text-blue-800 mb-2 text-center">せいかい</h3>
                      <div className="text-center">
                        <p className="text-4xl font-bold">{correctAnswer}</p>
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
                {!showAnswer && (
                  <div className="text-center mt-6">
                    <button
                      onClick={handleShowAnswer}
                      className="px-8 py-4 rounded-lg text-2xl font-bold transition-colors shadow-md bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-600"
                    >
                      こたえる
                    </button>
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