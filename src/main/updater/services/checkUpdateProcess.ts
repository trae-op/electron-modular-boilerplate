import { getStore } from "#main/@shared/store.js";

export function isUpdateProcess() {
  const isUpdateProcess = getStore("updateProcess");

  return isUpdateProcess !== undefined && isUpdateProcess;
}
