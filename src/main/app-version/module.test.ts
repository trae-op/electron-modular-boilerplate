import "reflect-metadata";
import { describe, expect, it } from "vitest";

import { AppVersionIpc } from "./ipc.js";
import { AppVersionModule } from "./module.js";

describe("AppVersionModule", () => {
  it("registers module metadata", () => {
    const metadata = Reflect.getMetadata("RgModule", AppVersionModule);

    expect(metadata).toBeDefined();
    expect(metadata.ipc).toEqual([AppVersionIpc]);
  });
});
