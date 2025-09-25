'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';

/**
 * Problem7 Main Problem Page (もんだい７)
 * 
 * SYSTEM ARCHITECTURE NOTES:
 * - 問題7の本問ページ（2段階構成の2段階目）
 * - マークカウント問題・3種類マーク・30秒制限
 * - 複数要素の同時識別・計数問題
 * 
 * PROBLEM TYPE: Mark Counting Main Problem (マークカウント本問)
 * - 提供された画像1枚から3種類のマークを数える
 * - ○（白丸）、◎（二重丸）、●（黒丸）の識別と計数
 * - 制限時間: 30秒
 * 
 * TIMER IMPLEMENTATION:
 * - 制限時間: 30秒（問題2・4・5と同じ）
 * - 3種類マークで30秒
 * - 時間切れ時は自動送信
 * 
 * DATA STRUCTURE:
 * - answers: オブジェクト形式 {circle: '', doubleCircle: '', filledCircle: ''}
 * - 問題1と似た構造だが、3種類のマークを管理
 * 
 * UI/UX DESIGN:
 * - Card + Background統一パターン
 * - ProblemTitle統一（タイマー表示付き）
 * - 上部に大きく画像表示
 * - 下部に3つの入力エリアを横並び配置
 * 
 * DATA PERSISTENCE:
 * - localStorage['problem7Answers']: オブジェクト形式でJSON保存
 * - localStorage['problem7Time']: タイムスタンプ保存
 * - 結果ページで使用される
 * 
 * ROUTING FLOW:
 * - 前: problem7-explanation（問題7説明）
 * - 次: problem8-explanation（問題8説明ページ）
 * 
 * DESIGN CONSISTENCY NOTES:
 * - タイマー表示: ProblemTitle内で統一
 * - 入力フィールド: 数値入力（1-20の範囲想定）
 * - ボタン: 統一スタイル（全入力完了時のみ有効化）
 * 
 * SCORING NOTES:
 * - 部分点あり: 2つ正解で1点、3つ正解で2.5点
 * - 正解: ○=8個、◎=7個、●=8個
 * - 具体的な採点ロジックは後で実装
 */

// 制限時間（秒）
const TIMER_DURATION = 30;

export default function Problem7() {
  // TIMER STATE:
  // - 問題7は30秒制限
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  
  // ANSWER STATE:
  // - オブジェクト形式: 3種類マークの回答をオブジェクトで管理
  const [answers, setAnswers] = useState({
    circle: '',        // ○（白丸）
    doubleCircle: '',  // ◎（二重丸）
    filledCircle: ''   // ●（黒丸）
  });
  const router = useRouter();

  // DATA SUBMISSION HANDLER:
  // - オブジェクト形式の回答データを保存
  const handleSubmit = useCallback(() => {
    // ANSWER DATA PROCESSING:
    // - 文字列 → 数値変換（未回答は0）
    const numericAnswers = {
      circle: parseInt(answers.circle) || 0,
      doubleCircle: parseInt(answers.doubleCircle) || 0,
      filledCircle: parseInt(answers.filledCircle) || 0
    };

    // LOCAL STORAGE PERSISTENCE:
    // - オブジェクト形式でJSON保存
    // - タイムスタンプも同時保存
    localStorage.setItem('problem7Answers', JSON.stringify(numericAnswers));
    localStorage.setItem('problem7Time', new Date().toISOString());

    // ROUTING TO PROBLEM 8:
    // 問題8説明ページへ遷移
    router.push('/problem8-explanation');
  }, [answers, router]);

  // TIMER CALLBACK WRAPPER:
  const handleFinish = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  // TIMER EFFECT:
  // - 他の問題と同じパターン
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

  // SELECTION CHANGE HANDLER:
  // - オブジェクトキーベースの更新（選択式）
  const handleSelectionChange = (markType: keyof typeof answers, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [markType]: value
    }));
  };

  // COMPLETION VALIDATION:
  // - 全3つのマークに回答があるかチェック
  // - 送信ボタンの有効/無効制御
  const isAllAnswered = answers.circle !== '' && answers.doubleCircle !== '' && answers.filledCircle !== '';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      <Card>
        <div className="overflow-y-auto h-full">
          {/* 
            COMPONENTIZATION NOTE - PROBLEM7 PAGE:
            ProblemTitleコンポーネントを使用してタイマー表示統一
            問題1・2・3・4・5・6と同じパターンで統一性を保持
          */}
          <ProblemTitle
            title="もんだい７"
            instruction="それぞれの マークのかずを かぞえて かいてください"
            additionalInfo={`のこり: ${timeLeft}びょう`}
          />

          {/* メインコンテンツエリア */}
          <div className="flex flex-col space-y-6" style={{height: '75%'}}>
            
            {/* 問題画像エリア */}
            <div className="flex justify-center flex-1">
              <div className="border-4 border-gray-400 p-4 bg-white rounded-xl shadow-lg flex items-center">
                <Image
                  src="/image/mondai7.png"
                  alt="問題7"
                  width={600}
                  height={400}
                  className="object-contain rounded-lg"
                />
              </div>
            </div>

            {/* 回答選択エリア */}
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-6 max-w-4xl">
                {/* ○（白丸）の選択 */}
                <div className="border-2 border-gray-300 p-4 rounded-lg bg-white">
                  <div className="text-center space-y-3">
                    <div className="text-4xl font-bold mb-2">○</div>
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <div className={`w-16 h-12 text-2xl text-center border-3 border-yellow-300 rounded-2xl flex items-center justify-center font-bold ${
                        answers.circle ? 'bg-yellow-100' : 'bg-white'
                      }`}>
                        {answers.circle || '?'}
                      </div>
                      <span className="text-lg font-bold text-gray-800">こ</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {Array.from({length: 21}, (_, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectionChange('circle', i.toString())}
                          className={`w-8 h-8 text-sm font-bold rounded transition-colors ${
                            answers.circle === i.toString()
                              ? 'bg-yellow-500 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ◎（二重丸）の選択 */}
                <div className="border-2 border-gray-300 p-4 rounded-lg bg-white">
                  <div className="text-center space-y-3">
                    <div className="text-4xl font-bold mb-2">◎</div>
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <div className={`w-16 h-12 text-2xl text-center border-3 border-yellow-300 rounded-2xl flex items-center justify-center font-bold ${
                        answers.doubleCircle ? 'bg-yellow-100' : 'bg-white'
                      }`}>
                        {answers.doubleCircle || '?'}
                      </div>
                      <span className="text-lg font-bold text-gray-800">こ</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {Array.from({length: 21}, (_, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectionChange('doubleCircle', i.toString())}
                          className={`w-8 h-8 text-sm font-bold rounded transition-colors ${
                            answers.doubleCircle === i.toString()
                              ? 'bg-yellow-500 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ●（黒丸）の選択 */}
                <div className="border-2 border-gray-300 p-4 rounded-lg bg-white">
                  <div className="text-center space-y-3">
                    <div className="text-4xl font-bold mb-2">●</div>
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <div className={`w-16 h-12 text-2xl text-center border-3 border-yellow-300 rounded-2xl flex items-center justify-center font-bold ${
                        answers.filledCircle ? 'bg-yellow-100' : 'bg-white'
                      }`}>
                        {answers.filledCircle || '?'}
                      </div>
                      <span className="text-lg font-bold text-gray-800">こ</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {Array.from({length: 21}, (_, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectionChange('filledCircle', i.toString())}
                          className={`w-8 h-8 text-sm font-bold rounded transition-colors ${
                            answers.filledCircle === i.toString()
                              ? 'bg-yellow-500 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 送信ボタン */}
            <div className="text-center">
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
        </div>
      </Card>
    </div>
  );
}