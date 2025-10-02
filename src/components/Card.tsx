import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
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
        className="absolute z-20 px-6 overflow-y-auto"
        style={{
          top: '60px',
          left: '60px',
          right: '60px',
          bottom: '60px'
        }}
      >
        {children}
      </div>
    </div>
  );
}