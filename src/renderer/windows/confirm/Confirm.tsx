import { memo } from "react";

import { MessageField } from "./MessageField";
import { SubmitButton } from "./SubmitButton";
import type { TConfirmFormProps } from "./types";
import { useConfirmForm } from "./useConfirmForm";

const Confirm = memo((_props: TConfirmFormProps) => {
  const { state, formAction } = useConfirmForm();

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white dark:bg-gray-900 shadow-lg p-8 border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-md">
        <div className="mb-6">
          <h1 className="font-semibold text-gray-900 dark:text-gray-100 text-2xl">
            Confirm Window
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
            Send a message to the main process
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          <MessageField error={state.errors?.message} defaultValue="" />

          <SubmitButton label="Send to Main Process" />
        </form>
      </div>
    </div>
  );
});

Confirm.displayName = "Confirm";

export default Confirm;
