import type {
  BrowserWindow,
  Event,
  MenuItem,
  MenuItemConstructorOptions,
  WebContentsWillRedirectEventParams,
} from "electron";

export type TWindowManager = {
  onDidFinishLoad?: (window: BrowserWindow) => void;
  onWebContentsDidFinishLoad?: (window: BrowserWindow) => void;
  onShow?: (window: BrowserWindow) => void;
  onHide?: (window: BrowserWindow) => void;
  onClose?: (event: Event, window: BrowserWindow) => void;
  onWillRedirect?: (
    event: Event<WebContentsWillRedirectEventParams>,
    url: string,
  ) => void;
  onWebContentsWillRedirect?: (
    event: Event<WebContentsWillRedirectEventParams>,
    url: string,
    window: BrowserWindow,
  ) => void;
};

type TCustomName = {
  name: "app" | "quit";
};

export type TMenuItem = MenuItemConstructorOptions | (MenuItem & TCustomName);
