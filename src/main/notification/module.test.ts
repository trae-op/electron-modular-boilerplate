import "reflect-metadata";
import { describe, expect, it } from "vitest";

import { NotificationIpc } from "./ipc.js";
import { NotificationModule } from "./module.js";
import { NotificationService } from "./service.js";

describe("NotificationModule", () => {
  it("registers module metadata", () => {
    const metadata = Reflect.getMetadata("RgModule", NotificationModule);

    expect(metadata).toBeDefined();
    expect(metadata.ipc).toEqual([NotificationIpc]);
    expect(metadata.providers).toEqual([NotificationService]);
    expect(metadata.exports).toEqual([NotificationService]);
  });
});
