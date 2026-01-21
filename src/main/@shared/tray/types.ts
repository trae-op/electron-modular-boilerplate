import { type MenuItem, type MenuItemConstructorOptions } from "electron";

export type TEventsCheckUpdate = {
  didFinishLoad?: () => void;
};

export type TEventsOptions = {
  checkUpdate?: TEventsCheckUpdate;
};

export type TCustomName = {
  name: "check-update" | "show" | "quit";
};

export interface IMenuItemConstructorOptions
  extends MenuItemConstructorOptions, TCustomName {}

export interface IMenuItem extends MenuItem, TCustomName {}

export type TItem = IMenuItemConstructorOptions | IMenuItem;
