import { describe, expect, it, vi } from "vitest";

vi.mock("electron", () => ({
  app: {
    getPath: vi.fn(() => "/downloads"),
  },
}));

vi.mock("node:fs", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  const createWriteStream = vi.fn(() => ({
    write: vi.fn(),
    end: vi.fn(),
  }));

  return {
    ...actual,
    default: {
      createWriteStream,
    },
    createWriteStream,
  };
});

describe("DownloadFileService", () => {
  it("downloads file and reports progress", async () => {
    const onDownloadProgress = vi.fn();

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => {
          let called = 0;
          return {
            read: async () => {
              called += 1;
              if (called === 1) {
                return { done: false, value: new Uint8Array(50) };
              }
              if (called === 2) {
                return { done: false, value: new Uint8Array(50) };
              }
              return { done: true, value: undefined };
            },
          };
        },
      },
    }) as any;

    const createLatestVersionFolderService = {
      createFolder: vi.fn().mockResolvedValue({ ok: true }),
    } as any;

    const { DownloadFileService } = await import("./download-file.js");
    const service = new DownloadFileService(createLatestVersionFolderService);

    const status = await service.downloadFile({
      name: "app.dmg",
      assetId: "1",
      size: 100,
      onDownloadProgress,
    });

    expect(status).toBe("update-downloaded");
    expect(onDownloadProgress).toHaveBeenCalled();
  });

  it("rejects when folder creation fails", async () => {
    globalThis.fetch = vi.fn() as any;

    const createLatestVersionFolderService = {
      createFolder: vi.fn().mockResolvedValue({ ok: false, message: "nope" }),
    } as any;

    const { DownloadFileService } = await import("./download-file.js");
    const service = new DownloadFileService(createLatestVersionFolderService);

    await expect(
      service.downloadFile({
        name: "app.dmg",
        assetId: "1",
        size: 100,
        onDownloadProgress: vi.fn(),
      }),
    ).rejects.toThrow("nope");
  });
});
