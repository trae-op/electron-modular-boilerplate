type TUnsubscribeFunction = () => void;

type TEventPayloadReceive = {
  updateApp: TUpdateData;
  openUpdateApp: TOpenUpdateApp;
  auth: TAuth;
  user: {
    user: TUser;
  };
  confirm: TConfirm;
};

type TReceiveTypes = keyof TEventPayloadReceive;

type TReceivePayload<TType extends TReceiveTypes = TReceiveTypes> =
  TEventPayloadReceive[TType];

type TReceive = <TType extends TReceiveTypes>(
  key: TType,
  callback: (payload?: TReceivePayload<TType>) => void,
) => TUnsubscribeFunction;
