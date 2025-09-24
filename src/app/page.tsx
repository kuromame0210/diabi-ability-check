'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Background from '../components/Background';
import SimpleCard from '../components/SimpleCard';

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

    // 例題ページに遷移
    router.push('/example');
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
    <Background>
      <div className="bg-white rounded-3xl shadow-lg p-12 relative z-10" style={{width: '80vw', height: '80vh', minWidth: '1000px', minHeight: '750px'}}>
        <div className="h-full flex items-center justify-center">
          <div style={{width: '500px', height: '600px'}} className="flex flex-col justify-center p-8 border border-gray-300 rounded-lg relative">
            <img src="/image/title_icon.png" alt="タイトル" className="absolute -top-8 left-1/2 transform -translate-x-1/2 h-32 w-auto z-10" />
            <div className="mb-6 grid items-center gap-0" style={{gridTemplateColumns: '1fr 2fr 1fr'}}>
            <div className="text-right">
              <img src="/image/teacher.png" alt="アイコン" className="w-full h-28 object-contain" />
            </div>
            <div className="text-center whitespace-nowrap">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                アビリティチェック
              </h1>
              <label htmlFor="name-input" className="block text-xl text-gray-800 mb-3 font-bold">
                なまえをいれてください 📝
                <br />
                <span className="text-base text-gray-600 font-normal">（漢字で入力）</span>
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
              className="w-full px-4 py-3 text-xl border-2 border-gray-400 rounded-lg text-center focus:outline-none focus:border-gray-600 transition-colors bg-white"
              onKeyPress={(e) => e.key === 'Enter' && handleStart()}
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleStart}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors shadow-md"
            >
              はじめる！
            </button>

            <button
              onClick={handleReset}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors shadow-md"
            >
              リセット
            </button>
          </div>

            <div className="mt-4 text-sm text-pink-600 font-semibold rounded-full py-2 px-4 text-center">
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
