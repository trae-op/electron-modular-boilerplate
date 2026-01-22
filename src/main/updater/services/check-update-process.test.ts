import { describe, expect, it, vi } from "vitest";

vi.mock("#shared/store.js", () => ({
  getStore: vi.fn(),
}));

describe("CheckUpdateProcessService", () => {
  it("returns true when update process is set", async () => {
    const { getStore } = await import("#shared/store.js");
    vi.mocked(getStore).mockReturnValue(true);

    const { CheckUpdateProcessService } =
      await import("./check-update-process.js");

    const service = new CheckUpdateProcessService();
    expect(service.isUpdateProcess()).toBe(true);
  });

  it("returns false when update process is missing", async () => {
    const { getStore } = await import("#shared/store.js");
    vi.mocked(getStore).mockReturnValue(undefined);

    const { CheckUpdateProcessService } =
      await import("./check-update-process.js");

    const service = new CheckUpdateProcessService();
    expect(service.isUpdateProcess()).toBe(false);
  });
});
