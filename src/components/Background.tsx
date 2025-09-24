import React from 'react';

interface BackgroundProps {
  children: React.ReactNode;
}

export default function Background({ children }: BackgroundProps) {
  return (
    <div 
      className="min-h-screen bg-white flex items-center justify-center p-4 relative" 
      style={{
        backgroundImage: 'url(/image/main_bg.png)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 opacity-20" style={{backgroundColor: '#A3A3A3'}}></div>
      {children}
    </div>
  );
}