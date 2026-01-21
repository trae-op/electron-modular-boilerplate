import { type PropsWithChildren } from "react";

export type TProviderProps = PropsWithChildren;

export type TContext = {
  hasAuthenticated: () => boolean | undefined;
  setAuthenticated: (value: boolean) => void;
  subscribe: (callback: TSubscriberCallback) => () => void;
};

export type TSubscriberCallback = () => void;
