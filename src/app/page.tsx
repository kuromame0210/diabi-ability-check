'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Background from '../components/Background';
import SimpleCard from '../components/SimpleCard';

export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();

  // ROUTING LOGIC - START:
  // アプリケーション全体のエントリーポイント
  // - 入力チェック → データ保存 → 例題ページへ遷移
  const handleStart = () => {
    // VALIDATION: 名前入力必須
    if (!name.trim()) {
      alert('なまえをいれてください');
      return;
    }

    // INITIAL DATA PERSISTENCE:
    // - ユーザー名: 結果ページで表示
    // - 開始時刻: 全体の所要時間計算用
    localStorage.setItem('userName', name);
    localStorage.setItem('testStartTime', new Date().toISOString());

    // ROUTING TO FIRST STAGE:
    // 問題1の例題ページへ遷移（2段階構成の1段階目）
    // ※問題2は3段階構成だが、問題1は2段階構成
    router.push('/example');
  };

  // ROUTING LOGIC - RESET:
  // 全データクリア機能
  // - フォーム状態 + localStorage を完全初期化
  const handleReset = () => {
    // UI STATE RESET:
    setName('');

    // COMPLETE DATA CLEANUP:
    // - 基本データ: ユーザー名、開始時刻
    // - 回答データ: 問題1（オブジェクト形式）、問題2（配列形式）
    // - 時刻データ: 各問題の完了時刻
    localStorage.removeItem('userName');
    localStorage.removeItem('problem1Answers');
    localStorage.removeItem('problem2Answers');
    localStorage.removeItem('testStartTime');
    localStorage.removeItem('problem1Time');
    localStorage.removeItem('problem2Time');
  };

  return (
    <Background>
      <div className="bg-white rounded-3xl shadow-lg p-8 relative z-10" style={{width: '70vw', height: '70vh', minWidth: '800px', minHeight: '600px'}}>
        <div className="h-full flex items-center justify-center">
          <div style={{width: '400px', height: '500px'}} className="flex flex-col justify-center p-6 border border-gray-300 rounded-lg relative">
            <img src="/image/title_icon.png" alt="タイトル" className="absolute -top-6 left-1/2 transform -translate-x-1/2 h-24 w-auto z-10" />
            <div className="mb-6 grid items-center gap-0" style={{gridTemplateColumns: '1fr 2fr 1fr'}}>
            <div className="text-right">
              <img src="/image/teacher.png" alt="アイコン" className="w-full h-20 object-contain" />
            </div>
            <div className="text-center whitespace-nowrap">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                アビリティチェック
              </h1>
              <label htmlFor="name-input" className="block text-lg text-gray-800 mb-2 font-bold">
                なまえをいれてください 📝
                <br />
                <span className="text-sm text-gray-600 font-normal">（漢字で入力）</span>
              </label>
            </div>
            <div></div>
          </div>

          <div className="mb-6">
            <input
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="なまえ"
              className="w-full px-4 py-2 text-lg border-2 border-gray-400 rounded-lg text-center focus:outline-none focus:border-gray-600 transition-colors bg-white"
              onKeyPress={(e) => e.key === 'Enter' && handleStart()}
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleStart}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors shadow-md"
            >
              はじめる！
            </button>

            <button
              onClick={handleReset}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-base transition-colors shadow-md"
            >
              リセット
            </button>
          </div>

            <div className="mt-3 text-xs text-pink-600 font-semibold rounded-full py-1 px-3 text-center">
              テストはぜんぶで８もんです
              <br />
              （やく５ふん）
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
}
