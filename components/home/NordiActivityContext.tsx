"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type NordiActivityContextValue = {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
};

const NordiActivityContext = createContext<NordiActivityContextValue | null>(null);

export function NordiActivityProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const value = useMemo(() => ({ isActive, setIsActive }), [isActive]);

  return <NordiActivityContext.Provider value={value}>{children}</NordiActivityContext.Provider>;
}

export function useNordiActivity(): NordiActivityContextValue {
  const context = useContext(NordiActivityContext);
  if (!context) {
    return { isActive: false, setIsActive: () => undefined };
  }
  return context;
}
