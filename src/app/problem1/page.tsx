'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { TIMER_DURATION } from '@/lib/constants';

export default function Problem1() {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [answers, setAnswers] = useState({
    star: '',
    heart: '',
    triangle: ''
  });
  const router = useRouter();

  const handleSubmit = useCallback(() => {
    // 回答をローカルストレージに保存
    const problem1Answers = {
      star: parseInt(answers.star) || 0,
      heart: parseInt(answers.heart) || 0,
      triangle: parseInt(answers.triangle) || 0
    };

    localStorage.setItem('problem1Answers', JSON.stringify(problem1Answers));
    localStorage.setItem('problem1Time', new Date().toISOString());

    // 問題2ページに遷移
    router.push('/problem2');
  }, [answers.star, answers.heart, answers.triangle, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmit]);

  const handleInputChange = (symbol: 'star' | 'heart' | 'triangle', value: string) => {
    // 1-3の数字のみ許可
    if (value === '' || (/^[1-3]$/.test(value))) {
      setAnswers(prev => ({
        ...prev,
        [symbol]: value
      }));
    }
  };

  const isAnswerComplete = answers.star && answers.heart && answers.triangle;

  return (
    <div className="min-h-screen bg-white p-4 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* タイマー */}
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-base shadow-lg z-10">
          のこり: {timeLeft}秒
        </div>

        <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-3xl shadow-xl p-4 mt-12">
          <h2 className="text-2xl font-bold text-cyan-700 mb-4 text-center drop-shadow-lg">
            🔍 もんだい１ 🔍
          </h2>

          <p className="text-xl text-gray-800 mb-6 text-center font-bold py-2">
            きごうから めだけでせんをたどったさきのすうじをかいてください ✨
          </p>

          {/* 画像と回答エリアを横並び */}
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* 左: 問題画像 */}
            <div className="flex justify-center">
              <div className="border-2 border-gray-400 p-4">
                <Image
                  src="/docs/アビリティチェックもんだい１.png"
                  alt="線つなぎ問題"
                  width={300}
                  height={450}
                  className="max-w-full h-auto rounded-xl"
                />
              </div>
            </div>

            {/* 右: 回答エリア */}
            <div className="space-y-4 max-w-sm mx-auto lg:mx-0">
              <div className="flex items-center justify-between p-4 border-2 border-gray-300 mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl drop-shadow-lg">⭐</span>
                  <span className="text-lg font-bold text-gray-800">のこたえ:</span>
                </div>
                <input
                  type="text"
                  value={answers.star}
                  onChange={(e) => handleInputChange('star', e.target.value)}
                  className="w-12 h-12 text-xl text-center border-2 border-gray-400 rounded-2xl focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-yellow-200 transition-all bg-white font-bold shadow-inner"
                  maxLength={1}
                />
              </div>

              <div className="flex items-center justify-between p-4 border-2 border-gray-300 mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl drop-shadow-lg">💕</span>
                  <span className="text-lg font-bold text-gray-800">のこたえ:</span>
                </div>
                <input
                  type="text"
                  value={answers.heart}
                  onChange={(e) => handleInputChange('heart', e.target.value)}
                  className="w-12 h-12 text-xl text-center border-2 border-gray-400 rounded-2xl focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-yellow-200 transition-all bg-white font-bold shadow-inner"
                  maxLength={1}
                />
              </div>

              <div className="flex items-center justify-between p-4 border-2 border-gray-300 mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl drop-shadow-lg">🔺</span>
                  <span className="text-lg font-bold text-gray-800">のこたえ:</span>
                </div>
                <input
                  type="text"
                  value={answers.triangle}
                  onChange={(e) => handleInputChange('triangle', e.target.value)}
                  className="w-12 h-12 text-xl text-center border-2 border-gray-400 rounded-2xl focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-yellow-200 transition-all bg-white font-bold shadow-inner"
                  maxLength={1}
                />
              </div>

              {/* 送信ボタン */}
              <div className="text-center mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={!isAnswerComplete}
                  className={`px-10 py-4 rounded-lg text-xl font-bold transition-colors shadow-md ${
                    isAnswerComplete
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  🎯 かいとうする！
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}