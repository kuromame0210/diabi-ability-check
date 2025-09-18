'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TIMER_DURATION, PROBLEM2_PATTERNS } from '@/lib/constants';

export default function Problem2() {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    const numericAnswers = answers.map(answer => parseInt(answer) || 0);

    // 回答をローカルストレージに保存
    localStorage.setItem('problem2Answers', JSON.stringify(numericAnswers));
    localStorage.setItem('problem2Time', new Date().toISOString());

    // 結果ページに遷移
    router.push('/result');
  };

  const handleFinish = () => {
    handleSubmit();
  };

  const handleInputChange = (index: number, value: string) => {
    // 0-9の数字のみ許可
    if (value === '' || (/^[0-9]$/.test(value))) {
      const newAnswers = [...answers];
      newAnswers[index] = value;
      setAnswers(newAnswers);
    }
  };

  const isAllAnswered = answers.every(answer => answer.trim() !== '');

  return (
    <div className="min-h-screen bg-white p-2 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* タイマー */}
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-base shadow-lg z-10">
          のこり: {timeLeft}秒
        </div>

        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🔢 もんだい２ 🔢
          </h2>

          <p className="text-xl text-gray-800 mb-4 text-center font-bold py-2">
            ０から９までの数字がならんでいます。ひとつだけ足りない数字を答えてください ✨
          </p>

          <p className="text-lg text-red-600 mb-6 text-center font-bold py-2">
            ⚠️ 指で数字をなぞらず目だけで見つけてください 👀
          </p>

          {/* 5問を同時表示 */}
          <div className="space-y-3">
            {PROBLEM2_PATTERNS.map((pattern, index) => (
              <div key={index} className="border-2 border-gray-300 p-4 mb-4">
                <div className="grid lg:grid-cols-3 gap-4 items-center">
                  {/* 問題番号 */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      🎯 {index + 1}
                    </h3>
                  </div>

                  {/* 数字表示エリア */}
                  <div className="border-2 border-gray-400 p-4 text-center">
                    <div className="text-2xl font-bold tracking-wider text-gray-800 font-mono">
                      {pattern.numbers.join('  ')}
                    </div>
                  </div>

                  {/* 回答エリア */}
                  <div className="flex items-center justify-center space-x-3">
                    <label className="text-lg font-bold text-gray-800">こたえ:</label>
                    <input
                      type="text"
                      value={answers[index]}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      className="w-12 h-12 text-2xl text-center border-3 border-yellow-300 rounded-2xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all font-bold bg-white shadow-inner"
                      maxLength={1}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 送信ボタン */}
          <div className="text-center mt-6">
            <button
              onClick={handleSubmit}
              disabled={!isAllAnswered}
              className={`px-12 py-4 rounded-lg text-xl font-bold transition-colors shadow-md ${
                isAllAnswered
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              🎉 かいとうする！
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}