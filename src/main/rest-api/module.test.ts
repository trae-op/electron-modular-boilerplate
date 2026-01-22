import "reflect-metadata";
import { describe, expect, it } from "vitest";

import { RestApiModule } from "./module.js";
import { RestApiService } from "./service.js";

describe("RestApiModule", () => {
  it("registers module metadata", () => {
    const metadata = Reflect.getMetadata("RgModule", RestApiModule);

    expect(metadata).toBeDefined();
    expect(metadata.providers).toEqual([RestApiService]);
    expect(metadata.exports).toEqual([RestApiService]);
  });
});
