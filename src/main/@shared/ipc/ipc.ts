import { type IpcMainEvent, type WebContents, ipcMain } from "electron";

import {
  TInvokeEnvelope,
  TReceiveEnvelope,
  TRegisterIpcOptions,
  TSendEnvelope,
} from "#main/@shared/ipc/types.js";
import { validateEventFrame } from "#main/@shared/utils.js";

export const registerIpc = ({ onSend, onInvoke }: TRegisterIpcOptions) => {
  if (onSend !== undefined) {
    ipcMain.on("send", (event, payload: TSendEnvelope) => {
      validateEventFrame(event.senderFrame);
      onSend({ event, payload });
    });
  }

  if (onInvoke !== undefined) {
    ipcMain.handle("invoke", async (event, payload: TInvokeEnvelope) => {
      validateEventFrame(event.senderFrame);

      return await onInvoke({ event, payload });
    });
  }
};

export const sendToRenderer = <TType extends TReceiveTypes>(
  webContents: WebContents,
  payload: TReceiveEnvelope<TType>,
) => {
  webContents.send("receive", payload);
};

export const replyToRenderer = <TType extends TReceiveTypes>(
  event: IpcMainEvent,
  payload: TReceiveEnvelope<TType>,
) => {
  event.reply("receive", payload);
};
