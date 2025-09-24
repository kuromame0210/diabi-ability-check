'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { TIMER_DURATION } from '@/lib/constants';
import Card from '../../components/Card';

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
    setAnswers(prev => ({
      ...prev,
      [symbol]: value
    }));
  };

  const isAnswerComplete = answers.star && answers.heart && answers.triangle;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>
      {/* タイマー */}
      <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-base shadow-lg z-30">
        のこり: {timeLeft}秒
      </div>

      <Card>
        <div className="overflow-y-auto h-full">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">
            もんだい１
          </h2>
          <img src="/image/border-line.png" alt="区切り線" className="w-full h-auto mb-6" />

          <p className="text-2xl text-gray-800 mb-6 text-center font-bold py-2">
            きごうから めだけでせんをたどったさきのすうじをせんたくしてください
          </p>

          {/* 画像と回答エリアを横並び */}
          <div className="grid lg:grid-cols-2 gap-6 items-start" style={{height: '70%'}}>
            {/* 左: 問題画像 */}
            <div className="flex justify-center h-full">
              <div className="border-gray-400 p-4 h-full">
                <Image
                  src="/image/mondai1.png"
                  alt="線つなぎ問題"
                  width={400}
                  height={600}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>

            {/* 右: 回答エリア */}
            <div className="h-full flex flex-col justify-end">
              <div className="space-y-4 max-w-sm mx-auto lg:mx-0 border-gray-400 px-6 rounded-xl bg-gray-50">
              <div className="flex items-center justify-between p-4 border-2 border-gray-300 mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl drop-shadow-lg">★</span>
                  <span className="text-lg font-bold text-gray-800">のこたえ:</span>
                </div>
                <select
                  value={answers.star}
                  onChange={(e) => handleInputChange('star', e.target.value)}
                  className="w-16 h-12 text-xl text-center border-2 border-gray-400 rounded-2xl focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-yellow-200 transition-all bg-white font-bold shadow-inner"
                >
                  <option value="">?</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 border-2 border-gray-300 mb-4">
                <div className="flex items-center space-x-3">
                  <span className="pl-1 text-4xl drop-shadow-lg">♥</span>
                  <span className="text-lg font-bold text-gray-800">のこたえ:</span>
                </div>
                <select
                  value={answers.heart}
                  onChange={(e) => handleInputChange('heart', e.target.value)}
                  className="w-16 h-12 text-xl text-center border-2 border-gray-400 rounded-2xl focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-yellow-200 transition-all bg-white font-bold shadow-inner"
                >
                  <option value="">?</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 border-2 border-gray-300 mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl drop-shadow-lg">▲</span>
                  <span className="text-lg font-bold text-gray-800">のこたえ:</span>
                </div>
                <select
                  value={answers.triangle}
                  onChange={(e) => handleInputChange('triangle', e.target.value)}
                  className="w-16 h-12 text-xl text-center border-2 border-gray-400 rounded-2xl focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-yellow-200 transition-all bg-white font-bold shadow-inner"
                >
                  <option value="">?</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
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
                  かいとうする！
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}