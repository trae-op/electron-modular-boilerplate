import { type PropsWithChildren } from "react";

export type TProviderProps = PropsWithChildren;

export type TContext = {
  getDownloadedPercent: () => TUpdateData["downloadedPercent"] | undefined;
  setDownloadedPercent: (
    value: TUpdateData["downloadedPercent"] | undefined,
  ) => void;
  getMessage: () => TUpdateData["message"] | undefined;
  setMessage: (value: TUpdateData["message"] | undefined) => void;
  getVersion: () => TUpdateData["version"] | undefined;
  setVersion: (value: TUpdateData["version"] | undefined) => void;
  getPlatform: () => TUpdateData["platform"] | undefined;
  setPlatform: (value: TUpdateData["platform"] | undefined) => void;
  getUpdateFile: () => TUpdateData["updateFile"] | undefined;
  setUpdateFile: (value: TUpdateData["updateFile"] | undefined) => void;
  getStatus: () => TUpdateData["status"];
  setStatus: (value: TUpdateData["status"]) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};

export type TSubscriberCallback = () => void;
