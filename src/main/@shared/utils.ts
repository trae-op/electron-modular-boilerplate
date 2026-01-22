import path from "node:path";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export function isPlatform(platform: NodeJS.Platform): boolean {
  return process.platform === platform;
}

export const toPosixPath = (value: string): string => {
  return value.replace(/\\/g, "/");
};

export const joinPosixPath = (...segments: string[]): string => {
  return toPosixPath(path.join(...segments));
};
