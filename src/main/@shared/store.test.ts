import { getLastElectronStoreInstance } from "electron-store";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import {
  clearElectronStorage,
  clearStore,
  deleteFromElectronStorage,
  deleteStore,
  getElectronStorage,
  getStore,
  hasElectronStorage,
  hasStore,
  setElectronStorage,
  setStore,
} from "./store.js";

type TElectronStoreMock = {
  set: Mock<any>;
  get: Mock<any>;
  has: Mock<any>;
  delete: Mock<any>;
  clear: Mock<any>;
};

vi.mock("electron-store", () => {
  const instances: Array<TElectronStoreMock> = [];

  const MockStore = vi.fn(() => {
    const instance: TElectronStoreMock = {
      set: vi.fn(),
      get: vi.fn(),
      has: vi.fn(),
      delete: vi.fn(),
      clear: vi.fn(),
    };

    instances.push(instance);
    return instance;
  });

  const getLastElectronStoreInstance = () => instances[instances.length - 1];

  return {
    default: MockStore,
    getLastElectronStoreInstance,
  };
});

describe("@shared/store", () => {
  beforeEach(() => {
    clearStore();
    vi.clearAllMocks();
  });

  describe("in-memory store", () => {
    it("sets and gets values", () => {
      setStore("testKey", "testValue");
      expect(getStore("testKey")).toBe("testValue");
    });

    it("checks if a key exists", () => {
      setStore("testKey", "value");
      expect(hasStore("testKey")).toBe(true);
      expect(hasStore("missingKey")).toBe(false);
    });

    it("deletes values", () => {
      setStore("testKey", "value");
      deleteStore("testKey");
      expect(hasStore("testKey")).toBe(false);
    });

    it("clears all values", () => {
      setStore("key1", "value1");
      setStore("key2", "value2");
      clearStore();
      expect(hasStore("key1")).toBe(false);
      expect(hasStore("key2")).toBe(false);
    });
  });

  describe("electron storage", () => {
    it("interacts with electron-store", () => {
      setElectronStorage("authToken", "token-123");

      const mock = getLastElectronStoreInstance();

      expect(mock.set).toHaveBeenCalledWith("authToken", "token-123");

      getElectronStorage("authToken");
      expect(mock.get).toHaveBeenCalledWith("authToken");

      hasElectronStorage("authToken");
      expect(mock.has).toHaveBeenCalledWith("authToken");

      deleteFromElectronStorage("authToken");
      expect(mock.delete).toHaveBeenCalledWith("authToken");

      clearElectronStorage();
      expect(mock.clear).toHaveBeenCalled();
    });
  });
});
