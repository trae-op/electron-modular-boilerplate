import { type AxiosRequestConfig } from "axios";

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
