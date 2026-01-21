import { type AxiosRequestConfig } from "axios";

export interface ApiError {
  code?: string | number;
  message: string;
  details?: any;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  status: number;
}

export interface RequestOptions extends AxiosRequestConfig {
  params?: Record<string, any>;
  isCache?: boolean;
}
