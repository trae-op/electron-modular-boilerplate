import { createContext, useCallback, useRef } from "react";

import type { TContext, TProviderProps, TSubscriberCallback } from "./types";

export const Context = createContext<TContext | null>(null);

export function Provider({ children }: TProviderProps) {
  const isAuthenticated = useRef(false);
  const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

  const hasAuthenticated = useCallback((): boolean | undefined => {
    return isAuthenticated.current;
  }, []);

  const setAuthenticated = useCallback((value: boolean): void => {
    isAuthenticated.current = value;
    subscribers.current.forEach((callback) => callback());
  }, []);

  const subscribe = useCallback((callback: () => void) => {
    subscribers.current.add(callback);

    return (): void => {
      subscribers.current.delete(callback);
    };
  }, []);

  return (
    <Context.Provider
      value={{
        hasAuthenticated,
        setAuthenticated,
        subscribe,
      }}
    >
      {children}
    </Context.Provider>
  );
}
