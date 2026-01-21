import { type IpcMainEvent, type IpcMainInvokeEvent } from "electron";

export type TSendEnvelope<TType extends TSendTypes = TSendTypes> = {
  type: TType;
  data?: TEventPayloadSend[TType];
};

export type TInvokeEnvelope<TType extends TInvokeTypes = TInvokeTypes> = {
  type: TType;
  data?: TEventSendInvoke[TType];
};

export type TReceiveEnvelope<TType extends TReceiveTypes = TReceiveTypes> = {
  type: TType;
  data: TEventPayloadReceive[TType];
};

export type TSendHandler = (args: {
  event: IpcMainEvent;
  payload: TSendEnvelope;
}) => void;

export type TInvokeHandler = (args: {
  event: IpcMainInvokeEvent;
  payload: TInvokeEnvelope;
}) =>
  | Promise<TEventPayloadInvoke[TInvokeTypes] | void>
  | TEventPayloadInvoke[TInvokeTypes]
  | void;

export type TRegisterIpcOptions = {
  onSend?: TSendHandler;
  onInvoke?: TInvokeHandler;
};
