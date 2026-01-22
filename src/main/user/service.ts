import { Inject, Injectable, getWindow } from "@devisfuture/electron-modular";
import { type AxiosRequestConfig } from "axios";

import { getElectronStorage } from "#shared/store.js";

import { restApi } from "../config.js";

import { AUTH_PROVIDER, USER_REST_API_PROVIDER } from "./tokens.js";
import type { TAuthProvider, TUserRestApiProvider } from "./types.js";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REST_API_PROVIDER)
    private restApiProvider: TUserRestApiProvider,
    @Inject(AUTH_PROVIDER) private authProvider: TAuthProvider,
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

    if (
      response.error !== undefined &&
      response.error.details?.statusCode === 401
    ) {
      const mainWindow = getWindow<TWindows["main"]>("window:main");
      if (mainWindow !== undefined) {
        this.authProvider.logout(mainWindow);
      }
      return;
    }

    if (response.error !== undefined) {
      return;
    }

    return response.data;
  }
}
