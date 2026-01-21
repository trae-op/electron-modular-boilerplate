import { useContext } from "react";

import { Context } from "./Context";

export const useEntityContext = () => {
  const entityContext = useContext(Context);

  if (!entityContext)
    throw new Error("Auth useEntityContext must be used within a Provider");

  return entityContext;
};
