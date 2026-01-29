import { useActionState } from "react";

import type { TFormState } from "./types";

const confirmAction = async (
  _prevState: TFormState,
  formData: FormData,
): Promise<TFormState> => {
  const message = formData.get("message") as string;

  if (!message || message.trim().length === 0) {
    return {
      errors: { message: ["Message is required"] },
      success: false,
    };
  }

  if (message.length < 3) {
    return {
      errors: { message: ["Message must be at least 3 characters"] },
      success: false,
    };
  }

  try {
    await window.electron.invoke("confirmData", { message });

    return {
      success: true,
    };
  } catch (error) {
    return {
      message: "Failed to process message",
      success: false,
    };
  }
};

export const useConfirmForm = () => {
  const initialState: TFormState = {
    errors: {},
    message: "",
    success: false,
  };

  const [state, formAction] = useActionState(confirmAction, initialState);

  return {
    state,
    formAction,
  };
};
