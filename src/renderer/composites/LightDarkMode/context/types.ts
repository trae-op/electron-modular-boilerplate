import type { ReactNode } from "react";

export type TPaletteMode = "light" | "dark";

export type TProviderProps = {
  children: ReactNode;
};

export type TSubscriberCallback = () => void;

export type TContext = {
  getMode: () => TPaletteMode;
  setMode: (mode: TPaletteMode) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};
