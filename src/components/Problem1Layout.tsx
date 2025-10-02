/**
 * Problem1Layout Component
 *
 * 問題1と練習1で使用する共通レイアウトコンポーネント
 * 画像 + 回答エリア（3つの記号）の横並びレイアウト
 */

import Image from 'next/image';
import AnswerButton from './AnswerButton';
import SymbolAnswerBox from './SymbolAnswerBox';

interface Problem1LayoutProps {
  // 画像関連
  imageSrc: string;
  imageAlt: string;

  // 回答状態
  answers: {
    star: string;
    heart: string;
    triangle: string;
  };

  // イベントハンドラ
  onAnswerChange: (symbol: 'star' | 'heart' | 'triangle', value: string) => void;
  onSubmit?: () => void;

  // 状態フラグ
  disabled?: boolean;
  showAnswers?: boolean;

  // 正解データ（例題用）
  correctAnswers?: {
    star: string;
    heart: string;
    triangle: string;
  };

  // 次へボタン（例題用）
  onNext?: () => void;
}

export default function Problem1Layout({
  imageSrc,
  imageAlt,
  answers,
  onAnswerChange,
  onSubmit,
  disabled = false,
  showAnswers = false,
  correctAnswers,
  onNext
}: Problem1LayoutProps) {
  const isAnswerComplete = answers.star && answers.heart && answers.triangle;

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start" style={{height: '70%'}}>
      {/* 左: 問題画像 */}
      <div className="flex justify-end h-full">
        <div className="border-gray-400 p-4 h-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={500}
            height={700}
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
      </div>

      {/* 右: 回答エリア */}
      <div className="h-full flex flex-col justify-end">
        <div className="space-y-4 max-w-sm mx-auto lg:mx-0 border-gray-400 px-6 rounded-xl bg-gray-50">
          {/* ★の回答 */}
          <SymbolAnswerBox
            symbol="★"
            label="のこたえ:"
            value={answers.star}
            onChange={(value) => onAnswerChange('star', value)}
            disabled={disabled}
            showAnswer={showAnswers}
          />

          {/* ♥の回答 */}
          <SymbolAnswerBox
            symbol="♥"
            label="のこたえ:"
            value={answers.heart}
            onChange={(value) => onAnswerChange('heart', value)}
            disabled={disabled}
            showAnswer={showAnswers}
            symbolClassName="pl-1 text-4xl"
          />

          {/* ▲の回答 */}
          <SymbolAnswerBox
            symbol="▲"
            label="のこたえ:"
            value={answers.triangle}
            onChange={(value) => onAnswerChange('triangle', value)}
            disabled={disabled}
            showAnswer={showAnswers}
          />

          {/* 正解表示ボックス（例題用：答えるボタン押下後） */}
          {showAnswers && correctAnswers && onNext && (
            <div className="flex gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex-1">
                <h3 className="text-2xl font-bold text-blue-800 mb-2 text-center">せいかい</h3>
                <div className="space-y-1 text-center">
                  <p className="text-2xl"><span className="text-3xl">★</span> = {correctAnswers.star}</p>
                  <p className="text-2xl"><span className="text-3xl">♥</span> = {correctAnswers.heart}</p>
                  <p className="text-2xl"><span className="text-3xl">▲</span> = {correctAnswers.triangle}</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={onNext}
                  className="transition-transform hover:scale-105"
                >
                  <img src="/image/next.png" alt="つぎへ" className="h-16 w-auto" />
                </button>
              </div>
            </div>
          )}

          {/* 答えるボタン（例題用：正解表示前） */}
          {!showAnswers && correctAnswers && (
            <div className="text-center mt-6">
              <AnswerButton
                onClick={onSubmit || (() => {})}
                className="px-6 py-3 text-lg"
              />
            </div>
          )}

          {/* 送信ボタン（問題用） */}
          {!correctAnswers && onSubmit && (
            <div className="text-center mt-6">
              <AnswerButton
                onClick={onSubmit}
                disabled={!isAnswerComplete}
                className="px-10 py-4"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
