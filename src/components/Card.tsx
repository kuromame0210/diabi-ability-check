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
          top: '20px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          backgroundImage: 'url(/image/border-orange.png)',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      ></div>
      <div
        className="absolute z-20 px-6 overflow-y-auto"
        style={{
          top: '40px',
          left: '40px',
          right: '40px',
          bottom: '40px'
        }}
      >
        {children}
      </div>
    </div>
  );
}