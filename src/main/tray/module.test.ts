import "reflect-metadata";
import { describe, expect, it } from "vitest";

import { TrayModule } from "./module.js";
import { TrayService } from "./service.js";

describe("TrayModule", () => {
  it("registers module metadata", () => {
    const metadata = Reflect.getMetadata("RgModule", TrayModule);

    expect(metadata).toBeDefined();
    expect(metadata.providers).toEqual([TrayService]);
    expect(metadata.exports).toEqual([TrayService]);
  });
});
