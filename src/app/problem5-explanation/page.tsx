'use client';

import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';

/**
 * Problem5 Explanation Page (やりかた５)
 * 
 * SYSTEM ARCHITECTURE NOTES:
 * - 問題5の説明ページ（3段階構成の1段階目）
 * - 問題1は2段階、問題2・3・4・5は3段階構成を採用
 * - 文字認識問題の説明
 * 
 * PROBLEM TYPE: Character Recognition (文字認識問題)
 * - 不完全な文字や記号を認識して回答
 * - 視覚的な認知力と文字識別能力をテスト
 * - 例題1問、本問題1問（30秒制限）の構成
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
 * - 前: problem4（問題4本問）
 * - 次: problem5-example（問題5例題）
 * 
 * FUTURE EXPANSION NOTES:
 * - 複雑な問題形式では3段階構成を継続
 * - 説明内容は先方指定により変更可能
 */

export default function Problem5Explanation() {
  const router = useRouter();

  // ROUTING LOGIC:
  // 説明完了後は例題ページへ（3段階構成の2段階目）
  // - データ保存は不要（説明ページのため）
  const handleNext = () => {
    // 問題5の本問ページに直接遷移（例題なし）
    router.push('/problem5');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      <Card>
        <div className="h-full overflow-y-auto relative" style={{scrollbarWidth: 'thin'}}>
          {/* 
            COMPONENTIZATION NOTE - PROBLEM5 EXPLANATION PAGE:
            ProblemTitleコンポーネントを使用してタイトル部分を共通化
            問題2・3・4説明ページと同じパターンで統一性を保持
          */}
          <ProblemTitle
            title="もんだい５のやりかた"
            instruction=""
          />

          {/* 説明内容エリア */}
          <div className="flex items-center justify-center h-3/4">
            <div className="max-w-4xl">
              <div className="space-y-8 text-center">
                <div className="text-3xl font-bold text-gray-800 leading-relaxed">
                  なんというもじがかいてあるかを
                  <br />
                  こたえてください
                </div>

              </div>
            </div>
          </div>

          {/* 次へボタン */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button
              onClick={handleNext}
              className="transition-transform hover:scale-105"
            >
              <img src="/image/next.png" alt="もんだいへ" className="h-16 w-auto" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}