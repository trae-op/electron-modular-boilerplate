import { beforeEach, describe, expect, it, vi } from "vitest";

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

describe("@shared/store", () => {
  beforeEach(() => {
    clearStore();
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
    it("interacts with electron-store", async () => {
      setElectronStorage("authToken", "token-123");
      getElectronStorage("authToken");
      hasElectronStorage("authToken");
      deleteFromElectronStorage("authToken");
      clearElectronStorage();

      const { getLastElectronStoreInstance } = await import("electron-store");
      const instance = getLastElectronStoreInstance();

      expect(instance?.set).toHaveBeenCalledWith("authToken", "token-123");
      expect(instance?.get).toHaveBeenCalledWith("authToken");
      expect(instance?.has).toHaveBeenCalledWith("authToken");
      expect(instance?.delete).toHaveBeenCalledWith("authToken");
      expect(instance?.clear).toHaveBeenCalled();
    });
  });
});
