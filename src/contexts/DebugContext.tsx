'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DebugContextType {
  isVisible: boolean;
  hideDebug: () => void;
  showDebug: () => void;
  toggleDebug: () => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export function DebugProvider({ children }: { children: ReactNode }) {
  // デバッグパネルを一時的に非表示に設定（開発時はtrueに変更）
  const [isVisible, setIsVisible] = useState(false);

  const hideDebug = () => setIsVisible(false);
  const showDebug = () => setIsVisible(true);
  const toggleDebug = () => setIsVisible(prev => !prev);

  return (
    <DebugContext.Provider value={{
      isVisible,
      hideDebug,
      showDebug,
      toggleDebug
    }}>
      {children}
    </DebugContext.Provider>
  );
}

export function useDebug() {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
}