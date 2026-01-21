import { BrowserWindow, type BrowserWindowConstructorOptions } from "electron";

export type TParamsCreateWindow<N = string> = {
  hash?: N;
  isCache?: boolean;
  options?: BrowserWindowConstructorOptions;
  loadURL?: string;
};

export type TCache = {
  [key in string]: BrowserWindow;
};
