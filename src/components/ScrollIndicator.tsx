/**
 * ScrollIndicator Component
 *
 * スクロール可能であることを示すインジケーター
 * 枠内の右下に配置し、スクロールが最下部に達したら非表示になる
 */

'use client';

import { useState, useEffect } from 'react';

interface ScrollIndicatorProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollIndicator({ containerRef }: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const checkScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const hasScroll = scrollHeight > clientHeight;
      const atBottom = scrollHeight - scrollTop - clientHeight < 10;

      setIsVisible(hasScroll && !atBottom);
    };

    // 初期チェック
    checkScroll();

    // スクロールイベント
    container.addEventListener('scroll', checkScroll);

    // リサイズイベント
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [containerRef]);

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-4 right-6 z-10 flex flex-col items-center gap-2 bg-white/95 px-2 py-3 rounded-lg shadow-lg border-2 border-gray-300">
      <div className="text-xs font-bold text-gray-700 whitespace-nowrap">スクロール</div>
      <div className="text-xs font-bold text-gray-700 whitespace-nowrap">できます</div>
      <div className="animate-bounce">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
