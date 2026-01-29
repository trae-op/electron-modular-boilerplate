type TEventPayloadInvoke = {
  getVersion: string;
  confirmData?: {
    success: boolean;
  };
};

type TEventSendInvoke = {
  getVersion: string;
  confirmData: {
    message: string;
  };
};

type TInvokeTypes = keyof TEventPayloadInvoke;

type TInvokePayload<TType extends TInvokeTypes = TInvokeTypes> =
  TEventSendInvoke[TType];

type TInvoke = <TType extends TInvokeTypes>(
  key: TType,
  payload?: TInvokePayload<TType>,
) => Promise<TEventPayloadInvoke[TType]>;
