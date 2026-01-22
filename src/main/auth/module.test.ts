import "reflect-metadata";
import { describe, expect, it } from "vitest";

import { AuthIpc } from "./ipc.js";
import { AuthModule } from "./module.js";
import { AuthService } from "./service.js";
import { AuthWindow } from "./window.js";

describe("AuthModule", () => {
  it("registers module metadata", () => {
    const metadata = Reflect.getMetadata("RgModule", AuthModule);

    expect(metadata).toBeDefined();
    expect(metadata.providers).toEqual([AuthService]);
    expect(metadata.ipc).toEqual([AuthIpc]);
    expect(metadata.windows).toEqual([AuthWindow]);
  });
});
