type TInvokeTypes = keyof TEventPayloadInvoke;

type TInvokePayload<TType extends TInvokeTypes = TInvokeTypes> = {
  type: TType;
  data?: TEventSendInvoke[TType];
};

type TInvoke = <TType extends TInvokeTypes>(
  payload: TInvokePayload<TType>
) => Promise<TEventPayloadInvoke[TType]>;
