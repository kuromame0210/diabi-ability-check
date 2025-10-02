'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';

/**
 * Problem4 Main Problem Page (もんだい４)
 *
 * SYSTEM ARCHITECTURE NOTES:
 * - 問題4の本問ページ（3段階×5問の順次表示）
 * - ドット数カウント問題・5問セット
 * - 各問題で3段階フロー：カウントダウン→表示→入力
 *
 * PROBLEM TYPE: Dot Counting Sequential Display (ドット数カウント順次表示)
 * - 画像5枚: mondai1.png ～ mondai5.png
 * - 各画像のドット数を入力
 * - 3段階フロー：3秒カウント→1秒表示→入力
 *
 * 3-STAGE FLOW PER QUESTION:
 * 1. COUNTDOWN (3秒): 大きな数字でカウントダウン
 * 2. DISPLAY (1秒): 画像表示
 * 3. INPUT: 回答入力（制限時間なし）
 *
 * SEQUENTIAL PROCESSING:
 * - currentQuestion: 0-4の問題インデックス
 * - stage: 'countdown' | 'display' | 'input'
 * - 5問完了後に結果画面へ遷移
 *
 * DATA STRUCTURE:
 * - answers: 配列形式（['','','','','']）
 * - 数値入力（文字列で管理、送信時に数値変換）
 *
 * UI/UX DESIGN:
 * - 1問ずつの順次表示
 * - 問題番号の明確表示
 * - カウントダウンは大きな数字で表示
 *
 * DATA PERSISTENCE:
 * - localStorage['problem4Answers']: 配列形式でJSON保存
 * - localStorage['problem4Time']: タイムスタンプ保存
 *
 * ROUTING FLOW:
 * - 前: problem4-example（問題4例題）
 * - 次: problem5-explanation（問題5説明）
 */

type Stage = 'countdown' | 'display' | 'input';

export default function Problem4() {
  // SEQUENTIAL QUESTION STATE:
  const [currentQuestion, setCurrentQuestion] = useState(0); // 0-4の問題番号
  const [stage, setStage] = useState<Stage>('countdown');
  const [countdownNumber, setCountdownNumber] = useState(3);

  // ANSWER STATE:
  // - 配列形式: 5問分の回答を配列で管理
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);
  const [currentAnswer, setCurrentAnswer] = useState('');

  // TIMER STATE: 各問題ごとに30秒
  const [timeLeft, setTimeLeft] = useState(30); // 各問題ごとに30秒制限

  const router = useRouter();

  // 問題画像のパス配列
  const problemImages = [
    '/image/4/1.jpg',
    '/image/4/2.jpg',
    '/image/4/3.jpg',
    '/image/4/4.jpg',
    '/image/4/5.jpg'
  ];


  // STAGE PROGRESSION HANDLER:
  const proceedToNextStage = useCallback(() => {
    if (stage === 'countdown') {
      setStage('display');
    } else if (stage === 'display') {
      setStage('input');
    } else if (stage === 'input') {
      // Save current answer
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = currentAnswer;
      setAnswers(newAnswers);
      setCurrentAnswer('');

      // Move to next question or finish
      if (currentQuestion < 4) {
        setCurrentQuestion(currentQuestion + 1);
        setStage('countdown');
        setCountdownNumber(3);
        setTimeLeft(30); // 次の問題用にタイマーリセット
      } else {
        // All questions completed
        const finalAnswers = [...newAnswers];
        const numericAnswers = finalAnswers.map(answer => parseInt(answer) || 0);
        localStorage.setItem('problem4Answers', JSON.stringify(numericAnswers));
        localStorage.setItem('problem4Time', new Date().toISOString());
        router.push('/problem5-explanation');
      }
    }
  }, [stage, currentQuestion, answers, currentAnswer, router]);

  // TIMER EFFECT: 各問題ごとのタイマー（inputステージでのみカウントダウン）
  useEffect(() => {
    if (stage !== 'input') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // 時間切れ: 現在の回答を保存して次の問題へ
          const newAnswers = [...answers];
          newAnswers[currentQuestion] = currentAnswer;
          setAnswers(newAnswers);
          setCurrentAnswer('');

          if (currentQuestion < 4) {
            // 次の問題へ
            setCurrentQuestion(currentQuestion + 1);
            setStage('countdown');
            setCountdownNumber(3);
            setTimeLeft(30); // タイマーリセット
          } else {
            // 5問完了
            const finalAnswers = [...newAnswers];
            const numericAnswers = finalAnswers.map(answer => parseInt(answer) || 0);
            localStorage.setItem('problem4Answers', JSON.stringify(numericAnswers));
            localStorage.setItem('problem4Time', new Date().toISOString());
            router.push('/problem5-explanation');
          }
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, answers, currentAnswer, currentQuestion, router]);

  // STAGE TIMER EFFECT:
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (stage === 'countdown') {
      timer = setInterval(() => {
        setCountdownNumber((prev) => {
          if (prev <= 1) {
            setStage('display');
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (stage === 'display') {
      timer = setTimeout(() => {
        setStage('input');
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (timer) clearTimeout(timer);
    };
  }, [stage]);

  // INPUT CHANGE HANDLER:
  // - 現在の問題の回答を更新
  // - セレクトボックス形式（1-8の範囲）
  const handleInputChange = (value: string) => {
    setCurrentAnswer(value);
  };


  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      <Card>
        <div className="h-full flex flex-col">

          {stage === 'countdown' && (
            <>
              {/* STAGE 1: カウントダウン */}
              <ProblemTitle
                title={`もんだい４ (${currentQuestion + 1}/5)`}
                instruction="● のかずを こたえてください。もんだいは ぜんぶで ５もんです。"
                additionalInfo={`のこり: ${timeLeft}びょう`}
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

          {stage === 'display' && (
            <>
              {/* STAGE 2: 画像表示（タイトルなし） */}

              <div className="flex-1 flex items-center justify-center bg-gray-100">
                <div className="text-center h-full w-full flex items-center justify-center">
                  <div className="border-2 border-gray-400 p-4 bg-gray-100 rounded-lg max-h-full max-w-full">
                    <Image
                      src={problemImages[currentQuestion]}
                      alt={`問題${currentQuestion + 1}`}
                      width={800}
                      height={800}
                      className="object-contain rounded-lg max-h-[70vh] max-w-full w-auto h-auto"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {stage === 'input' && (
            <>
              {/* STAGE 3: 回答入力 */}
              <ProblemTitle
                title={`もんだい４ (${currentQuestion + 1}/5)`}
                instruction="● のかずを こたえてください。もんだいは ぜんぶで ５もんです。"
                additionalInfo={`のこり: ${timeLeft}びょう`}
              />

              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="text-xl font-bold text-gray-800">●のかず</div>
                  <select
                    value={currentAnswer}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-20 h-16 text-3xl text-center border-3 border-yellow-300 rounded-2xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all font-bold bg-white shadow-inner"
                  >
                    <option value="">?</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>

                  <div className="mt-6">
                    <button
                      onClick={() => {
                        // 手動で次の問題へ
                        const newAnswers = [...answers];
                        newAnswers[currentQuestion] = currentAnswer;
                        setAnswers(newAnswers);
                        setCurrentAnswer('');

                        if (currentQuestion < 4) {
                          setCurrentQuestion(currentQuestion + 1);
                          setStage('countdown');
                          setCountdownNumber(3);
                          setTimeLeft(30); // 次の問題用にタイマーリセット
                        } else {
                          // 5問完了
                          const finalAnswers = [...newAnswers];
                          const numericAnswers = finalAnswers.map(answer => parseInt(answer) || 0);
                          localStorage.setItem('problem4Answers', JSON.stringify(numericAnswers));
                          localStorage.setItem('problem4Time', new Date().toISOString());
                          router.push('/problem5-explanation');
                        }
                      }}
                      disabled={!currentAnswer}
                      className="transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <img
                        src="/image/next.png"
                        alt={currentQuestion < 4 ? 'つぎへ' : 'かんりょう'}
                        className="h-16 w-auto"
                      />
                    </button>
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