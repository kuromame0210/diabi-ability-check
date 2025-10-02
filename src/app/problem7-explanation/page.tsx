'use client';

import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';
import ExplanationContent from '../../components/ExplanationContent';

/**
 * Problem7 Explanation Page (やりかた７)
 * 
 * SYSTEM ARCHITECTURE NOTES:
 * - 問題7の説明ページ（2段階構成の1段階目）
 * - 問題1・5・6は2段階、問題2・3・4は3段階構成、問題7は例題なしで2段階
 * - マークカウント問題の説明
 * 
 * PROBLEM TYPE: Mark Counting (マークカウント問題)
 * - 3種類のマーク（○、◎、●）の数をそれぞれ数える
 * - 複数の異なる図形を同時に識別・計数する能力をテスト
 * - 例題なし、本問題1問（30秒制限）の構成
 * 
 * UI/UX DESIGN PHILOSOPHY:
 * - シンプル構成: 余計な装飾を排除
 * - 文字サイズの強弱: メイン説明(text-3xl) > 詳細(text-xl)
 * - 左寄せ統一: 読みやすさを重視
 * - 改行対応: 見切れ防止のため適切な位置で改行
 * 
 * TEXT NOTATION RULES:
 * - ひらがな表記で統一
 * - この表記ルールは全ページで一貫
 * 
 * ROUTING FLOW:
 * - 前: problem6（問題6本問）
 * - 次: problem7（問題7本問）※例題なし
 * 
 * FUTURE EXPANSION NOTES:
 * - 複数要素を同時カウントする問題では2段階構成を採用
 * - 説明内容は先方指定により変更可能
 */

export default function Problem7Explanation() {
  const router = useRouter();

  // ROUTING LOGIC:
  // 説明完了後は本問ページに直接遷移（例題なし）
  // - データ保存は不要（説明ページのため）
  const handleNext = () => {
    // 問題7の本問ページに直接遷移
    router.push('/problem7');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      <Card>
        <div className="h-full overflow-y-auto relative" style={{scrollbarWidth: 'thin'}}>
          {/* 
            COMPONENTIZATION NOTE - PROBLEM7 EXPLANATION PAGE:
            ProblemTitleコンポーネントを使用してタイトル部分を共通化
            問題6説明ページと同じパターンで統一性を保持
          */}
          <ProblemTitle
            title="もんだい７のやりかた"
            instruction=""
          />

          {/* 説明内容エリア */}
          <ExplanationContent onNext={handleNext}>
            <div className="text-3xl font-bold text-gray-800 leading-relaxed">
              それぞれの きごうのかずを かぞえて こたえてください。
            </div>

            <div className="text-2xl font-bold text-blue-600 leading-relaxed">
              （こたえるじかん：30びょう）
            </div>
          </ExplanationContent>
        </div>
      </Card>
    </div>
  );
}