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
        height: '85vh', 
        minWidth: '1100px', 
        minHeight: '820px', 
        backgroundImage: 'url(/image/card_bg.png)', 
        backgroundSize: '100% 100%', 
        backgroundRepeat: 'no-repeat', 
        backgroundPosition: 'center'
      }}
    >
      <div 
        className="absolute" 
        style={{
          top: '30px', 
          left: '30px', 
          right: '30px', 
          bottom: '30px', 
          backgroundImage: 'url(/image/border-orange.png)', 
          backgroundSize: '100% 100%', 
          backgroundRepeat: 'no-repeat', 
          backgroundPosition: 'center'
        }}
      ></div>
      <div 
        className="absolute z-20 px-6" 
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