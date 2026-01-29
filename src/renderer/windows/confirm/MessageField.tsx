import { TextField } from "@components/TextField";
import { memo } from "react";

import type { TMessageFieldProps } from "./types";
import { useMessageField } from "./useMessageField";

export const MessageField = memo((props: TMessageFieldProps) => {
  const { value, handleChange, isTouched, localError } = useMessageField(
    props.defaultValue,
  );

  const displayError =
    props.error || (isTouched && localError ? [localError] : undefined);
  const isError = Boolean(displayError);

  return (
    <TextField
      label="Message"
      name="message"
      placeholder="Type your message"
      type="text"
      value={value}
      onChange={handleChange}
      isError={isError}
      textError={isError ? displayError?.join(", ") : ""}
      dataTestId="confirm-message-field"
    />
  );
});

MessageField.displayName = "MessageField";
