import { TRoutes } from "../types";

export type THookControl = {
  isMainRoute: (routers: TRoutes[]) => boolean;
};
