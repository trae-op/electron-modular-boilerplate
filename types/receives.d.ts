type TUnsubscribeFunction = () => void;

type TEventPayloadReceive = {
  updateApp: TUpdateData;
  openUpdateApp: TOpenUpdateApp;
  auth: TAuth;
  user: {
    user: TUser;
  };
};

type TReceiveTypes = keyof TEventPayloadReceive;

type TReceivePayload<TType extends TReceiveTypes = TReceiveTypes> = {
  type: TType;
  data: TEventPayloadReceive[TType];
};

type TReceive = <TType extends TReceiveTypes>(
  callback: (payload: TReceivePayload<TType>) => void,
) => TUnsubscribeFunction;
