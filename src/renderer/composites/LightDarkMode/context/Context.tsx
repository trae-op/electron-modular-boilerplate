import { createContext, useCallback, useEffect, useRef } from "react";

import { STORAGE_KEY_MODE } from "../constants";
import { getInitialMode } from "../utils/getInitialMode";
import type {
  TContext,
  TPaletteMode,
  TProviderProps,
  TSubscriberCallback,
} from "./types";

const applyMode = (mode: TPaletteMode) => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.paletteMode = mode;
  document.documentElement.style.colorScheme = mode;
  document.documentElement.classList.toggle("dark", mode === "dark");
};

export const Context = createContext<TContext | null>(null);

export function Provider({ children }: TProviderProps) {
  const modeRef = useRef<TPaletteMode>(getInitialMode());
  const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

  const getMode = useCallback((): TPaletteMode => {
    return modeRef.current;
  }, []);

  const setMode = useCallback((mode: TPaletteMode): void => {
    if (modeRef.current === mode) {
      return;
    }

    modeRef.current = mode;

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY_MODE, mode);
    }

    applyMode(mode);
    subscribers.current.forEach((callback) => callback());
  }, []);

  const subscribe = useCallback((callback: () => void) => {
    subscribers.current.add(callback);

    return () => {
      subscribers.current.delete(callback);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY_MODE, modeRef.current);
    }

    applyMode(modeRef.current);
  }, []);

  return (
    <Context.Provider value={{ getMode, setMode, subscribe }}>
      {children}
    </Context.Provider>
  );
}
