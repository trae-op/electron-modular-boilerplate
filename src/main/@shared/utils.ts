export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export function isPlatform(platform: NodeJS.Platform): boolean {
  return process.platform === platform;
}
