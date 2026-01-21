import { useContext } from "react";

import { Context } from "./Context";

export const useEntityContext = () => {
  const entityContext = useContext(Context);

  if (!entityContext)
    throw new Error("Updater useEntityContext must be used inside Provider");

  return entityContext;
};
