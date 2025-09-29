'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';

/**
 * Example Page for Problem 1 (れいだい１)
 * 
 * SYSTEM ARCHITECTURE NOTES:
 * - これは問題1の例題ページ（2段階構成の1段階目）
 * - 問題2は3段階構成（説明→例題→問題）だが、問題1は2段階構成（例題→問題）
 * - ホームから最初に遷移するのがこのページ
 * 
 * PROBLEM TYPE: Visual Tracking (線つなぎ問題)
 * - 画像: /image/reidai1.png
 * - 3つの記号（★♥▲）から3つの数字（123）への線つなぎ
 * - 正解: ★=2, ♥=1, ▲=3
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
 * SIZE OPTIMIZATION:
 * - ボタンサイズ: px-8 py-4 text-2xl（見やすさ重視）
 * - 正解表示: text-2xl〜text-3xl（はっきり表示）
 * - セレクトボックス: 問題1用の3択仕様
 * 
 * ROUTING FLOW:
 * - 前: ホームページ（名前入力）
 * - 次: problem1（問題1本問）
 * 
 * FUTURE EXPANSION NOTES:
 * - 問題3〜8の例題も同様のパターンで実装予定
 * - 回答エリアは問題形式によって異なる可能性があるため共通化は慎重に
 * - 例題→問題の2段階 or 説明→例題→問題の3段階かは問題によって決める
 */
export default function Example() {
  // STATE MANAGEMENT NOTES:
  // - answers: ユーザーの選択状態を管理（star/heart/triangle）
  // - showAnswers: 正解表示状態（false: 選択中, true: 正解表示中）
  // - このパターンは問題1本問でも同様に使用
  const [answers, setAnswers] = useState({
    star: '',
    heart: '',
    triangle: ''
  });
  const [showAnswers, setShowAnswers] = useState(false);
  const router = useRouter();

  // CORRECT ANSWERS DEFINITION:
  // 問題1の正解パターン（線つなぎの結果）
  // - この値は画像(/image/reidai1.png)の内容と一致している必要がある
  const correctAnswers = {
    star: '2',
    heart: '1', 
    triangle: '3'
  };

  // ROUTING LOGIC:
  // 例題完了後は問題1本問へ遷移
  // - データ保存は不要（例題のため）
  // - 問題1では実際の回答データをlocalStorageに保存
  const handleNext = () => {
    // 問題1ページに遷移
    router.push('/problem1');
  };

  // ANSWER REVEAL FUNCTIONALITY:
  // 「こたえる」ボタン押下時の処理
  // - 正解を表示状態に切り替え
  // - 選択状態も正解に更新（視覚的フィードバック）
  const handleShowAnswers = () => {
    setShowAnswers(true);
    setAnswers(correctAnswers);
  };

  // INPUT CHANGE HANDLER:
  // セレクトボックスの変更処理
  // - 正解表示後は変更不可（disabled対応）
  // - 記号別の状態管理（star/heart/triangle）
  const handleInputChange = (symbol: 'star' | 'heart' | 'triangle', value: string) => {
    if (!showAnswers) {
      setAnswers(prev => ({
        ...prev,
        [symbol]: value
      }));
    }
  };

  // COMPLETION CHECK:
  // 全ての記号に回答が入力されているかチェック
  // - 現在は使用していないが、将来的に完答チェックに使用可能
  // const isAnswerComplete = answers.star && answers.heart && answers.triangle;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      <Card>
        <div className="h-full overflow-y-auto relative" style={{scrollbarWidth: 'thin'}}>
          {/* 
            COMPONENTIZATION NOTE - EXAMPLE PAGE:
            ProblemTitleコンポーネントを使用してタイトル部分を共通化
            
            WHY THIS IS SAFE TO COMPONENTIZE:
            - タイトル + 区切り線 + 説明文は全問題ページで確実に同じパターン
            - additionalInfoプロパティで「時間制限なし」メモを柔軟に追加
            - 8問追加時にも同じパターンで再利用可能
            
            WHAT IS NOT COMPONENTIZED:
            - 回答エリア: 問題によって形式が異なる可能性（問題2は既に違う形式）
            - ボタン動作: 例題は答え表示、問題は送信と機能が異なる
            - レイアウト詳細: 問題ごとにカスタマイズが必要な可能性
          */}
          <ProblemTitle
            title="れんしゅう１"
            instruction="きごうから めだけでせんをたどったさきのすうじをせんたくしてください"
          />

          {/* 画像と回答エリアを横並び */}
          <div className="grid lg:grid-cols-2 gap-6 items-start" style={{height: '70%'}}>
            {/* 左: 問題画像 */}
            <div className="flex justify-center h-full">
              <div className="border-gray-400 p-4 h-full">
                <Image
                  src="/image/reidai1.png"
                  alt="例題"
                  width={500}
                  height={700}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>

            {/* 右: 回答エリア */}
            <div className="h-full flex flex-col justify-end">
              <div className="space-y-4 max-w-sm mx-auto lg:mx-0 border-gray-400 px-6 rounded-xl bg-gray-50">
                <div className="flex items-center justify-between p-4 border-2 border-gray-300 mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl drop-shadow-lg">★</span>
                    <span className="text-lg font-bold text-gray-800">のこたえ:</span>
                  </div>
                  <select
                    value={answers.star}
                    onChange={(e) => handleInputChange('star', e.target.value)}
                    disabled={showAnswers}
                    className={`w-16 h-12 text-xl text-center border-2 border-gray-400 rounded-2xl focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-yellow-200 transition-all font-bold shadow-inner ${showAnswers ? 'bg-green-100' : 'bg-white'}`}
                  >
                    <option value="">?</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border-2 border-gray-300 mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="pl-1 text-4xl drop-shadow-lg">♥</span>
                    <span className="text-lg font-bold text-gray-800">のこたえ:</span>
                  </div>
                  <select
                    value={answers.heart}
                    onChange={(e) => handleInputChange('heart', e.target.value)}
                    disabled={showAnswers}
                    className={`w-16 h-12 text-xl text-center border-2 border-gray-400 rounded-2xl focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-yellow-200 transition-all font-bold shadow-inner ${showAnswers ? 'bg-green-100' : 'bg-white'}`}
                  >
                    <option value="">?</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border-2 border-gray-300 mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl drop-shadow-lg">▲</span>
                    <span className="text-lg font-bold text-gray-800">のこたえ:</span>
                  </div>
                  <select
                    value={answers.triangle}
                    onChange={(e) => handleInputChange('triangle', e.target.value)}
                    disabled={showAnswers}
                    className={`w-16 h-12 text-xl text-center border-2 border-gray-400 rounded-2xl focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-yellow-200 transition-all font-bold shadow-inner ${showAnswers ? 'bg-green-100' : 'bg-white'}`}
                  >
                    <option value="">?</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>

                {/* 正解表示ボックス（答えるボタン押下後） */}
                {showAnswers && (
                  <div className="flex gap-4 mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex-1">
                      <h3 className="text-2xl font-bold text-blue-800 mb-2 text-center">せいかい</h3>
                      <div className="space-y-1 text-center">
                        <p className="text-2xl"><span className="text-3xl">★</span> = 2</p>
                        <p className="text-2xl"><span className="text-3xl">♥</span> = 1</p>
                        <p className="text-2xl"><span className="text-3xl">▲</span> = 3</p>
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
                    <button
                      onClick={handleShowAnswers}
                      className="px-6 py-3 rounded-lg text-lg font-bold transition-colors shadow-md bg-orange-500 hover:bg-orange-600 text-white"
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