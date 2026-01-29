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
  windowConfirm: undefined;
  openLatestVersion: TOpenLatestVersion;
  openUpdate: {
    id: string;
  };
};

type TSendTypes = keyof TEventPayloadSend;

type TSendPayload<TType extends TSendTypes = TSendTypes> =
  TEventPayloadSend[TType];

type TSend = <TType extends TSendTypes>(
  key: TType,
  payload?: TSendPayload<TType>,
) => void;
