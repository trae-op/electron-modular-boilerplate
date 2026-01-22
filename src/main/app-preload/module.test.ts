import "reflect-metadata";
import { describe, expect, it } from "vitest";

import { AppPreloadIpc } from "./ipc.js";
import { AppPreloadModule } from "./module.js";
import { AppPreloadWindow } from "./window.js";

describe("AppPreloadModule", () => {
  it("registers module metadata", () => {
    const metadata = Reflect.getMetadata("RgModule", AppPreloadModule);

    expect(metadata).toBeDefined();
    expect(metadata.ipc).toEqual([AppPreloadIpc]);
    expect(metadata.windows).toEqual([AppPreloadWindow]);
  });
});
