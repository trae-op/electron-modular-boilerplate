import { app } from "electron";
import path from "node:path";

import { folders } from "../config.js";

import { isDev, joinPosixPath } from "./utils.js";

export function getPreloadPath() {
  return joinPosixPath(
    app.getAppPath(),
    isDev() ? "." : "..",
    folders.distMain,
    "preload.cjs",
  );
}

export function getUIPath() {
  return joinPosixPath(app.getAppPath(), folders.distRenderer, "index.html");
}

export function getAssetsPath() {
  return joinPosixPath(app.getAppPath(), isDev() ? "." : "..", "src", "assets");
}
