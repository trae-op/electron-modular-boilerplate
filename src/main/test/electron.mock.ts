import { vi } from "vitest";

export const app = {
  getPath: vi.fn(() => process.cwd()),
  getVersion: vi.fn(() => "0.0.0"),
  getAppPath: vi.fn(() => process.cwd()),
  on: vi.fn(),
  quit: vi.fn(),
  dock: {
    hide: vi.fn(),
    show: vi.fn(),
  },
};

export const dialog = {
  showMessageBox: vi.fn(),
};

export const BrowserWindow = vi.fn();

export const Menu = {
  buildFromTemplate: vi.fn((items) => items),
  setApplicationMenu: vi.fn(),
};

export const Tray = vi.fn(() => ({
  setContextMenu: vi.fn(),
  destroy: vi.fn(),
}));

export const Notification = vi.fn(() => ({
  show: vi.fn(),
}));

export const shell = {
  openPath: vi.fn(),
};

export const ipcMain = {
  handle: vi.fn(),
  on: vi.fn(),
};

export default {
  app,
  dialog,
  BrowserWindow,
  Menu,
  Tray,
  Notification,
  shell,
  ipcMain,
};
