import { describe, expect, it, vi } from "vitest";

vi.mock("#shared/store.js", () => ({
  getElectronStorage: vi.fn(),
}));

describe("UserService", () => {
  it("fetches user with auth token", async () => {
    const { getElectronStorage } = await import("#shared/store.js");
    vi.mocked(getElectronStorage).mockReturnValue("token-123");

    const restApiProvider = {
      get: vi.fn().mockResolvedValue({
        status: 200,
        data: { id: "1", name: "Jane" },
        error: undefined,
      }),
    };

    const { UserService } = await import("./service.js");
    const authProvider = { logout: vi.fn() };
    const service = new UserService(
      restApiProvider as any,
      authProvider as any,
    );

    const result = await service.byId("1");

    expect(result).toEqual({ id: "1", name: "Jane" });
    expect(restApiProvider.get).toHaveBeenCalledWith(
      expect.stringContaining("/user/1"),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer token-123" }),
        isCache: true,
      }),
    );
  });

  it("returns undefined when API returns error", async () => {
    const restApiProvider = {
      get: vi.fn().mockResolvedValue({
        status: 404,
        data: undefined,
        error: { message: "Not found" },
      }),
    };

    const { UserService } = await import("./service.js");
    const authProvider = { logout: vi.fn() };
    const service = new UserService(
      restApiProvider as any,
      authProvider as any,
    );

    const result = await service.byId("missing");

    expect(result).toBeUndefined();
  });
});
