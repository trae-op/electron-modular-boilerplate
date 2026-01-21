import ElectronStorage from "electron-store";

type TStore = {
  [key: string]: any | undefined;
};

export type TCacheResponse = {
  [key: string]: any | undefined;
};

type TElectronStore = {
  authToken: string;
  userId: string;
  response: TCacheResponse;
};

const store = new Map<keyof TStore, TStore[keyof TStore]>();
const electronStorage = new ElectronStorage<TStore>();

export function getStore<K extends keyof TStore>(key: K) {
  return store.get(key) as TStore[K] | undefined;
}

export function hasStore<K extends keyof TStore>(name: K) {
  return store.has(name);
}

export function setStore<K extends keyof TStore>(name: K, value: TStore[K]) {
  store.set(name, value);
}

export function clearStore() {
  store.clear();
}

export function getElectronStorage<K extends keyof TElectronStore>(key: K) {
  return electronStorage.get(key) as TElectronStore[K] | undefined;
}

export function hasElectronStorage<K extends keyof TElectronStore>(name: K) {
  return electronStorage.has(name);
}

export function setElectronStorage<K extends keyof TElectronStore>(
  name: K,
  value: TElectronStore[K],
) {
  electronStorage.set(name, value);
}

export function clearElectronStorage() {
  electronStorage.clear();
}

export function deleteFromElectronStorage<K extends keyof TElectronStore>(
  name: K,
) {
  electronStorage.delete(name);
}
