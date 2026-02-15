import { RgModule } from "@devisfuture/electron-modular";
import { BrowserWindow } from "electron";

import { AuthModule } from "#main/auth/module.js";
import { AuthService } from "#main/auth/service.js";
import { RestApiModule } from "#main/rest-api/module.js";
import { RestApiService } from "#main/rest-api/service.js";

import { UserIpc } from "./ipc.js";
import { UserService } from "./service.js";
import { AUTH_PROVIDER, USER_REST_API_PROVIDER } from "./tokens.js";
import type { TAuthProvider, TUserRestApiProvider } from "./types.js";

@RgModule({
  imports: [RestApiModule, AuthModule],
  ipc: [UserIpc],
  providers: [
    UserService,
    {
      provide: USER_REST_API_PROVIDER,
      useFactory: (restApiService: RestApiService): TUserRestApiProvider => ({
        get: (endpoint, options) => restApiService.get(endpoint, options),
      }),
      inject: [RestApiService],
    },
    {
      provide: AUTH_PROVIDER,
      useFactory: (authService: AuthService): TAuthProvider => ({
        logout: (window: BrowserWindow) => authService.logout(window),
      }),
      inject: [AuthService],
    },
  ],
  lazy: {
    enabled: true,
    trigger: "init-user-lazy",
  },
})
export class UserModule {}
