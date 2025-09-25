'use client';

import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';

/**
 * Problem8 Explanation Page (やりかた８)
 * 
 * SYSTEM ARCHITECTURE NOTES:
 * - 問題8の説明ページ（2段階構成の1段階目）
 * - 問題1・5・6・7は2段階、問題2・3・4は3段階構成、問題8は動画問題で2段階
 * - 動画観察・カウント問題の説明
 * 
 * PROBLEM TYPE: Video Observation Counting (動画観察カウント問題)
 * - 動画を視聴して4つのパレット（黄色、緑、青、水色）に入るボールの数をカウント
 * - 動的な観察・記憶・カウント能力をテスト
 * - 動画1本の観察問題構成
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
 * - 前: problem7（問題7本問）
 * - 次: problem8（問題8本問）※動画観察問題
 * 
 * FUTURE EXPANSION NOTES:
 * - 動画を使用する問題では2段階構成を採用
 * - 説明内容は先方指定により変更可能
 */

export default function Problem8Explanation() {
  const router = useRouter();

  // ROUTING LOGIC:
  // 説明完了後は本問ページに直接遷移（動画観察問題）
  // - データ保存は不要（説明ページのため）
  const handleNext = () => {
    // 問題8の本問ページに直接遷移
    router.push('/problem8');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      <Card>
        <div className="h-full overflow-y-auto relative" style={{scrollbarWidth: 'thin'}}>
          {/* 
            COMPONENTIZATION NOTE - PROBLEM8 EXPLANATION PAGE:
            ProblemTitleコンポーネントを使用してタイトル部分を共通化
            問題7説明ページと同じパターンで統一性を保持
          */}
          <ProblemTitle
            title="もんだい８のやりかた"
            instruction=""
          />

          {/* 説明内容エリア */}
          <div className="flex items-center justify-center h-3/4">
            <div className="max-w-4xl">
              <div className="space-y-8 text-left">
                <div className="text-3xl font-bold text-gray-800 leading-relaxed">
                  ４つの へんに いくつずつ
                  <br />
                  ボールが はいったかを
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
              className="px-10 py-4 rounded-lg text-xl font-bold transition-colors shadow-md bg-blue-500 hover:bg-blue-600 text-white"
            >
              もんだいへ
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}