'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Card from '../../components/Card';
import ProblemTitle from '../../components/ProblemTitle';
import ExplanationContent from '../../components/ExplanationContent';

/**
 * Problem4 Explanation Page (やりかた４)
 * 
 * SYSTEM ARCHITECTURE NOTES:
 * - 問題4の説明ページ（3段階構成の1段階目）
 * - 問題1は2段階、問題2・3・4は3段階構成を採用
 * - ドット数カウント問題の説明
 * 
 * PROBLEM TYPE: Dot Counting (ドット数カウント問題)
 * - 黒丸（●）の数を数えて回答
 * - 視覚的な集中力とカウント能力をテスト
 * - 例題1問、本問題5問の構成
 * 
 * UI/UX DESIGN PHILOSOPHY:
 * - シンプル構成: 余計な装飾を排除
 * - 文字サイズの強弱: メイン説明(text-3xl) > 詳細(text-xl)
 * - 左寄せ統一: 読みやすさを重視
 * - 改行対応: 見切れ防止のため適切な位置で改行
 * 
 * TEXT NOTATION RULES:
 * - ドット表記: ●（黒丸）で統一
 * - ひらがな表記で統一
 * - この表記ルールは全ページで一貫
 * 
 * ROUTING FLOW:
 * - 前: problem3（問題3本問）
 * - 次: problem4-example（問題4例題）
 * 
 * FUTURE EXPANSION NOTES:
 * - 複雑な問題形式では3段階構成を継続
 * - 説明内容は先方指定により変更可能
 */

export default function Problem4Explanation() {
  const router = useRouter();

  // ROUTING LOGIC:
  // 説明完了後は問題4本問へ（練習なし）
  // - データ保存は不要（説明ページのため）
  const handleNext = () => {
    // 問題4本問に直接遷移
    router.push('/problem4');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      <Card>
        {/*
          COMPONENTIZATION NOTE - PROBLEM4 EXPLANATION PAGE:
          ProblemTitleコンポーネントを使用してタイトル部分を共通化
          問題2・3説明ページと同じパターンで統一性を保持
        */}
        <ProblemTitle
          title="もんだい４のやりかた"
          instruction=""
        />

        {/* 説明内容エリア */}
        <ExplanationContent onNext={handleNext}>
            <div className="text-3xl font-bold text-gray-800 leading-relaxed">
              ● のかずを こたえてください。もんだいは ぜんぶで ５もんです。
            </div>

            <div className="mt-4 flex justify-center">
              <Image
                src="/image/4/0reidai.jpg"
                alt="ドット例題"
                width={400}
                height={400}
                className="object-contain border-4 border-black rounded"
              />
            </div>

            <div className="mt-4">
              <div className="text-4xl font-bold text-red-600">
                こたえは４
              </div>
            </div>

            <div className="mt-4">
              <div className="text-2xl font-bold text-blue-600 leading-relaxed">
                （こたえるじかん：５もんで30びょう）
              </div>
            </div>
          </ExplanationContent>
      </Card>
    </div>
  );
}