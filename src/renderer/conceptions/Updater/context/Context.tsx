import { createContext, useCallback, useRef } from "react";

import type { TContext, TProviderProps, TSubscriberCallback } from "./types";

export const Context = createContext<TContext | null>(null);

export function Provider({ children }: TProviderProps) {
  const downloadedPercent = useRef<
    TUpdateData["downloadedPercent"] | undefined
  >(undefined);
  const message = useRef<TUpdateData["message"] | undefined>(undefined);
  const version = useRef<TUpdateData["version"] | undefined>(undefined);
  const platform = useRef<TUpdateData["platform"] | undefined>(undefined);
  const updateFile = useRef<TUpdateData["updateFile"] | undefined>(undefined);
  const status = useRef<TUpdateData["status"]>("checking-for-update");
  const subscribers = useRef<Set<TSubscriberCallback>>(new Set());

  const getDownloadedPercent = useCallback(():
    | TUpdateData["downloadedPercent"]
    | undefined => {
    return downloadedPercent.current;
  }, []);

  const setDownloadedPercent = useCallback(
    (value: TUpdateData["downloadedPercent"] | undefined): void => {
      downloadedPercent.current = value;
      subscribers.current.forEach((callback) => callback());
    },
    [],
  );

  const getMessage = useCallback((): TUpdateData["message"] | undefined => {
    return message.current;
  }, []);

  const setMessage = useCallback(
    (value: TUpdateData["message"] | undefined): void => {
      message.current = value;
      subscribers.current.forEach((callback) => callback());
    },
    [],
  );

  const getVersion = useCallback((): TUpdateData["version"] | undefined => {
    return version.current;
  }, []);

  const setVersion = useCallback(
    (value: TUpdateData["version"] | undefined): void => {
      version.current = value;
      subscribers.current.forEach((callback) => callback());
    },
    [],
  );

  const getPlatform = useCallback((): TUpdateData["platform"] | undefined => {
    return platform.current;
  }, []);

  const setPlatform = useCallback(
    (value: TUpdateData["platform"] | undefined): void => {
      platform.current = value;
      subscribers.current.forEach((callback) => callback());
    },
    [],
  );

  const getUpdateFile = useCallback(():
    | TUpdateData["updateFile"]
    | undefined => {
    return updateFile.current;
  }, []);

  const setUpdateFile = useCallback(
    (value: TUpdateData["updateFile"] | undefined): void => {
      updateFile.current = value;
      subscribers.current.forEach((callback) => callback());
    },
    [],
  );

  const getStatus = useCallback((): TUpdateData["status"] => {
    return status.current;
  }, []);

  const setStatus = useCallback((value: TUpdateData["status"]): void => {
    status.current = value;
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
        getDownloadedPercent,
        setDownloadedPercent,
        getMessage,
        setMessage,
        getVersion,
        setVersion,
        getPlatform,
        setPlatform,
        getUpdateFile,
        setUpdateFile,
        getStatus,
        setStatus,
        subscribe,
      }}
    >
      {children}
    </Context.Provider>
  );
}
