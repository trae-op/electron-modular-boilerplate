import { type MenuItem, type MenuItemConstructorOptions } from "electron";

type TCustomName = {
  name: "app" | "edit";
};

interface IMenuItemConstructorOptions
  extends MenuItemConstructorOptions,
    TCustomName {}

interface IMenuItem extends MenuItem, TCustomName {}

export type TItem = IMenuItemConstructorOptions | IMenuItem;
