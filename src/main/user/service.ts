import { type AxiosRequestConfig } from "axios";
import { restApi } from "../config.js";
import { Injectable, Inject } from "@devisfuture/electron-modular";
import { getElectronStorage } from "#shared/store.js";
import { USER_REST_API_PROVIDER } from "./tokens.js";
import type { TUserRestApiProvider } from "./types.js";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REST_API_PROVIDER)
    private restApiProvider: TUserRestApiProvider,
  ) {}

  private getAuthorization(): AxiosRequestConfig["headers"] {
    const token = getElectronStorage("authToken");

    if (token !== undefined) {
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
    }

    return;
  }

  async byId<R extends TUser>(id: string): Promise<R | undefined> {
    const response = await this.restApiProvider.get<R>(
      `${restApi.urls.base}${restApi.urls.baseApi}${
        restApi.urls.user.base
      }${restApi.urls.user.byId(id)}`,
      {
        headers: this.getAuthorization(),
        isCache: true,
      },
    );

    if (response.error !== undefined) {
      return;
    }

    return response.data;
  }
}
