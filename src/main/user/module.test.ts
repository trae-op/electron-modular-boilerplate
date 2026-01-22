import "reflect-metadata";
import { describe, expect, it } from "vitest";

import { RestApiModule } from "#main/rest-api/module.js";

import { UserIpc } from "./ipc.js";
import { UserModule } from "./module.js";
import { UserService } from "./service.js";
import { USER_REST_API_PROVIDER } from "./tokens.js";

describe("UserModule", () => {
  it("registers module metadata", () => {
    const metadata = Reflect.getMetadata("RgModule", UserModule);

    expect(metadata).toBeDefined();
    expect(metadata.imports).toEqual([RestApiModule]);
    expect(metadata.ipc).toEqual([UserIpc]);
    expect(metadata.providers).toEqual(
      expect.arrayContaining([
        UserService,
        expect.objectContaining({ provide: USER_REST_API_PROVIDER }),
      ]),
    );
  });
});
