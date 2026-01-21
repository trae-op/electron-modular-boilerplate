import { type WebFrameMain } from "electron";

import { windows } from "#main/config.js";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export function isPlatform(platform: NodeJS.Platform): boolean {
  return process.platform === platform;
}

function containsAnyIdentifier(
  fullUrl: string,
  identifiers: string[],
): boolean {
  const decodedUrl = decodeURIComponent(fullUrl);
  if (identifiers.some((identifier) => decodedUrl.includes(identifier))) {
    return true;
  }

  return /\/\d+(\/|$)/.test(decodedUrl);
}

export function validateEventFrame(frame: WebFrameMain | null) {
  if (frame === null) {
    throw new Error("Invalid frame: Frame is null");
  }

  const url = new URL(frame.url);

  const devHosts = [
    process.env.LOCALHOST_ELECTRON_SERVER_PORT,
    process.env.LOCALHOST_PORT,
  ].filter(Boolean) as string[];

  if (isDev() && devHosts.some((host) => url.host === `localhost:${host}`)) {
    return;
  }

  const isPresent = containsAnyIdentifier(frame.url, Object.values(windows));

  if (
    (!isPresent && url.hash !== "") ||
    (url.protocol !== "file:" && url.hash === "")
  ) {
    throw new Error(`The event is from an unauthorized frame: ${frame.url}`);
  }
}
