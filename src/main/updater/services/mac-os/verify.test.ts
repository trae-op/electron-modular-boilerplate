import { describe, expect, it, vi } from "vitest";

vi.mock("fs/promises", () => ({
  access: vi.fn(),
}));

describe("VerifyService", () => {
  it("returns true when file exists", async () => {
    const { access } = await import("fs/promises");
    vi.mocked(access).mockResolvedValue(undefined);

    const { VerifyService } = await import("./verify.js");
    const service = new VerifyService();

    expect(await service.isVerify("/tmp", "file.dmg")).toBe(true);
  });

  it("returns false when file missing", async () => {
    const { access } = await import("fs/promises");
    vi.mocked(access).mockRejectedValue(new Error("missing"));

    const { VerifyService } = await import("./verify.js");
    const service = new VerifyService();

    expect(await service.isVerify("/tmp", "file.dmg")).toBe(false);
  });
});
