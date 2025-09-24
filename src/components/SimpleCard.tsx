import React from 'react';

interface SimpleCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function SimpleCard({ children, className = '' }: SimpleCardProps) {
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 w-auto text-center relative z-10 ${className}`} 
      style={{
        width: '80vw', 
        height: '80vh', 
        minWidth: '1000px', 
        minHeight: '750px'
      }}
    >
      <div 
        className="p-6 h-full overflow-y-auto" 
      >
        {children}
      </div>
    </div>
  );
}