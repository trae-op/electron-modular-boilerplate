const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  send: <TType extends TSendTypes>(
    key: TType,
    payload?: TSendPayload<TType>,
  ) => {
    electron.ipcRenderer.send(key, payload);
  },
  invoke: <TType extends TInvokeTypes>(
    key: TType,
    payload?: TInvokePayload<TType>,
  ) => {
    return electron.ipcRenderer.invoke(key, payload);
  },
  receive: <TType extends TReceiveTypes>(
    key: TType,
    callback: (payload?: TReceivePayload<TType>) => void,
  ) => {
    const cb = (
      _: Electron.IpcRendererEvent,
      payload?: TReceivePayload<TType>,
    ) => callback(payload);

    electron.ipcRenderer.on(key, cb);
    return () => electron.ipcRenderer.off(key, cb);
  },
} satisfies Window["electron"]);
