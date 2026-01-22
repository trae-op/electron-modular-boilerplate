import { RgModule } from "@devisfuture/electron-modular";

import { RestApiModule } from "#main/rest-api/module.js";
import { RestApiService } from "#main/rest-api/service.js";

import { UserIpc } from "./ipc.js";
import { UserService } from "./service.js";
import { USER_REST_API_PROVIDER } from "./tokens.js";
import type { TUserRestApiProvider } from "./types.js";

@RgModule({
  imports: [RestApiModule],
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
  ],
})
export class UserModule {}
