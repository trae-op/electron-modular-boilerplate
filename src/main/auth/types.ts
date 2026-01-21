import { restApi } from "../config.js";

export type TProvidersIpc = {
  getUserById: <R extends TUser>(id: string) => Promise<R | undefined>;
};
export type TLessProviders = typeof restApi.urls.auth;
