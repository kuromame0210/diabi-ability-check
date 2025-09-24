'use client';

import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';

/**
 * Problem2 Explanation Page (やりかたがめん)
 * 
 * SYSTEM ARCHITECTURE NOTES:
 * - 問題2の説明ページ（3段階構成の1段階目）
 * - 問題1は2段階構成（例題→問題）だが、問題2は3段階構成（説明→例題→問題）
 * - この違いは問題の複雑さと形式の違いによるもの
 * 
 * PROBLEM TYPE: Number Search (数字探し問題)
 * - 0から9までの数字から1つだけ欠けている数字を見つける
 * - 問題1の線つなぎ問題とは全く異なる形式
 * - 5問セットで30秒の制限時間
 * 
 * UI/UX DESIGN PHILOSOPHY:
 * - シンプル構成: 余計な枠線や装飾を排除
 * - 文字サイズの強弱: メイン説明(text-3xl) > 制限時間(text-xl) > 注意書き(text-base)
 * - 左寄せ統一: 読みやすさを重視（中央寄せは重要要素のみ）
 * - 改行対応: 見切れ防止のため適切な位置で改行
 * 
 * TEXT NOTATION RULES:
 * - 数字は算用数字使用: "0から9まで", "5もん", "30びょう"
 * - ひらがな + 算用数字の組み合わせで統一
 * - この表記ルールは全ページで一貫
 * 
 * LAYOUT STRUCTURE:
 * - Card内での中央配置（ボックス自体は中央）
 * - 内容は左寄せ（テキスト読みやすさ重視）
 * - ボタンは下部中央（操作しやすい位置）
 * 
 * ROUTING FLOW:
 * - 前: problem1（問題1本問）
 * - 次: problem2-example（問題2例題）
 * 
 * FUTURE EXPANSION NOTES:
 * - 問題3〜8でも同様の3段階構成を採用する可能性
 * - 複雑な問題形式では説明ページを設ける方針
 * - シンプルな問題形式では2段階構成を継続
 */

export default function Problem2Explanation() {
  const router = useRouter();

  // ROUTING LOGIC:
  // 説明完了後は例題ページへ（3段階構成の2段階目）
  // - データ保存は不要（説明ページのため）
  const handleNext = () => {
    // 問題2の例題ページに遷移
    router.push('/problem2-example');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      <Card>
        <div className="h-full overflow-y-auto relative" style={{scrollbarWidth: 'thin'}}>
          {/* 
            COMPONENTIZATION NOTE - PROBLEM2 EXPLANATION PAGE:
            ProblemTitleコンポーネントを使用してタイトル部分を共通化
            例題ページと同じパターンで統一性を保持
          */}
          <ProblemTitle
            title="もんだい２のやりかた"
            instruction=""
          />

          {/* 説明内容エリア */}
          <div className="flex items-center justify-center h-3/4">
            <div className="max-w-4xl">
              <div className="space-y-8 text-left">
                <div className="text-3xl font-bold text-gray-800 leading-relaxed">0から9までの数字がならんでいます。
                  <br />
                  ひとつだけたりない数字をこたえてください
                </div>
                
                <div className="mt-12 text-left">
                  <div className="text-base font-bold text-red-600 leading-relaxed">
                    ※ゆびですうじをなぞらずめだけでみつけてください
                  </div>
                </div>
                
                <div className="mt-8 text-left">
                  <div className="text-xl font-bold text-blue-600 leading-relaxed">
                    せいげんじかんは5もんで30びょうかんです
                  </div>
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
              れいだいへ
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}