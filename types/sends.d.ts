type TEventPayloadSend = {
  restart: undefined;
  windowClosePreload: undefined;
  user: undefined;
  logout: undefined;
  checkForUpdates: undefined;
  checkAuth: undefined;
  windowAuth: {
    provider: TProviders;
  };
  openLatestVersion: TOpenLatestVersion;
  openUpdate: {
    id: string;
  };
};

type TSendTypes = keyof TEventPayloadSend;

type TSendPayload<TType extends TSendTypes = TSendTypes> = {
  type: TType;
  data?: TEventPayloadSend[TType];
};

type TSend = <TType extends TSendTypes>(payload: TSendPayload<TType>) => void;
