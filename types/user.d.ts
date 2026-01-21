type TUser = {
  id: number;
  email: string;
  sourceId: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  displayName?: string;
  provider: TProviders;
};

type TOmitUser = Omit<TUser, "id" | "picture">;
type TOptionalUser = Partial<Pick<TUser, "id" | "picture">>;
type TPartialUser = TOmitUser & TOptionalUser;
