'use client';

import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';

/**
 * Problem3 Explanation Page (やりかた３)
 * 
 * SYSTEM ARCHITECTURE NOTES:
 * - 問題3の説明ページ（3段階構成の1段階目）
 * - 問題1は2段階、問題2・3は3段階構成を採用
 * - 記憶テストの複雑な手順のため事前説明が必要
 * 
 * PROBLEM TYPE: Memory Test (記憶テスト問題)
 * - 見本10秒表示→カウントダウン5秒→入力30秒の3段階
 * - 9マス（3×3）グリッドでの記憶・再現テスト
 * - 例題3箇所、本問題5箇所の配置記憶
 * 
 * UI/UX DESIGN PHILOSOPHY:
 * - シンプル構成: 余計な装飾を排除
 * - 文字サイズの強弱: メイン説明(text-3xl) > 詳細(text-xl) > 注意書き(text-base)
 * - 左寄せ統一: 読みやすさを重視
 * - 改行対応: 見切れ防止のため適切な位置で改行
 * 
 * TEXT NOTATION RULES:
 * - 数字は算用数字使用: "10びょう", "5びょう", "30びょう"
 * - ひらがな + 算用数字の組み合わせで統一
 * - この表記ルールは全ページで一貫
 * 
 * ROUTING FLOW:
 * - 前: problem2（問題2本問）
 * - 次: problem3-example（問題3例題）
 * 
 * FUTURE EXPANSION NOTES:
 * - 複雑な問題形式では3段階構成を継続
 * - 説明内容は先方指定により変更可能
 */

export default function Problem3Explanation() {
  const router = useRouter();

  // ROUTING LOGIC:
  // 説明完了後は例題ページへ（3段階構成の2段階目）
  // - データ保存は不要（説明ページのため）
  const handleNext = () => {
    // 問題3の例題ページに遷移
    router.push('/problem3-example');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      <Card>
        <div className="h-full overflow-y-auto relative" style={{scrollbarWidth: 'thin'}}>
          {/* 
            COMPONENTIZATION NOTE - PROBLEM3 EXPLANATION PAGE:
            ProblemTitleコンポーネントを使用してタイトル部分を共通化
            問題2説明ページと同じパターンで統一性を保持
          */}
          <ProblemTitle
            title="もんだい３のやりかた"
            instruction=""
          />

          {/* 説明内容エリア */}
          <div className="flex items-center justify-center h-3/4">
            <div className="max-w-4xl">
              <div className="space-y-8 text-left">
                
                <div className="text-3xl font-bold text-gray-800 leading-relaxed">
                  ひょうにかいてあるもじやきごうを
                  <br />
                  おぼえてかいとうらんのおなじばしょにかきます。
                </div>
                
                <div className="mt-12 text-left">
                  <div className="text-xl font-bold text-blue-600 leading-relaxed">
                    みほんは10びょうひょうじされます。
                    <br />
                    まず10びょうかんでみほんをおぼえてください。
                  </div>
                </div>
                
                <div className="mt-8 text-left">
                  <div className="text-xl font-bold text-blue-600 leading-relaxed">
                    そのあと5びょうかうんとしたあと
                    <br />
                    ひょうにかきこんでください。
                  </div>
                </div>
                
                <div className="mt-8 text-left">
                  <div className="text-xl font-bold text-red-600 leading-relaxed">
                    かきこむじかんは30びょうです。
                  </div>
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
              <img src="/image/next.png" alt="れいだいへ" className="h-16 w-auto" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}