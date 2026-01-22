import { type AxiosRequestConfig } from "axios";
import { BrowserWindow } from "electron";

type TApiError = {
  code?: string | number;
  message: string;
  details?: any;
};

type TApiResponse<T> = {
  data?: T;
  error?: TApiError;
  status: number;
};

type TRequestOptions = AxiosRequestConfig & {
  params?: Record<string, any>;
  isCache?: boolean;
};

export type TUserRestApiProvider = {
  get: <TResponse>(
    endpoint: string,
    options?: TRequestOptions,
  ) => Promise<TApiResponse<TResponse>>;
};

export type TAuthProvider = {
  logout: (window: BrowserWindow) => void;
};
