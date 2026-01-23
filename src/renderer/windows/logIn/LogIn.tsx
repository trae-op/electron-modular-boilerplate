import { SignIn } from "@conceptions/Auth";
import { useClosePreloadWindow } from "@hooks/closePreloadWindow";

const LogIn = () => {
  useClosePreloadWindow("sign-in");

  return <SignIn />;
};

export default LogIn;
