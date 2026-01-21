const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  send: <TType extends TSendTypes>(payload: TSendPayload<TType>) => {
    ipcSend("send", payload);
  },
  invoke: <TType extends TInvokeTypes>(payload: TInvokePayload<TType>) => {
    return ipcInvoke("invoke", payload);
  },
  receive: <TType extends TReceiveTypes>(
    callback: (payload: TReceivePayload<TType>) => void,
  ) => {
    return ipcOn<TType>("receive", callback);
  },
} satisfies Window["electron"]);

function ipcInvoke(key: "invoke", payload: TInvokePayload) {
  return electron.ipcRenderer.invoke(key, payload);
}

function ipcSend(key: "send", payload: TSendPayload) {
  electron.ipcRenderer.send(key, payload);
}

function ipcOn<TType extends TReceiveTypes>(
  key: "receive",
  callback: (payload: TReceivePayload<TType>) => void,
): TUnsubscribeFunction {
  const cb = (_: Electron.IpcRendererEvent, payload: TReceivePayload<TType>) =>
    callback(payload);

  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}
