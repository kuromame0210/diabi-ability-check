'use client';

import React, { useRef } from 'react';
import ScrollIndicator from './ScrollIndicator';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`text-center relative z-10 ${className}`}
      style={{
        width: '85vw',
        height: '90vh',
        minWidth: '1000px',
        minHeight: '800px',
        backgroundImage: 'url(/image/card_bg.png)',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    >
      <div
        className="absolute"
        style={{
          top: '35px',
          left: '35px',
          right: '35px',
          bottom: '35px',
          backgroundImage: 'url(/image/border-orange.png)',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      ></div>
      <div
        ref={scrollContainerRef}
        className="absolute z-20 px-6 overflow-y-auto"
        style={{
          top: '60px',
          left: '60px',
          right: '60px',
          bottom: '60px',
          scrollbarWidth: 'auto',
          scrollbarColor: '#9ca3af #e5e7eb'
        }}
      >
        {children}
        <ScrollIndicator containerRef={scrollContainerRef} />
      </div>
    </div>
  );
}