'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';

/**
 * Problem8 Main Problem Page (もんだい８)
 * 
 * SYSTEM ARCHITECTURE NOTES:
 * - 問題8の本問ページ（2段階構成の2段階目）
 * - 動画観察・カウント問題・4色パレット・30秒制限
 * - 動的観察・記憶・複数要素カウント問題
 * 
 * PROBLEM TYPE: Video Observation Counting Main Problem (動画観察カウント本問)
 * - 提供された動画1本を視聴して4色パレットに入るボールを数える
 * - 黄色、緑、青、水色の4つのパレットへのボール分配を観察
 * - 制限時間: 30秒（問題2・4・5・7と同じ）
 * 
 * TIMER IMPLEMENTATION:
 * - 制限時間: 30秒（標準的な制限時間）
 * - 4色パレットで30秒
 * - 時間切れ時は自動送信
 * 
 * DATA STRUCTURE:
 * - answers: オブジェクト形式 {yellow: '', green: '', blue: '', cyan: ''}
 * - 問題1・7と似た構造だが、4色のパレットを管理
 * 
 * UI/UX DESIGN:
 * - Card + Background統一パターン
 * - ProblemTitle統一（タイマー表示付き）
 * - 上部に動画プレーヤー配置
 * - 下部に4つのカラーパレット入力エリアを配置
 * 
 * DATA PERSISTENCE:
 * - localStorage['problem8Answers']: オブジェクト形式でJSON保存
 * - localStorage['problem8Time']: タイムスタンプ保存
 * - 結果ページで使用される
 * 
 * ROUTING FLOW:
 * - 前: problem8-explanation（問題8説明）
 * - 次: result（結果ページ）※暫定、後で問題9に変更予定
 * 
 * DESIGN CONSISTENCY NOTES:
 * - タイマー表示: ProblemTitle内で統一
 * - 入力フィールド: 数値入力（0-10の範囲想定）
 * - ボタン: 統一スタイル（全入力完了時のみ有効化）
 * 
 * SCORING NOTES:
 * - 完全一致による採点（4つ全て正解で満点）
 * - 正解: 黄色=2個、緑=0個、青=1個、水色=1個
 * - 具体的な採点ロジックは後で実装
 */

// 制限時間（秒）
const TIMER_DURATION = 30;

export default function Problem8() {
  // TIMER STATE:
  // - 問題8は30秒制限
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  
  // ANSWER STATE:
  // - オブジェクト形式: 4色パレットの回答をオブジェクトで管理
  const [answers, setAnswers] = useState({
    yellow: '',  // 黄色パレット
    green: '',   // 緑パレット
    blue: '',    // 青パレット
    cyan: ''     // 水色パレット
  });
  const router = useRouter();

  // DATA SUBMISSION HANDLER:
  // - オブジェクト形式の回答データを保存
  const handleSubmit = useCallback(() => {
    // ANSWER DATA PROCESSING:
    // - 文字列 → 数値変換（未回答は0）
    const numericAnswers = {
      yellow: parseInt(answers.yellow) || 0,
      green: parseInt(answers.green) || 0,
      blue: parseInt(answers.blue) || 0,
      cyan: parseInt(answers.cyan) || 0
    };

    // LOCAL STORAGE PERSISTENCE:
    // - オブジェクト形式でJSON保存
    // - タイムスタンプも同時保存
    localStorage.setItem('problem8Answers', JSON.stringify(numericAnswers));
    localStorage.setItem('problem8Time', new Date().toISOString());

    // ROUTING TO RESULT:
    // 暫定的に結果ページへ（後で問題9に変更予定）
    router.push('/result');
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
  const handleSelectionChange = (colorType: keyof typeof answers, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [colorType]: value
    }));
  };

  // COMPLETION VALIDATION:
  // - 全4つのパレットに回答があるかチェック
  // - 送信ボタンの有効/無効制御
  const isAllAnswered = answers.yellow !== '' && answers.green !== '' && answers.blue !== '' && answers.cyan !== '';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      {/* 固定タイマー表示 */}
      <div className="fixed top-4 right-4 z-50 bg-white border-2 border-gray-400 rounded-lg px-4 py-2 shadow-lg">
        <div className="text-lg font-bold text-red-600">
          のこり: {timeLeft}びょう
        </div>
      </div>

      <Card>
        <div className="overflow-y-auto h-full">
          {/* 
            COMPONENTIZATION NOTE - PROBLEM8 PAGE:
            ProblemTitleコンポーネントを使用してタイマー表示統一
            問題1・2・3・4・5・6・7と同じパターンで統一性を保持
          */}
          <ProblemTitle
            title="もんだい８"
            instruction="４つのへんに ボールが いくつ はいったかを こたえてください。"
          />

          {/* メインコンテンツエリア */}
          <div className="flex flex-col space-y-3" style={{height: '75%'}}>
            
            {/* 動画エリア */}
            <div className="flex justify-center flex-1">
              <div className="border-4 border-gray-400 p-4 bg-white rounded-xl shadow-lg flex items-center">
                <video
                  src="/image/media1.mp4"
                  width={400}
                  height={280}
                  controls
                  autoPlay
                  className="object-contain rounded-lg"
                >
                  お使いのブラウザは動画の再生に対応していません。
                </video>
              </div>
            </div>

            {/* 回答入力エリア */}
            <div className="flex justify-center">
              <div className="grid grid-cols-4 gap-3 max-w-4xl w-full">
                {/* 黄色パレットの選択 */}
                <div className="border-2 border-gray-300 p-3 rounded-lg" style={{backgroundColor: '#FFF59D'}}>
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-xl font-bold text-gray-800">A</span>
                      <span className="text-lg font-bold text-gray-800">きいろ</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className={`w-12 h-8 text-lg text-center border-2 border-yellow-300 rounded-lg flex items-center justify-center font-bold ${
                        answers.yellow ? 'bg-yellow-200' : 'bg-white'
                      }`}>
                        {answers.yellow || '?'}
                      </div>
                      <span className="text-sm font-bold text-gray-800">こ</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({length: 11}, (_, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectionChange('yellow', i.toString())}
                          className={`w-10 h-8 text-sm font-bold rounded transition-colors ${
                            answers.yellow === i.toString()
                              ? 'bg-yellow-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 緑パレットの選択 */}
                <div className="border-2 border-gray-300 p-3 rounded-lg" style={{backgroundColor: '#C8E6C9'}}>
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-xl font-bold text-gray-800">B</span>
                      <span className="text-lg font-bold text-gray-800">みどり</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className={`w-12 h-8 text-lg text-center border-2 border-green-300 rounded-lg flex items-center justify-center font-bold ${
                        answers.green ? 'bg-green-200' : 'bg-white'
                      }`}>
                        {answers.green || '?'}
                      </div>
                      <span className="text-sm font-bold text-gray-800">こ</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({length: 11}, (_, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectionChange('green', i.toString())}
                          className={`w-10 h-8 text-sm font-bold rounded transition-colors ${
                            answers.green === i.toString()
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 青パレットの選択 */}
                <div className="border-2 border-gray-300 p-3 rounded-lg" style={{backgroundColor: '#BBDEFB'}}>
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-xl font-bold text-gray-800">C</span>
                      <span className="text-lg font-bold text-gray-800">あお</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className={`w-12 h-8 text-lg text-center border-2 border-blue-300 rounded-lg flex items-center justify-center font-bold ${
                        answers.blue ? 'bg-blue-200' : 'bg-white'
                      }`}>
                        {answers.blue || '?'}
                      </div>
                      <span className="text-sm font-bold text-gray-800">こ</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({length: 11}, (_, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectionChange('blue', i.toString())}
                          className={`w-10 h-8 text-sm font-bold rounded transition-colors ${
                            answers.blue === i.toString()
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 水色パレットの選択 */}
                <div className="border-2 border-gray-300 p-3 rounded-lg" style={{backgroundColor: '#B2EBF2'}}>
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-xl font-bold text-gray-800">D</span>
                      <span className="text-lg font-bold text-gray-800">みずいろ</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className={`w-12 h-8 text-lg text-center border-2 border-cyan-300 rounded-lg flex items-center justify-center font-bold ${
                        answers.cyan ? 'bg-cyan-200' : 'bg-white'
                      }`}>
                        {answers.cyan || '?'}
                      </div>
                      <span className="text-sm font-bold text-gray-800">こ</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({length: 11}, (_, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectionChange('cyan', i.toString())}
                          className={`w-10 h-8 text-sm font-bold rounded transition-colors ${
                            answers.cyan === i.toString()
                              ? 'bg-cyan-600 text-white'
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