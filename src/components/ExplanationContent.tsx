/**
 * ExplanationContent Component
 *
 * 説明ページの統一レイアウトコンポーネント
 * 問題2, 3の説明ページで使用
 */

import React from 'react';

interface ExplanationContentProps {
  children: React.ReactNode;
  onNext: () => void;
}

export default function ExplanationContent({ children, onNext }: ExplanationContentProps) {
  return (
    <div className="flex justify-center pt-16 h-full">
      <div className="max-w-4xl">
        <div className="space-y-8 text-center">
          {children}

          {/* 次へボタン */}
          <div className="mt-12 text-center">
            <button
              onClick={onNext}
              className="transition-transform hover:scale-105"
            >
              <img src="/image/next.png" alt="れいだいへ" className="h-16 w-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
