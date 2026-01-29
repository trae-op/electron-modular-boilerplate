import { Button } from "@components/Button";
import { memo } from "react";
import { useFormStatus } from "react-dom";

import type { TSubmitButtonProps } from "./types";

export const SubmitButton = memo((props: TSubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      data-testid="confirm-submit-button"
      className="w-full"
    >
      {pending ? "Submitting..." : props.label || "Submit"}
    </Button>
  );
});

SubmitButton.displayName = "SubmitButton";
