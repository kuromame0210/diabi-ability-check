'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';
import Problem1Layout from '../../components/Problem1Layout';

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

          <Problem1Layout
            imageSrc="/image/reidai1.png"
            imageAlt="例題"
            answers={answers}
            onAnswerChange={handleInputChange}
            onSubmit={handleShowAnswers}
            showAnswers={showAnswers}
            correctAnswers={correctAnswers}
            onNext={handleNext}
          />
        </div>
      </Card>
    </div>
  );
}