'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';
import { MAIN_PATTERN, INPUT_CANDIDATES, PROBLEM3_TIMERS, PROBLEM3_SCORING } from '../../config/problem3-patterns';

/**
 * Problem3 Main Problem Page (もんだい３)
 * 
 * SYSTEM ARCHITECTURE NOTES:
 * - 問題3の本問題ページ（3段階構成の3段階目）
 * - 例題と同じ3段階フローだが、5箇所配置の記憶テスト
 * - 採点機能付き（3問正解で2.5点満点）
 * 
 * PROBLEM TYPE: Memory Test - Main Problem (記憶テスト本問)
 * - 9マス（3×3）グリッドでの記憶テスト
 * - 本問題パターン: 5箇所配置（3, 6, ○, ♥, 9）
 * - フロー: 10秒表示→5秒カウント→30秒入力
 * 
 * 3-STAGE FLOW IMPLEMENTATION:
 * 1. DISPLAY (10秒): パターン表示
 * 2. COUNTDOWN (5秒): 大きな数字でカウントダウン
 * 3. INPUT (30秒): グリッド入力+候補選択UI
 * 
 * SCORING SYSTEM:
 * - 5箇所中3箇所以上正解で2.5点（満点）
 * - 2箇所以下正解は0点
 * - 正解チェックは位置とパターンの完全一致
 * 
 * UI/UX DESIGN PATTERN:
 * - 段階的な画面遷移（自動・タイマー制御）
 * - 選択状態の視覚化（薄い背景色）
 * - 2段階選択：マス選択→候補選択
 * - 時間終了時は自動的に結果画面へ
 * 
 * DATA STORAGE:
 * - localStorage: problem3_answers（回答データ）
 * - localStorage: problem3_score（採点結果）
 * - localStorage: problem3_time（回答時間記録）
 * 
 * CONFIGURATION:
 * - パターンデータ: /config/problem3-patterns.ts
 * - 採点設定: 同上ファイルで管理
 * - タイマー設定: 同上ファイルで管理
 * 
 * ROUTING FLOW:
 * - 前: problem3-example（問題3例題）
 * - 次: result（結果ページ）
 */

type Stage = 'display' | 'countdown' | 'input';

export default function Problem3() {
  // STAGE MANAGEMENT:
  // 3段階フローの現在段階を管理
  const [stage, setStage] = useState<Stage>('display');
  const [timeLeft, setTimeLeft] = useState(PROBLEM3_TIMERS.DISPLAY_TIME);
  const [countdownNumber, setCountdownNumber] = useState(PROBLEM3_TIMERS.COUNTDOWN_TIME);
  
  // GRID STATE MANAGEMENT:
  // 9マスの入力状態を配列で管理（インデックス0-8）
  const [answers, setAnswers] = useState<string[]>(Array(9).fill(''));
  const [selectedCell, setSelectedCell] = useState<number>(-1);
  
  // TIMING MANAGEMENT:
  // 回答開始時刻を記録（採点データとして保存）
  const [startTime, setStartTime] = useState<number>(0);
  
  const router = useRouter();

  // SUBMISSION HANDLER:
  // 回答完了時の処理（手動完了 or 時間切れ）
  const handleSubmit = useCallback(() => {
    const endTime = Date.now();
    const responseTime = startTime > 0 ? Math.round((endTime - startTime) / 1000) : PROBLEM3_TIMERS.INPUT_TIME;

    // 採点処理
    const result = calculateScore();

    // localStorageに保存
    localStorage.setItem('problem3_answers', JSON.stringify(result.answers));
    localStorage.setItem('problem3_score', result.score.toString());
    localStorage.setItem('problem3_time', responseTime.toString());
    localStorage.setItem('problem3_correct_count', result.correctCount.toString());
    localStorage.setItem('problem3_total_questions', result.totalQuestions.toString());

    // 問題4説明ページへ遷移
    router.push('/problem4-explanation');
  }, [startTime, answers, router]);

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
            setStartTime(Date.now()); // 回答開始時刻を記録
            return 0;
          }
          return prev - 1;
        });
      } else if (stage === 'input') {
        // STAGE 3: 入力時間（30秒）
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // TIME UP: 自動的に採点・保存して結果画面へ
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, handleSubmit]);

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

  // SCORING LOGIC:
  // 回答を採点して結果をlocalStorageに保存
  const calculateScore = () => {
    let correctCount = 0;

    // 空白以外の位置のみを採点対象とする
    for (let i = 0; i < MAIN_PATTERN.length; i++) {
      // 正解パターンが空白でない位置のみチェック
      if (MAIN_PATTERN[i] !== '' && answers[i] === MAIN_PATTERN[i]) {
        correctCount++;
      }
    }

    // 部分点システム：5つ全て正解で2.5点、3つ正解で1点、それ以下は0点
    let score = 0;
    if (correctCount === 5) {
      score = 2.5;
    } else if (correctCount === 3) {
      score = 1;
    } else {
      score = 0;
    }

    return {
      score,
      correctCount,
      totalQuestions: MAIN_PATTERN.filter(item => item !== '').length, // 空白以外の問題数（5つ）
      answers: [...answers],
      correctAnswers: [...MAIN_PATTERN]
    };
  };

  // GRID RENDERING HELPER:
  // 9マスグリッドの表示
  const renderGrid = (pattern: string[], isDisplayMode = false) => {
    // 見本表示の場合はサイズを大きく
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
                title="もんだい３"
                instruction="いかのみほんを10びょうかんおぼえてください"
                additionalInfo={`のこり: ${timeLeft}びょう`}
              />
              
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-black mb-4">みほん</div>
                    {renderGrid(MAIN_PATTERN, true)}
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
                  <div className="text-center mb-4">
                    <div className="text-lg font-bold text-gray-800 mb-3">
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
                    <div className="text-lg font-bold text-gray-800 mb-3">にゅうりょくこうほ</div>
                    <div className="space-y-1">
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
                          onClick={handleSubmit}
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
        </div>
      </Card>
    </div>
  );
}