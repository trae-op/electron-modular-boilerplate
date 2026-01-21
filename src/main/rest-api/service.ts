import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { Injectable } from "@devisfuture/electron-modular";
import {
  setElectronStorage,
  getElectronStorage,
  TCacheResponse,
} from "@shared/store.js";
import { restApi } from "../config.js";
import type { ApiResponse, RequestOptions } from "./types.js";

@Injectable()
export class RestApiService {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: restApi.urls.base,
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => Promise.reject(error),
    );
  }

  private handleResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      status: response.status,
      data: response.data,
      error: undefined,
    };
  }

  private handleError(error: AxiosError): ApiResponse<any> {
    if (error.response) {
      return {
        status: error.response.status,
        error: {
          message:
            error.message ||
            `Request failed with status ${error.response.status}`,
          code: error.code,
          details: error.response.data,
        },
        data: undefined,
      };
    } else if (error.request) {
      // The request was sent, but there was no response.
      return {
        status: 0,
        error: { message: "No response received from the server" },
        data: undefined,
      };
    } else {
      // An error occurred while configuring the query.
      return {
        status: 0,
        error: { message: error.message || "Request setup error" },
        data: undefined,
      };
    }
  }

  async get<T>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(
        endpoint,
        options,
      );

      if (options?.isCache) {
        this.setResponseElectronStorage(endpoint, response);
      }

      return this.handleResponse<T>(response);
    } catch (error: any) {
      return this.handleError(error as AxiosError);
    }
  }

  merge(data: TCacheResponse): TCacheResponse | undefined {
    let cacheStore = getElectronStorage("response");
    if (!cacheStore) {
      cacheStore = {};
    }

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const incomingValue = data[key];
        const existingValue = cacheStore[key];

        const isIncomingArrayOfCacheableItems =
          Array.isArray(incomingValue) &&
          incomingValue.every(
            (item) => typeof item === "object" && item !== null && "id" in item,
          );

        if (isIncomingArrayOfCacheableItems) {
          const existingArray: any[] = Array.isArray(existingValue)
            ? [...existingValue]
            : [];
          const updatedArray: any[] = [];

          incomingValue.forEach((incomingItem: any) => {
            const existingItemIndex = existingArray.findIndex(
              (existingItem: any) => existingItem.id === incomingItem.id,
            );

            if (existingItemIndex !== -1) {
              updatedArray.push({
                ...existingArray[existingItemIndex],
                ...incomingItem,
              });

              existingArray.splice(existingItemIndex, 1);
            } else {
              updatedArray.push(incomingItem);
            }
          });

          cacheStore[key] = updatedArray;
        } else if (
          typeof incomingValue === "object" &&
          incomingValue !== null &&
          !Array.isArray(incomingValue)
        ) {
          cacheStore[key] = {
            ...(typeof existingValue === "object" && existingValue !== null
              ? existingValue
              : {}),
            ...incomingValue,
          };
        } else {
          cacheStore[key] = incomingValue;
        }
      }
    }

    return cacheStore;
  }

  private setResponseElectronStorage(
    endpoint: string,
    response: AxiosResponse<any, any>,
  ) {
    if (response.status >= 200 && response.status < 300) {
      const merged = this.merge({
        [endpoint]: response.data,
      });
      if (merged !== undefined) {
        setElectronStorage("response", merged);
      }
    }
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(
        endpoint,
        data,
        options,
      );
      return this.handleResponse<T>(response);
    } catch (error: any) {
      return this.handleError(error as AxiosError);
    }
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.put(
        endpoint,
        data,
        options,
      );
      return this.handleResponse<T>(response);
    } catch (error: any) {
      return this.handleError(error as AxiosError);
    }
  }

  async delete<T>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.delete(
        endpoint,
        options,
      );
      return this.handleResponse<T>(response);
    } catch (error: any) {
      return this.handleError(error as AxiosError);
    }
  }
}
