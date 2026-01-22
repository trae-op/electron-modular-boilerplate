import { getStore } from "#shared/store.js";
import { Injectable } from "@devisfuture/electron-modular";

@Injectable()
export class CheckUpdateProcessService {
  constructor() {}

  isUpdateProcess() {
    const isUpdateProcess = getStore("updateProcess");

    return isUpdateProcess !== undefined && isUpdateProcess;
  }
}
