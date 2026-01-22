import { vi } from "vitest";

type TElectronStoreInstance = {
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  has: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
};

const instances: TElectronStoreInstance[] = [];

const ElectronStorage = vi
  .fn()
  .mockImplementation((): TElectronStoreInstance => {
    const instance = {
      get: vi.fn(),
      set: vi.fn(),
      has: vi.fn(),
      delete: vi.fn(),
      clear: vi.fn(),
    };
    instances.push(instance);
    return instance;
  });

export const getLastElectronStoreInstance = ():
  | TElectronStoreInstance
  | undefined => {
  return instances[instances.length - 1];
};

export default ElectronStorage;
