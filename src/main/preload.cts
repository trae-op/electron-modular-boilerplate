const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  send: <TType extends TSendTypes>(
    key: string,
    payload: TSendPayload<TType>,
  ) => {
    electron.ipcRenderer.send(key, payload);
  },
  invoke: <TType extends TInvokeTypes>(
    key: string,
    payload: TInvokePayload<TType>,
  ) => {
    return electron.ipcRenderer.invoke(key, payload);
  },
  receive: <TType extends TReceiveTypes>(
    key: string,
    callback: (payload: TReceivePayload<TType>) => void,
  ) => {
    const cb = (
      _: Electron.IpcRendererEvent,
      payload: TReceivePayload<TType>,
    ) => callback(payload);

    electron.ipcRenderer.on(key, cb);
    return () => electron.ipcRenderer.off(key, cb);
  },
} satisfies Window["electron"]);
