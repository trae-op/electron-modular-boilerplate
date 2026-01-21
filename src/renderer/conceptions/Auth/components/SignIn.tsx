import { ProviderButton } from "./ProviderButton";

export const SignIn = () => {
  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-sm">
      <ProviderButton data-provider="google" text="Enter by Google" />
      <ProviderButton data-provider="github" text="Enter by Github" />
    </div>
  );
};
