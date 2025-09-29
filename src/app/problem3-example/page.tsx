'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';
import { EXAMPLE_PATTERN, INPUT_CANDIDATES, PROBLEM3_TIMERS } from '../../config/problem3-patterns';

/**
 * Problem3 Example Page (れいだい３)
 * 
 * SYSTEM ARCHITECTURE NOTES:
 * - 問題3の例題ページ（3段階構成の2段階目）
 * - 見本表示→カウントダウン→入力の3段階フローを実装
 * - 問題1・2例題と同じ答え表示機能を実装
 * 
 * PROBLEM TYPE: Memory Test (記憶テスト問題)
 * - 9マス（3×3）グリッドでの記憶テスト
 * - 例題パターン: 3箇所配置（2, △, 4）
 * - フロー: 10秒表示→5秒カウント→30秒入力
 * 
 * 3-STAGE FLOW IMPLEMENTATION:
 * 1. DISPLAY (10秒): パターン表示
 * 2. COUNTDOWN (5秒): 大きな数字でカウントダウン
 * 3. INPUT (30秒): グリッド入力+候補選択UI
 * 
 * UI/UX DESIGN PATTERN:
 * - 段階的な画面遷移（自動・タイマー制御）
 * - 選択状態の視覚化（薄い背景色）
 * - 2段階選択：マス選択→候補選択
 * - 答え表示機能（例題のため）
 * 
 * LAYOUT PHILOSOPHY:
 * - 9マスグリッド: 中央配置（重要要素）
 * - 入力候補: グリッド形式で見やすく
 * - 選択フィードバック: 背景色で明確に
 * 
 * CONFIGURATION:
 * - パターンデータ: /config/problem3-patterns.ts
 * - タイマー設定: 同上ファイルで管理
 * - 候補データ: 同上ファイルで管理
 * 
 * ROUTING FLOW:
 * - 前: problem3-explanation（問題3説明）
 * - 次: problem3（問題3本問）
 */

type Stage = 'display' | 'countdown' | 'input' | 'result';

export default function Problem3Example() {
  // STAGE MANAGEMENT:
  // 3段階フローの現在段階を管理
  const [stage, setStage] = useState<Stage>('display');
  const [timeLeft, setTimeLeft] = useState(PROBLEM3_TIMERS.DISPLAY_TIME);
  const [countdownNumber, setCountdownNumber] = useState(PROBLEM3_TIMERS.COUNTDOWN_TIME);
  
  // GRID STATE MANAGEMENT:
  // 9マスの入力状態を配列で管理（インデックス0-8）
  const [answers, setAnswers] = useState<string[]>(Array(9).fill(''));
  const [selectedCell, setSelectedCell] = useState<number>(-1);
  const [showAnswers, setShowAnswers] = useState(false);
  // ユーザーの元の回答を保持（正解表示後も表示するため）
  const [originalAnswers, setOriginalAnswers] = useState<string[]>(Array(9).fill(''));
  
  const router = useRouter();

  // TIMER EFFECT:
  // 各段階のタイマー制御
  useEffect(() => {
    const timer = setInterval(() => {
      if (stage === 'display') {
        // STAGE 1: 見本表示（10秒）
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStage('countdown');
            setCountdownNumber(PROBLEM3_TIMERS.COUNTDOWN_TIME);
            return 0;
          }
          return prev - 1;
        });
      } else if (stage === 'countdown') {
        // STAGE 2: カウントダウン（5秒）
        setCountdownNumber((prev) => {
          if (prev <= 1) {
            setStage('input');
            setTimeLeft(PROBLEM3_TIMERS.INPUT_TIME);
            return 0;
          }
          return prev - 1;
        });
      } else if (stage === 'input') {
        // STAGE 3: 入力時間（30秒）
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // TIME UP: 自動的に結果表示段階へ
            setStage('result');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [stage]);

  // CELL SELECTION HANDLER:
  // 9マスのうちどのマスを選択中かを管理
  const handleCellClick = (index: number) => {
    setSelectedCell(index);
  };

  // CANDIDATE SELECTION HANDLER:
  // 選択中のマスに候補を入力
  const handleCandidateClick = (candidate: string) => {
    if (selectedCell >= 0) {
      const newAnswers = [...answers];
      newAnswers[selectedCell] = candidate;
      setAnswers(newAnswers);
      setSelectedCell(-1); // 選択解除
    }
  };

  // CANCEL HANDLER:
  // 選択中のマスの入力を削除
  const handleCancel = () => {
    if (selectedCell >= 0) {
      const newAnswers = [...answers];
      newAnswers[selectedCell] = '';
      setAnswers(newAnswers);
      setSelectedCell(-1); // 選択解除
    }
  };

  // ANSWER REVEAL FUNCTIONALITY:
  // 例題のため正解を表示
  const handleShowAnswers = () => {
    setOriginalAnswers([...answers]); // ユーザーの回答を保存
    setShowAnswers(true);
  };

  // ROUTING LOGIC:
  // 例題完了後は問題3本問へ遷移
  const handleNext = () => {
    router.push('/problem3');
  };

  // GRID RENDERING HELPER:
  // 9マスグリッドの表示
  const renderGrid = (pattern: string[], isDisplayMode = false) => {
    // 見本表示の場合はサイズを大きく、でも横並び対応のため適度なサイズに
    const gridSize = isDisplayMode ? 'w-96' : 'w-72';
    const cellSize = isDisplayMode ? 'w-28 h-28' : 'w-20 h-20';
    const fontSize = isDisplayMode ? 'text-4xl' : 'text-2xl';
    
    return (
      <div className={`grid grid-cols-3 gap-2 ${gridSize} mx-auto`}>
        {pattern.map((item, index) => (
          <div
            key={index}
            onClick={() => !isDisplayMode && handleCellClick(index)}
            className={`
              ${cellSize} border-2 border-black rounded-lg 
              flex items-center justify-center
              ${fontSize} font-bold
              ${!isDisplayMode ? 'cursor-pointer' : ''}
              ${selectedCell === index ? 'bg-blue-200' : 'bg-white'}
              ${isDisplayMode ? '' : 'hover:bg-gray-100'}
            `}
          >
            {item}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      <Card>
        <div className="h-full flex flex-col">
          
          {stage === 'display' && (
            <>
              {/* STAGE 1: 見本表示 */}
              <ProblemTitle
                title="れんしゅう３"
                instruction="いかのみほんを10びょうかんおぼえてください"
              />
              
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="text-xl font-bold text-blue-600 mb-4">みほん</div>
                    {renderGrid(EXAMPLE_PATTERN, true)}
                  </div>
                </div>
              </div>
            </>
          )}

          {stage === 'countdown' && (
            <>
              {/* STAGE 2: カウントダウン */}
              <ProblemTitle
                title="じゅんび"
                instruction="もうすぐにゅうりょくがはじまります"
              />
              
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[12rem] font-bold text-black mb-4">
                    {countdownNumber}
                  </div>
                </div>
              </div>
            </>
          )}

          {stage === 'input' && (
            <>
              {/* STAGE 3: 入力段階 */}
              <ProblemTitle
                title="にゅうりょく"
                instruction="おぼえたとおりににゅうりょくしてください"
                additionalInfo={`のこり: ${timeLeft}びょう`}
              />
              
              <div className="flex-1 flex flex-col">
                {/* 入力グリッド */}
                <div className="text-center mb-6">
                  <div className="text-lg font-bold text-gray-800 mb-4">
                    ますをせんたくしてから、もじをせんたくしてください
                    <br />
                    <span className="text-sm font-normal text-red-600">
                      ※まちがえたときは、わくをえらんで
                      <img src="/image/torikeshi.png" alt="とりけしボタン" className="w-8 h-8 inline mx-1" />
                      をおします
                    </span>
                  </div>
                  {renderGrid(answers)}
                </div>

                {/* 入力候補 */}
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800 mb-4">にゅうりょくこうほ</div>
                  <div className="space-y-2">
                    {/* 数字候補（1行目） */}
                    <div className="flex gap-2 justify-center items-center">
                      {INPUT_CANDIDATES.slice(0, 10).map((candidate, index) => (
                        <button
                          key={index}
                          onClick={() => handleCandidateClick(candidate)}
                          className="w-12 h-12 border-2 border-gray-400 rounded-lg bg-white hover:bg-gray-100 text-lg font-bold transition-colors"
                        >
                          {candidate}
                        </button>
                      ))}
                    </div>
                    {/* マーク候補（2行目） */}
                    <div className="flex gap-2 justify-center items-center">
                      {INPUT_CANDIDATES.slice(10, 20).map((candidate, index) => (
                        <button
                          key={index + 10}
                          onClick={() => handleCandidateClick(candidate)}
                          className="w-12 h-12 border-2 border-gray-400 rounded-lg bg-white hover:bg-gray-100 text-lg font-bold transition-colors"
                        >
                          {candidate}
                        </button>
                      ))}
                    </div>
                    {/* 取り消しボタンと回答ボタン */}
                    <div className="flex justify-center items-center gap-6 mt-2">
                      <button
                        onClick={handleCancel}
                        disabled={selectedCell < 0}
                        className="transition-transform hover:scale-105"
                      >
                        <img
                          src="/image/torikeshi.png"
                          alt="とりけし"
                          className={`w-12 h-12 ${selectedCell >= 0 ? 'opacity-100' : 'opacity-50'} ${selectedCell < 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        />
                      </button>
                      <button
                        onClick={() => setStage('result')}
                        className="px-6 py-3 rounded-lg text-xl font-bold transition-colors shadow-md bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-600"
                      >
                        かいとう
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {stage === 'result' && (
            <>
              {/* STAGE 4: 結果表示（例題のため正解表示） */}
              <ProblemTitle
                title="けっか"
                instruction=""
              />
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-center">
                  {!showAnswers && (
                    <div className="mb-6">
                      <div className="text-xl font-bold text-gray-800 mb-4">あなたのこたえ</div>
                      {renderGrid(answers, true)}
                    </div>
                  )}
                  
                  {!showAnswers ? (
                    <button
                      onClick={handleShowAnswers}
                      className="px-8 py-4 rounded-lg text-xl font-bold transition-colors shadow-md bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      せいかいをみる
                    </button>
                  ) : (
                    <div>
                      {/* 正解を横並びで表示 */}
                      <div className="flex gap-8 justify-center mb-6">
                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-800 mb-4">あなたのこたえ</div>
                          {renderGrid(originalAnswers, true)}
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-800 mb-4">せいかい</div>
                          {renderGrid(EXAMPLE_PATTERN, true)}
                        </div>
                      </div>
                      <button
                        onClick={handleNext}
                        className="transition-transform hover:scale-105"
                      >
                        <img src="/image/next.png" alt="つぎへ" className="h-16 w-auto" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}