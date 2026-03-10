"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

type AmbientColor = "teal" | "violet" | "cyan" | null;

interface AmbientColorContextValue {
  activeColor: AmbientColor;
  setActiveColor: (color: AmbientColor) => void;
}

const AmbientColorContext = createContext<AmbientColorContextValue | undefined>(
  undefined
);

export function AmbientColorProvider({ children }: { children: ReactNode }) {
  const [activeColor, setActiveColorState] = useState<AmbientColor>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const setActiveColor = useCallback((color: AmbientColor) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveColorState(color);

    if (color !== null) {
      timerRef.current = setTimeout(() => {
        setActiveColorState(null);
      }, 4000);
    }
  }, []);

  return (
    <AmbientColorContext.Provider value={{ activeColor, setActiveColor }}>
      {children}
    </AmbientColorContext.Provider>
  );
}

const NOOP_CONTEXT: AmbientColorContextValue = {
  activeColor: null,
  setActiveColor: () => {},
};

export function useAmbientColor() {
  const context = useContext(AmbientColorContext);
  return context ?? NOOP_CONTEXT;
}
