import { Injectable } from "@devisfuture/electron-modular";

import type { TConfirmData, TConfirmResponse } from "./types.js";

@Injectable()
export class ConfirmService {
  constructor() {}

  async transformData(data: TConfirmData): Promise<TConfirmResponse> {
    const transformedMessage = data.message.toUpperCase();
    const timestamp = Date.now();

    return {
      transformedMessage,
      timestamp,
    };
  }
}
