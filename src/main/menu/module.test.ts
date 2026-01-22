import "reflect-metadata";
import { describe, expect, it } from "vitest";

import { MenuModule } from "./module.js";
import { MenuService } from "./service.js";

describe("MenuModule", () => {
  it("registers module metadata", () => {
    const metadata = Reflect.getMetadata("RgModule", MenuModule);

    expect(metadata).toBeDefined();
    expect(metadata.providers).toEqual([MenuService]);
    expect(metadata.exports).toEqual([MenuService]);
  });
});
