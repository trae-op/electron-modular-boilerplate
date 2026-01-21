import { app } from "electron";

import type { TInvokeHandler } from "#main/@shared/ipc/types.js";

const currentVersion = app.getVersion();

export const handleInvoke: TInvokeHandler = ({ payload }) => {
  if (payload.type !== "getVersion") {
    return undefined;
  }

  return currentVersion;
};
