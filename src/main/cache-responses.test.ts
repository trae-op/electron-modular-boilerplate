import { describe, expect, it, vi } from "vitest";

vi.mock("#shared/store.js", () => ({
  getElectronStorage: vi.fn(),
}));

vi.mock("#main/config.js", () => ({
  restApi: {
    urls: {
      base: "https://api.example.com",
      baseApi: "/api",
      user: {
        base: "/user",
        byId: (id: string) => `/${id}`,
      },
    },
  },
}));

describe("cache-responses", () => {
  it("returns cached user when present", async () => {
    const { getElectronStorage } = await import("#shared/store.js");
    vi.mocked(getElectronStorage).mockReturnValue({
      "https://api.example.com/api/user/123": { id: "123", name: "Alex" },
    });

    const { cacheUser } = await import("./cache-responses.js");

    expect(cacheUser("123")).toEqual({ id: "123", name: "Alex" });
  });

  it("returns undefined when cache is missing", async () => {
    const { getElectronStorage } = await import("#shared/store.js");
    vi.mocked(getElectronStorage).mockReturnValue(undefined);

    const { cacheUser } = await import("./cache-responses.js");

    expect(cacheUser("123")).toBeUndefined();
  });
});
