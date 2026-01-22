import { getElectronStorage } from "#shared/store.js";

import { restApi } from "./config.js";

export function cacheUser(userId: string | undefined): TUser | undefined {
  let user: TUser | undefined = undefined;
  const cacheResponse = getElectronStorage("response");

  if (cacheResponse !== undefined && userId !== undefined) {
    user =
      cacheResponse[
        `${restApi.urls.base}${restApi.urls.baseApi}${
          restApi.urls.user.base
        }${restApi.urls.user.byId(userId)}`
      ];
  }

  if (user !== undefined) {
    return user;
  }

  return undefined;
}
