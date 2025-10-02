'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';
import AnswerButton from '../../components/AnswerButton';

/**
 * Problem6 Main Problem Page (もんだい６)
 * 
 * SYSTEM ARCHITECTURE NOTES:
 * - 問題6の本問ページ（2段階構成の2段階目）
 * - 図形カウント問題・1問・15秒制限
 * - 問題1・2・4・5より短い制限時間
 * 
 * PROBLEM TYPE: Shape Counting Main Problem (図形カウント本問)
 * - 提供された画像1枚から同じ図形を数える
 * - 同じ形・同じ大きさの図形の識別と計数
 * - 制限時間: 15秒（最短制限時間）
 * 
 * TIMER IMPLEMENTATION:
 * - 制限時間: 15秒（他問題より短い）
 * - 1問のみで15秒
 * - 時間切れ時は自動送信
 * 
 * DATA STRUCTURE:
 * - answer: 数値形式（ユーザーの入力数値）
 * - 問題5の文字列形式と異なり数値管理
 * 
 * UI/UX DESIGN:
 * - Card + Background統一パターン
 * - ProblemTitle統一（タイマー表示付き）
 * - 中央に大きく画像表示
 * - 下部に数値入力フィールド配置
 * 
 * DATA PERSISTENCE:
 * - localStorage['problem6Answer']: 数値で保存
 * - localStorage['problem6Time']: タイムスタンプ保存
 * - 結果ページで使用される
 * 
 * ROUTING FLOW:
 * - 前: problem6-explanation（問題6説明）
 * - 次: problem7-explanation（問題7説明ページ）
 * 
 * DESIGN CONSISTENCY NOTES:
 * - タイマー表示: ProblemTitle内で統一
 * - 入力フィールド: 数値入力（1-20の範囲想定）
 * - ボタン: 統一スタイル（入力完了時のみ有効化）
 * 
 * SCORING NOTES:
 * - 完全一致による採点
 * - 正解: 7個（提供画像の図形数）
 * - 具体的な採点ロジックは後で実装
 */

// 制限時間（秒）
const TIMER_DURATION = 15;

export default function Problem6() {
  // TIMER STATE:
  // - 問題6は15秒制限（最短制限時間）
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  
  // ANSWER STATE:
  // - 数値形式: 1問分の回答を数値で管理
  const [answer, setAnswer] = useState<string>('');
  const router = useRouter();

  // DATA SUBMISSION HANDLER:
  // - 数値の回答データを保存
  const handleSubmit = useCallback(() => {
    // ANSWER DATA PROCESSING:
    // - 文字列 → 数値変換（未回答は0）
    const numericAnswer = parseInt(answer) || 0;

    // LOCAL STORAGE PERSISTENCE:
    // - 数値形式で保存
    // - タイムスタンプも同時保存
    localStorage.setItem('problem6Answer', numericAnswer.toString());
    localStorage.setItem('problem6Time', new Date().toISOString());

    // ROUTING TO PROBLEM 7:
    // 問題7説明ページへ遷移
    router.push('/problem7-explanation');
  }, [answer, router]);

  // TIMER CALLBACK WRAPPER:
  const handleFinish = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  // TIMER EFFECT:
  // - 他の問題と同じパターンだが制限時間が15秒
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
  // - 選択式の更新（1-9の範囲）
  const handleSelectionChange = (value: string) => {
    setAnswer(value);
  };

  // COMPLETION VALIDATION:
  // - 回答が入力されているかチェック
  // - 送信ボタンの有効/無効制御
  const isAnswered = answer.trim() !== '';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      <Card>
        <div className="overflow-y-auto h-full">
          {/* 
            COMPONENTIZATION NOTE - PROBLEM6 PAGE:
            ProblemTitleコンポーネントを使用してタイマー表示統一
            問題1・2・3・4・5と同じパターンで統一性を保持
          */}
          <ProblemTitle
            title="もんだい６"
            instruction=""
            additionalInfo={`のこり: ${timeLeft}びょう`}
          />

          {/* メインコンテンツエリア */}
          <div className="flex flex-col items-center space-y-4" style={{height: '75%'}}>
            
            {/* 問題画像エリア */}
            <div className="flex justify-center flex-1 items-center">
              <div className="border-4 border-gray-400 p-4 bg-white rounded-xl shadow-lg">
                <Image
                  src="/image/mondai6.png"
                  alt="問題6"
                  width={450}
                  height={320}
                  className="object-contain rounded-lg"
                />
              </div>
            </div>

            {/* 回答選択エリア - インライン形式 */}
            <div className="flex items-center justify-between gap-12 px-8 pb-2">
              {/* インライン文章形式の回答欄 */}
              <div className="flex items-center space-x-3 text-2xl font-bold text-gray-800">
                <span>おなじかたちで おなじおおきさの ずけい</span>
                <select
                  value={answer}
                  onChange={(e) => handleSelectionChange(e.target.value)}
                  className="w-16 h-12 text-2xl text-center border-3 border-yellow-300 rounded-2xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all font-bold bg-white shadow-inner"
                >
                  <option value="">?</option>
                  {Array.from({length: 9}, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <span>こ</span>
              </div>

              {/* こたえるボタン */}
              <div>
                <AnswerButton
                  onClick={handleSubmit}
                  disabled={!isAnswered}
                  type="text"
                  text="こたえる"
                  className="px-8 py-3 text-xl"
                />
              </div>
            </div>

          </div>
        </div>
      </Card>
    </div>
  );
}