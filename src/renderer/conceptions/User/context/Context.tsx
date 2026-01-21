import { createContext, useCallback, useRef } from "react";

import type { TContext, TProviderProps, TSubscriberCallback } from "./type";

export const Context = createContext<TContext | null>(null);

export function Provider({ children }: TProviderProps) {
  const user = useRef<TUser | undefined>(undefined);
  const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

  const getUser = useCallback((): TUser | undefined => {
    return user.current;
  }, []);

  const setUser = useCallback((value: TUser | undefined): void => {
    user.current = value;
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
        getUser,
        setUser,
        subscribe,
      }}
    >
      {children}
    </Context.Provider>
  );
}
