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
 * - 問題4の本問ページ（3段階構成の3段階目）
 * - ドット数カウント問題・5問セット・30秒制限
 * - 問題2と同じタイマー制御パターン
 * 
 * PROBLEM TYPE: Dot Counting Main Problem (ドット数カウント本問)
 * - 画像5枚: mondai1.png ～ mondai5.png
 * - 各画像のドット数を入力
 * - 制限時間: 30秒
 * 
 * TIMER IMPLEMENTATION:
 * - 制限時間: 30秒（問題2と同じ）
 * - 5問全体で30秒（1問あたり6秒計算）
 * - 時間切れ時は自動送信
 * 
 * DATA STRUCTURE:
 * - answers: 配列形式（['','','','','']）
 * - 問題2と同じ形式で統一
 * - 数値入力（文字列で管理、送信時に数値変換）
 * 
 * UI/UX DESIGN:
 * - Card + Background統一パターン
 * - ProblemTitle左寄せ統一
 * - 5問同時表示（スクロール対応）
 * - 各問題にナンバリング表示
 * - 数値入力フィールド使用
 * 
 * DATA PERSISTENCE:
 * - localStorage['problem4Answers']: 配列形式でJSON保存
 * - localStorage['problem4Time']: タイムスタンプ保存
 * - 結果ページで使用される
 * 
 * ROUTING FLOW:
 * - 前: problem4-example（問題4例題）
 * - 次: result（結果ページ）※暫定、後で問題5に変更予定
 * 
 * DESIGN CONSISTENCY NOTES:
 * - タイマー表示: 問題1・2と同じスタイル（右上、赤背景）
 * - 入力フィールド: 数値入力専用
 * - ボタン: 統一スタイル（完答時のみ有効化）
 * 
 * SCORING NOTES:
 * - 正解数による段階的採点を想定
 * - 5問満点、3問以上で部分点のパターン予想
 * - 具体的な採点ロジックは後で実装
 */

// 制限時間（秒）
const TIMER_DURATION = 30;

export default function Problem4() {
  // TIMER STATE:
  // - 問題4は30秒制限（問題2と同じ制限時間）
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  
  // ANSWER STATE:
  // - 配列形式: 5問分の回答を配列で管理
  // - 初期値: 空文字列5つの配列
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);
  const router = useRouter();

  // 問題画像のパス配列
  const problemImages = [
    '/image/4/mondai1.png',
    '/image/4/mondai2.png',
    '/image/4/mondai3.png',
    '/image/4/mondai4.png',
    '/image/4/mondai5.png'
  ];

  // DATA SUBMISSION HANDLER:
  // - 配列形式の回答データを数値配列に変換
  // - 結果ページでの計算処理に対応
  const handleSubmit = useCallback(() => {
    // ANSWER DATA PROCESSING:
    // - 文字列配列 → 数値配列変換
    // - 未回答は0にフォールバック
    const numericAnswers = answers.map(answer => parseInt(answer) || 0);

    // LOCAL STORAGE PERSISTENCE:
    // - JSON配列形式で保存
    // - タイムスタンプも同時保存
    localStorage.setItem('problem4Answers', JSON.stringify(numericAnswers));
    localStorage.setItem('problem4Time', new Date().toISOString());

    // ROUTING TO PROBLEM5:
    // 問題4完了後は問題5説明ページへ
    router.push('/problem5-explanation');
  }, [answers, router]);

  // TIMER CALLBACK WRAPPER:
  const handleFinish = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  // TIMER EFFECT:
  // - 問題2と同じパターン
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
  // - セレクトボックス形式（1-8の範囲）
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
            COMPONENTIZATION NOTE - PROBLEM4 PAGE:
            ProblemTitleコンポーネントを使用してタイトル部分を共通化
            問題2・3と同じパターンで統一性を保持
          */}
          <ProblemTitle
            title="もんだい４"
            instruction="ドット（●＝くろまる）のかずをこたえてください"
            additionalInfo={`のこり: ${timeLeft}びょう`}
          />

          {/* 5問を横並び表示（2行×3列レイアウト） */}
          <div className="grid grid-cols-3 gap-4 max-w-6xl mx-auto">
            {problemImages.map((imagePath, index) => (
              <div key={index} className="border-2 border-gray-300 p-3 bg-white rounded-lg">
                <div className="flex flex-col items-center space-y-3">
                  {/* 問題番号 */}
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-800">
                      {index + 1}
                    </h3>
                  </div>

                  {/* 画像表示エリア */}
                  <div className="flex justify-center">
                    <div className="border-2 border-gray-400 p-2 bg-white rounded-lg">
                      <Image
                        src={imagePath}
                        alt={`問題${index + 1}`}
                        width={150}
                        height={150}
                        className="object-contain rounded-lg"
                      />
                    </div>
                  </div>

                  {/* 回答エリア */}
                  <div className="flex flex-col items-center space-y-2">
                    <label className="text-sm font-bold text-gray-800">ドットのかず</label>
                    <select
                      value={answers[index]}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      className="w-16 h-10 text-xl text-center border-3 border-yellow-300 rounded-2xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all font-bold bg-white shadow-inner"
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
                </div>
              </div>
            ))}
          </div>

          {/* 送信ボタン */}
          <div className="text-center mt-6">
            <button
              onClick={handleSubmit}
              disabled={!isAllAnswered}
              className={`px-12 py-4 rounded-lg text-xl font-bold transition-colors shadow-md ${
                isAllAnswered
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              かいとうする！
            </button>
          </div>

        </div>
      </Card>
    </div>
  );
}