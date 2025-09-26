import React from 'react';

interface SimpleCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function SimpleCard({ children, className = '' }: SimpleCardProps) {
  return (
    <div 
      className={`bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 w-auto text-center relative z-10 ${className}`} 
      style={{
        width: '70vw',
        height: '70vh',
        minWidth: '800px',
        minHeight: '600px'
      }}
    >
      <div 
        className="p-4 h-full overflow-y-auto" 
      >
        {children}
      </div>
    </div>
  );
}