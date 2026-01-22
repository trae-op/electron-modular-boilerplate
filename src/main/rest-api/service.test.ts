import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("axios");

vi.mock("#shared/store.js", () => ({
  getElectronStorage: vi.fn(),
  setElectronStorage: vi.fn(),
}));

describe("RestApiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns data on successful GET", async () => {
    const mockAxiosInstance = {
      get: vi.fn().mockResolvedValue({ status: 200, data: { id: 1 } }),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        response: { use: vi.fn() },
      },
    };

    vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as any);

    const { RestApiService } = await import("./service.js");
    const service = new RestApiService();

    const result = await service.get("/test");

    expect(result).toEqual({ status: 200, data: { id: 1 }, error: undefined });
  });

  it("caches response when isCache is true", async () => {
    const mockAxiosInstance = {
      get: vi.fn().mockResolvedValue({ status: 200, data: { id: 1 } }),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        response: { use: vi.fn() },
      },
    };

    vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as any);

    const { setElectronStorage } = await import("#shared/store.js");
    const { RestApiService } = await import("./service.js");

    const service = new RestApiService();
    await service.get("/test", { isCache: true });

    expect(setElectronStorage).toHaveBeenCalledWith(
      "response",
      expect.objectContaining({ "/test": { id: 1 } }),
    );
  });

  it("handles response errors", async () => {
    const mockAxiosInstance = {
      get: vi.fn().mockRejectedValue({
        response: { status: 404, data: { message: "Not found" } },
        message: "Request failed",
        code: "ERR_BAD_REQUEST",
      }),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        response: { use: vi.fn() },
      },
    };

    vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as any);

    const { RestApiService } = await import("./service.js");
    const service = new RestApiService();

    const result = await service.get("/test");

    expect(result.status).toBe(404);
    expect(result.error).toBeDefined();
  });

  it("merges cached responses", async () => {
    const mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        response: { use: vi.fn() },
      },
    };

    vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as any);

    const { getElectronStorage } = await import("#shared/store.js");
    vi.mocked(getElectronStorage).mockReturnValue({
      "/list": [{ id: 1, name: "A" }],
      "/user": { id: 1, name: "A" },
    });

    const { RestApiService } = await import("./service.js");
    const service = new RestApiService();

    const merged = service.merge({
      "/list": [
        { id: 1, name: "A1" },
        { id: 2, name: "B" },
      ],
      "/user": { name: "A2" },
    });

    expect(merged).toEqual({
      "/list": [
        { id: 1, name: "A1" },
        { id: 2, name: "B" },
      ],
      "/user": { id: 1, name: "A2" },
    });
  });
});
