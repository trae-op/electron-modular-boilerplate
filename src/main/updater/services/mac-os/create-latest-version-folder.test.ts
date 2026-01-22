import { describe, expect, it, vi } from "vitest";

vi.mock("fs/promises", () => ({
  mkdir: vi.fn(),
}));

describe("CreateLatestVersionFolderService", () => {
  it("creates folder successfully", async () => {
    const { mkdir } = await import("fs/promises");
    vi.mocked(mkdir).mockResolvedValue(undefined);

    const { CreateLatestVersionFolderService } =
      await import("./create-latest-version-folder.js");

    const service = new CreateLatestVersionFolderService();
    const result = await service.createFolder("/tmp/app");

    expect(result).toEqual({ ok: true });
    expect(mkdir).toHaveBeenCalledWith("/tmp/app", { recursive: true });
  });

  it("returns error when mkdir fails", async () => {
    const { mkdir } = await import("fs/promises");
    vi.mocked(mkdir).mockRejectedValue(new Error("fail"));

    const { CreateLatestVersionFolderService } =
      await import("./create-latest-version-folder.js");

    const service = new CreateLatestVersionFolderService();
    const result = await service.createFolder("/tmp/app");

    expect(result).toEqual({ ok: false, message: "fail" });
  });
});
