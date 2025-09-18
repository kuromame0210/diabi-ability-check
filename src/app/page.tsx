'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleStart = () => {
    if (!name.trim()) {
      alert('なまえをいれてください');
      return;
    }

    // 名前をローカルストレージに保存
    localStorage.setItem('userName', name);
    localStorage.setItem('testStartTime', new Date().toISOString());

    // 問題1ページに遷移
    router.push('/problem1');
  };

  const handleReset = () => {
    // フォームをリセット
    setName('');

    // ローカルストレージをクリア
    localStorage.removeItem('userName');
    localStorage.removeItem('problem1Answers');
    localStorage.removeItem('problem2Answers');
    localStorage.removeItem('testStartTime');
    localStorage.removeItem('problem1Time');
    localStorage.removeItem('problem2Time');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🌟 アビリティチェック 🌟
        </h1>

        <div className="mb-6">
          <label htmlFor="name-input" className="block text-xl text-gray-800 mb-3 font-bold">
            なまえをいれてください 📝
            <br />
            <span className="text-base text-gray-600 font-normal">（漢字で入力）</span>
          </label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="なまえ"
            className="w-full px-4 py-3 text-xl border-2 border-gray-400 rounded-lg text-center focus:outline-none focus:border-gray-600 transition-colors bg-white"
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
          />
        </div>

        <div className="space-y-3">
          <button
            onClick={handleStart}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors shadow-md"
          >
            🚀 はじめる！
          </button>

          <button
            onClick={handleReset}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors shadow-md"
          >
            🔄 リセット
          </button>
        </div>

        <div className="mt-4 text-sm text-pink-600 font-semibold rounded-full py-2 px-4">
          ⏰ テストは約5分で完了します
        </div>
      </div>
    </div>
  );
}
