import { Injectable } from "@devisfuture/electron-modular";
import { getStore } from "@shared/store.js";

@Injectable()
export class CheckUpdateProcessService {
  constructor() {}

  isUpdateProcess() {
    const isUpdateProcess = getStore("updateProcess");

    return isUpdateProcess !== undefined && isUpdateProcess;
  }
}
