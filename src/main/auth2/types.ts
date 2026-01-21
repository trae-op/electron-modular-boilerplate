import type { ApiResponse, RequestOptions } from "../rest-api/types.js";

export type TAuthRestApiProvider = {
  get: <TResponse>(
    endpoint: string,
    options?: RequestOptions
  ) => Promise<ApiResponse<TResponse>>;
};
