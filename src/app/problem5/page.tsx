'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';
import AnswerButton from '../../components/AnswerButton';

/**
 * Problem5 Main Problem Page (もんだい５)
 * 
 * SYSTEM ARCHITECTURE NOTES:
 * - 問題5の本問ページ（3段階構成の3段階目）
 * - 文字認識問題・1問・30秒制限
 * - 問題1・2・4と同じタイマー制御パターン
 * 
 * PROBLEM TYPE: Character Recognition Main Problem (文字認識本問)
 * - 提供された画像1枚から文字を認識
 * - 不完全な文字や記号を識別して入力
 * - 制限時間: 30秒
 * 
 * TIMER IMPLEMENTATION:
 * - 制限時間: 30秒（問題2・4と同じ）
 * - 1問のみで30秒
 * - 時間切れ時は自動送信
 * 
 * DATA STRUCTURE:
 * - answer: 文字列形式（ユーザーの入力文字）
 * - 他の問題と異なり単一回答
 * 
 * UI/UX DESIGN:
 * - Card + Background統一パターン
 * - ProblemTitle統一（タイマー表示付き）
 * - 中央に大きく画像表示
 * - 下部に入力フィールド配置
 * 
 * DATA PERSISTENCE:
 * - localStorage['problem5Answer']: 文字列で保存
 * - localStorage['problem5Time']: タイムスタンプ保存
 * - 結果ページで使用される
 * 
 * ROUTING FLOW:
 * - 前: problem5-example（問題5例題）
 * - 次: result（結果ページ）※暫定、後で問題6に変更予定
 * 
 * DESIGN CONSISTENCY NOTES:
 * - タイマー表示: ProblemTitle内で統一
 * - 入力フィールド: テキスト入力
 * - ボタン: 統一スタイル（入力完了時のみ有効化）
 * 
 * SCORING NOTES:
 * - 完全一致による採点を想定
 * - 大文字小文字の区別や記号の扱いは要調整
 * - 具体的な採点ロジックは後で実装
 */

// 制限時間（秒）
const TIMER_DURATION = 30;

export default function Problem5() {
  // TIMER STATE:
  // - 問題5は30秒制限
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  
  // ANSWER STATE:
  // - 文字列形式: 1問分の回答を文字列で管理
  const [answer, setAnswer] = useState<string>('');
  const router = useRouter();

  // DATA SUBMISSION HANDLER:
  // - 文字列の回答データをそのまま保存
  const handleSubmit = useCallback(() => {
    // LOCAL STORAGE PERSISTENCE:
    // - 文字列形式で保存
    // - タイムスタンプも同時保存
    localStorage.setItem('problem5Answer', answer);
    localStorage.setItem('problem5Time', new Date().toISOString());

    // ROUTING TO PROBLEM6:
    // 問題5完了後は問題6説明ページへ
    router.push('/problem6-explanation');
  }, [answer, router]);

  // TIMER CALLBACK WRAPPER:
  const handleFinish = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  // TIMER EFFECT:
  // - 問題2・4と同じパターン
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
  // - テキスト入力の更新
  const handleInputChange = (value: string) => {
    setAnswer(value);
  };

  // COMPLETION VALIDATION:
  // - 回答が入力されているかチェック
  // - 送信ボタンの有効/無効制御
  const isAnswered = answer.trim() !== '';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      <Card>
        <div className="overflow-y-auto h-full">
          {/* 
            COMPONENTIZATION NOTE - PROBLEM5 PAGE:
            ProblemTitleコンポーネントを使用してタイマー表示統一
            問題1・2・3・4と同じパターンで統一性を保持
          */}
          <ProblemTitle
            title="もんだい５"
            instruction=""
            additionalInfo={`のこり: ${timeLeft}びょう`}
          />

          {/* メインコンテンツエリア */}
          <div className="flex flex-col items-center justify-center space-y-8" style={{height: '70%'}}>

            {/* 問題画像エリア */}
            <div className="flex justify-center h-full">
              <div className="border-4 border-gray-400 p-4 bg-white rounded-xl shadow-lg h-full flex items-center">
                <Image
                  src="/image/mondai5.png"
                  alt="問題5"
                  width={1600}
                  height={1200}
                  className="object-contain rounded-lg max-h-full w-auto"
                />
              </div>
            </div>

            {/* 回答入力エリア */}
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center space-x-4">
                <label className="text-2xl font-bold text-gray-800">こたえ:</label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="?"
                  className="w-40 h-16 text-3xl text-center border-3 border-yellow-300 rounded-2xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all font-bold bg-white shadow-inner"
                />
              </div>

              {/* こたえるボタン */}
              <div className="text-center">
                <AnswerButton
                  onClick={handleSubmit}
                  disabled={!isAnswered}
                  type="text"
                  text="こたえる"
                  className="px-10 py-4 text-2xl"
                />
              </div>
            </div>

          </div>
        </div>
      </Card>
    </div>
  );
}