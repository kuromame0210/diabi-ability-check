'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Card from '../../components/Card';

export default function Example() {
  const [answers, setAnswers] = useState({
    star: '',
    heart: '',
    triangle: ''
  });
  const [showAnswers, setShowAnswers] = useState(false);
  const router = useRouter();

  const correctAnswers = {
    star: '2',
    heart: '1', 
    triangle: '3'
  };

  const handleNext = () => {
    // 問題1ページに遷移
    router.push('/problem1');
  };

  const handleShowAnswers = () => {
    setShowAnswers(true);
    setAnswers(correctAnswers);
  };

  const handleInputChange = (symbol: 'star' | 'heart' | 'triangle', value: string) => {
    if (!showAnswers) {
      setAnswers(prev => ({
        ...prev,
        [symbol]: value
      }));
    }
  };

  const isAnswerComplete = answers.star && answers.heart && answers.triangle;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative" style={{backgroundImage: 'url(/image/main_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>

      <Card>
        <div className="h-full overflow-y-auto relative" style={{scrollbarWidth: 'thin'}}>
          {/* スクロールインジケーター */}
          <div className="fixed bottom-4 left-4 z-30 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold opacity-75">
            ↓ スクロール可能 ↓
          </div>
          <div className="flex items-center justify-center mb-4 relative">
            <h2 className="text-4xl font-bold text-gray-800 text-center">
              れいだい
            </h2>
            <p className="text-lg text-black absolute right-0">
              ※じかんせいげんはありません
            </p>
          </div>
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
                  src="/image/reidai1.png"
                  alt="例題"
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
                    disabled={showAnswers}
                    className={`w-16 h-12 text-xl text-center border-2 border-gray-400 rounded-2xl focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-yellow-200 transition-all font-bold shadow-inner ${showAnswers ? 'bg-green-100' : 'bg-white'}`}
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
                    disabled={showAnswers}
                    className={`w-16 h-12 text-xl text-center border-2 border-gray-400 rounded-2xl focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-yellow-200 transition-all font-bold shadow-inner ${showAnswers ? 'bg-green-100' : 'bg-white'}`}
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
                    disabled={showAnswers}
                    className={`w-16 h-12 text-xl text-center border-2 border-gray-400 rounded-2xl focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-yellow-200 transition-all font-bold shadow-inner ${showAnswers ? 'bg-green-100' : 'bg-white'}`}
                  >
                    <option value="">?</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>

                {/* 正解表示ボックス（答えるボタン押下後） */}
                {showAnswers && (
                  <div className="flex gap-4 mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex-1">
                      <h3 className="text-lg font-bold text-blue-800 mb-2 text-center">せいかい</h3>
                      <div className="space-y-1 text-center">
                        <p className="text-lg"><span className="text-xl">★</span> = 2</p>
                        <p className="text-lg"><span className="text-xl">♥</span> = 1</p>
                        <p className="text-lg"><span className="text-xl">▲</span> = 3</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={handleNext}
                        className="px-6 py-3 rounded-lg text-xl font-bold transition-colors shadow-md bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        つぎへ
                      </button>
                    </div>
                  </div>
                )}

                {/* 答えるボタン（最下部） */}
                {!showAnswers && (
                  <div className="text-center mt-6">
                    <button
                      onClick={handleShowAnswers}
                      className="px-6 py-3 rounded-lg text-lg font-bold transition-colors shadow-md bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      こたえる
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}